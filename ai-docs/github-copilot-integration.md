# GitHub Copilot Integration

This document explains how the AI Dev Playbook integrates with GitHub Copilot's repository custom instructions and prompt files features to provide a seamless AI-assisted development experience. The integration is designed to work with any specification source, whether created internally or imported from external tools like Amazon Kiro or GitHub Spec Kit.

## Repository Custom Instructions

GitHub Copilot allows repositories to include custom instructions that provide context and guidance for AI interactions. The AI Dev Playbook leverages this feature to ensure consistent AI assistance across your project.

### How It Works

1. The `.github/copilot-instructions.md` file contains repository-wide instructions for GitHub Copilot
2. These instructions inform Copilot about:
   - The AI Dev Playbook methodology and principles
   - Project structure and workflow
   - Coding standards and expectations
   - Template variables for project-specific customization
   - Integration with external specification tools (Kiro, Spec Kit)
   - Location and format of specification artifacts in `.ai-dev/memory/`

### Benefits

- **Consistency**: Ensures all team members receive the same AI guidance
- **Onboarding**: New developers automatically get context about your development approach
- **Quality**: Reinforces best practices like minimal code generation and design documentation
- **External Tool Awareness**: Copilot automatically recognizes and references artifacts from Kiro, Spec Kit, or other external tools
- **Specification Integration**: Seamless workflow whether specifications come from internal processes or external tools

## Prompt Files

GitHub Copilot's prompt files feature allows you to save common prompt instructions in `.prompt.md` files that can be referenced directly in Copilot Chat.

### How It Works

1. The `.github/prompts/` directory contains `.prompt.md` files for each agent type
2. These files mirror the functionality of our agent templates in `ai-dev/prompts/`
3. You can reference them directly in GitHub Copilot Chat using the `@prompt` command

For example:
```
@prompt plan-feature
```

### Available Prompt Files

The AI Dev Playbook includes the following prompt files:

| Prompt File | Purpose |
|-------------|---------|
| `create-specifications.prompt.md` | Create detailed specifications before implementation |
| `plan-feature.prompt.md` | Create a detailed implementation plan |
| `estimate-work.prompt.md` | Provide time and complexity estimates |
| `implement-code.prompt.md` | Write clean, efficient code |
| `write-tests.prompt.md` | Create comprehensive tests |
| `refactor-code.prompt.md` | Improve existing code |
| `security-review.prompt.md` | Identify security vulnerabilities |
| `document-code.prompt.md` | Create clear documentation |
| `archive-work.prompt.md` | Record completed work in AIDEV.md |
| `compact-context.prompt.md` | Distill large context into focused summaries |
| `incident-triage.prompt.md` | Analyze production errors systematically |
| `incident-fix.prompt.md` | Plan balanced incident response strategies |

## Side-by-Side Workflow Comparison

| Agent | Traditional Workflow | Copilot Native Workflow | Expert Persona |
|-------|---------------------|-------------------------|----------------|
| **Specification** | `@workspace ai-dev/prompts/00-specification-agent.md` | `@prompt create-specifications` | Domain expert + Technical architect |
| **Planner** | `@workspace ai-dev/prompts/01-planner-agent.md` | `@prompt plan-feature` | Senior software architect |
| **Estimator** | `@workspace ai-dev/prompts/02-estimator-agent.md` | `@prompt estimate-work` | Technical lead with estimation expertise |
| **Coder** | `@workspace ai-dev/prompts/03-coder-agent.md` | `@prompt implement-code` | Senior developer with stack expertise |
| **Tester** | `@workspace ai-dev/prompts/04-tester-agent.md` | `@prompt write-tests` | QA expert with testing frameworks |
| **Refactor** | `@workspace ai-dev/prompts/05-refactor-agent.md` | `@prompt refactor-code` | Martin Fowler methodology |
| **Documenter** | `@workspace ai-dev/prompts/06-documenter-agent.md` | `@prompt document-code` | Technical writer + codebase expert |
| **Security** | `@workspace ai-dev/prompts/07-security-reviewer-agent.md` | `@prompt security-review` | Security expert + penetration tester |
| **Archiver** | `@workspace ai-dev/prompts/08-archiver-agent.md` | `@prompt archive-work` | Project historian |
| **Compactor** | `@workspace ai-dev/prompts/09-compactor-agent.md` | `@prompt compact-context` | Information architect |
| **Incident Triage** | `@workspace ai-dev/prompts/10-incident-triage-agent.md` | `@prompt incident-triage` | Site reliability engineer |
| **Incident Fix** | `@workspace ai-dev/prompts/11-incident-fix-agent.md` | `@prompt incident-fix` | Senior engineer + incident response |

