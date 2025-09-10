# **Spec-Driven Development with AI**

## **Introduction**

Spec-Driven Development (SDD) is an approach that prioritizes creating detailed specifications and design documents *before* writing code. When combined with AI assistance, this methodology produces higher quality, more maintainable software than ad-hoc "vibe coding" approaches.

The AI Dev Playbook supports multiple approaches to specification creation:
- **Internal Workflow**: Using the AI Dev Playbook's Specification Agent for custom spec generation
- **External Tool Integration**: Leveraging tools like Amazon Kiro or GitHub Spec Kit for specification generation
- **Hybrid Approach**: Combining external tools with AI Dev Playbook refinement and implementation

## **Core Principles**

1. **Plans as Primary Assets**: The specifications and implementation plans are your most valuable development artifacts—more valuable than the code itself, which is often rewritten. A flawed plan leads to hundreds of lines of incorrect code; flawed research can lead to thousands.
2. **Specifications First, Code Second**: Create detailed requirements, design documents, and API contracts before implementation.
3. **Human-Centered Reviews**: Code reviews should prioritize reviewing the plan (which is shorter and easier to read) over reviewing hundreds of lines of AI-generated code.
4. **Living Documentation**: Keep specifications and code in sync throughout development.
5. **Test-Driven Approach**: Generate tests alongside or before code implementation.
6. **Structured Workflow**: Follow a consistent process from spec to implementation.

## **Benefits Over "Vibe Coding"**

| Aspect | "Vibe Coding" (Ad-hoc Prompting) | Spec-Driven Development |
|--------|----------------------------------|-------------------------|
| **Speed** | Fast for simple prototypes | More efficient for complex features |
| **Documentation** | Often minimal or missing | Built-in, comprehensive |
| **Maintainability** | Lower, decisions undocumented | Higher, design rationale preserved |
| **Testing** | Often an afterthought | Integrated from the beginning |
| **Team Collaboration** | Difficult to coordinate | Clear shared understanding |
| **Scaling** | Breaks down with complexity | Scales to enterprise applications |

## **Choosing Your Specification Approach**

### **When to Use Internal Specification Generation**

**Best for:**
- New teams learning the AI Dev Playbook methodology
- Unique or innovative features requiring custom specification frameworks
- Projects with specific documentation requirements not covered by external tools
- Teams wanting maximum control over specification format and content

**Advantages:**
- Fully integrated with AI Dev Playbook workflow
- Customizable to project needs
- Expert persona integration for specialized reviews
- No external tool dependencies

### **When to Use Amazon Kiro**

**Best for:**
- Enterprise teams with established design document standards
- Projects requiring comprehensive architectural documentation
- Teams familiar with traditional software design methodologies
- Large-scale systems requiring detailed component interaction mapping

**Advantages:**
- Mature enterprise tooling
- Comprehensive design document generation
- Established patterns for complex system design
- Strong architectural focus

### **When to Use GitHub Spec Kit**

**Best for:**
- Teams already using GitHub-based workflows
- Projects with constitutional or rule-based requirements
- Agile teams wanting rapid specification generation
- Teams preferring command-line tool integration

**Advantages:**
- Native GitHub integration
- Constitution-based planning approach
- Rapid task generation
- Command-line workflow compatibility

### **When to Use Hybrid Approach**

**Best for:**
- Teams transitioning between toolsets
- Complex projects requiring multiple specification perspectives
- Organizations with diverse project requirements
- Teams wanting to leverage best-of-breed tools

**Advantages:**
- Combines strengths of multiple approaches
- Flexible adaptation to project needs
- Risk mitigation through tool diversity
- Enhanced specification quality through multiple perspectives

## **Implementing Spec-Driven Development**

The AI Dev Playbook supports three approaches to specification creation. Choose the one that best fits your team's needs and existing toolchain.

### **Approach 1: Internal Specification Generation**

Use the AI Dev Playbook's built-in Specification Agent for custom spec generation:

**1. Create Initial Specification**
```
Using @workspace ai-dev/prompts/00-specification-agent.md, create a comprehensive feature specification for [feature description]
```

**2. Choose Document Structure**

**Option A: Multiple Focused Files**
- `requirements.md`: User stories, acceptance criteria, and constraints
- `design.md`: Architecture, data models, and component interactions
- `api-contract.md`: API endpoints, request/response formats

**Option B: Single Comprehensive File**
- `feature-spec.md`: A comprehensive document containing all specifications including requirements, design, API contracts, data models, and testing strategy

### **Approach 2: External Tool Integration**

#### **Using Amazon Kiro**

Kiro generates comprehensive design documents that can be directly integrated into the AI Dev Playbook workflow:

**1. Generate Kiro Artifacts**
```bash
# Use Kiro to generate specification documents
kiro generate [project-details]
# Outputs: design.md, requirements.md, tasks.md
```

**2. Import into AI Dev Playbook**
```bash
# Move Kiro artifacts to AI Dev Playbook memory
mv design.md .ai-dev/memory/
mv requirements.md .ai-dev/memory/
mv tasks.md .ai-dev/memory/
```

**3. Consolidate and Refine**
```
Using @workspace ai-dev/prompts/00-specification-agent.md, analyze and consolidate the Kiro documents in @workspace .ai-dev/memory/ into a unified technical specification.
```

