#!/bin/bash

# AI Dev Playbook - Delegator Agent Orchestration Script
# Provides infrastructure support for the Delegator Agent to coordinate
# the specialized agent swarm and manage complex project workflows

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
AGENTS_DIR="$PROJECT_ROOT/ai-dev/prompts"
MEMORY_DIR="$PROJECT_ROOT/.ai-dev/memory"
TEMP_DIR="$PROJECT_ROOT/.ai-dev/temp"
ORCHESTRATION_LOG="$TEMP_DIR/orchestration.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[DELEGATOR]${NC} $1" | tee -a "$ORCHESTRATION_LOG"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$ORCHESTRATION_LOG"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$ORCHESTRATION_LOG"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$ORCHESTRATION_LOG"; }
log_agent() { echo -e "${PURPLE}[AGENT]${NC} $1" | tee -a "$ORCHESTRATION_LOG"; }
log_phase() { echo -e "${CYAN}[PHASE]${NC} $1" | tee -a "$ORCHESTRATION_LOG"; }

# Initialize orchestration environment
init_orchestration() {
    log_info "Initializing Delegator Agent orchestration environment..."
    
    # Create necessary directories
    mkdir -p "$MEMORY_DIR" "$TEMP_DIR"
    
    # Initialize orchestration log
    echo "=== AI Dev Playbook - Delegator Agent Orchestration Log ===" > "$ORCHESTRATION_LOG"
    echo "Started: $(date)" >> "$ORCHESTRATION_LOG"
    echo "Project: $(basename "$PROJECT_ROOT")" >> "$ORCHESTRATION_LOG"
    echo "=========================================================" >> "$ORCHESTRATION_LOG"
    
    log_success "Orchestration environment initialized"
}

