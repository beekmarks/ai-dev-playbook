# AI Dev Playbook: Governance and Sustainability Guide

This guide outlines best practices for governing, scaling, and maintaining the AI Dev Playbook methodology across teams and over time. It addresses how to manage artifacts, handle security concerns, onboard new team members, and measure success.

## Governance and Team Workflow

To ensure the AI Dev Playbook works effectively across distributed teams, adopt the following governance model:

### Managing Templates and Prompts

- **Centralized Curation**: Agent templates (`.ai-dev/prompts/`) and GitHub Copilot prompts (`.github/prompts/`) should be centrally curated
- **Change Process**: Changes to core templates should be made via Pull Request with appropriate review
- **Local Adaptations**: Developers are encouraged to adapt prompts locally for specific tasks but should not commit those tweaks to main
- **Template Variables**: Use template variables (`.ai-dev/config/variables.json`) to customize prompts without modifying core templates

### Managing the AIDEV.md File

- **Collaborative Ownership**: The AIDEV.md file is updated by everyone on the team
- **Pull Request Requirement**: Updates to AIDEV.md must be included in every feature's Pull Request
- **Merge Conflict Handling**: Developers should handle any merge conflicts as a routine part of the Git workflow
- **Consistent Formatting**: Follow the established format for entries to maintain readability

## Security and Sensitive Data Handling

### Core Security Principles

- **Zero-Trust for Prompts**: NEVER paste secrets, credentials, PII, or other sensitive data into a prompt
- **Use Placeholders**: Use placeholders (e.g., `[DATABASE_PASSWORD]`) in the context provided to AI
- **Environment Variables**: Reference environment variables in the code the AI generates
- **Security Review**: The security-reviewer-agent should include checks for hardcoded secrets and insecure dependencies
- **Regular Audits**: Periodically audit AIDEV.md files to ensure no sensitive data has been accidentally committed

### Secure Sandboxed Execution

### Mandatory Isolation Requirements
- **All AI-generated code execution** must occur in secure, isolated environments
- **No direct host system access** for any code-running agents
- **Resource limits enforced** to prevent system impact or resource exhaustion
- **Network restrictions** to prevent unauthorized external communications

📖 **Implementation Guide**: See the [Secure Sandbox Execution Guide](../docs/secure-sandbox-execution.md) for complete architecture details, setup instructions, and security implementation.

#### Recommended Solutions:
- **Docker-based sandboxes** for local development environments
- **Managed services** like Amazon Bedrock AgentCore Code Interpreter for cloud deployments
- **Safety frameworks** like the UK AI Safety Institute's Inspect toolkit for evaluation

#### Affected Agents:
- **Tester Agent**: When executing integration or E2E tests
- **Security Reviewer Agent**: When running dynamic security analysis
- **Coder Agent**: When validation requires code execution
- **Any future autonomous agents**: Operating in Macro-Workflow mode

## Human-in-the-Loop (HITL) Safeguards

While the AI Dev Playbook methodology inherently involves human oversight, implementing structured HITL patterns is essential for safe and effective AI-assisted development. These safeguards ensure that developers maintain control while leveraging AI capabilities.

### Enhanced HITL Patterns for Agentic Development

As AI agents evolve from assistants to autonomous actors, Human-in-the-Loop patterns must adapt to manage greater complexity and risk while maintaining developer control.

#### 1. Approval-Based HITL (Enhanced)
- **Implementation**: Require explicit human approval before any AI-generated code is committed
- **When to Use**: For all code changes in critical systems, security-related features, or core business logic
- **Process Example**: 
  - AI agent generates code and creates a draft PR
  - Human developer must review and approve before merging
  - Consider requiring approval from someone other than the person who initiated the AI task
- **Agentic Enhancement**: For autonomous agents, approval shifts to **Strategic Validation** - approving the high-level plan before execution begins, plus final PR review

#### 2. Audit Trail HITL (Enhanced)
- **Implementation**: Comprehensive logging of all AI interactions, decisions, and generated outputs
- **When to Use**: For all AI-assisted development, mandatory for autonomous agent workflows
- **Process Example**:
  - Store all agent prompts and responses in a searchable format
  - Include references to AI assistance in commit messages
  - Maintain structured Git history with atomic, descriptive commits
  - Auto-generate AIDEV.md entries from structured commit history
- **Agentic Enhancement**: AIDEV.md becomes an automated **Explanation Log** synthesized from structured development history

#### 3. Expert-in-the-Loop HITL (Enhanced)
- **Implementation**: Configure AI agents to pause and request guidance when facing uncertainty
- **When to Use**: For complex tasks where the AI might not have sufficient context
- **Process Example**:
  - Add explicit instructions in agent prompts to identify edge cases or uncertainties
  - Establish a protocol for agents to "escalate" decisions to human experts
  - Document these interactions in the AIDEV.md file for future reference

#### 4. Strategic Validation (New)
- **Implementation**: Human validates AI's high-level strategic plan and final output alignment with business goals
- **When to Use**: For autonomous agents handling goal-oriented tasks (Macro-Workflow)
- **Process Example**:
  - AI presents comprehensive plan for human review before execution
  - Human evaluates plan against architectural principles and business requirements
  - Final output validated for strategic alignment, not just technical correctness

