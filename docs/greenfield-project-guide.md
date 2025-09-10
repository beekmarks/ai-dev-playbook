# Greenfield Project Quick Start Guide

This guide provides comprehensive instructions for starting a new project from scratch using the AI Dev Playbook methodology. Whether you're building a web application, API service, CLI tool, or any other software project, this guide will help you establish a solid foundation for AI-assisted development.

## Overview

Greenfield projects offer a unique advantage: you can establish the AI Dev Playbook workflow from day one, creating a development culture that emphasizes quality, documentation, and structured AI assistance from the very beginning.

## Quick Integration (Integration Assistant)

If you simply want the correct structure generated for you, use the Integration Assistant. It analyzes your repository, selects or confirms the correct integration pattern, populates prompts with context, and validates the setup.

### When to Use
- Brand‑new empty repo
- Migrating an existing empty scaffold (README + license) to AI Dev Playbook
- Rapid evaluation / spike environment

### Prerequisites
- GitHub Copilot enabled in VS Code
- This repository (ai-dev-playbook) either: (a) cloned as your project OR (b) cloned adjacent to your project directory

### Commands

Same repository (you already copied or started from this template):
```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```
Adjacent clone (recommended for integrating into an existing empty repo):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```
Monorepo (have multiple apps/packages; let the assistant choose pattern):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, analyze this monorepo and implement the appropriate AI Dev Playbook integration pattern with a short rationale.
```

### What It Automates
- Repository analysis (structure, languages, potential monorepo layout)
- Selection / recommendation of integration pattern (repository-focused vs application-focused)
- Creation of .ai-dev/, .github/ prompts, and AIDEV.md if missing
- Customization using variables (reads or scaffolds .ai-dev/config/variables.json)
- Generation / update of operational docs explaining daily workflow
- Validation checklist (prompts accessible, variables resolved, ledger initialized)

### Manual Fallback (If Assistant Not Available)
1. Copy .ai-dev/, .github/, and AIDEV.md into repo root
2. Rename example.variables.json to variables.json and fill values
3. Commit; open VS Code; proceed with Phase 1 below

Proceed with the detailed phased bootstrap if you need deeper control or want to understand each step.

## Phase 1: Project Bootstrap

### Step 1: Create Your Project Repository

**Option A: Use as Template (Recommended)**
```bash
# Clone the AI Dev Playbook as your project foundation
git clone https://github.com/your-org/ai-dev-playbook.git my-new-project
cd my-new-project

# Reset git history for your new project
rm -rf .git
git init
git add .
git commit -m "Initial project setup with AI Dev Playbook"
```

**Option B: Add to Existing Empty Repository**
```bash
# If you already have an empty repository
git clone https://github.com/your-org/ai-dev-playbook.git temp-playbook
cp -r temp-playbook/* your-existing-repo/
cp -r temp-playbook/.* your-existing-repo/ 2>/dev/null || true
rm -rf temp-playbook
cd your-existing-repo
```

### Step 2: Customize for Your Project

**Update Project Context:**
1. **Edit `.ai-dev/config/variables.json`** with your project details:
```json
{
  "PROJECT_NAME": "Your Project Name",
  "ARCHITECTURE_STYLE": "Your Architecture Pattern",
  "PRIMARY_LANGUAGE": "Your Primary Language",
  "FRAMEWORKS": "Your Key Frameworks",
  "CLOUD_PROVIDER": "Your Cloud Platform (if applicable)",
  "TESTING_FRAMEWORK": "Your Testing Framework"
}
```

2. **Update `.github/copilot-instructions.md`** with your:
   - Coding standards and conventions
   - Architecture principles
   - Technology stack context
   - Team-specific guidelines

3. **Initialize `AIDEV.md`** with your project's first entry:
```markdown
# AI Development Log (AIDEV.md)

This file tracks the development history of [Your Project Name] using the AI Dev Playbook methodology.

## Project Initialization - [Current Date]

### Description
Initial project setup and AI Dev Playbook integration for [Your Project Name]. This project will follow Spec Driven Development principles for all feature development.

### Objectives
- Establish AI-assisted development workflow
- Create foundation for [describe your project's purpose]
- Implement quality-first development culture

### Project Structure
- **Technology Stack**: [Your chosen technologies]
- **Architecture**: [Your architecture approach] 
- **Development Methodology**: AI Dev Playbook with Spec Driven Development
```

### Step 3: Create Your Project Structure