# Function to validate agent availability
validate_agents() {
    log_info "Validating specialized agent availability..."
    
    local agents=(
        "00-delegator-agent.md"
        "00-specification-agent.md"
        "01-planner-agent.md"
        "02-estimator-agent.md"
        "03-coder-agent.md"
        "04-tester-agent.md"
        "05-refactor-agent.md"
        "06-documenter-agent.md"
        "07-security-reviewer-agent.md"
        "08-archiver-agent.md"
    )
    
    local missing_agents=()
    for agent in "${agents[@]}"; do
        if [[ ! -f "$AGENTS_DIR/$agent" ]]; then
            missing_agents+=("$agent")
        fi
    done
    
    if [[ ${#missing_agents[@]} -gt 0 ]]; then
        log_error "Missing agent prompts:"
        for agent in "${missing_agents[@]}"; do
            log_error "  - $agent"
        done
        return 1
    fi
    
    log_success "All specialized agents available (${#agents[@]} agents)"
}

# Function to create project context file
create_project_context() {
    local goal="$1"
    local context_file="$TEMP_DIR/project-context.md"
    
    log_info "Creating project context for Delegator Agent..."
    
    cat > "$context_file" << EOF
# Project Context for Delegator Agent

## High-Level Goal
$goal

## Project Information
- **Project Root**: $PROJECT_ROOT
- **Repository**: $(git remote get-url origin 2>/dev/null || echo "Local repository")
- **Current Branch**: $(git branch --show-current 2>/dev/null || echo "Unknown")
- **Last Commit**: $(git log -1 --oneline 2>/dev/null || echo "No commits")

## Available Specialized Agents
$(ls -1 "$AGENTS_DIR"/*.md | sed 's|.*/||' | sed 's/\.md$//' | sort | sed 's/^/- /')

## Project Structure
\`\`\`
$(find "$PROJECT_ROOT" -type f -name "*.md" -o -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.py" | grep -E "(README|package\.json|requirements\.txt|\.md$)" | head -20 | sed "s|$PROJECT_ROOT/||")
\`\`\`

## Current AIDEV.md Status
$(if [[ -f "$PROJECT_ROOT/AIDEV.md" ]]; then
    echo "✅ AIDEV.md exists"
    echo "Last entry: $(grep -E "^## " "$PROJECT_ROOT/AIDEV.md" | tail -1 || echo "No entries found")"
else
    echo "❌ AIDEV.md not found"
fi)

## Git Status
\`\`\`
$(git status --porcelain 2>/dev/null | head -10 || echo "No git repository or no changes")
\`\`\`

## Orchestration Environment
- **Memory Directory**: $MEMORY_DIR
- **Temp Directory**: $TEMP_DIR
- **Orchestration Log**: $ORCHESTRATION_LOG
- **Timestamp**: $(date)

## Instructions for Delegator Agent
1. Analyze the high-level goal and project context
2. Generate a comprehensive strategic plan
3. Present the plan for human approval
4. Upon approval, orchestrate the specialized agent swarm
5. Monitor progress and provide regular status updates
6. Ensure all governance and security requirements are met
7. Generate comprehensive documentation and knowledge capture

## Security Requirements
- All code execution must occur in secure sandbox environments
- Comprehensive security review at each major milestone
- Compliance with organizational security policies
- Structured audit trails for all activities

## Quality Standards
- Code quality metrics must meet organizational standards
- Comprehensive testing required for all deliverables
- Documentation must be complete and accurate
- Performance requirements must be validated
EOF
    
    log_success "Project context created: $context_file"
    echo "$context_file"
}

# Function to create agent coordination template
create_coordination_template() {
    local template_file="$TEMP_DIR/agent-coordination-template.md"
    
    log_info "Creating agent coordination template..."
    
    cat > "$template_file" << 'EOF'
# Agent Coordination Template

## Phase Execution Framework

### Phase: [PHASE_NAME]
**Objective**: [Clear description of what this phase accomplishes]
**Duration**: [Estimated timeline]
**Dependencies**: [Prerequisites and blockers]

#### Agent Assignments

##### Planning Cluster
- **Specification Agent**: [Specific task and deliverables]
- **Planner Agent**: [Specific task and deliverables]
- **Estimator Agent**: [Specific task and deliverables]

##### Execution Cluster
- **Coder Agent**: [Specific task and deliverables]
- **Refactorer Agent**: [Specific task and deliverables]
- **Tester Agent**: [Specific task and deliverables]

##### Quality Cluster
- **Security Reviewer Agent**: [Specific task and deliverables]
- **Documenter Agent**: [Specific task and deliverables]
- **AIDEV Archiver Agent**: [Specific task and deliverables]

#### Coordination Points
1. **Task Dependencies**: [How tasks relate to each other]
2. **Handoff Protocols**: [How outputs transfer between agents]
3. **Quality Gates**: [Validation checkpoints]
4. **Human Checkpoints**: [When human approval is required]

#### Success Criteria
- [ ] [Specific, measurable outcome 1]
- [ ] [Specific, measurable outcome 2]
- [ ] [Specific, measurable outcome 3]

#### Risk Mitigation
- **Risk**: [Potential issue]
  **Mitigation**: [How to address it]
- **Risk**: [Potential issue]
  **Mitigation**: [How to address it]

## Progress Tracking

### Completed Tasks
- [ ] [Task 1] - Assigned to [Agent] - Status: [Status]
- [ ] [Task 2] - Assigned to [Agent] - Status: [Status]

### Current Activities
- [Agent Name]: [Current task and progress]
- [Agent Name]: [Current task and progress]

### Upcoming Tasks
- [Task]: [Assigned agent and timeline]
- [Task]: [Assigned agent and timeline]

### Issues and Blockers
- **Issue**: [Description]
  **Impact**: [Effect on project]
  **Resolution**: [Action being taken]

## Human Interaction Points

### Approval Required
- [ ] Strategic plan approval
- [ ] Phase completion sign-off
- [ ] Final deliverable acceptance

### Status Updates
- **Last Update**: [Date and summary]
- **Next Update**: [Scheduled date]
- **Escalation Needed**: [Yes/No - Description if yes]

## Quality Assurance

### Security Checklist
- [ ] All code execution in sandbox environments
- [ ] Security review completed
- [ ] Vulnerability assessment passed
- [ ] Compliance requirements met

### Quality Metrics
- **Code Coverage**: [Percentage]
- **Test Results**: [Pass/Fail counts]
- **Performance**: [Metrics and benchmarks]
- **Documentation**: [Completeness score]
EOF
    
    log_success "Agent coordination template created: $template_file"
    echo "$template_file"
}

# Function to start orchestration session
start_orchestration() {
    local goal="$1"
    
    if [[ -z "$goal" ]]; then
        log_error "Goal is required for orchestration"
        echo "Usage: $0 start \"<high-level goal>\""
        return 1
    fi
    
    log_phase "Starting Delegator Agent orchestration session"
    log_info "Goal: $goal"
    
    # Initialize environment
    init_orchestration
    
    # Validate agents
    if ! validate_agents; then
        log_error "Agent validation failed. Cannot proceed with orchestration."
        return 1
    fi
    
    # Create project context
    local context_file
    context_file=$(create_project_context "$goal")
    
    # Create coordination template
    local template_file
    template_file=$(create_coordination_template)
    
    # Generate orchestration instructions
    cat << EOF

🤖 DELEGATOR AGENT ORCHESTRATION READY
=====================================

## Next Steps:
1. **Load Delegator Agent**: Use the prompt at ai-dev/prompts/00-delegator-agent.md
2. **Provide Context**: Share the project context file: $context_file
3. **Set Goal**: Present the high-level goal for analysis and planning
4. **Review Plan**: The Delegator will generate a comprehensive strategic plan
5. **Approve Execution**: Once approved, the Delegator will orchestrate the agent swarm

## Available Resources:
- **Project Context**: $context_file
- **Coordination Template**: $template_file
- **Orchestration Log**: $ORCHESTRATION_LOG
- **All Specialized Agents**: Available in $AGENTS_DIR

## Delegator Agent Capabilities:
✅ Goal analysis and decomposition
✅ Strategic planning and architecture design
✅ Agent swarm coordination and task delegation
✅ Progress monitoring and risk management
✅ Human interaction and governance compliance
✅ Quality assurance and knowledge capture

## Security Features:
🔒 Sandbox execution requirements enforced
🔒 Comprehensive security review protocols
🔒 Structured audit trails and documentation
🔒 Human oversight and approval checkpoints

Ready to begin autonomous goal-oriented development!

EOF
    
    log_success "Orchestration session initialized successfully"
}

# Function to show orchestration status
show_status() {
    log_info "Delegator Agent Orchestration Status"
    
    if [[ -f "$ORCHESTRATION_LOG" ]]; then
        echo ""
        echo "=== Recent Orchestration Activity ==="
        tail -20 "$ORCHESTRATION_LOG"
    else
        log_warning "No orchestration session found"
    fi
    
    echo ""
    echo "=== Environment Status ==="
    echo "Project Root: $PROJECT_ROOT"
    echo "Memory Directory: $MEMORY_DIR ($(ls -la "$MEMORY_DIR" 2>/dev/null | wc -l) items)"
    echo "Temp Directory: $TEMP_DIR ($(ls -la "$TEMP_DIR" 2>/dev/null | wc -l) items)"
    
    if validate_agents >/dev/null 2>&1; then
        echo "Agent Status: ✅ All agents available"
    else
        echo "Agent Status: ❌ Some agents missing"
    fi
}

# Function to cleanup orchestration environment
cleanup_orchestration() {
    log_info "Cleaning up orchestration environment..."
    
    # Archive current session if it exists
    if [[ -f "$ORCHESTRATION_LOG" ]]; then
        local archive_name="orchestration-$(date +%Y%m%d-%H%M%S).log"
        mv "$ORCHESTRATION_LOG" "$TEMP_DIR/$archive_name"
        log_info "Orchestration log archived as: $archive_name"
    fi
    
    # Clean temporary files but preserve memory
    find "$TEMP_DIR" -name "*.tmp" -delete 2>/dev/null || true
    
    log_success "Orchestration environment cleaned"
}

# Main function
main() {
    cd "$PROJECT_ROOT"
    
    case "${1:-help}" in
        "start")
            start_orchestration "$2"
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup_orchestration
            ;;
        "help"|"-h"|"--help")
            cat << EOF
AI Dev Playbook - Delegator Agent Orchestration Script

USAGE:
    $0 <command> [options]

COMMANDS:
    start "<goal>"      Initialize orchestration session with high-level goal
    status              Show current orchestration status
    cleanup             Clean up orchestration environment
    help                Show this help message

EXAMPLES:
    $0 start "Implement OAuth 2.0 authentication system"
    $0 start "Migrate database from MySQL to PostgreSQL"
    $0 start "Add real-time chat functionality to the application"
    $0 status
    $0 cleanup

DESCRIPTION:
    This script provides infrastructure support for the Delegator Agent to
    coordinate the specialized agent swarm and manage complex project workflows.
    
    The Delegator Agent represents the ultimate evolution of the AI Dev Playbook,
    enabling autonomous goal-oriented development while maintaining human strategic
    control and comprehensive governance.

WORKFLOW:
    1. Initialize orchestration environment
    2. Validate all specialized agents are available
    3. Create project context and coordination templates
    4. Present goal to Delegator Agent for strategic planning
    5. Obtain human approval for strategic plan
    6. Execute plan through coordinated agent swarm
    7. Monitor progress and provide status updates
    8. Ensure quality, security, and governance compliance
    9. Generate comprehensive documentation and knowledge capture

SECURITY FEATURES:
    🔒 Sandbox execution requirements enforced
    🔒 Comprehensive security review protocols  
    🔒 Structured audit trails and documentation
    🔒 Human oversight and approval checkpoints

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
