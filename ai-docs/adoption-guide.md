# **AI Dev Playbook: Adoption Guide**

This guide explains how to adopt the AI Dev Playbook workflow for both new (Greenfield) and existing (Brownfield) projects. The core principle in both scenarios is maintaining a logical separation between your application code and the AI Dev Playbook framework.

## Quick Integration (Integration Assistant)

Use the Integration Assistant for first-time setup to minimize errors and ensure the correct pattern is applied.

### Commands
Greenfield (started from template / same repo):
```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```
Existing project (playbook cloned adjacent):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```
Monorepo (let assistant choose pattern):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, analyze this repository as a monorepo and implement the appropriate AI Dev Playbook integration pattern with rationale.
```
Single app inside monorepo (scoped):
```
@workspace Using the AI Dev Playbook Integration Assistant at ../../ai-dev-playbook/integration-assistant.prompt.md, analyze ONLY this application directory and implement an application-scoped AI Dev Playbook instance.
```

### What It Automates
- Repository / monorepo analysis and pattern decision
- Scaffolding .ai-dev/, .github/, AIDEV.md (or augmenting existing assets)
- Variable file creation / merging
- Prompt customization with detected stack context
- Operational usage guidance snippet
- Validation checklist output (prompts accessible, variables resolved, ledger initialized)

### Manual Fallback
If the assistant is unavailable:
1. Copy .ai-dev/, .github/, AIDEV.md into target scope (root or app dir)
2. Rename example.variables.json to variables.json and populate
3. Open VS Code and proceed with standard workflow docs
4. Add initial AIDEV.md entry marking adoption

## **The Separation Principle**

The AI Dev Playbook assets (.ai-dev/, .github/prompts/, AIDEV.md, docs/) are **development-time tools**, not production code. They are meta-artifacts that help you write, test, and document your code, but they are never deployed.

* **Your Application Code (/src, /app, etc.):** This is the code that gets built, tested in CI/CD, and deployed. It is the product.  
* **The AI Dev Playbook Framework (.ai-dev/ and .github/):** This is the set of "recipes" and processes you use to create the product. It should never be bundled in your final build.

## **Use Case 1: New Greenfield Projects**

For new applications, the process is simple as you are starting with a clean slate.

**📖 For detailed greenfield project setup, see [docs/greenfield-project-guide.md](../docs/greenfield-project-guide.md)**

**Quick Start:**
1. **Use as a Template:** Clone or generate your new repository from the ai-dev-playbook-starter template. This provides you with the complete, correct structure from day one.  
2. **Develop in /src:** Begin developing your application code inside the src/ directory. You can rename or restructure this as needed (e.g., to /lib, /app), but all of your application-specific logic should reside there.  
3. **Follow the Workflow:** For every new feature or task, follow the workflow outlined in docs/ai-dev-playbook-workflow.md. The framework assets in .ai-dev/ are already in place to support you.
4. **Choose Your Integration Style:** Decide whether to use the traditional workflow with agent templates, the GitHub Copilot native integration, or both approaches in parallel.
5. **Choose Your Development Approach:** Decide whether to use "Vibe Coding" for quick prototyping or "Spec-Driven Development" for complex features requiring detailed specifications before implementation. See [spec-driven-development.md](spec-driven-development.md) for details.

The logical separation is maintained by default. The framework guides the creation of your code but remains distinct from it.

## **Use Case 2: Existing Brownfield Projects**

Integrating the AI Dev Playbook into a mature codebase requires a simple "drop-in" process without disrupting existing code.

1. **Copy Framework Files:** Copy the following files and directories from the starter repo into the **root directory** of your existing project:  
   * The entire .ai-dev/ directory.  
   * The .github/copilot-instructions.md file and .github/prompts/ directory.  
   * The AIDEV.md file.  
   * The docs/ directory (or just docs/ai-dev-playbook-workflow.md, docs/github-copilot-integration.md, and this docs/adoption-guide.md).  
2. **No Code Changes Required:** This action should require **zero modifications** to your existing application source code. The AI Dev Playbook assets will sit alongside your current /src, /app, /tests directories.  
3. **(Optional) Tune the Prompts and Instructions:** Your team should take a few minutes to tune both the agent prompts and GitHub Copilot instructions to your project's specific context:
   * For agent templates: Add project-specific context to files in `.ai-dev/prompts/`. For example, you might add a line to 03-coder-agent.md like: *"This is a Java Spring Boot application using Maven. Ensure all code follows standard Java 17 conventions and our internal style guide."*
   * For GitHub Copilot: Customize `.github/copilot-instructions.md` with your project's coding standards, architecture, and other important context. Also review and update the prompt files in `.github/prompts/` to align with your team's needs.
   * Consider using template variables in `.ai-dev/config/variables.json` to maintain consistency across both systems.  
4. **Initialize AIDEV.md:** You do not need to retroactively document your entire project. Instead, create an initial entry in AIDEV.md to mark the start of the new process.  
   \#\# Process Adopted \- July 08, 2025

   \#\#\# Description  
   The AI Dev Playbook development workflow was officially adopted for this project. All new features and significant bug fixes will be logged in this document going forward.

5. **Start with New Work:** From this point forward, your team follows the AI Dev Playbook workflow for all new development. The framework is now a part of your development process, and the AIDEV.md ledger will grow over time, increasing the project's maintainability.

## **Choosing Your Integration Approach**