## When to Use Each Approach

### Traditional Workflow (`@workspace` commands)

**Best for**:
- Complex, multi-step features requiring careful context management
- Processing specifications from external tools like Kiro or Spec Kit
- Team collaboration with structured handoffs between agents
- Features requiring artifact persistence between workflow steps
- Training team members on the complete AI Dev Playbook methodology

**Example workflow**:
```bash
# 1. Create specification
Using @workspace ai-dev/prompts/00-specification-agent.md, create a technical specification for the user authentication system.

# 2. Create implementation plan  
Using @workspace ai-dev/prompts/01-planner-agent.md, create a detailed plan based on the specification in .ai-dev/memory/auth-spec.md.

# 3. Implement with full context
Using @workspace ai-dev/prompts/03-coder-agent.md, implement the authentication system following the plan in .ai-dev/memory/auth-plan.md.
```

### Copilot Native Workflow (`@prompt` commands)

**Best for**:
- Quick, focused tasks (code reviews, bug fixes, single function implementations)
- Developers who prefer conversational AI interaction
- Tasks that don't require persistent artifact management
- Rapid prototyping and experimentation
- Code refactoring and documentation updates

**Example workflow**:
```bash
# Quick implementation with expert guidance
@prompt implement-code
# Implement the login validation function with senior developer expertise

# Immediate test creation  
@prompt write-tests
# Create comprehensive tests with QA expert methodology

# Security review
@prompt security-review  
# Review with penetration tester mindset for vulnerabilities
```

## Key Advantages of Each Approach

### Traditional Workflow Advantages
- **Context Persistence**: Artifacts flow seamlessly between agents
- **External Tool Integration**: Automatic processing of Kiro/Spec Kit specifications
- **Structured Collaboration**: Clear handoffs for team development
- **Complete Documentation**: Full audit trail in AIDEV.md project ledger

### Copilot Native Advantages  
- **Speed**: Immediate access to expert personas without file navigation
- **Native Integration**: Built into VS Code Copilot experience
- **Flexibility**: Easy to combine multiple agents in single conversation
- **Learning Curve**: Familiar interface for existing Copilot users

## Working with External Tool Artifacts

GitHub Copilot's repository custom instructions are automatically aware of external tool artifacts stored in `.ai-dev/memory/`. This means:

### **Automatic Context Awareness**

When you reference specifications in Copilot Chat, it will automatically understand:
- Kiro-generated `design.md`, `requirements.md`, and `tasks.md` files
- Spec Kit-generated specification and task files
- Any other specification documents in the memory directory

### **Seamless Integration Examples**

**With Kiro Artifacts:**
```
Based on the Kiro design document in .ai-dev/memory/, implement the user authentication service
```

**With Spec Kit Artifacts:**
```
Using the task list from Spec Kit in .ai-dev/memory/, implement Task T003 for the payment processing feature
```

**Hybrid Approach:**
```
@prompt implement-code and reference both the Kiro requirements and the additional design notes I added to .ai-dev/memory/
```

### **Benefits of Repository Instruction Awareness**

- **No Manual Context Loading**: Copilot automatically knows about your specification artifacts
- **Consistent Interpretation**: External tool outputs are understood in the context of AI Dev Playbook methodology
- **Quality Assurance**: Implementations are guided by both external specifications and AI Dev Playbook best practices

## Template Variables

Both approaches support template variables:

1. Repository custom instructions reference variables using `{{VARIABLE_NAME}}` syntax
2. Variables are defined in `.ai-dev/config/variables.json`
3. The same variables can be used in both agent templates and prompt files

## Setting Up GitHub Copilot Integration

To enable these features in your project:

1. Ensure GitHub Copilot is properly configured in your IDE
2. Verify that repository custom instructions are enabled in your Copilot settings
3. For prompt files, ensure the "Use Instruction Files" option is enabled

## Best Practices

1. **Consistency**: Keep agent templates and prompt files synchronized
2. **Minimal Duplication**: Reference existing documentation rather than duplicating it
3. **Progressive Adoption**: Start with repository custom instructions, then add prompt files as needed
4. **Team Training**: Ensure all team members understand both approaches
5. **External Tool Integration**: When using tools like Kiro or Spec Kit, ensure artifacts are properly placed in `.ai-dev/memory/` for automatic Copilot awareness
6. **Specification Quality**: Whether using internal or external tools, maintain high-quality specifications that Copilot can effectively reference
7. **Memory Management**: Regularly clean and organize `.ai-dev/memory/` to maintain clear context for Copilot interactions
