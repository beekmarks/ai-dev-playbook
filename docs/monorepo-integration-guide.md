# Monorepo Integration Guide

This guide helps you choose the right AI Dev Playbook integration pattern for monorepo projects and understand the architectural decisions behind each approach.

## Quick Decision Tree

```
What type of repository are you working with?

├── Single Project Repository
│   └── ✅ Use Repository-Focused (Standard AI Dev Playbook)
│
└── Monorepo
    ├── Multiple Independent Applications
    │   └── ✅ Use Application-Focused (Recommended)
    │       Examples: Microservices, separate frontends, independent APIs
    │
    ├── Shared Codebase with Single Deployable
    │   └── ✅ Use Repository-Focused
    │       Examples: Shared component library, single app with packages
    │
    └── Complex/Mixed Structure
        └── ⚠️  Read detailed guidance below
```

## Quick Integration (Integration Assistant)

Use the Integration Assistant to automatically analyze the monorepo and apply the correct integration pattern.

### Commands
From monorepo root with adjacent clone (recommended when bringing AI Dev Playbook to an existing mono):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, analyze this monorepo and implement the appropriate AI Dev Playbook integration pattern with a rationale for the choice.
```
If the playbook template content is already inside the repo root:
```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, analyze this monorepo and confirm or adjust the current integration pattern, then complete any missing assets.
```
Single application inside a larger mono (apply only to that app directory):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../../ai-dev-playbook/integration-assistant.prompt.md, analyze this application directory only and implement an application-scoped AI Dev Playbook instance.
```

### What It Automates
- Monorepo structure detection (apps/, packages/, libs/, services/ patterns)
- Pattern selection (repository-focused vs application-focused) with justification
- Scaffolding of .ai-dev/, .github/prompts/, and AIDEV.md at correct scope(s)
- Variable file creation per scope (shared vs per-app recommendations)
- Operational doc linkage (quick start per app if needed)
- Validation checklist (prompt coverage, ledger placement, duplication avoidance)

### Manual Fallback (If Assistant Not Available)
1. Decide pattern using decision tree
2. Copy framework assets (.ai-dev/, .github/, AIDEV.md) to appropriate scope(s)
3. Create per-app variables.json where behavior differs
4. Remove accidental duplicate prompt sets to avoid confusion
5. Add an app-level README section explaining usage

## Integration Patterns

### Repository-Focused Pattern

**Best for**: Single projects, shared codebases, unified deployments

**Structure**:
```
your-repo/
├── .ai-dev/
│   ├── prompts/ (10 agent files)
│   ├── memory/ (workspace)
│   └── config/variables.json
├── .github/
│   ├── copilot-instructions.md
│   └── prompts/ (10 GitHub Copilot files)
├── AIDEV.md (development history)
└── [your project files]
```

**When to use**:
- ✅ Single application or service
- ✅ Monorepo with shared codebase (component libraries, design systems)
- ✅ Multiple packages that deploy as one unit
- ✅ Team works on the codebase as a unified whole

**Workflow**: Developers work from repository root using AI Dev Playbook prompts

### Application-Focused Pattern

**Best for**: Independent applications, microservices, separate teams

**Structure**:
```
your-monorepo/
├── .github/
│   └── copilot-instructions.md (governance only)
├── docs/
│   ├── ai-dev-playbook-quick-start.md (how to use in this repo)
│   └── ai-dev-playbook-example.md (workflow demonstration)
├── apps/
│   ├── service-a/
│   │   ├── .ai-dev/ (complete instance)
│   │   ├── .github/prompts/ (9 files)
│   │   ├── AIDEV.md
│   │   └── src/
│   └── service-b/
│       ├── .ai-dev/ (complete instance)
│       ├── .github/prompts/ (9 files)
│       ├── AIDEV.md
│       └── src/
└── libs/ (shared libraries)
```

**When to use**:
- ✅ Microservices architecture
- ✅ Independent applications with separate teams
- ✅ Different deployment schedules per application
- ✅ Applications with different technology stacks
- ✅ Clear application boundaries and ownership

**Workflow**: Developers work within specific application directories

### Managing Multiple Specification Sets

For complex applications, you may have multiple sets of specification documents (e.g., for different features or epics). The recommended best practice is to create a permanent, version-controlled specs directory within each application to house these sets.

**Example Structure:**

```
your-monorepo/
└── apps/
    └── my-app/
        ├── .ai-dev/
        │   └── memory/   // AI's temporary workspace
        ├── specs/          // Permanent spec storage
        │   ├── feature-auth/
        │   │   ├── design.md
        │   │   ├── requirements.md
        │   │   └── tasks.md
        │   └── feature-billing/
        │       ├── design.md
        │       ├── requirements.md
        │       └── tasks.md
        ├── src/
        └── AIDEV.md
```

