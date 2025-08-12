# Secure Sandbox Execution Guide: AI Dev Playbook v2.0

This comprehensive guide explains the secure sandbox execution architecture in AI Dev Playbook v2.0, including prerequisites, setup instructions, and implementation details for safe AI-assisted development.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Installation and Setup](#installation-and-setup)
4. [Implementation Details](#implementation-details)
5. [Usage Examples](#usage-examples)
6. [Security Features](#security-features)
7. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
8. [Best Practices](#best-practices)

## Architecture Overview

### **Critical Distinction: AI Agents vs. Code Execution**

The AI Dev Playbook v2.0 uses a **separation of concerns** architecture where:

- **AI Agents run in your development environment** with full internet access to foundational models
- **Generated code runs in isolated sandbox environments** with no external network access

```mermaid
graph TD
    A[Developer Workstation] --> B[AI Development Environment]
    B --> C[AI Agents + Model Access]
    C --> D[Generated Code/Tests]
    D --> E[Docker Sandbox Environment]
    E --> F[Isolated Execution]
    
    G[Internet/AI Models] --> C
    G -.-> E[❌ No Access]
    
    subgraph "Host Environment"
        A
        B
        C
    end
    
    subgraph "Sandbox Environment"
        E
        F
    end
```

### **What Runs Where**

#### **Host Environment (Internet Access)**
- ✅ **AI Agent Prompts** (Delegator, Code Review, etc.)
- ✅ **Foundational AI Models** (GPT-4, Claude, etc.)
- ✅ **Development Tools** (VS Code, Git, etc.)
- ✅ **Orchestration Scripts** (delegator-orchestrator.sh, code-review-automation.sh)

#### **Sandbox Environment (Isolated)**
- 🔒 **AI-Generated Application Code**
- 🔒 **AI-Generated Test Suites**
- 🔒 **Security Testing Tools**
- 🔒 **Performance Testing**
- 🔒 **Integration Testing**

## Prerequisites

### **Required Software**

#### **1. Docker Desktop**
**Purpose**: Container orchestration for secure sandbox environments

**Installation:**

**macOS:**
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop/
# Or install via Homebrew
brew install --cask docker

# Start Docker Desktop application
open -a Docker
```

**Windows:**
```powershell
# Download Docker Desktop from https://www.docker.com/products/docker-desktop/
# Or install via Chocolatey
choco install docker-desktop

# Start Docker Desktop
```

**Linux (Ubuntu/Debian):**
```bash
# Install Docker Engine
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

**Verification:**
```bash
# Verify Docker installation
docker --version
docker-compose --version

# Test Docker functionality
docker run hello-world
```

#### **2. Git**
**Purpose**: Version control and structured commit analysis

**Installation:**
```bash
# macOS
brew install git

# Windows
choco install git

# Linux
sudo apt-get install git
```

#### **3. AI Development Environment**
**Purpose**: Interface for AI agents and foundational models

**Options:**
- **VS Code with AI Extensions** (GitHub Copilot, Cursor, etc.)
- **Claude Interface** (web or API)
- **ChatGPT Plus** (web or API)
- **Local AI Models** (Ollama, etc.)

#### **4. API Keys (Optional but Recommended)**
**Purpose**: Access to foundational AI models

**Required Environment Variables:**
```bash
# .env file in project root
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GITHUB_TOKEN=your_github_token_here

# Optional for enhanced capabilities
GOOGLE_AI_API_KEY=your_google_key_here
AZURE_OPENAI_API_KEY=your_azure_key_here
```

### **System Requirements**

#### **Minimum Requirements**
- **RAM**: 8GB (16GB recommended)
- **Storage**: 10GB free space for Docker images
- **CPU**: 2 cores (4 cores recommended)
- **Network**: Internet access for AI model communication

#### **Recommended Requirements**
- **RAM**: 16GB or more
- **Storage**: 20GB+ free space
- **CPU**: 4+ cores
- **Network**: Stable broadband connection

## Installation and Setup

### **Step 1: Verify Prerequisites**

```bash
# Check Docker installation
docker --version
docker-compose --version
docker info

# Check Git installation
git --version

# Verify AI Dev Playbook files
ls -la ai-dev/scripts/test-sandbox.sh
ls -la ai-dev/scripts/delegator-orchestrator.sh
ls -la ai-dev/scripts/code-review-automation.sh
```

### **Step 2: Make Scripts Executable**

```bash
# Navigate to your AI Dev Playbook directory
cd /path/to/your/ai-dev-playbook

# Make automation scripts executable
chmod +x ai-dev/scripts/*.sh

# Verify permissions
ls -la ai-dev/scripts/
```

### **Step 3: Initialize Sandbox Environment**

```bash
# Test sandbox functionality
./ai-dev/scripts/test-sandbox.sh help

# Create initial sandbox environment
./ai-dev/scripts/test-sandbox.sh create

# Verify sandbox creation
./ai-dev/scripts/test-sandbox.sh status
```

### **Step 4: Configure Project-Specific Settings**

#### **Create Docker Compose Configuration**

Create `docker-compose.test.yml` in your project root:

```yaml
version: '3.8'

services:
  # Main application test container
  app-test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@db-test:5432/testdb
      - REDIS_URL=redis://redis-test:6379
      - NO_INTERNET=true
      - OFFLINE_MODE=true
    depends_on:
      - db-test
      - redis-test
    networks:
      - aidev-test-network
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=100m
    volumes:
      - ./test-results:/app/test-results:rw

  # Test database
  db-test:
    image: postgres:13-alpine
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=test
      - POSTGRES_PASSWORD=test
    networks:
      - aidev-test-network
    tmpfs:
      - /var/lib/postgresql/data:rw,noexec,nosuid
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'

  # Test cache/session store
  redis-test:
    image: redis:6-alpine
    networks:
      - aidev-test-network
    tmpfs:
      - /data:rw,noexec,nosuid
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'

networks:
  aidev-test-network:
    driver: bridge
    internal: true  # No external internet access
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

#### **Create Test Dockerfile**

Create `Dockerfile.test` in your project root:

```dockerfile
# Use appropriate base image for your technology stack
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only test dependencies)
RUN npm ci --only=dev

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S testuser && \
    adduser -S testuser -u 1001 -G testuser

# Set ownership and permissions
RUN chown -R testuser:testuser /app
USER testuser

# Expose port for testing
EXPOSE 3000

# Default command for testing
CMD ["npm", "test"]
```

### **Step 5: Test Installation**

```bash
# Test basic sandbox functionality
./ai-dev/scripts/test-sandbox.sh create
./ai-dev/scripts/test-sandbox.sh run unit
./ai-dev/scripts/test-sandbox.sh cleanup

# Test orchestration functionality
./ai-dev/scripts/delegator-orchestrator.sh status

# Test code review functionality
./ai-dev/scripts/code-review-automation.sh status
```

## Implementation Details

### **Sandbox Security Architecture**

#### **Network Isolation**
```bash
# Create isolated network with no external access
docker network create --driver bridge --internal aidev-test-network

# Verify network isolation
docker network inspect aidev-test-network
# Should show "Internal": true
```

#### **Resource Constraints**
```bash
# Run container with strict resource limits
docker run --rm \
  --name aidev-test-app \
  --network aidev-test-network \
  --memory="512m" \
  --cpus="1.0" \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  --user 1001:1001 \
  your-app:test
```

#### **File System Protection**
```bash
# Mount volumes with security restrictions
docker run --rm \
  --volume ./test-data:/app/data:ro \  # Read-only data
  --volume ./test-results:/app/results:rw \  # Write results only
  --tmpfs /tmp:rw,noexec,nosuid \  # Temporary files with no execution
  your-app:test
```

### **Agent Integration Points**

#### **Tester Agent Sandbox Integration**
```markdown
## SANDBOX EXECUTION REQUIREMENTS
1. All test execution MUST use ./ai-dev/scripts/test-sandbox.sh
2. Tests run in isolated Docker containers with no external access
3. Resource limits enforced: 512MB RAM, 1 CPU core, 5-minute timeout
4. Results captured and returned to host environment
5. Clean environment created for each test run
```

#### **Security Reviewer Agent Integration**
```markdown
## DYNAMIC SECURITY TESTING
1. Security scans run in dedicated security sandbox
2. Vulnerability testing isolated from production systems
3. Network traffic analysis within container boundaries
4. Security tools run with minimal privileges
5. Results aggregated for comprehensive security assessment
```

#### **Delegator Agent Orchestration**
```markdown
## SANDBOX COORDINATION
1. Orchestrate multiple sandbox environments for complex projects
2. Coordinate parallel test execution across isolated containers
3. Aggregate results from multiple sandbox instances
4. Ensure all code execution complies with security requirements
5. Monitor resource usage across all sandbox environments
```

## Usage Examples

### **Example 1: Unit Testing**

```bash
# Generate unit tests using Tester Agent (runs on host with AI access)
# Load ai-dev/prompts/04-tester-agent.md in your AI interface
# AI generates comprehensive unit tests

# Execute tests in sandbox (isolated environment)
./ai-dev/scripts/test-sandbox.sh run unit

# View results
./ai-dev/scripts/test-sandbox.sh logs unit
```

### **Example 2: Integration Testing**

```bash
# Generate integration tests using Tester Agent
# AI creates tests for component interactions

# Run integration tests in sandbox with database
./ai-dev/scripts/test-sandbox.sh run integration

# Monitor resource usage
./ai-dev/scripts/test-sandbox.sh monitor
```

### **Example 3: Security Testing**

```bash
# Generate security tests using Security Reviewer Agent
# AI creates vulnerability assessment tests

# Run security tests in isolated environment
./ai-dev/scripts/test-sandbox.sh run security

# Review security findings
./ai-dev/scripts/test-sandbox.sh results security
```

### **Example 4: End-to-End Workflow**

```bash
# Step 1: Start orchestration (AI planning on host)
./ai-dev/scripts/delegator-orchestrator.sh start "Implement user authentication"

# Step 2: AI agents generate code, tests, and documentation (host environment)
# Delegator Agent coordinates specialized agents with full AI model access

# Step 3: Execute all tests in sandbox (isolated environment)
./ai-dev/scripts/test-sandbox.sh run all

# Step 4: Code review with AI analysis (host environment)
./ai-dev/scripts/code-review-automation.sh review HEAD commit

# Step 5: Final validation and cleanup
./ai-dev/scripts/test-sandbox.sh cleanup
```

## Security Features

### **Multi-Layer Security Model**

#### **Layer 1: Network Isolation**
- **Internal Networks**: Docker networks with no external internet access
- **Service Segmentation**: Separate networks for different test types
- **Traffic Monitoring**: Network activity logging and analysis
- **Firewall Rules**: Explicit deny-all external communication

#### **Layer 2: Resource Constraints**
- **Memory Limits**: Prevent memory exhaustion attacks
- **CPU Limits**: Prevent resource monopolization
- **Execution Timeouts**: Automatic termination of long-running processes
- **File System Limits**: Prevent disk space exhaustion

#### **Layer 3: File System Protection**
- **Read-Only Root**: Container root filesystem is immutable
- **Temporary Storage**: Limited writable space with no execution permissions
- **Volume Isolation**: Test data isolated from host system
- **Permission Controls**: Non-root user execution with minimal privileges

#### **Layer 4: Process Isolation**
- **Container Boundaries**: Process isolation between containers
- **User Namespaces**: Non-root user execution
- **Capability Dropping**: Minimal Linux capabilities
- **Seccomp Profiles**: System call filtering

### **Audit and Compliance Features**

#### **Execution Logging**
```bash
# View sandbox execution logs
docker logs aidev-test-app

# Monitor resource usage
docker stats aidev-test-*

# Export audit logs
./ai-dev/scripts/test-sandbox.sh export-logs
```

#### **Security Monitoring**
```bash
# Check for security violations
./ai-dev/scripts/test-sandbox.sh security-check

# Generate compliance report
./ai-dev/scripts/test-sandbox.sh compliance-report
```

## Monitoring and Troubleshooting

### **Health Monitoring**

#### **System Health Checks**
```bash
# Check Docker daemon status
docker info

# Verify network configuration
docker network ls | grep aidev

# Check resource usage
docker system df
docker system prune  # Clean up if needed
```

#### **Sandbox Health Checks**
```bash
# Check sandbox status
./ai-dev/scripts/test-sandbox.sh status

# Verify container health
./ai-dev/scripts/test-sandbox.sh health-check

# Monitor resource consumption
./ai-dev/scripts/test-sandbox.sh monitor
```

### **Common Issues and Solutions**

#### **Issue: Docker daemon not running**
```bash
# macOS/Windows: Start Docker Desktop application
open -a Docker  # macOS
# Windows: Start Docker Desktop from Start Menu

# Linux: Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

#### **Issue: Insufficient resources**
```bash
# Check available resources
docker system df
free -h  # Check memory
df -h    # Check disk space

# Clean up Docker resources
docker system prune -a
docker volume prune
```

#### **Issue: Network connectivity problems**
```bash
# Recreate test network
docker network rm aidev-test-network
./ai-dev/scripts/test-sandbox.sh create

# Verify network isolation
docker network inspect aidev-test-network
```

#### **Issue: Permission denied errors**
```bash
# Fix script permissions
chmod +x ai-dev/scripts/*.sh

# Check Docker permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker
```

### **Performance Optimization**

#### **Resource Allocation**
```bash
# Adjust resource limits in docker-compose.test.yml
deploy:
  resources:
    limits:
      memory: 1G      # Increase if needed
      cpus: '2.0'     # Increase for CPU-intensive tests
```

#### **Image Optimization**
```bash
# Use multi-stage builds for smaller images
# Cache dependencies for faster builds
# Use Alpine Linux for minimal base images
```

## Best Practices

### **Development Workflow**

#### **1. Separation of Concerns**
- **AI Planning**: Use AI agents on host for intelligent analysis
- **Code Generation**: Generate code with full AI model access
- **Code Execution**: Run generated code in isolated sandbox
- **Results Analysis**: Analyze results on host with AI assistance

#### **2. Security-First Approach**
- **Default Deny**: No external network access in sandbox
- **Minimal Privileges**: Run containers with non-root users
- **Resource Limits**: Always set memory and CPU constraints
- **Clean State**: Fresh environment for each test run

#### **3. Monitoring and Alerting**
- **Resource Monitoring**: Track CPU, memory, and network usage
- **Security Monitoring**: Alert on policy violations
- **Performance Monitoring**: Track test execution times
- **Audit Logging**: Maintain comprehensive execution logs

### **Team Adoption**

#### **1. Training and Documentation**
- **Architecture Understanding**: Ensure team understands AI vs. execution separation
- **Security Awareness**: Train on sandbox security requirements
- **Troubleshooting Skills**: Provide debugging and monitoring guidance
- **Best Practices**: Establish team standards for sandbox usage

#### **2. Integration with Existing Workflows**
- **CI/CD Integration**: Incorporate sandbox testing in pipelines
- **Code Review Process**: Include sandbox execution validation
- **Quality Gates**: Implement automated quality checks
- **Compliance Reporting**: Generate security and compliance reports

### **Security Compliance**

#### **1. Enterprise Requirements**
- **Network Segmentation**: Implement proper network isolation
- **Access Controls**: Enforce authentication and authorization
- **Audit Trails**: Maintain comprehensive activity logs
- **Compliance Reporting**: Generate regulatory compliance reports

#### **2. Risk Management**
- **Threat Assessment**: Regular security risk evaluations
- **Vulnerability Management**: Proactive security scanning
- **Incident Response**: Procedures for security violations
- **Continuous Improvement**: Regular security posture reviews

## Conclusion

The secure sandbox execution architecture in AI Dev Playbook v2.0 provides the perfect balance of AI intelligence and security isolation. By separating AI agent execution (with model access) from code execution (in isolated environments), developers can leverage the full power of AI-assisted development while maintaining enterprise-grade security.

### **Key Benefits**

- **🤖 Full AI Capabilities**: Agents have complete access to foundational models
- **🔒 Secure Execution**: Generated code runs in completely isolated environments
- **⚡ Performance**: Optimized resource usage with configurable limits
- **📊 Monitoring**: Comprehensive logging and monitoring capabilities
- **🏢 Enterprise Ready**: Meets security and compliance requirements
- **🔧 Developer Friendly**: Easy setup and integration with existing workflows

### **Next Steps**

1. **Complete Prerequisites**: Install Docker, Git, and AI development environment
2. **Run Setup**: Execute installation and configuration steps
3. **Test Functionality**: Verify sandbox creation and execution
4. **Integrate Workflows**: Incorporate into development processes
5. **Monitor and Optimize**: Continuously improve security and performance
6. **Train Team**: Ensure all team members understand architecture and usage

With this secure sandbox execution implementation, AI Dev Playbook v2.0 enables safe, intelligent, autonomous development that meets the highest security standards while maximizing AI assistance capabilities.
