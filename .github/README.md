# GitHub Copilot Integration for AI Dev Playbook

This directory contains files that enable GitHub Copilot to provide AI assistance that follows the AI Dev Playbook methodology. These files complement the traditional workflow using agent templates in the `.ai-dev/prompts/` directory.

## Contents

- **copilot-instructions.md**: Repository-wide custom instructions for GitHub Copilot
- **prompts/**: Directory containing prompt files for specific tasks

## How to Use

### Repository Custom Instructions

The `copilot-instructions.md` file provides GitHub Copilot with context about your project and the AI Dev Playbook methodology. These instructions are automatically applied to all Copilot interactions in this repository.

No special commands are needed - just use GitHub Copilot as you normally would, and it will follow the guidelines specified in the instructions file.

### Prompt Files

The `.prompt.md` files in the `prompts/` directory can be directly referenced in GitHub Copilot Chat using the `@prompt` command:

```
@prompt plan-feature
```

This will load the instructions from `prompts/plan-feature.prompt.md` into your current Copilot Chat conversation.

## Available Prompt Files

| Prompt File | Purpose | Traditional Equivalent |
|-------------|---------|------------------------|
| `create-specifications.prompt.md` | Create detailed specifications before implementation | `00-specification-agent.md` |
| `plan-feature.prompt.md` | Create a detailed implementation plan | `01-planner-agent.md` |
| `estimate-work.prompt.md` | Provide time and complexity estimates | `02-estimator-agent.md` |
| `implement-code.prompt.md` | Write clean, efficient code | `03-coder-agent.md` |
| `write-tests.prompt.md` | Create comprehensive tests | `04-tester-agent.md` |
| `refactor-code.prompt.md` | Improve existing code | `05-refactorer-agent.md` |
| `document-code.prompt.md` | Create clear documentation | `06-documenter-agent.md` |
| `security-review.prompt.md` | Identify security vulnerabilities | `07-security-reviewer-agent.md` |
| `archive-work.prompt.md` | Record completed work in AIDEV.md | `08-archiver-agent.md` |
| `compact-context.prompt.md` | Distill and summarize accumulated context | `09-compactor-agent.md` |

## Template Variables

Both the repository custom instructions and prompt files support template variables defined in `.ai-dev/config/variables.json`. These variables are referenced using the `{{VARIABLE_NAME}}` syntax.

## When to Use Each Approach

- **Traditional Workflow**: Best for complex features and structured development following the full AI Dev Playbook methodology
- **GitHub Copilot Native Integration**: Best for quick tasks and developers who prefer a more conversational AI interaction

For more details, see [ai-docs/github-copilot-integration.md](../ai-docs/github-copilot-integration.md).
