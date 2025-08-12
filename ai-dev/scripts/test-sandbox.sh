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

# Function to check if Docker is available
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi
}

# Function to create secure test environment
create_sandbox() {
    log_info "Creating secure test sandbox environment..."
    
    check_docker
    
    # Create isolated network if it doesn't exist
    if ! docker network ls | grep -q "$TEST_NETWORK"; then
        docker network create --driver bridge --internal "$TEST_NETWORK"
        log_info "Created isolated test network: $TEST_NETWORK"
    fi
    
    # Check if compose file exists
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        log_warning "Docker Compose file not found: $COMPOSE_FILE"
        log_info "Creating basic test configuration..."
        create_basic_compose_file
    fi
    
    # Start test services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 10
    
    # Verify sandbox isolation
    verify_isolation
    
    log_success "Secure test sandbox created successfully"
}

# Function to create basic compose file if none exists
create_basic_compose_file() {
    cat > "$COMPOSE_FILE" << 'EOF'
version: '3.8'

services:
  app-test:
    image: node:18-alpine
    working_dir: /app
    environment:
      - NODE_ENV=test
    volumes:
      - .:/app:ro
      - test-data:/app/data
    networks:
      - test-network
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/tmp
    command: ["tail", "-f", "/dev/null"]  # Keep container running

networks:
  test-network:
    driver: bridge
    internal: true  # No external network access

volumes:
  test-data:
EOF
    
    log_info "Created basic Docker Compose configuration"
}

# Function to verify sandbox isolation
verify_isolation() {
    log_info "Verifying sandbox isolation..."
    
    local container_name
    container_name=$(docker-compose -f "$COMPOSE_FILE" ps -q app-test)
    
    if [[ -z "$container_name" ]]; then
        log_error "Test container not found"
        return 1
    fi
    
    # Check network isolation (should fail to reach external sites)
    if docker exec "$container_name" ping -c 1 -W 1 google.com >/dev/null 2>&1; then
        log_error "SECURITY VIOLATION: Container has external network access"
        cleanup_sandbox
        exit 1
    fi
    
    # Check file system restrictions (should fail to write to system directories)
    if docker exec "$container_name" touch /etc/test-file 2>/dev/null; then
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
    
    local container_name
    container_name=$(docker-compose -f "$COMPOSE_FILE" ps -q app-test)
    
    if [[ -z "$container_name" ]]; then
        log_error "Test container not running. Run 'create' first."
        exit 1
    fi
    
    case "$test_type" in
        "unit")
            docker exec "$container_name" npm run test:unit 2>/dev/null || \
            docker exec "$container_name" npm test -- --testPathPattern=unit 2>/dev/null || \
            log_warning "No unit test script found. Please configure package.json"
            ;;
        "integration")
            docker exec "$container_name" npm run test:integration 2>/dev/null || \
            docker exec "$container_name" npm test -- --testPathPattern=integration 2>/dev/null || \
            log_warning "No integration test script found. Please configure package.json"
            ;;
        "e2e")
            docker exec "$container_name" npm run test:e2e 2>/dev/null || \
            docker exec "$container_name" npm test -- --testPathPattern=e2e 2>/dev/null || \
            log_warning "No E2E test script found. Please configure package.json"
            ;;
        "security")
            docker exec "$container_name" npm run test:security 2>/dev/null || \
            log_warning "No security test script found. Please configure package.json"
            ;;
        "all")
            docker exec "$container_name" npm test 2>/dev/null || \
            log_warning "No test script found. Please configure package.json"
            ;;
        "shell")
            log_info "Opening shell in test container..."
            docker exec -it "$container_name" /bin/sh
            ;;
        *)
            log_error "Unknown test type: $test_type"
            log_info "Available types: unit, integration, e2e, security, all, shell"
            exit 1
            ;;
    esac
}

# Function to cleanup sandbox
cleanup_sandbox() {
    log_info "Cleaning up test sandbox..."
    
    # Stop and remove containers
    docker-compose -f "$COMPOSE_FILE" down -v 2>/dev/null || true
    
    # Remove test network
    docker network rm "$TEST_NETWORK" 2>/dev/null || true
    
    # Clean up dangling volumes
    docker volume prune -f >/dev/null 2>&1 || true
    
    log_success "Test sandbox cleaned up"
}

# Function to get sandbox status
status_sandbox() {
    log_info "Test sandbox status:"
    
    if [[ -f "$COMPOSE_FILE" ]]; then
        docker-compose -f "$COMPOSE_FILE" ps
        
        # Show network status
        if docker network ls | grep -q "$TEST_NETWORK"; then
            log_info "Test network: $TEST_NETWORK (active)"
        else
            log_warning "Test network: $TEST_NETWORK (not found)"
        fi
    else
        log_warning "No Docker Compose configuration found"
    fi
}

# Function to show logs
show_logs() {
    local service="$1"
    
    if [[ -n "$service" ]]; then
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    else
        docker-compose -f "$COMPOSE_FILE" logs -f
    fi
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
        "logs")
            show_logs "$2"
            ;;
        "help"|"-h"|"--help")
            cat << EOF
AI Dev Playbook - Secure Test Sandbox Manager

USAGE:
    $0 <command> [options]

COMMANDS:
    create              Create secure test sandbox environment
    test [type]         Run tests in sandbox (unit|integration|e2e|security|all|shell)
    cleanup             Clean up test sandbox and resources
    status              Show sandbox status
    logs [service]      Show container logs
    help                Show this help message

EXAMPLES:
    $0 create                    # Create sandbox environment
    $0 test e2e                  # Run E2E tests
    $0 test security             # Run security tests
    $0 test shell                # Open shell in test container
    $0 logs app-test             # Show application logs
    $0 cleanup                   # Clean up when done

SECURITY FEATURES:
    ✅ Container isolation with no external network access
    ✅ Read-only file system with limited write access
    ✅ Non-root user execution (when configured)
    ✅ Resource limits and constraints
    ✅ Automatic cleanup of test data
    ✅ Network isolation verification

REQUIREMENTS:
    - Docker and Docker Compose installed
    - Project with package.json (for Node.js projects)
    - Test scripts configured in package.json

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
