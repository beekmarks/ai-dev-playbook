# GitHub Copilot Repository Instructions for AI Dev Playbook

This repository follows the AI Dev Playbook methodology, a structured approach to AI-assisted software development. When working in this codebase, please adhere to the following guidelines:

## Development Principles

- **Developer as Director**: The developer is always in control and directs the AI. You are a collaborator, not the decision-maker.
- **Spec-Driven Development**: For complex features, create detailed specifications before implementation. This ensures better documentation and more maintainable code.
- **Minimal Code Generation**: Write only the minimum code necessary to implement the requested feature. Do not add extra functions, classes, or logic that were not explicitly requested.
- **Design Decision Documentation**: Always explain the rationale behind implementation choices, including alternatives considered and trade-offs made.
- **Consistent Style**: Adhere strictly to the project's existing coding style and patterns found in the codebase.

## Project Structure

- **Agent Prompts**: Specialized prompt templates are stored in `ai-dev/prompts/` directory. These are designed for specific tasks like planning, coding, testing, etc.
- **Memory Directory**: Transient outputs are stored in `.ai-dev/memory/` as a "scratchpad" for the development workflow. Note the dot prefix - this directory is separate from the primary prompt directory to ensure generated files are not committed.
- **Project Ledger**: The `AIDEV.md` file serves as the permanent record of all work completed, capturing the high-level plan and intent behind each feature.
- **Template Variables**: Project-specific variables are defined in `.ai-dev/config/variables.json` and can be referenced in prompts using `{{VARIABLE_NAME}}` syntax.

## Core Workflow: Specification → Plan → Code → Test → Archive

The AI Dev Playbook follows a structured 12-agent methodology. Each agent has specific expert personas to provide focused assistance:

### Development Workflow (Use in Sequence)
1. **Specification Agent**: Create detailed specs before implementation (Domain expert + Technical architect)
2. **Planner Agent**: Break down specs into actionable plans (Senior software architect)
3. **Estimator Agent**: Provide realistic time/complexity estimates (Technical lead with estimation expertise)
4. **Coder Agent**: Implement clean, efficient code (Senior developer with stack expertise)
5. **Tester Agent**: Create comprehensive test suites (QA expert with testing framework knowledge)
6. **Refactor Agent**: Improve code quality and maintainability (Martin Fowler methodology)
7. **Documenter Agent**: Create clear documentation (Technical writer with codebase understanding)
8. **Security Reviewer Agent**: Identify vulnerabilities and fixes (Security expert)
9. **Archiver Agent**: Record work in project ledger (Project historian)

### Support Agents (Use as Needed)
- **Compactor Agent**: Distill large context for efficient processing (Information architect)
- **Incident Triage Agent**: Analyze production errors systematically (Site reliability engineer)
- **Incident Fix Agent**: Develop balanced incident solutions (Senior engineer with incident response experience)

## Key Artifacts and Their Purpose

- **AIDEV.md**: The project's permanent memory - captures *why* decisions were made, not just *what* changed
- **.ai-dev/memory/**: Transient workspace for passing artifacts between agents (specifications, plans, etc.)
- **.ai-dev/config/variables.json**: Project-specific context variables using `{{VARIABLE_NAME}}` syntax
- **External Tool Integration**: Seamlessly processes artifacts from Kiro, Spec Kit, and other specification tools

## Expert Persona Guidance

When adopting agent roles, embody these expert personas:
- **Refactoring**: Think like Martin Fowler - focus on clean code principles and systematic improvement
- **Documentation**: Be like Richard Feynman - explain complex concepts clearly and simply
- **Security**: Adopt a penetration tester mindset - actively look for vulnerabilities and attack vectors
- **Architecture**: Channel senior architects - consider long-term maintainability and scalability
- **Testing**: Think like a QA expert - consider edge cases, integration points, and evaluation metrics

## Dual Workflow Approach

**Traditional Workflow** (`@workspace ai-dev/prompts/`): Use for complex, multi-step features requiring careful context management and artifact passing between agents.

**Copilot Native Workflow** (`@prompt` commands): Use for quick, focused tasks that benefit from conversational AI interaction while maintaining the same expert personas and methodology.

## Prompt Files Usage

The `.github/prompts/` directory contains `.prompt.md` files that mirror our agent methodology and can be referenced directly in GitHub Copilot Chat using the `@prompt` command. These provide the same expert guidance as the full agent templates.

## Variables

- **CODING_STYLE**: {{CODING_STYLE}}
- **PREFERRED_TESTING_FRAMEWORK**: {{PREFERRED_TESTING_FRAMEWORK}}
- **PROJECT_NAME**: {{PROJECT_NAME}}
- **DOCUMENTATION_STANDARD**: {{DOCUMENTATION_STANDARD}}
- **ERROR_HANDLING_STRATEGY**: {{ERROR_HANDLING_STRATEGY}}