**Organize your source code** (customize based on your project type):
```
your-project/
├── .ai-dev/                    # AI Dev Playbook workflow
├── .github/                    # GitHub Copilot integration
├── docs/                       # Project documentation
├── src/                        # Your application source code
│   ├── main/                   # Main application code
│   ├── test/                   # Test files
│   └── ...                     # Additional directories as needed
├── AIDEV.md                    # Development history
├── README.md                   # Project overview
└── [build/config files]        # Project-specific build and config files
```

## Phase 2: Development Environment Setup

### Step 1: Configure Your Development Tools

**VS Code Configuration:**
1. Install GitHub Copilot extension
2. Configure workspace settings for your project
3. Set up any language-specific extensions

**Project Dependencies:**
1. Initialize your project's build system (package.json, requirements.txt, etc.)
2. Set up testing framework
3. Configure linting and formatting tools
4. Add any necessary development dependencies

### Step 2: Validate AI Dev Playbook Integration

**Test the workflow** by running a simple validation:
```bash
# Traditional workflow test
Using @workspace ai-dev/prompts/00-specification-agent.md, create a technical specification for a simple "Hello World" feature that demonstrates your project's basic functionality. Save to @workspace .ai-dev/memory/hello-world-spec.md.

# GitHub Copilot workflow test (from project root)
@prompt create-spec
```

## Phase 3: Your First Feature Implementation

Now let's implement your first feature using the complete AI Dev Playbook workflow to establish the development pattern.

### Step 1: Choose Your First Feature

Select a simple but representative feature that demonstrates your project's core functionality:
- **Web App**: User authentication or basic page rendering
- **API Service**: Health check endpoint or basic CRUD operation  
- **CLI Tool**: Help command or basic input processing
- **Library**: Core utility function or main API method

### Step 2: Follow the Complete Workflow

**Spec Driven Development Process:**

**1. Create Technical Specification**
```bash
Using @workspace ai-dev/prompts/00-specification-agent.md, create a comprehensive technical specification for [your chosen feature]. Include interfaces, data structures, error handling, and integration points. Save to @workspace .ai-dev/memory/[feature-name]-spec.md.
```

**2. Plan Implementation**
```bash
Using @workspace ai-dev/prompts/01-planner-agent.md, create a detailed implementation plan based on the specification in @workspace .ai-dev/memory/[feature-name]-spec.md. Break down into implementable steps with clear acceptance criteria. Save to @workspace .ai-dev/memory/[feature-name]-plan.md.
```

**3. Implement the Feature**
```bash
Using @workspace ai-dev/prompts/03-coder-agent.md, implement Step 1 from the plan in @workspace .ai-dev/memory/[feature-name]-plan.md. Focus on clean, maintainable code that follows the specification.
```

**4. Write Comprehensive Tests**
```bash
Using @workspace ai-dev/prompts/04-tester-agent.md, write comprehensive unit tests for the implemented feature. Include happy path, error cases, and edge conditions as defined in the specification.
```

**5. Security Review**
```bash
Using @workspace ai-dev/prompts/07-security-reviewer-agent.md, review the implementation for security concerns. Ensure proper input validation, error handling, and no sensitive data exposure.
```

**6. Create Documentation**
```bash
Using @workspace ai-dev/prompts/06-documenter-agent.md, create user and developer documentation for the implemented feature. Include usage examples and API documentation.
```

**7. Archive the Work**
```bash
Using @workspace ai-dev/prompts/08-archiver-agent.md, create a comprehensive entry in @workspace AIDEV.md titled 'Feature: [Your Feature Name]'. Include the specification, plan, implementation summary, and lessons learned.
```

### Step 3: Establish Development Patterns

After implementing your first feature:

**1. Review and Refine**
- Analyze what worked well in your workflow
- Identify any project-specific patterns or standards
- Update your AI Dev Playbook prompts with project-specific context

**2. Document Your Standards**
- Update `.github/copilot-instructions.md` with patterns you want to follow
- Add any coding conventions or architectural decisions to your prompts
- Create project-specific examples in your documentation

