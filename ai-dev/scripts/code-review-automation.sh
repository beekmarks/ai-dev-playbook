#!/bin/bash

# AI Dev Playbook - Code Review Automation Script
# Provides automated code review capabilities using the AI-Powered Code Review Agent
# Supports PR reviews, commit analysis, and continuous integration workflows

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REVIEW_AGENT_PROMPT="$PROJECT_ROOT/ai-dev/prompts/09-code-review-agent.md"
TEMP_DIR="$PROJECT_ROOT/.ai-dev/temp"
REVIEW_LOG="$TEMP_DIR/code-review.log"
REVIEW_OUTPUT_DIR="$TEMP_DIR/reviews"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${BLUE}[REVIEW]${NC} $1" | tee -a "$REVIEW_LOG"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$REVIEW_LOG"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$REVIEW_LOG"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a "$REVIEW_LOG"; }
log_agent() { echo -e "${PURPLE}[AGENT]${NC} $1" | tee -a "$REVIEW_LOG"; }

# Initialize review environment
init_review_environment() {
    log_info "Initializing code review environment..."
    
    # Create necessary directories
    mkdir -p "$TEMP_DIR" "$REVIEW_OUTPUT_DIR"
    
    # Initialize review log
    echo "=== AI Dev Playbook - Code Review Automation Log ===" > "$REVIEW_LOG"
    echo "Started: $(date)" >> "$REVIEW_LOG"
    echo "Project: $(basename "$PROJECT_ROOT")" >> "$REVIEW_LOG"
    echo "======================================================" >> "$REVIEW_LOG"
    
    # Validate review agent prompt exists
    if [[ ! -f "$REVIEW_AGENT_PROMPT" ]]; then
        log_error "Code Review Agent prompt not found: $REVIEW_AGENT_PROMPT"
        return 1
    fi
    
    log_success "Code review environment initialized"
}

# Function to analyze Git changes
analyze_git_changes() {
    local target="$1"
    local output_file="$2"
    
    log_info "Analyzing Git changes for: $target"
    
    # Determine the type of analysis
    if [[ "$target" == "staged" ]]; then
        # Staged changes analysis
        analyze_staged_changes "$output_file"
    elif [[ "$target" =~ \.\. ]]; then
        # Commit range analysis (for PRs)
        analyze_commit_range "$target" "$output_file"
    else
        # Single commit analysis (supports HEAD, commit hashes, branch names, etc.)
        analyze_commit "$target" "$output_file"
    fi
}