#### **Using GitHub Spec Kit**

Spec Kit provides constitution-based planning that integrates seamlessly with AI Dev Playbook implementation:

**1. Generate Spec Kit Artifacts**
```bash
# Use Spec Kit commands for specification generation
/specify [feature description]
/plan
/tasks
# Outputs: specification files in specs/[###-feature-name]/
```

**2. Import into AI Dev Playbook**
```bash
# Copy Spec Kit artifacts to AI Dev Playbook memory
cp specs/[###-feature-name]/*.md .ai-dev/memory/
```

**3. Execute with AI Dev Playbook**
```
Using @workspace ai-dev/prompts/03-coder-agent.md, implement Task T001 from @workspace .ai-dev/memory/tasks.md.
```

### **Approach 3: Hybrid Integration**

Combine external tool strengths with AI Dev Playbook refinement:

**1. Start with External Tool**
- Use Kiro for comprehensive design documentation
- Use Spec Kit for constitution-based feature planning

**2. Enhance with AI Dev Playbook**
- Use Specification Agent to fill gaps or refine details
- Apply expert personas for specialized review (security, performance, etc.)
- Use context engineering for project-specific adaptations

**3. Implement with Full Workflow**
- Proceed with standard AI Dev Playbook implementation phases
- Maintain specifications as living documents throughout development

### 2. Generate Tasks from Specifications

Use the Planner Agent to break down specifications into discrete tasks (works with specifications from any source):

```
Using @workspace ai-dev/prompts/01-planner-agent.md, create a task list based on the specifications in @workspace .ai-dev/memory/
```

### 3. Implement with Continuous Reference to Specs

When implementing code, always reference the specification documents:

```
Using @workspace ai-dev/prompts/03-coder-agent.md, implement the API endpoint described in @workspace .ai-dev/memory/api-contract.md
```

### 4. Keep Documentation in Sync

Update specification documents when implementation details change:

```
Using @workspace ai-dev/prompts/06-documenter-agent.md, update the design document at @workspace .ai-dev/memory/design.md to reflect the changes made to the authentication flow
```

## **Plan-Centric Code Reviews**

### **Why Review Plans Instead of Code**

Traditional code reviews of AI-generated code can be overwhelming and ineffective:
- **Volume Problem**: AI can generate hundreds of lines of code in minutes
- **Context Loss**: Reviewers often lack the context for why specific implementation choices were made  
- **Surface-Level Review**: Reviewers focus on syntax and style rather than architectural decisions

### **Plan Review Process**

1. **Review the Specification**: Start with the spec document to understand the requirements and design decisions
2. **Examine the Plan**: Review the implementation plan in `AIDEV.md` or `.ai-dev/memory/` files
3. **Validate Architecture**: Ensure the planned approach aligns with system architecture
4. **Check Completeness**: Verify all requirements are addressed in the plan
5. **Light Code Review**: Do a high-level code review focused on:
   - Plan adherence (does the code match the plan?)
   - Integration points
   - Security considerations
   - Error handling patterns

### **Review Checklist**

**Plan Quality:**
- [ ] Does the plan clearly address all requirements?
- [ ] Are architectural decisions documented with rationale?
- [ ] Are dependencies and integration points identified?
- [ ] Does the plan include testing strategy?

**Implementation Alignment:**
- [ ] Does the code follow the approved plan?
- [ ] Are deviations from the plan documented and justified?
- [ ] Do tests match the planned testing strategy?

**AIDEV.md Quality:**
- [ ] Is the feature properly documented in the project ledger?
- [ ] Are design decisions and trade-offs captured?
- [ ] Will future developers understand the "why" behind this implementation?

## **Spec-Driven Incident Response**

The spec-driven approach extends beyond development into production incident management, ensuring that even urgent fixes maintain quality standards:

### **Incident Analysis**
- Use systematic triage to understand root causes before implementing fixes
- Document incident specifications that capture both the immediate problem and underlying design gaps

### **Sustainable Fixes**
- Apply spec-driven development to sustainable incident fixes
- Use incident analysis to identify system design improvements
- Create specifications for architectural changes that prevent similar issues

### **Example Workflow**
```
# 1. Systematic Analysis
Using @workspace ai-dev/prompts/10-incident-triage-agent.md, analyze this production error and identify root causes.

# 2. Balanced Response Planning  
Using @workspace ai-dev/prompts/11-incident-fix-agent.md, propose both hotfix and sustainable solutions.

# 3. Spec-Driven Sustainable Fix
Using @workspace ai-dev/prompts/00-specification-agent.md, create specifications for the long-term solution to address the underlying design issues identified in the incident analysis.
```

This approach ensures that incidents become opportunities for system improvement rather than just quick patches.

## **Integration with AI Dev Playbook Workflow**

The spec-driven approach enhances the existing AI Dev Playbook workflow:

1. **Planning Phase**: Create detailed specifications before generating the implementation plan
2. **Estimation Phase**: More accurate estimates based on detailed specifications
3. **Execution Phase**: Implementation guided by specifications
4. **Quality Phase**: Verification against specifications
5. **Archival Phase**: Specifications included in the project ledger

By adopting spec-driven development, teams can leverage AI assistance while maintaining software engineering best practices and creating more maintainable, well-documented code.