#### 5. Human-on-the-Loop (New)
- **Implementation**: Real-time supervision with ability to intervene, pause, or redirect agent execution
- **When to Use**: For long-running autonomous tasks or high-risk operations
- **Process Example**:
  - Human monitors agent progress through interactive interface
  - Ability to pause execution and provide course corrections
  - Agent reports progress and requests guidance at predefined checkpoints

### Never-Automate Zones

Certain parts of your codebase should be designated as "Never-Automate" zones where AI assistance is limited or prohibited:

- **Security-Critical Code**: Authentication, authorization, encryption, and other security mechanisms
- **Regulatory Compliance Logic**: Code that ensures compliance with legal or industry regulations
- **Financial Calculation Core**: Critical financial algorithms or transaction processing
- **Safety-Critical Systems**: Any code where failures could lead to physical harm

For these zones:
1. Clearly document them in AIDEV.md
2. Consider implementing technical safeguards (e.g., protected branches, required reviews)
3. Create specific template variables that instruct AI agents about these restrictions

### Observability and Feedback

To continuously improve AI-assisted development:

- **Centralized Logging**: Implement a system to log all AI agent activities
- **Feedback Mechanism**: Create a process for developers to report AI errors or low-quality outputs
- **Learning Loop**: Use feedback to improve agent prompts and template variables
- **Periodic Reviews**: Schedule regular reviews of AI contributions to identify patterns and areas for improvement

### Approval Workflows

Establish clear workflows for reviewing and approving AI-generated code:

1. **Pre-Commit Review**: All AI-generated code must be reviewed before committing
2. **Dedicated PR Template**: Create a pull request template specifically for AI-assisted changes that prompts reviewers to check for common issues
3. **Tiered Approval**: Implement different levels of approval based on the risk profile:
   - Low risk (documentation, tests): Single reviewer
   - Medium risk (feature enhancements): Two reviewers
   - High risk (core functionality): Senior developer + domain expert review
4. **Verification Steps**: Include specific steps to verify AI-generated code:
   - Run comprehensive test suite
   - Perform manual testing of edge cases
   - Review design decisions against architectural principles

## Onboarding and Training

- **Living Documentation**: Continuously update documentation with best practices and lessons learned
- **Example Library**: Maintain a library of high-quality AIDEV.md entries as a learning resource
- **AI Guild / Center of Excellence**: Establish a group of power-users responsible for:
  - Mentoring other developers
  - Curating core prompts
  - Evangelizing the workflow
  - Holding office hours and sharing tips
- **Onboarding Checklist**: Create a standardized onboarding process for new team members

## Long-Term Sustainability and Scalability

### Artifact Management

- **AIDEV.md Archival Strategy**: As the AIDEV.md file grows, implement a yearly archival strategy:
  - At the end of the year, rename AIDEV.md to AIDEV-YYYY.md (e.g., AIDEV-2025.md)
  - Start a fresh AIDEV.md file for the new year
  - This keeps the active file manageable while preserving the complete project history
  
- **Memory Directory Hygiene**: The `.ai-dev/memory/` directory is for transient, in-flight work:
  - Note the dot prefix (`.ai-dev/`) to distinguish it from the primary prompt directory (`ai-dev/`)
  - Configure `.gitignore` to exclude `.ai-dev/memory/*`
  - Include an exception for `.example` files
  - Establish a policy stating this directory is not for permanent storage

### Automation and Tooling

- **VS Code Snippets**: Create custom snippets to reduce friction:
  ```json
  "AI Dev Planner": {
    "prefix": "aidp-plan",
    "body": [
      "Using @workspace .ai-dev/prompts/01-planner-agent.md, create a plan for $1. Save the output to @workspace .ai-dev/memory/$2."
    ]
  }
  ```

- **GitHub Copilot Shortcuts**: Create documentation on using the `@prompt` command with the prompt files:
  ```
  @prompt plan-feature
  ```

- **Task Automation**: For multi-step processes, explore using VS Code Tasks to chain together commands

## Measuring Success and ROI

### Qualitative Metrics

- **Developer Surveys**: Regularly survey developer satisfaction
  - Is the system helping them work faster?
  - Do they feel more confident in their code?
  - Are they finding the documentation and design decisions useful?

### Quantitative Metrics

Track metrics that this process is designed to improve:

- **Development Efficiency**:
  - Time from feature request to PR creation
  - Number of review comments related to style, tests, or documentation (should decrease)
  - Time spent in code review

- **Onboarding and Knowledge Transfer**:
  - Onboarding time for new developers
  - Number of questions about code rationale or design decisions
  - Frequency of referencing AIDEV.md for historical context

- **Code Quality**:
  - Bug density in features developed with the AI Dev Playbook
  - Test coverage
  - Security vulnerabilities identified during review

## Continuous Improvement

- **Feedback Loop**: Establish a process for collecting and incorporating feedback on the AI Dev Playbook methodology
- **Regular Reviews**: Schedule quarterly reviews of the governance model and templates
- **Community Sharing**: Share success stories and lessons learned with the broader development community

---

By implementing these governance and sustainability practices, teams can ensure the AI Dev Playbook continues to provide value as the team grows and evolves over time.