# Analyze a single commit
analyze_commit() {
    local commit="$1"
    local output_file="$2"
    
    log_info "Analyzing commit: $commit"
    
    # Validate commit exists
    if ! git rev-parse --verify "$commit" >/dev/null 2>&1; then
        log_error "Commit not found: $commit"
        return 1
    fi
    
    # Get commit information
    local commit_msg=$(git log -1 --pretty=format:"%s" "$commit")
    local commit_author=$(git log -1 --pretty=format:"%an" "$commit")
    local commit_date=$(git log -1 --pretty=format:"%ci" "$commit")
    
    # Get changed files
    local changed_files=$(git diff-tree --no-commit-id --name-only -r "$commit")
    local files_count=$(echo "$changed_files" | wc -l)
    
    # Get diff statistics
    local diff_stats=$(git diff-tree --stat "$commit")
    
    # Generate review context
    cat > "$output_file" << EOF
# Code Review Context: Single Commit Analysis

## Commit Information
- **Commit Hash**: $commit
- **Message**: $commit_msg
- **Author**: $commit_author
- **Date**: $commit_date
- **Files Changed**: $files_count

## Changed Files
\`\`\`
$changed_files
\`\`\`

## Diff Statistics
\`\`\`
$diff_stats
\`\`\`

## Full Diff
\`\`\`diff
$(git show "$commit")
\`\`\`

## Review Instructions
Please perform a comprehensive code review of this commit using the AI-Powered Code Review Agent framework. Focus on:

1. **Atomic Change Validation**: Ensure the commit represents a single logical change
2. **Code Quality Assessment**: Evaluate the quality of the changes
3. **Security Analysis**: Identify any security implications
4. **Performance Impact**: Assess performance implications
5. **Testing Requirements**: Determine if additional tests are needed
6. **Documentation Updates**: Check if documentation needs updating

Generate a structured review report following the Code Review Agent output format.
EOF
    
    log_success "Commit analysis context generated: $output_file"
}

# Analyze staged changes
analyze_staged_changes() {
    local output_file="$1"
    
    log_info "Analyzing staged changes"
    
    # Check if there are staged changes
    if ! git diff --cached --quiet; then
        local staged_files=$(git diff --cached --name-only)
        local files_count=$(echo "$staged_files" | wc -l)
        local diff_stats=$(git diff --cached --stat)
        
        # Generate review context
        cat > "$output_file" << EOF
# Code Review Context: Staged Changes Analysis

## Staged Changes Information
- **Files Changed**: $files_count
- **Analysis Date**: $(date)
- **Branch**: $(git branch --show-current)

## Staged Files
\`\`\`
$staged_files
\`\`\`

## Diff Statistics
\`\`\`
$diff_stats
\`\`\`

## Full Diff
\`\`\`diff
$(git diff --cached)
\`\`\`

## Review Instructions
Please perform a comprehensive pre-commit code review of these staged changes. Focus on:

1. **Pre-commit Quality Check**: Ensure changes meet quality standards before commit
2. **Security Validation**: Identify any security concerns before they enter the repository
3. **Code Standards**: Verify adherence to coding standards and best practices
4. **Test Coverage**: Ensure appropriate test coverage for changes
5. **Documentation**: Verify documentation is updated as needed

Generate a structured review report and recommend whether these changes are ready for commit.
EOF
        
        log_success "Staged changes analysis context generated: $output_file"
    else
        log_warning "No staged changes found"
        return 1
    fi
}

# Analyze commit range (for PR reviews)
analyze_commit_range() {
    local range="$1"
    local output_file="$2"
    
    log_info "Analyzing commit range: $range"
    
    # Validate commit range
    if ! git rev-list "$range" >/dev/null 2>&1; then
        log_error "Invalid commit range: $range"
        return 1
    fi
    
    # Get range information
    local commits=$(git rev-list --oneline "$range")
    local commits_count=$(echo "$commits" | wc -l)
    local changed_files=$(git diff --name-only "$range")
    local files_count=$(echo "$changed_files" | wc -l)
    local diff_stats=$(git diff --stat "$range")
    
    # Generate review context
    cat > "$output_file" << EOF
# Code Review Context: Pull Request / Commit Range Analysis

## Range Information
- **Commit Range**: $range
- **Commits Count**: $commits_count
- **Files Changed**: $files_count
- **Analysis Date**: $(date)

## Commits in Range
\`\`\`
$commits
\`\`\`

## Changed Files
\`\`\`
$changed_files
\`\`\`

## Diff Statistics
\`\`\`
$diff_stats
\`\`\`

## Full Diff
\`\`\`diff
$(git diff "$range")
\`\`\`

## Review Instructions
Please perform a comprehensive pull request review of this commit range. Focus on:

1. **Feature Completeness**: Ensure the feature/change is complete and cohesive
2. **Code Quality**: Evaluate overall code quality across all changes
3. **Security Review**: Comprehensive security analysis of all changes
4. **Performance Impact**: Assess cumulative performance implications
5. **Testing Strategy**: Evaluate test coverage and quality for the entire change set
6. **Documentation**: Ensure all documentation is updated appropriately
7. **Integration Impact**: Consider how changes affect the broader system

Generate a comprehensive pull request review report with approval recommendation.
EOF
    
    log_success "Commit range analysis context generated: $output_file"
}

# Function to generate review summary for AIDEV.md
generate_aidev_entry() {
    local review_type="$1"
    local target="$2"
    local review_file="$3"
    local aidev_entry="$TEMP_DIR/aidev-review-entry.md"
    
    log_info "Generating AIDEV.md entry for review"
    
    # Extract key metrics from review (this would be enhanced with actual AI review output parsing)
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > "$aidev_entry" << EOF
## Code Review: $review_type
**Date**: $timestamp | **Reviewer**: AI Code Review Agent | **Target**: $target

### Review Summary
- **Review Type**: $review_type
- **Target**: $target
- **Analysis Completed**: $(date)
- **Review Context**: Available in $review_file

### Key Findings
- **Files Analyzed**: [To be populated by AI review]
- **Quality Assessment**: [To be populated by AI review]
- **Security Status**: [To be populated by AI review]
- **Performance Impact**: [To be populated by AI review]

### Action Items
- [ ] [Critical issues to be populated by AI review]
- [ ] [High priority improvements to be populated by AI review]
- [ ] [Recommendations to be populated by AI review]

### Quality Metrics
- **Code Quality Score**: [To be populated]/10
- **Security Score**: [To be populated]/10
- **Test Coverage**: [To be populated]%
- **Technical Debt**: [To be assessed]

### Review Process
1. **Context Generation**: Automated analysis of Git changes
2. **AI Review**: Comprehensive analysis using Code Review Agent
3. **Report Generation**: Structured review output with actionable recommendations
4. **Integration**: Results integrated into development workflow

### Next Steps
- Review AI-generated recommendations
- Address critical and high-priority issues
- Update tests and documentation as recommended
- Consider architectural improvements suggested

---
*This entry was generated by the AI Dev Playbook Code Review Automation system.*
EOF
    
    log_success "AIDEV.md entry template generated: $aidev_entry"
    echo "$aidev_entry"
}

# Function to run automated review
run_automated_review() {
    local target="$1"
    local review_type="$2"
    
    if [[ -z "$target" ]]; then
        log_error "Target is required for automated review"
        echo "Usage: $0 review <target> [type]"
        echo "Examples:"
        echo "  $0 review abc1234 commit"
        echo "  $0 review staged pre-commit"
        echo "  $0 review main..feature-branch pr"
        return 1
    fi
    
    # Determine review type if not specified
    if [[ -z "$review_type" ]]; then
        if [[ "$target" == "staged" ]]; then
            review_type="pre-commit"
        elif [[ "$target" =~ \.\. ]]; then
            review_type="pull-request"
        else
            review_type="commit"
        fi
    fi
    
    log_info "Starting automated code review"
    log_info "Target: $target | Type: $review_type"
    
    # Initialize environment
    init_review_environment
    
    # Generate unique review ID
    local review_id="review-$(date +%Y%m%d-%H%M%S)-$(echo "$target" | tr '/' '-' | cut -c1-10)"
    local review_context="$REVIEW_OUTPUT_DIR/${review_id}-context.md"
    local review_output="$REVIEW_OUTPUT_DIR/${review_id}-output.md"
    
    # Analyze Git changes
    if ! analyze_git_changes "$target" "$review_context"; then
        log_error "Failed to analyze Git changes"
        return 1
    fi
    
    # Generate AIDEV entry template
    local aidev_entry
    aidev_entry=$(generate_aidev_entry "$review_type" "$target" "$review_context")
    
    # Present instructions for AI review
    cat << EOF

🤖 AI-POWERED CODE REVIEW READY
===============================

## Review Configuration
- **Review ID**: $review_id
- **Review Type**: $review_type
- **Target**: $target
- **Context File**: $review_context

## Next Steps for AI Review:
1. **Load Code Review Agent**: Use the prompt at $REVIEW_AGENT_PROMPT
2. **Provide Context**: Share the review context file: $review_context
3. **Execute Review**: Let the AI agent perform comprehensive analysis
4. **Generate Report**: Save the structured review output to: $review_output
5. **Update AIDEV**: Use the template at: $aidev_entry

## Review Capabilities:
✅ Comprehensive code quality analysis
✅ Security vulnerability detection
✅ Performance impact assessment
✅ Test coverage evaluation
✅ Documentation review
✅ Best practices validation
✅ Architecture compliance checking

## Integration Features:
🔗 Git workflow integration
🔗 AIDEV.md automated logging
🔗 CI/CD pipeline compatibility
🔗 Quality metrics tracking

## Files Generated:
- **Review Context**: $review_context
- **Review Output**: $review_output (to be created by AI)
- **AIDEV Entry**: $aidev_entry

Ready to perform intelligent code review!

EOF
    
    log_success "Automated code review setup completed"
    log_info "Review ID: $review_id"
}

# Function to show review status
show_review_status() {
    log_info "Code Review Automation Status"
    
    if [[ -f "$REVIEW_LOG" ]]; then
        echo ""
        echo "=== Recent Review Activity ==="
        tail -20 "$REVIEW_LOG"
    else
        log_warning "No review activity found"
    fi
    
    echo ""
    echo "=== Review Environment ==="
    echo "Project Root: $PROJECT_ROOT"
    echo "Review Output Dir: $REVIEW_OUTPUT_DIR ($(ls -la "$REVIEW_OUTPUT_DIR" 2>/dev/null | wc -l) items)"
    echo "Review Agent Prompt: $REVIEW_AGENT_PROMPT"
    
    if [[ -f "$REVIEW_AGENT_PROMPT" ]]; then
        echo "Agent Status: ✅ Code Review Agent available"
    else
        echo "Agent Status: ❌ Code Review Agent not found"
    fi
    
    # Show recent reviews
    if [[ -d "$REVIEW_OUTPUT_DIR" ]]; then
        echo ""
        echo "=== Recent Reviews ==="
        ls -lt "$REVIEW_OUTPUT_DIR" | head -10
    fi
}

# Function to setup Git hooks for automated reviews
setup_git_hooks() {
    local hooks_dir="$PROJECT_ROOT/.git/hooks"
    
    log_info "Setting up Git hooks for automated code review"
    
    if [[ ! -d "$hooks_dir" ]]; then
        log_error "Git hooks directory not found. Is this a Git repository?"
        return 1
    fi
    
    # Create pre-commit hook
    cat > "$hooks_dir/pre-commit" << 'EOF'
#!/bin/bash
# AI Dev Playbook - Pre-commit Code Review Hook

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REVIEW_SCRIPT="$PROJECT_ROOT/ai-dev/scripts/code-review-automation.sh"

if [[ -f "$REVIEW_SCRIPT" ]]; then
    echo "🤖 Running automated pre-commit code review..."
    "$REVIEW_SCRIPT" review staged pre-commit
    echo "📝 Review context generated. Consider running AI review before committing."
else
    echo "⚠️  Code review automation script not found"
fi
EOF
    
    chmod +x "$hooks_dir/pre-commit"
    log_success "Pre-commit hook installed"
    
    # Create post-commit hook for automatic review logging
    cat > "$hooks_dir/post-commit" << 'EOF'
#!/bin/bash
# AI Dev Playbook - Post-commit Review Logging Hook

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REVIEW_SCRIPT="$PROJECT_ROOT/ai-dev/scripts/code-review-automation.sh"

if [[ -f "$REVIEW_SCRIPT" ]]; then
    LAST_COMMIT=$(git rev-parse HEAD)
    echo "📋 Generating review context for commit: $LAST_COMMIT"
    "$REVIEW_SCRIPT" review "$LAST_COMMIT" post-commit
fi
EOF
    
    chmod +x "$hooks_dir/post-commit"
    log_success "Post-commit hook installed"
    
    log_success "Git hooks setup completed"
}

# Main function
main() {
    cd "$PROJECT_ROOT"
    
    case "${1:-help}" in
        "review")
            run_automated_review "$2" "$3"
            ;;
        "status")
            show_review_status
            ;;
        "setup-hooks")
            setup_git_hooks
            ;;
        "help"|"-h"|"--help")
            cat << EOF
AI Dev Playbook - Code Review Automation Script

USAGE:
    $0 <command> [options]

COMMANDS:
    review <target> [type]    Run automated code review analysis
    status                    Show code review automation status
    setup-hooks              Install Git hooks for automated reviews
    help                     Show this help message

REVIEW TARGETS:
    <commit-hash>            Review a specific commit
    staged                   Review currently staged changes
    <from>..<to>            Review a range of commits (PR review)

REVIEW TYPES:
    commit                   Single commit review
    pre-commit              Pre-commit staged changes review
    pull-request            Pull request / feature branch review
    post-commit             Post-commit analysis and logging

EXAMPLES:
    $0 review abc1234                    # Review specific commit
    $0 review staged                     # Review staged changes
    $0 review main..feature-branch       # Review PR/feature branch
    $0 review HEAD~3..HEAD pr           # Review last 3 commits as PR
    $0 setup-hooks                       # Install Git hooks
    $0 status                           # Show review status

WORKFLOW:
    1. Analyze Git changes and generate context
    2. Prepare structured input for AI Code Review Agent
    3. Execute comprehensive code review using AI agent
    4. Generate structured review report with recommendations
    5. Create AIDEV.md entry for development log
    6. Integrate with CI/CD and quality gates

FEATURES:
    🔍 Comprehensive code quality analysis
    🔒 Security vulnerability detection
    ⚡ Performance impact assessment
    📊 Test coverage evaluation
    📚 Documentation review
    🏗️ Architecture compliance checking
    🔗 Git workflow integration
    📝 AIDEV.md automated logging

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
