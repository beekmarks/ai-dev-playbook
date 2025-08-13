# Starting a Project from Design Documents

This guide explains how to bootstrap a new AI Dev Playbook project when you already have design documents (design.md, requirements.md, tasks.md) but no source code yet.

## Overview

Starting with design documents is an excellent approach that aligns perfectly with the AI Dev Playbook's Spec Driven Development methodology. You already have specifications - now we'll establish the AI Dev Playbook structure and use your existing documents to jump-start development.

## Quick Integration (Integration Assistant)

Use the Integration Assistant for the fastest, error‑free setup. It analyzes your repository, incorporates your existing design docs context, selects or confirms the correct integration pattern, scaffolds missing assets, and validates workflow readiness.

### Commands
Same repository (you started from this template):
```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```
Adjacent clone (you created a fresh directory with only documents):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```
Monorepo root (let assistant decide pattern):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, analyze this repository as a potential monorepo and implement the appropriate AI Dev Playbook integration pattern with a brief rationale.
```

### What It Automates
- Repository + document analysis (detects design/requirements/task files)
- Pattern selection (single project vs application-focused)
- Creation of .ai-dev/, .github/, AIDEV.md if absent
- Variable file scaffolding / merging
- Contextual linking of your existing docs into memory for first specification step
- Validation checklist output

### Manual Fallback
If the assistant is unavailable:
1. Clone ai-dev-playbook adjacent to your project
2. Copy .ai-dev/, .github/, and AIDEV.md into your repo root
3. Rename example.variables.json to variables.json and populate
4. Continue with Step 2 below

## Quick Start Process

### Step 1: Create Your Project with AI Dev Playbook

**Option A: Use as Template (Recommended)**
```bash
# Clone the AI Dev Playbook as your project foundation
git clone https://github.com/your-org/ai-dev-playbook.git your-project-name
cd your-project-name

# Reset git history for your new project
rm -rf .git
git init
git add .
git commit -m "Initial project setup with AI Dev Playbook"
```

**Option B: Use Integration Assistant**
```bash
# Create empty project directory
mkdir your-project-name
cd your-project-name

# Copy your design documents
cp /path/to/your/design.md .
cp /path/to/your/requirements.md .
cp /path/to/your/tasks.md .

# Initialize git
git init
git add .
git commit -m "Initial project with design documents"

# Download AI Dev Playbook adjacent to your project
cd ..
git clone https://github.com/your-org/ai-dev-playbook.git

# Return to your project and integrate
cd your-project-name
code .
```

Then in VS Code, run the appropriate Integration Assistant command above.

### Step 2: Import Your Design Documents

**Move your documents to the AI Dev Playbook structure:**
```bash
# Move documents to the memory directory for processing
mv design.md .ai-dev/memory/
mv requirements.md .ai-dev/memory/
mv tasks.md .ai-dev/memory/

# Keep copies in your docs directory for reference
cp .ai-dev/memory/design.md docs/
cp .ai-dev/memory/requirements.md docs/
cp .ai-dev/memory/tasks.md docs/
```

### Step 3: Initialize Your AIDEV.md

Create an initial entry that references your existing documents:

```markdown
# AI Development Log (AIDEV.md)

This file tracks the development history of [Your Project Name] using the AI Dev Playbook methodology.

## Project Initialization from Design Documents - [Current Date]

### Description
Project bootstrapped from existing design documents (design.md, requirements.md, tasks.md) using the AI Dev Playbook methodology. This project will follow Spec Driven Development principles for all implementation work.

### Initial Documents
- **Requirements**: Comprehensive requirements in .ai-dev/memory/requirements.md
- **Design**: System design and architecture in .ai-dev/memory/design.md  
- **Tasks**: Initial task breakdown in .ai-dev/memory/tasks.md

### Next Steps
1. Review and consolidate design documents into formal specifications
2. Create detailed implementation plan based on existing tasks
3. Set up project structure and development environment
4. Begin iterative implementation using AI Dev Playbook workflow

### Project Context
- **Technology Stack**: [To be determined based on design requirements]
- **Architecture**: [Based on design.md specifications]
- **Development Methodology**: AI Dev Playbook with Spec Driven Development
```

## Implementation Workflow

### Step 1: Document Analysis and Consolidation

**1. Analyze Your Existing Documents**
```bash
Using @workspace .ai-dev/prompts/00-specification-agent.md, analyze the design documents in @workspace .ai-dev/memory/ (design.md, requirements.md, tasks.md) and create a consolidated technical specification that includes:
- System requirements and constraints
- Architecture and design decisions
- API specifications and data models
- Technology stack recommendations
- Integration requirements
Save to @workspace .ai-dev/memory/consolidated-spec.md.
```

**2. Create Initial Implementation Plan**
```bash
Using @workspace .ai-dev/prompts/01-planner-agent.md, create a comprehensive implementation plan based on the consolidated specification in @workspace .ai-dev/memory/consolidated-spec.md and the task breakdown in @workspace .ai-dev/memory/tasks.md. Organize work into phases:
1. Project setup and infrastructure
2. Core functionality implementation
3. Integration and testing
4. Documentation and deployment
Save to @workspace .ai-dev/memory/implementation-plan.md.
```

