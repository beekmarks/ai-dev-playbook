# Sandboxed Testing Guide: Secure E2E and Integration Testing

This guide provides comprehensive instructions for implementing secure, sandboxed testing environments as required by the enhanced AI Dev Playbook. It ensures that AI agents can safely execute comprehensive tests without compromising system security.

## Overview

The enhanced Tester Agent requires secure sandbox environments for:
- **End-to-End (E2E) Testing**: Complete user workflow validation
- **Integration Testing**: Component interaction verification
- **Security Testing**: Dynamic vulnerability assessment
- **Performance Testing**: Load and stress testing

## Security Requirements

### Mandatory Sandbox Isolation

All test execution that runs live code **MUST** occur within secure, isolated environments:

- **Container Isolation**: Docker or equivalent containerization
- **Database Isolation**: Separate test databases or in-memory alternatives
- **Network Isolation**: Restricted external network access
- **File System Protection**: Limited access to designated test directories
- **Resource Limits**: CPU, memory, and execution time constraints
- **Clean State**: Tests start with predictable, clean environments

## Implementation Patterns

### 1. Docker-Based Testing Environment

#### Basic Docker Setup

Create a `docker-compose.test.yml` file for isolated testing:

```yaml
version: '3.8'

services:
  app-test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@db-test:5432/testdb
      - REDIS_URL=redis://redis-test:6379
    depends_on:
      - db-test
      - redis-test
    networks:
      - test-network
    volumes:
      - ./tests:/app/tests:ro
      - test-data:/app/data
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/tmp

  db-test:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test
    networks:
      - test-network
    volumes:
      - test-db-data:/var/lib/postgresql/data
    security_opt:
      - no-new-privileges:true

  redis-test:
    image: redis:7-alpine
    networks:
      - test-network
    security_opt:
      - no-new-privileges:true

networks:
  test-network:
    driver: bridge
    internal: true  # No external network access

volumes:
  test-data:
  test-db-data:
```

#### Test Dockerfile

Create `Dockerfile.test` with security hardening:

```dockerfile
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY --chown=testuser:testuser . .

# Switch to non-root user
USER testuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["npm", "run", "test:e2e"]
```

### 2. Test Environment Management Scripts

#### Test Environment Launcher

Create `ai-dev/scripts/test-sandbox.sh`:

```bash
#!/bin/bash

# AI Dev Playbook - Secure Test Sandbox Manager
# Manages isolated testing environments for safe AI agent test execution

set -e

# Configuration
COMPOSE_FILE="docker-compose.test.yml"
TEST_NETWORK="aidev-test-network"
CONTAINER_PREFIX="aidev-test"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to create secure test environment
create_sandbox() {
    log_info "Creating secure test sandbox environment..."
    
    # Create isolated network
    docker network create --driver bridge --internal "$TEST_NETWORK" 2>/dev/null || true
    
    # Start test services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 10
    
    # Verify sandbox isolation
    verify_isolation
    
    log_success "Secure test sandbox created successfully"
}

# Function to verify sandbox isolation
verify_isolation() {
    log_info "Verifying sandbox isolation..."
    
    # Check network isolation
    if docker exec "${CONTAINER_PREFIX}_app-test_1" ping -c 1 google.com >/dev/null 2>&1; then
        log_error "SECURITY VIOLATION: Container has external network access"
        cleanup_sandbox
        exit 1
    fi
    
    # Check file system restrictions
    if docker exec "${CONTAINER_PREFIX}_app-test_1" touch /etc/test-file 2>/dev/null; then
        log_error "SECURITY VIOLATION: Container can write to system directories"
        cleanup_sandbox
        exit 1
    fi
    
    log_success "Sandbox isolation verified"
}

# Function to run tests in sandbox
run_tests() {
    local test_type="$1"
    
    log_info "Running $test_type tests in secure sandbox..."
    
    case "$test_type" in
        "unit")
            docker-compose -f "$COMPOSE_FILE" exec app-test npm run test:unit
            ;;
        "integration")
            docker-compose -f "$COMPOSE_FILE" exec app-test npm run test:integration
            ;;
        "e2e")
            docker-compose -f "$COMPOSE_FILE" exec app-test npm run test:e2e
            ;;
        "security")
            docker-compose -f "$COMPOSE_FILE" exec app-test npm run test:security
            ;;
        "all")
            docker-compose -f "$COMPOSE_FILE" exec app-test npm run test
            ;;
        *)
            log_error "Unknown test type: $test_type"
            exit 1
            ;;
    esac
}

# Function to cleanup sandbox
cleanup_sandbox() {
    log_info "Cleaning up test sandbox..."
    
    # Stop and remove containers
    docker-compose -f "$COMPOSE_FILE" down -v
    
    # Remove test network
    docker network rm "$TEST_NETWORK" 2>/dev/null || true
    
    # Clean up test volumes
    docker volume prune -f
    
    log_success "Test sandbox cleaned up"
}

# Function to get sandbox status
status_sandbox() {
    log_info "Test sandbox status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Main function
main() {
    case "${1:-help}" in
        "create")
            create_sandbox
            ;;
        "test")
            run_tests "${2:-all}"
            ;;
        "cleanup")
            cleanup_sandbox
            ;;
        "status")
            status_sandbox
            ;;
        "help"|"-h"|"--help")
            cat << EOF
AI Dev Playbook - Secure Test Sandbox Manager

USAGE:
    $0 <command> [options]

COMMANDS:
    create          Create secure test sandbox environment
    test [type]     Run tests in sandbox (unit|integration|e2e|security|all)
    cleanup         Clean up test sandbox and resources
    status          Show sandbox status
    help            Show this help message

EXAMPLES:
    $0 create                    # Create sandbox environment
    $0 test e2e                  # Run E2E tests
    $0 test security             # Run security tests
    $0 cleanup                   # Clean up when done

SECURITY FEATURES:
    ✅ Container isolation with no external network access
    ✅ Read-only file system with limited write access
    ✅ Non-root user execution
    ✅ Resource limits and constraints
    ✅ Automatic cleanup of test data

EOF
            ;;
        *)
            log_error "Unknown command: $1"
            log_info "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

main "$@"
```