The AI Dev Playbook now offers two complementary approaches to AI-assisted development. Here's guidance on when to use each:

### **Traditional Workflow with Agent Templates**

**Best for:**
- Teams new to AI-assisted development who benefit from the structured workflow
- Complex features that require multiple specialized agents (planning, estimation, coding, testing)
- Projects where maintaining a comprehensive development history in AIDEV.md is critical
- Teams who want maximum control over AI interactions

**How to use:** Follow the workflow in ai-dev-playbook-workflow.md, using `@workspace` commands to invoke agent templates.

### **GitHub Copilot Native Integration**

**Best for:**
- Teams already familiar with GitHub Copilot Chat
- Quick, focused tasks that don't require the full workflow
- Developers who prefer a more conversational AI interaction
- Onboarding new team members to the AI Dev Playbook methodology

**How to use:** Use GitHub Copilot Chat with the `@prompt` command to access prompt files, or simply benefit from the repository custom instructions during normal Copilot interactions.

### **Hybrid Approach (Recommended)**

Many teams will benefit from using both approaches in parallel:

1. Use the **traditional workflow** for complex features, major refactorings, and significant changes
2. Use the **Copilot native integration** for quick tasks, bug fixes, and exploratory work

Both approaches complement each other and reinforce the same development principles and standards.

## **Implementing Human-in-the-Loop (HITL) Safeguards**

Regardless of which integration approach you choose, implementing structured HITL safeguards is essential for successful AI-assisted development:

### **Getting Started with HITL**

1. **Review the Governance Guide**: Familiarize your team with the HITL patterns described in the governance-and-sustainability.md document.

2. **Select Appropriate HITL Patterns**: Based on your project's risk profile and team structure, decide which HITL patterns to implement:
   - **Approval-Based HITL**: Required for all teams, especially for critical code
   - **Audit Trail HITL**: Recommended for regulatory compliance or when training new team members
   - **Expert-in-the-Loop HITL**: Valuable for complex domains with specialized knowledge requirements

3. **Identify Never-Automate Zones**: Document in AIDEV.md which parts of your codebase should never be modified by AI without extensive human oversight:
   - Security mechanisms
   - Regulatory compliance code
   - Critical business logic
   - Financial calculations

4. **Establish Approval Workflows**: Create PR templates and review checklists specific to AI-assisted code changes.

5. **Set Up Observability**: Implement a system for logging AI interactions and capturing feedback on AI-generated code quality.

HITL safeguards should evolve with your team's experience with AI-assisted development. Start with more oversight and gradually adjust as your team builds confidence in the process.

## **Repository Structure Considerations**

The placement of the AI Dev Playbook assets depends on your repository structure.

### **Stand-Alone Repositories**

For a standard repository that contains a single application or library, the placement is simple:

* The .ai-dev directory, .github directory (with copilot-instructions.md and prompts/), AIDEV.md, and docs directory should live at the **root of the repository**.

This top-level placement signifies that the framework governs the single project contained within the repo.

### **Nx Monorepos**

In a monorepo, a single root-level framework is not ideal, as it would mix the history and context of many different, independent projects.

**The recommended approach is to treat each application or library within the monorepo as its own "project" deserving of its own AI Dev Playbook instance.**

* **Placement:** 
  * The `.ai-dev` directory and the `AIDEV.md` file should be placed **inside each project's directory**.
  * For GitHub Copilot integration, you have two options:
    * **Option 1 (Recommended)**: Place project-specific `.github/copilot-instructions.md` and `.github/prompts/` in each project directory
    * **Option 2**: Use a single repository-level `.github/copilot-instructions.md` with sections for each project
* **Why:**  
  * **Scoped AIDEV.md:** This keeps the development ledger clean and relevant to the specific project (apps/web-app has its own history, separate from libs/auth-lib).  
  * **Tuned Prompts:** This allows the prompts for each project to be tuned to its specific technology stack (e.g., React prompts for the web app, NestJS prompts for the API).
  * **Project-Specific Variables:** Use `.ai-dev/config/variables.json` in each project to customize template variables for that project's specific needs.

**Example Monorepo Structure:**

/  
├── apps/  
│   ├── my-react-app/  
│   │   ├── .ai-dev/         \<-- App-specific agent templates  
│   │   │   └── config/     \<-- React-specific template variables  
│   │   ├── .github/        \<-- App-specific Copilot integration  
│   │   │   ├── copilot-instructions.md  
│   │   │   └── prompts/    \<-- React-specific prompt files  
│   │   ├── src/  
│   │   └── AIDEV.md        \<-- Ledger for my-react-app  
│   │  
│   └── my-api/  
│       ├── .ai-dev/         \<-- API-specific agent templates  
│       │   └── config/     \<-- API-specific template variables  
│       ├── .github/        \<-- API-specific Copilot integration  
│       │   ├── copilot-instructions.md  
│       │   └── prompts/    \<-- API-specific prompt files  
│       ├── src/  
│       └── AIDEV.md        \<-- Ledger for my-api  
│  
├── libs/  
│   └── shared-ui/  
│       ├── .ai-dev/         \<-- UI lib-specific agent templates  
│       │   └── config/     \<-- UI-specific template variables  
│       ├── .github/        \<-- UI-specific Copilot integration  
│       │   ├── copilot-instructions.md  
│       │   └── prompts/    \<-- UI-specific prompt files  
│       ├── src/  
│       └── AIDEV.md        \<-- Ledger for shared-ui  
│  
└── nx.json
