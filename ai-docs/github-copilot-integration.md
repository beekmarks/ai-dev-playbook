# GitHub Copilot Integration

This document explains how the AI Dev Playbook integrates with GitHub Copilot's repository custom instructions and prompt files features to provide a seamless AI-assisted development experience.

## Repository Custom Instructions

GitHub Copilot allows repositories to include custom instructions that provide context and guidance for AI interactions. The AI Dev Playbook leverages this feature to ensure consistent AI assistance across your project.

### How It Works

1. The `.github/copilot-instructions.md` file contains repository-wide instructions for GitHub Copilot
2. These instructions inform Copilot about:
   - The AI Dev Playbook methodology and principles
   - Project structure and workflow
   - Coding standards and expectations
   - Template variables for project-specific customization

### Benefits

- **Consistency**: Ensures all team members receive the same AI guidance
- **Onboarding**: New developers automatically get context about your development approach
- **Quality**: Reinforces best practices like minimal code generation and design documentation

## Prompt Files

GitHub Copilot's prompt files feature allows you to save common prompt instructions in `.prompt.md` files that can be referenced directly in Copilot Chat.

### How It Works

1. The `.github/prompts/` directory contains `.prompt.md` files for each agent type
2. These files mirror the functionality of our agent templates in `.ai-dev/prompts/`
3. You can reference them directly in GitHub Copilot Chat using the `@prompt` command

For example:
```
@prompt plan-feature
```

### Available Prompt Files

The AI Dev Playbook includes the following prompt files:

| Prompt File | Purpose |
|-------------|---------|
| `plan-feature.prompt.md` | Create a detailed implementation plan |
| `estimate-work.prompt.md` | Provide time and complexity estimates |
| `implement-code.prompt.md` | Write clean, efficient code |
| `write-tests.prompt.md` | Create comprehensive tests |
| `refactor-code.prompt.md` | Improve existing code |
| `security-review.prompt.md` | Identify security vulnerabilities |
| `document-code.prompt.md` | Create clear documentation |
| `archive-work.prompt.md` | Record completed work in AIDEV.md |

## When to Use Each Approach

### Full Workflow with Agent Templates

Use the traditional AI Dev Playbook workflow with `@workspace` commands when:
- Following the complete structured workflow
- Working on complex features that benefit from the full methodology
- Collaborating with team members who are familiar with the playbook

Example:
```
Using @workspace .ai-dev/prompts/01-planner-agent.md, create a plan for...
```

### Quick Tasks with Prompt Files

Use the prompt files approach with `@prompt` commands when:
- Working on smaller, focused tasks
- Needing quick assistance that still follows project standards
- Onboarding new team members who are more familiar with Copilot Chat

Example:
```
@prompt implement-code
```

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