**3. Clean Up**
- Archive specification and plan files from `.ai-dev/memory/` (note the dot prefix - this is a hidden directory that won't be committed)
- Ensure all work is properly documented in `AIDEV.md`
- Commit your first feature implementation

## Phase 4: Team Onboarding and Workflow Establishment

### Development Guidelines

**For Every New Feature:**
1. **Always start with specifications** for non-trivial features
2. **Use the memory directory** for temporary work files
3. **Clean up after archiving** to keep the workspace organized
4. **Update AIDEV.md** to maintain development history
5. **Follow the complete workflow** to ensure quality and consistency

### Quality Checkpoints

**Human-in-the-Loop Reviews Required:**
- Security-sensitive features
- Architecture-changing modifications  
- External integration points
- Performance-critical components
- Data handling and privacy concerns

### Workflow Options

**Choose based on feature complexity:**
- **Quick Features**: Use GitHub Copilot native workflow (`@prompt` commands)
- **Complex Features**: Use traditional workflow with agent templates
- **Mixed Approach**: Start with specifications, then use quick workflow for implementation

## Phase 5: First Feature Walkthrough Example

Let's walk through a complete example of implementing a "Configuration Validation" feature to demonstrate the full AI Dev Playbook workflow.

### Example: Configuration Validation Feature

**Feature Goal:** Create a system that validates project configuration files and provides helpful error messages.

### Step-by-Step Implementation

**1. Create Technical Specification**
```bash
Using @workspace ai-dev/prompts/00-specification-agent.md, create a comprehensive technical specification for a configuration validation system. The system should:
- Read configuration files (JSON/YAML)
- Validate required fields and data types
- Provide clear error messages with suggestions
- Support custom validation rules
- Include logging and error reporting
Save to @workspace .ai-dev/memory/config-validation-spec.md.
```

**Expected Output:** A detailed specification document that includes:
- Interface definitions
- Validation rule structure
- Error handling strategy
- Configuration file schema
- API design for validation functions

**2. Create Implementation Plan**
```bash
Using @workspace ai-dev/prompts/01-planner-agent.md, create a detailed implementation plan based on the specification in @workspace .ai-dev/memory/config-validation-spec.md. Break down the work into these phases:
1. Core validation engine
2. Configuration parser
3. Error reporting system
4. Custom rule framework
5. Integration points
Save to @workspace .ai-dev/memory/config-validation-plan.md.
```

**Expected Output:** A structured plan with:
- Implementation steps in logical order
- Dependencies between components
- Testing strategy for each phase
- Time estimates and complexity assessments

**3. Implement Core Functionality**
```bash
Using @workspace ai-dev/prompts/03-coder-agent.md, implement Step 1 from the plan in @workspace .ai-dev/memory/config-validation-plan.md. Focus on the core validation engine with:
- Clean, maintainable code structure
- Proper error handling
- Type safety (if applicable to your language)
- Modular design for extensibility
```

**Expected Output:** 
- Core validation classes/functions
- Basic validation rules implementation
- Error handling framework
- Clean, documented code

**4. Write Comprehensive Tests**
```bash
Using @workspace ai-dev/prompts/04-tester-agent.md, write comprehensive unit tests for the validation engine. Include:
- Valid configuration scenarios
- Invalid configuration scenarios  
- Edge cases (empty files, malformed data)
- Error message validation
- Performance testing for large configs
```

**Expected Output:**
- Complete test suite with good coverage
- Test data fixtures
- Performance benchmarks
- Clear test documentation

**5. Security Review**
```bash
Using @workspace ai-dev/prompts/07-security-reviewer-agent.md, review the configuration validation implementation for security concerns:
- Input sanitization
- File access permissions
- Injection attack prevention
- Resource consumption limits
- Error message information disclosure
```

**Expected Output:**
- Security assessment report
- Identified vulnerabilities (if any)
- Mitigation recommendations
- Secure coding improvements

**6. Create Documentation**
```bash
Using @workspace ai-dev/prompts/06-documenter-agent.md, create comprehensive documentation for the configuration validation system:
- User guide with examples
- API documentation
- Configuration schema reference
- Troubleshooting guide
- Integration examples
```

**Expected Output:**
- User-friendly documentation
- Code examples and samples
- Integration guide
- FAQ and troubleshooting

**7. Archive the Work**
```bash
Using @workspace ai-dev/prompts/08-archiver-agent.md, create a comprehensive entry in @workspace AIDEV.md titled 'Feature: Configuration Validation System'. Include:
- Original specification summary
- Implementation approach and decisions
- Testing strategy and results
- Security review findings
- Documentation created
- Lessons learned and future improvements
```

**Expected Output:** A complete development history entry that future developers can reference.

### Workflow Insights from This Example

**What This Demonstrates:**
- **Spec-First Approach**: Clear requirements before coding
- **Structured Planning**: Logical breakdown of complex features
- **Quality Focus**: Testing and security as first-class concerns
- **Documentation Culture**: User and developer documentation
- **Knowledge Preservation**: Complete development history

**Patterns to Establish:**
- Always start with specifications for features beyond simple bug fixes
- Break complex features into implementable steps
- Include security and performance considerations from the start
- Create both user and developer documentation
- Archive knowledge for future team members

**Team Benefits:**
- **Consistency**: Every feature follows the same quality process
- **Knowledge Sharing**: Complete development context is preserved
- **Quality Assurance**: Multiple review stages catch issues early
- **Onboarding**: New team members can learn from existing examples
- **Maintenance**: Future changes have full context available

This example shows how the AI Dev Playbook methodology ensures that even your first feature establishes a high-quality development culture that will benefit your project throughout its lifecycle.

## Phase 6: Project Growth and Maintenance

### Scaling Your Workflow

**As your project grows:**
1. **Customize prompts** based on emerging patterns and requirements
2. **Update variables.json** with new project context and standards
3. **Expand documentation** with project-specific guidance
4. **Review AIDEV.md regularly** to identify improvement opportunities

### Continuous Improvement

**Regular maintenance:**
- Review and update AI Dev Playbook prompts quarterly
- Analyze AIDEV.md entries for workflow optimization opportunities
- Update GitHub Copilot instructions based on team feedback
- Refine Human-in-the-Loop checkpoints based on experience

## Quick Reference

### Essential Commands

**Traditional Workflow:**
```bash
# 1. Specification
Using @workspace ai-dev/prompts/00-specification-agent.md, create a technical specification for [feature]. Save to @workspace .ai-dev/memory/[name]-spec.md.

# 2. Planning  
Using @workspace ai-dev/prompts/01-planner-agent.md, create an implementation plan based on @workspace .ai-dev/memory/[name]-spec.md. Save to @workspace .ai-dev/memory/[name]-plan.md.

# 3. Implementation
Using @workspace ai-dev/prompts/03-coder-agent.md, implement Step 1 from @workspace .ai-dev/memory/[name]-plan.md.

# 4. Testing
Using @workspace ai-dev/prompts/04-tester-agent.md, write comprehensive tests for the implemented feature.

# 5. Security Review
Using @workspace ai-dev/prompts/07-security-reviewer-agent.md, review the implementation for security concerns.

# 6. Documentation  
Using @workspace ai-dev/prompts/06-documenter-agent.md, create documentation for the feature.

# 7. Archive
Using @workspace ai-dev/prompts/08-archiver-agent.md, create an entry in @workspace AIDEV.md titled 'Feature: [Name]'.

# Incident Management (When Issues Arise)
Using @workspace ai-dev/prompts/10-incident-triage-agent.md, analyze production errors.
Using @workspace ai-dev/prompts/11-incident-fix-agent.md, plan incident response.
```

**GitHub Copilot Workflow:**
```bash
@prompt create-spec
@prompt plan-feature  
@prompt write-code
@prompt write-tests
@prompt review-security
@prompt document-feature
@prompt archive-work

# Incident Management
@prompt incident-triage
@prompt incident-fix
```

### Key Files to Customize

- **`.ai-dev/config/variables.json`**: Project-specific variables
- **`.github/copilot-instructions.md`**: Coding standards and context
- **`AIDEV.md`**: Development history and decisions
- **Agent prompts in `ai-dev/prompts/`**: Project-specific guidance

## Success Indicators

Your greenfield project is successfully using AI Dev Playbook when:

✅ **Team members naturally follow the specification-first approach**
✅ **AIDEV.md contains comprehensive development history**
✅ **Code quality is consistently high with proper testing**
✅ **New team members can onboard using existing documentation**
✅ **AI assistance is integrated seamlessly into daily development**
✅ **Technical debt is minimized through structured development**

## Next Steps

1. **Implement your first feature** following the complete workflow
2. **Establish team conventions** based on your technology stack
3. **Create project-specific examples** for common development patterns
4. **Set up CI/CD integration** that respects the AI Dev Playbook structure
5. **Plan regular workflow reviews** to continuously improve your process

Remember: The AI Dev Playbook is a methodology, not a prescription. Adapt it to fit your project's specific needs while maintaining the core principles of structured, documented, AI-assisted development.
