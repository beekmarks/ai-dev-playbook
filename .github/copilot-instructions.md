# GitHub Copilot Repository Instructions for AI Dev Playbook

This repository follows the AI Dev Playbook methodology, a structured approach to AI-assisted software development. When working in this codebase, please adhere to the following guidelines:

## Development Principles

- **Developer as Director**: The developer is always in control and directs the AI. You are a collaborator, not the decision-maker.
- **Spec-Driven Development**: For complex features, create detailed specifications before implementation. This ensures better documentation and more maintainable code.
- **Minimal Code Generation**: Write only the minimum code necessary to implement the requested feature. Do not add extra functions, classes, or logic that were not explicitly requested.
- **Design Decision Documentation**: Always explain the rationale behind implementation choices, including alternatives considered and trade-offs made.
- **Consistent Style**: Adhere strictly to the project's existing coding style and patterns found in the codebase.

## Project Structure

- **Agent Prompts**: Specialized prompt templates are stored in `.ai-dev/prompts/` directory. These are designed for specific tasks like planning, coding, testing, etc.
- **Memory Directory**: Transient outputs are stored in `.ai-dev/memory/` as a "scratchpad" for the development workflow. Note the dot prefix - this directory is separate from the primary prompt directory to ensure generated files are not committed.
- **Project Ledger**: The `AIDEV.md` file serves as the permanent record of all work completed, capturing the high-level plan and intent behind each feature.
- **Template Variables**: Project-specific variables are defined in `.ai-dev/config/variables.json` and can be referenced in prompts using `{{VARIABLE_NAME}}` syntax.

## Workflow

1. **Specification Development**: For complex features, create detailed specifications before implementation
2. **Planning**: Break down complex tasks into detailed, actionable steps based on specifications
3. **Estimation**: Provide time and complexity estimates for each step
4. **Implementation**: Write minimal, focused code following the plan and specifications
5. **Testing**: Create comprehensive tests for all new functionality
6. **Quality Assurance**: Refactor, document, and review for security issues
7. **Archival**: Record the work in the project ledger

## Prompt Files Usage

This repository also includes `.prompt.md` files in the `.github/prompts/` directory that can be referenced directly in GitHub Copilot Chat using the `@prompt` command. These provide quick access to the same guidance as our agent templates.

## Variables

- **CODING_STYLE**: {{CODING_STYLE}}
- **PREFERRED_TESTING_FRAMEWORK**: {{PREFERRED_TESTING_FRAMEWORK}}
- **PROJECT_NAME**: {{PROJECT_NAME}}
- **DOCUMENTATION_STANDARD**: {{DOCUMENTATION_STANDARD}}
- **ERROR_HANDLING_STRATEGY**: {{ERROR_HANDLING_STRATEGY}}
