#!/bin/bash

# AI Dev Playbook - Automated AIDEV Archiver Script
# This script implements the Aider-style workflow by automatically generating
# AIDEV.md entries from structured Git commit history.

set -e

# Configuration
AIDEV_FILE="AIDEV.md"
TEMP_DIR=".ai-dev/temp"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a Git repository. Please run this script from the project root."
        exit 1
    fi
}

# Function to get the date of the last AIDEV.md entry
get_last_entry_date() {
    if [[ ! -f "$AIDEV_FILE" ]]; then
        log_warning "AIDEV.md not found. Will analyze all commits."
        echo "1970-01-01"
        return
    fi
    
    # Extract the most recent date from AIDEV.md entries
    # Look for patterns like "## Feature: ... - July 07, 2025" or "## Feature: ... - 2025-07-07"
    local last_date=$(grep -E "^## .*- [A-Za-z]+ [0-9]{1,2}, [0-9]{4}|^## .*- [0-9]{4}-[0-9]{2}-[0-9]{2}" "$AIDEV_FILE" | tail -1 | sed -E 's/.*- ([A-Za-z]+ [0-9]{1,2}, [0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}).*/\1/')
    
    if [[ -z "$last_date" ]]; then
        log_warning "Could not parse last entry date from AIDEV.md. Will analyze recent commits."
        echo "7 days ago"
    else
        log_info "Last AIDEV.md entry date: $last_date"
        echo "$last_date"
    fi
}

# Function to get structured commits since last entry
get_structured_commits() {
    local since_date="$1"
    local temp_file="$TEMP_DIR/commits.log"
    
    mkdir -p "$TEMP_DIR"
    
    # Get commits with full messages since the last entry
    git log --pretty=format:"%H|%s|%b|%ad" --date=short --since="$since_date" > "$temp_file"
    
    # Filter for structured commits (those with Plan Step, Implementation, Security sections)
    local structured_count=0
    while IFS='|' read -r hash subject body date; do
        if [[ "$body" =~ "Plan Step:" ]] && [[ "$body" =~ "Implementation:" ]]; then
            ((structured_count++))
        fi
    done < "$temp_file"
    
    log_info "Found $structured_count structured commits since $since_date"
    
    if [[ $structured_count -eq 0 ]]; then
        log_warning "No structured commits found. The enhanced Coder Agent may not have been used yet."
        return 1
    fi
    
    echo "$temp_file"
}

# Function to create a summary of commits for the archiver
create_commit_summary() {
    local commits_file="$1"
    local summary_file="$TEMP_DIR/commit-summary.md"
    
    cat > "$summary_file" << 'EOF'
# Commit History Analysis for AIDEV Archiver

## Instructions for AIDEV Archiver Agent

Please analyze the following structured Git commits and generate a comprehensive AIDEV.md entry. 
The commits follow the enhanced format with Plan Step references, Implementation details, and Security considerations.

## Structured Commits to Analyze

EOF
    
    local commit_count=0
    while IFS='|' read -r hash subject body date; do
        if [[ "$body" =~ "Plan Step:" ]] && [[ "$body" =~ "Implementation:" ]]; then
            ((commit_count++))
            cat >> "$summary_file" << EOF

### Commit $commit_count: $hash
**Date:** $date
**Subject:** $subject

**Details:**
$body

---
EOF
        fi
    done < "$commits_file"
    
    cat >> "$summary_file" << 'EOF'

## Analysis Requirements

1. **Synthesize Development Journey**: Create a narrative that explains how these commits work together to achieve a larger goal
2. **Extract Technical Decisions**: Highlight key architectural and implementation choices
3. **Security Analysis**: Summarize security considerations and mitigations
4. **Impact Assessment**: Evaluate the overall impact on code quality, security, and maintainability

Please generate the AIDEV.md entry following the enhanced format specified in your prompt.
EOF
    
    log_success "Created commit summary with $commit_count structured commits"
    echo "$summary_file"
}

# Function to invoke the AIDEV Archiver agent
invoke_archiver() {
    local summary_file="$1"
    
    log_info "Invoking AIDEV Archiver agent..."
    log_info "Summary file: $summary_file"
    
    # In a real implementation, this would call the AI agent
    # For now, we'll create a placeholder that shows the process
    cat << EOF

🤖 AIDEV ARCHIVER AGENT INVOCATION
================================

To complete the automated archiving process:

1. Use your AI development environment (VS Code with GitHub Copilot, etc.)
2. Open the AIDEV Archiver agent prompt: ai-dev/prompts/08-archiver-agent.md
3. Provide the commit summary file as context: $summary_file
4. The agent will analyze the structured commits and generate a comprehensive AIDEV.md entry

The enhanced archiver will:
✅ Parse structured commit messages
✅ Synthesize development narrative
✅ Extract technical decisions and security considerations
✅ Generate comprehensive documentation
✅ Append to AIDEV.md with proper formatting

EOF
}

# Function to demonstrate the workflow with current commits
demo_workflow() {
    log_info "=== AI Dev Playbook - Automated Archiver Demo ==="
    
    local since_date=$(get_last_entry_date)
    local commits_file
    
    if commits_file=$(get_structured_commits "$since_date"); then
        local summary_file=$(create_commit_summary "$commits_file")
        invoke_archiver "$summary_file"
        
        log_success "Automated archiver workflow prepared successfully!"
        log_info "Next: Use the AIDEV Archiver agent with the generated summary file"
    else
        log_warning "No structured commits found for automated processing"
        log_info "To enable automated archiving:"
        log_info "1. Use the enhanced Coder Agent for future development"
        log_info "2. Ensure commits follow the structured format"
        log_info "3. Run this script after completing features"
    fi
}

# Main execution
main() {
    cd "$PROJECT_ROOT"
    check_git_repo
    
    case "${1:-demo}" in
        "demo")
            demo_workflow
            ;;
        "help"|"-h"|"--help")
            cat << EOF
AI Dev Playbook - Automated AIDEV Archiver

USAGE:
    $0 [command]

COMMANDS:
    demo    Run demonstration of automated archiving workflow (default)
    help    Show this help message

DESCRIPTION:
    This script implements the Aider-style workflow by automatically analyzing
    structured Git commit history and preparing it for the AIDEV Archiver agent.
    
    The script looks for commits with structured messages containing:
    - Plan Step references
    - Implementation details  
    - Security considerations
    
    It then creates a summary file that can be used by the AIDEV Archiver agent
    to automatically generate comprehensive AIDEV.md entries.

REQUIREMENTS:
    - Git repository
    - Structured commits from enhanced Coder Agent
    - AIDEV.md file in project root

EOF
            ;;
        *)
            log_error "Unknown command: $1"
            log_info "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
