# Aider-Style Workflow Guide: Automated AIDEV.md Generation

This guide explains how to use the enhanced AI Dev Playbook workflow that automatically generates AIDEV.md entries from structured Git commit history, inspired by Aider's Git-centric approach.

## Overview

The traditional AI Dev Playbook required manual compilation of artifacts from the `.ai-dev/memory/` directory. The enhanced workflow eliminates this friction by:

1. **Structured Commits**: The enhanced Coder Agent creates atomic commits with structured messages
2. **Automated Analysis**: The enhanced AIDEV Archiver analyzes Git history to extract development narratives
3. **Seamless Documentation**: AIDEV.md entries are generated automatically from commit patterns

## Enhanced Workflow Process

### Step 1: Development with Structured Commits

When using the enhanced Coder Agent (`ai-dev/prompts/03-coder-agent.md`), each implementation step automatically creates a structured commit:

```bash
feat: implement user authentication endpoint

Plan Step: Step 3 - Create login API endpoint with JWT token generation
Implementation: Used bcrypt for password hashing, JWT for session management
Security: Input validation, rate limiting, secure password storage
```

### Step 2: Automated Commit Analysis

After completing a feature, run the automated archiver script:

```bash
./ai-dev/scripts/auto-archiver.sh
```

This script:
- Analyzes Git history since the last AIDEV.md entry
- Identifies structured commits from the enhanced Coder Agent
- Creates a comprehensive summary for the AIDEV Archiver agent

### Step 3: AIDEV Entry Generation

The enhanced AIDEV Archiver agent (`ai-dev/prompts/08-archiver-agent.md`) processes the commit analysis to generate:

- **Development Journey**: Narrative synthesis of commits organized by logical phases
- **Technical Decisions**: Key architectural and implementation choices extracted from commits
- **Security Analysis**: Security considerations and mitigations implemented
- **Impact Assessment**: Code quality, security posture, and maintainability improvements

## Structured Commit Format

The enhanced Coder Agent follows this commit message structure:

```
<type>: <brief description>

Plan Step: <reference to specific plan step>
Implementation: <key technical decisions made>
Security: <security considerations addressed>
```

### Commit Types
- `feat`: New feature implementation
- `fix`: Bug fixes and corrections
- `refactor`: Code refactoring without behavior changes
- `test`: Adding or updating tests
- `docs`: Documentation updates
- `security`: Security-focused changes

### Example Structured Commits

```bash
feat: add user input validation middleware

Plan Step: Step 2 - Implement request validation layer
Implementation: Used Joi schema validation, custom middleware for Express
Security: Prevents injection attacks, validates all user inputs

refactor: optimize database query performance

Plan Step: Step 5 - Improve API response times
Implementation: Added database indexes, optimized N+1 queries with joins
Security: Parameterized queries prevent SQL injection
```

## Benefits of the Enhanced Workflow

### 1. **Eliminated Manual Friction**
- No need to manually gather artifacts from `.ai-dev/memory/`
- No risk of forgetting to run the Archiver agent
- Automatic capture of development decisions in real-time

### 2. **Enhanced Traceability**
- Every code change linked to its strategic rationale
- Clear audit trail from high-level goals to specific implementations
- Comprehensive security documentation

### 3. **Improved Documentation Quality**
- Rich, contextual narratives generated from actual development history
- Technical decisions captured at the moment they're made
- Consistent formatting and comprehensive coverage

### 4. **Better Team Collaboration**
- Clear development history for team members
- Easy onboarding with comprehensive project context
- Standardized documentation across all team members

## Integration with Multi-Modal Workflows

### Micro-Workflow Integration
For quick IDE tasks, the structured commit format still applies but with minimal overhead:
```bash
fix: correct typo in user interface text

Plan Step: Quick fix - UI text correction
Implementation: Updated label text for clarity
Security: No security implications
```

### Meso-Workflow Integration
For feature development, the enhanced workflow provides comprehensive documentation:
- Multiple structured commits per feature
- Logical grouping of related changes
- Complete audit trail of development decisions

### Macro-Workflow Integration
For large projects, the workflow supports:
- Multi-phase development tracking
- Complex decision documentation
- Comprehensive impact assessment

## Migration from Traditional Workflow

### For Existing Projects
1. **Update Agent Prompts**: Use the enhanced Coder Agent for new development
2. **Hybrid Approach**: Continue using traditional workflow for in-progress features
3. **Gradual Adoption**: Implement enhanced workflow for new features

### For New Projects
1. **Start with Enhanced Workflow**: Use structured commits from day one
2. **Establish Patterns**: Create initial AIDEV.md entries to establish format
3. **Team Training**: Ensure all developers understand structured commit format

## Troubleshooting

### No Structured Commits Found
**Problem**: The auto-archiver script finds no structured commits
**Solution**: 
- Ensure you're using the enhanced Coder Agent
- Verify commit messages follow the structured format
- Check that commits include Plan Step, Implementation, and Security sections

### Incomplete Commit Analysis
**Problem**: Generated AIDEV.md entries lack detail
**Solution**:
- Improve commit message quality with more detailed Implementation sections
- Ensure Security considerations are documented even for low-risk changes
- Use descriptive Plan Step references

### Script Execution Issues
**Problem**: Auto-archiver script fails to run
**Solution**:
- Ensure you're in the project root directory
- Verify the script has execute permissions: `chmod +x ai-dev/scripts/auto-archiver.sh`
- Check that you're in a Git repository with commit history

## Best Practices

### Commit Message Quality
- **Be Specific**: Include concrete technical details in Implementation section
- **Security Focus**: Always document security considerations, even if minimal
- **Plan Traceability**: Clear references to plan steps enable better narrative synthesis

### Workflow Timing
- **Atomic Commits**: One logical change per commit for better analysis
- **Feature Completion**: Run auto-archiver after completing logical feature sets
- **Regular Archiving**: Don't let too many commits accumulate before archiving

### Team Coordination
- **Consistent Format**: Ensure all team members use the structured commit format
- **Review Process**: Include commit message quality in code review process
- **Documentation Standards**: Maintain consistent AIDEV.md entry quality

## Future Enhancements

The enhanced workflow provides the foundation for:
- **Automated PR Descriptions**: Generate pull request descriptions from structured commits
- **Release Notes**: Automatically create release notes from AIDEV.md entries
- **Metrics Dashboard**: Track development velocity and quality metrics
- **AI Learning**: Use structured history to improve agent performance over time

This Aider-style workflow transforms the AI Dev Playbook from a manual process into a seamless, automated system that captures development knowledge without friction while maintaining the highest standards of documentation and traceability.
