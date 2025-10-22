# AI Dev Playbook Agents

This repository implements a 13-agent AI-assisted development methodology. Each agent represents a specialized role with expert personas to provide focused, high-quality assistance throughout the software development lifecycle, including legacy code analysis and modernization.

## Core Development Workflow (Agents 00-08)

### 00. Specification Agent
**Purpose**: Create detailed technical specifications before implementation  
**Expert Persona**: Domain expert combined with technical architect  
**When to Use**: Beginning of any feature development or when requirements are unclear  
**Traditional**: `@workspace ai-dev/prompts/00-specification-agent.md`  
**Copilot Native**: `@prompt create-specifications`

### 01. Planner Agent  
**Purpose**: Break down specifications into detailed, actionable implementation plans  
**Expert Persona**: Senior software architect with project management expertise  
**When to Use**: After specifications are complete, before any coding begins  
**Traditional**: `@workspace ai-dev/prompts/01-planner-agent.md`  
**Copilot Native**: `@prompt plan-feature`

### 02. Estimator Agent
**Purpose**: Provide realistic time and complexity estimates for planned work  
**Expert Persona**: Experienced technical lead with strong estimation skills  
**When to Use**: After planning, for sprint planning and resource allocation  
**Traditional**: `@workspace ai-dev/prompts/02-estimator-agent.md`  
**Copilot Native**: `@prompt estimate-work`

### 03. Coder Agent
**Purpose**: Implement clean, efficient code following specifications and plans  
**Expert Persona**: Senior developer with deep expertise in the project's technology stack  
**When to Use**: During implementation phase, following detailed plans  
**Traditional**: `@workspace ai-dev/prompts/03-coder-agent.md`  
**Copilot Native**: `@prompt implement-code`

### 04. Tester Agent
**Purpose**: Create comprehensive test suites including unit, integration, and evaluation tests  
**Expert Persona**: Quality assurance expert with testing framework expertise  
**When to Use**: Immediately after code implementation, before refactoring  
**Traditional**: `@workspace ai-dev/prompts/04-tester-agent.md`  
**Copilot Native**: `@prompt write-tests`

### 05. Refactor Agent
**Purpose**: Improve code quality, maintainability, and performance  
**Expert Persona**: Martin Fowler (refactoring methodology expert)  
**When to Use**: After initial implementation and testing, during code review  
**Traditional**: `@workspace ai-dev/prompts/05-refactor-agent.md`  
**Copilot Native**: `@prompt refactor-code`

# 06. Documenter Agent
**Purpose**: Create audience-specific documentation and maintain living documentation synchronized with code  
**Expert Persona**: Richard Feynman (clear explanation) with audience-tailored communication  
**When to Use**: After implementation is complete and stable, or when documentation validation is needed  
**Traditional**: `@workspace ai-dev/prompts/06-documenter-agent.md`  
**Copilot Native**: `@prompt document-code`

**Key Features:**
- Audience-aware documentation (New Developer, SRE, Product Manager, etc.)
- Living documentation validation and synchronization
- Tailored complexity and examples for specified audiences

### 07. Security Reviewer Agent
**Purpose**: Identify security vulnerabilities and recommend fixes  
**Expert Persona**: Security expert with knowledge of common attack vectors  
**When to Use**: Before feature completion, as part of quality assurance  
**Traditional**: `@workspace ai-dev/prompts/07-security-reviewer-agent.md`  
**Copilot Native**: `@prompt security-review`

### 08. Archiver Agent
**Purpose**: Record completed work in the project ledger (AIDEV.md)  
**Expert Persona**: Project historian with documentation expertise  
**When to Use**: After feature completion, to maintain project memory  
**Traditional**: `@workspace ai-dev/prompts/08-archiver-agent.md`  
**Copilot Native**: `@prompt archive-work`

## Specialized Support Agents (Agents 09-12)

### 09. Compactor Agent
**Purpose**: Distill and summarize large amounts of context for efficient AI processing  
**Expert Persona**: Information architect with context engineering expertise  
**When to Use**: When context becomes too large for effective AI processing  
**Traditional**: `@workspace ai-dev/prompts/09-compactor-agent.md`  
**Copilot Native**: `@prompt compact-context`

### 10. Incident Triage Agent
**Purpose**: Analyze production errors systematically and identify root causes  
**Expert Persona**: Site reliability engineer with debugging expertise  
**When to Use**: When production issues occur that need systematic analysis  
**Traditional**: `@workspace ai-dev/prompts/10-incident-triage-agent.md`  
**Copilot Native**: `@prompt incident-triage`

### 11. Incident Fix Agent
**Purpose**: Develop balanced solutions for triaged incidents  
**Expert Persona**: Senior engineer with incident response experience  
**When to Use**: After incident triage, to implement appropriate fixes  
**Traditional**: `@workspace ai-dev/prompts/11-incident-fix-agent.md`  
**Copilot Native**: `@prompt incident-fix`

### 12. Legacy Code Analyzer Agent
**Purpose**: Reverse-engineer and document existing undocumented legacy code  
**Expert Persona**: Software archaeologist combining Robert C. Martin and Eric Evans approaches  
**When to Use**: When encountering undocumented legacy systems that need understanding  
**Traditional**: `@workspace ai-dev/prompts/12-legacy-analyzer-agent.md`  
**Copilot Native**: `@prompt analyze-legacy-code`

**Key Features:**
- Systematic code archaeology and pattern recognition
- Business domain extraction from implementation
- Technical debt assessment and modernization roadmap
- Foundation preparation for AI Dev Playbook workflows

## Key Principles

- **Developer as Director**: You control the workflow; agents provide specialized assistance
- **Spec-Driven Development**: Always create specifications before implementation
- **Minimal Code Generation**: Generate only what's necessary to implement the feature
- **Expert Personas**: Each agent adopts specific expert knowledge for focused assistance
- **Context Engineering**: Use the Compactor Agent to manage large context efficiently
- **External Tool Integration**: Agents work with specifications from Kiro, Spec Kit, and other tools

## Project Structure

- **Agent Templates**: Full methodology in `ai-dev/prompts/`
- **Memory Directory**: Transient workspace in `.ai-dev/memory/`
- **Project Ledger**: Permanent record in `AIDEV.md`
- **Variables**: Project context in `.ai-dev/config/variables.json`
- **GitHub Integration**: Repository instructions and prompt files in `.github/`

## Workflow Approaches

**Traditional Workflow**: Use `@workspace` commands for complex, multi-step features requiring careful context management and artifact passing between agents.

**Copilot Native Workflow**: Use `@prompt` commands for quick, focused tasks that benefit from conversational AI interaction.

Both approaches follow the same methodology and expert personas, providing flexibility for different development scenarios.