Before beginning work on a feature, copy the relevant files from the specs directory into the `.ai-dev/memory/` directory. This provides the AI with a clean, focused context for the task at hand.

## Technology-Specific Considerations

### Nx Monorepos
- **Recommended**: Application-focused if apps are independent services
- **Alternative**: Repository-focused if it's a single application with libraries
- **Consider**: Team structure and deployment patterns

### Lerna Monorepos
- **Recommended**: Application-focused for independent packages
- **Alternative**: Repository-focused for shared component libraries
- **Consider**: Whether packages are published independently

### Custom Monorepos
- **Analysis needed**: Examine team structure, deployment patterns, and code organization
- **Default**: Application-focused for better separation of concerns
- **Exception**: Repository-focused if teams work across multiple applications

## Detailed Decision Criteria

### Choose Application-Focused When:

#### Team Structure
- Different teams own different applications
- Teams work independently on their applications
- Separate development and deployment cycles

#### Technical Architecture
- Microservices or service-oriented architecture
- Independent databases per application
- Separate deployment pipelines
- Different technology stacks per application

#### Development Patterns
- Feature development happens within single applications
- Limited cross-application development
- Independent testing and quality gates

### Choose Repository-Focused When:

#### Team Structure
- Single team works across multiple packages
- Shared development and deployment cycles
- Coordinated releases

#### Technical Architecture
- Shared database or state
- Single deployment unit
- Shared component libraries or design systems
- Unified technology stack

#### Development Patterns
- Features often span multiple packages
- Frequent cross-package development
- Shared testing and quality standards

## Real-World Examples

### Application-Focused Examples

**E-commerce Platform**:
```
├── apps/
│   ├── user-service/ (User management microservice)
│   ├── order-service/ (Order processing microservice)
│   ├── payment-service/ (Payment handling microservice)
│   └── web-frontend/ (Customer-facing website)
```

**SaaS Platform**:
```
├── apps/
│   ├── api-gateway/ (Main API)
│   ├── auth-service/ (Authentication)
│   ├── admin-dashboard/ (Internal tools)
│   └── customer-portal/ (Customer interface)
```

### Repository-Focused Examples

**Design System**:
```
├── packages/
│   ├── components/ (React components)
│   ├── tokens/ (Design tokens)
│   ├── icons/ (Icon library)
│   └── docs/ (Documentation site)
```

**Single Application with Packages**:
```
├── packages/
│   ├── frontend/ (React app)
│   ├── backend/ (Node.js API)
│   └── shared/ (Shared utilities)
```

## Migration Between Patterns

### From Repository-Focused to Application-Focused
1. Identify natural application boundaries
2. Create application-level AI Dev Playbook instances
3. Customize prompts for each application's context
4. Remove repository-level prompts to avoid confusion
5. Create minimal operational documentation

### From Application-Focused to Repository-Focused
1. Consolidate common patterns across applications
2. Create unified repository-level AI Dev Playbook
3. Remove application-level instances
4. Update team workflows to work from repository root

## Common Anti-Patterns to Avoid

### ❌ Mixed Approaches
- Don't have both repository-level AND application-level AI Dev Playbook prompts
- This creates confusion about where to work

### ❌ Incomplete Coverage
- Every development location should have complete workflow coverage (9 prompts)
- Don't create partial implementations

### ❌ Generic Documentation
- Don't copy generic AI Dev Playbook docs into your repository
- Reference the original repository instead

### ❌ Setup Documentation Overhead
- Don't create implementation checklists or setup guides
- Focus on operational documentation only

## Getting Help

### Use the Integration Assistant
The fastest way to get the right setup:
```
@workspace Using the AI Dev Playbook Integration Assistant, please analyze this repository and implement the appropriate AI Dev Playbook integration pattern.
```

### Decision Support
If you're unsure which pattern to use:
1. **Start with Application-Focused** for monorepos (it's usually correct)
2. **Consider team structure** (how do teams actually work?)
3. **Look at deployment patterns** (independent vs. coordinated releases)
4. **Evaluate complexity** (is separation worth the overhead?)

### Architecture Validation
After implementation, verify:
- ✅ Clear development workflow (developers know where to work)
- ✅ Complete prompt coverage (9 prompts per development location)
- ✅ No confusing dual-level approaches
- ✅ Documentation focuses on ongoing use, not setup

The right pattern should feel natural and eliminate confusion about where and how to work with AI Dev Playbook in your repository.