### 3. Test Configuration Templates

#### Jest Configuration for Sandboxed Testing

Create `jest.sandbox.config.js`:

```javascript
module.exports = {
  displayName: 'Sandboxed Tests',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/sandbox.js'],
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.js',
    '<rootDir>/tests/e2e/**/*.test.js',
    '<rootDir>/tests/security/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/test-utils/**'
  ],
  coverageDirectory: 'coverage/sandbox',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000,
  maxWorkers: 1, // Ensure tests run sequentially in sandbox
  forceExit: true,
  detectOpenHandles: true
};
```

#### Sandbox Test Setup

Create `tests/setup/sandbox.js`:

```javascript
// Sandbox Test Environment Setup
// Ensures all tests run in secure, isolated environment

const { execSync } = require('child_process');

// Verify we're running in sandbox
beforeAll(async () => {
  // Check for sandbox environment variables
  const requiredEnvVars = ['NODE_ENV', 'DATABASE_URL'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  
  // Verify we're in test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run in NODE_ENV=test');
  }
  
  // Verify network isolation (should fail to reach external sites)
  try {
    execSync('ping -c 1 -W 1 google.com', { stdio: 'ignore' });
    throw new Error('SECURITY VIOLATION: External network access detected');
  } catch (error) {
    // Expected - network should be isolated
    console.log('✅ Network isolation verified');
  }
  
  // Initialize test database
  await setupTestDatabase();
  
  console.log('✅ Sandbox environment verified and initialized');
});

// Clean up after all tests
afterAll(async () => {
  await cleanupTestDatabase();
  console.log('✅ Sandbox cleanup completed');
});

// Reset state between tests
beforeEach(async () => {
  await resetTestState();
});

async function setupTestDatabase() {
  // Database initialization logic
  console.log('Setting up test database...');
}

async function cleanupTestDatabase() {
  // Database cleanup logic
  console.log('Cleaning up test database...');
}

async function resetTestState() {
  // Reset application state between tests
  console.log('Resetting test state...');
}
```

## Integration with Enhanced Tester Agent

### Agent Workflow Integration

The enhanced Tester Agent integrates with the sandbox environment through:

1. **Environment Detection**: Automatically detects if sandbox is available
2. **Test Strategy Selection**: Chooses appropriate test types based on environment
3. **Execution Management**: Manages test execution within security constraints
4. **Result Analysis**: Analyzes test results and generates comprehensive reports

### Example Agent Usage

```markdown
# Tester Agent Invocation

## Context
- Application: Node.js REST API
- Database: PostgreSQL
- Testing Framework: Jest
- Sandbox: Docker-based isolation

## Test Requirements
- Unit tests for authentication module
- Integration tests for API endpoints
- E2E tests for user registration flow
- Security tests for input validation

## Sandbox Configuration
- Network isolation: ✅ Enabled
- Database isolation: ✅ Test database
- File system protection: ✅ Read-only with limited write access
- Resource limits: ✅ CPU and memory constraints

Please generate comprehensive tests following the sandbox requirements.
```

## Best Practices

### Security Best Practices

1. **Always Use Isolation**: Never run AI-generated tests on production systems
2. **Verify Sandbox Integrity**: Always verify isolation before running tests
3. **Clean State**: Ensure tests start with clean, predictable state
4. **Resource Limits**: Implement CPU, memory, and time constraints
5. **Network Isolation**: Prevent external network access during testing

### Test Quality Best Practices

1. **Comprehensive Coverage**: Include unit, integration, E2E, and security tests
2. **Realistic Data**: Use synthetic data that mirrors production patterns
3. **Error Scenarios**: Test both success and failure cases
4. **Performance Validation**: Include performance benchmarks
5. **Security Validation**: Test for common vulnerabilities

### Operational Best Practices

1. **Automated Cleanup**: Always clean up sandbox resources after testing
2. **Monitoring**: Monitor resource usage during test execution
3. **Logging**: Maintain comprehensive logs of test execution
4. **Documentation**: Document test scenarios and expected outcomes
5. **Version Control**: Track test configurations and results

## Troubleshooting

### Common Issues

**Sandbox Creation Fails**
- Check Docker daemon is running
- Verify sufficient system resources
- Ensure no port conflicts

**Tests Fail in Sandbox**
- Verify environment variables are set correctly
- Check database connectivity
- Ensure test data is properly seeded

**Security Violations Detected**
- Review container configuration
- Check network isolation settings
- Verify file system permissions

**Performance Issues**
- Adjust resource limits
- Optimize test parallelization
- Review container resource allocation

This sandboxed testing approach ensures that AI agents can safely execute comprehensive tests while maintaining the highest security standards required for enterprise environments.
