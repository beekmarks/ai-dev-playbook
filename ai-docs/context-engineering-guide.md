# Context Engineering Guide

## Introduction

Context engineering is the strategic practice of gathering, filtering, and presenting information to AI systems to maximize their effectiveness. This guide outlines advanced techniques for managing context throughout the AI Dev Playbook workflow.

## The Gather and Glean Strategy

### Phase 1: Gather
Systematically collect all potentially relevant information before engaging with AI agents:

**Core Information Sources:**
- Requirements documents and tickets
- Related code files and modules
- Architecture diagrams and design docs
- Previous similar implementations
- Error messages and logs
- API documentation
- Test files and examples

**Extended Context Sources:**

**Data Architecture & Analytics:**
- Data lineage diagrams and data catalogs
- ETL pipeline documentation and data flow maps
- Data model schemas, relationships, and validation rules
- Data quality metrics and monitoring dashboards
- ML model documentation and training data specifications

**Operations & Infrastructure:**
- Runtime logs and historical error patterns
- Configuration files and environment settings
- Monitoring dashboards and alerting rules
- Deployment scripts and infrastructure as code
- Performance metrics and capacity planning documentation
- Service mesh configuration and routing rules

**Security & Compliance:**
- Security guidelines and compliance requirements
- Data privacy rules and regulations (GDPR, CCPA, HIPAA, etc.)
- Authentication and authorization patterns
- Security audit reports and vulnerability assessments
- Penetration testing results and remediation plans

**API & Integration Context:**
- Existing API documentation (Postman collections, Swagger/OpenAPI specs)
- Third-party API contracts, rate limits, and SLA documentation
- Event schemas and message queue documentation
- Webhook configurations and callback specifications
- Service dependency maps and circuit breaker configurations

**Business & Domain Context:**
- User journey maps and workflow documentation
- Business process documentation and decision trees
- Regulatory and compliance requirements
- Performance SLAs and business success metrics
- User personas and accessibility requirements

**Storage Strategy:**
Store gathered information in `.ai-dev/memory/` using descriptive filenames:
- `{feature-name}-context.md` - All gathered information
- `{feature-name}-related-code.md` - Relevant existing code snippets
- `{feature-name}-requirements.md` - Extracted requirements and constraints
- `{feature-name}-data-context.md` - Data lineage, schemas, and quality rules
- `{feature-name}-security-context.md` - Security requirements and compliance rules
- `{feature-name}-ops-context.md` - Infrastructure, monitoring, and deployment context
- `{feature-name}-api-context.md` - API contracts, integration points, and service dependencies

### Phase 2: Glean
Filter and distill the gathered information to create focused, noise-free context:

**Filtering Techniques:**
1. **Relevance Scoring**: Rate each piece of information (High/Medium/Low relevance)
2. **Dependency Mapping**: Identify direct vs. indirect dependencies
3. **Context Summarization**: Create executive summaries of large documents
4. **Code Extraction**: Pull only the essential functions/classes, not entire files

**Output Format:**
Create a curated context file that includes:
- **Executive Summary**: 2-3 sentence overview
- **Key Requirements**: Bullet list of must-haves
- **Critical Dependencies**: Essential components that must be considered
- **Constraints**: Technical and business limitations
- **Reference Links**: Pointers to full documents in memory

## Context Window Management

### The Compaction Principle
As conversations grow, context becomes unwieldy. Implement regular compaction:

**When to Compact:**
- Before switching between agents
- After completing major workflow phases
- When approaching token limits
- Before critical decision points

**Compaction Strategies:**
1. **Summary Generation**: Distill long conversations into key decisions
2. **Decision Extraction**: Pull out concrete choices made
3. **Progress Tracking**: Document what's been completed vs. remaining
4. **Context Refresh**: Start new conversations with compacted context

## Best Practices

### Do's
- ✅ Always gather before you code
- ✅ Create explicit context documents in memory
- ✅ Regularly compact long conversations
- ✅ Version your context as requirements evolve
- ✅ Use descriptive filenames for context files

### Don'ts
- ❌ Don't dump entire codebases into prompts
- ❌ Don't skip the gathering phase for "simple" tasks
- ❌ Don't let context accumulate without periodic cleanup
- ❌ Don't assume AI can extract relevant context from noise

## Integration with AI Dev Playbook Workflow

Each agent in the workflow should follow context engineering principles:

1. **Specification Agent**: Gathers all requirements and constraints
2. **Planner Agent**: Gleans from specifications to create focused plans
3. **Coder Agent**: Works with compacted, relevant context only
4. **Tester Agent**: Uses gathered examples and edge cases
5. **All Agents**: Regularly compact their outputs for next steps

## Measuring Context Quality

Track the effectiveness of your context engineering:
- **Precision**: How much of the provided context was actually used?
- **Completeness**: Did missing context cause issues later?
- **Efficiency**: How much time was saved/lost due to context quality?
- **Accuracy**: Did better context lead to better AI outputs?