**3. Estimate Work and Complexity**
```bash
Using @workspace .ai-dev/prompts/02-estimator-agent.md, provide detailed time and complexity estimates for the implementation plan in @workspace .ai-dev/memory/implementation-plan.md. Consider:
- Technology stack setup time
- Development complexity by feature
- Testing and integration effort
- Documentation requirements
Save to @workspace .ai-dev/memory/project-estimates.md.
```

### Step 2: Project Setup

**1. Determine Technology Stack**
```bash
Using @workspace .ai-dev/prompts/03-coder-agent.md, based on the consolidated specification in @workspace .ai-dev/memory/consolidated-spec.md, recommend and set up the initial project structure including:
- Technology stack selection
- Project directory structure
- Build and dependency management setup
- Basic configuration files
- Development environment setup
```

**2. Create Project Foundation**
```bash
Using @workspace .ai-dev/prompts/03-coder-agent.md, implement Step 1 (Project setup and infrastructure) from @workspace .ai-dev/memory/implementation-plan.md. Focus on:
- Basic project structure
- Build system configuration
- Essential dependencies
- Development tooling setup
```

### Step 3: Iterative Development

Now follow the standard AI Dev Playbook workflow for each feature/phase:

**For Each Development Phase:**

1. **Create Detailed Specifications** (if needed)
```bash
Using @workspace .ai-dev/prompts/00-specification-agent.md, create detailed specifications for [specific feature] based on the requirements in @workspace .ai-dev/memory/consolidated-spec.md. Save to @workspace .ai-dev/memory/[feature-name]-spec.md.
```

2. **Plan Implementation**
```bash
Using @workspace .ai-dev/prompts/01-planner-agent.md, create implementation steps for [specific feature] based on @workspace .ai-dev/memory/[feature-name]-spec.md. Save to @workspace .ai-dev/memory/[feature-name]-plan.md.
```

3. **Implement Features**
```bash
Using @workspace .ai-dev/prompts/03-coder-agent.md, implement Step [X] from @workspace .ai-dev/memory/[feature-name]-plan.md.
```

4. **Write Tests**
```bash
Using @workspace .ai-dev/prompts/04-tester-agent.md, write comprehensive tests for the [feature] implementation.
```

5. **Security Review**
```bash
Using @workspace .ai-dev/prompts/07-security-reviewer-agent.md, review the [feature] implementation for security concerns.
```

6. **Archive Progress**
```bash
Using @workspace .ai-dev/prompts/08-archiver-agent.md, create an entry in @workspace AIDEV.md titled 'Feature: [Feature Name]' documenting the implementation.
```

## Advantages of This Approach

### ✅ **Design-First Benefits**
- **Clear Vision**: Start with well-thought-out requirements and design
- **Reduced Rework**: Comprehensive planning before implementation
- **Stakeholder Alignment**: Design documents ensure everyone agrees on the approach
- **Risk Mitigation**: Issues identified in design phase rather than during coding

### ✅ **AI Dev Playbook Integration**
- **Structured Implementation**: Systematic approach to turning design into code
- **Quality Assurance**: Multiple review stages ensure high-quality implementation
- **Documentation Culture**: Complete development history from conception to delivery
- **Knowledge Preservation**: Design decisions and rationale captured in AIDEV.md

### ✅ **Iterative Development**
- **Incremental Progress**: Build and validate features progressively
- **Early Feedback**: Get working software quickly for stakeholder review
- **Course Correction**: Adjust implementation based on early learnings
- **Risk Management**: Identify and address issues early in development

## Tips for Success

### **Document Organization**
- Keep original documents in `docs/` for reference
- Use `.ai-dev/memory/` for active development artifacts (note the dot prefix - this is a hidden directory separate from `ai-dev/prompts/`)
- Archive completed work in `AIDEV.md` for historical reference

### **Specification Evolution**
- Your original documents may need refinement during implementation
- Use the specification agent to create more detailed technical specs as needed
- Keep specifications updated as the implementation evolves

### **Technology Decisions**
- Let the AI Dev Playbook help you choose appropriate technologies based on your requirements
- Consider team expertise, scalability needs, and maintenance requirements
- Document technology decisions in AIDEV.md for future reference

### **Incremental Delivery**
- Start with the most critical features from your tasks.md
- Build a minimal viable version first
- Add features iteratively based on priority and feedback

## Example Project Structure

After setup, your project will look like:

```
your-project/
├── .ai-dev/
│   ├── prompts/              # AI Dev Playbook agents
│   ├── memory/               # Working documents
│   │   ├── consolidated-spec.md
│   │   ├── implementation-plan.md
│   │   ├── project-estimates.md
│   │   └── [feature]-spec.md files
│   └── config/
├── .github/                  # GitHub Copilot integration
├── docs/                     # Documentation
│   ├── design.md            # Your original design
│   ├── requirements.md      # Your original requirements
│   └── tasks.md             # Your original tasks
├── src/                      # Application source code
├── tests/                    # Test files
├── AIDEV.md                 # Development history
├── README.md                # Project overview
└── [build/config files]     # Project-specific files
```

This approach gives you the best of both worlds: the thoughtful planning captured in your design documents and the structured, quality-focused implementation methodology of the AI Dev Playbook.
