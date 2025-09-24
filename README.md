# **AI Dev Playbook Starter Repository**

Welcome\! This repository is a template for building software using a structured, repeatable, and high-quality **AI-Assisted Development** methodology. It's designed for teams using GitHub Copilot within VS Code.

The goal of this "AI Dev Playbook" is not to replace developer thinking, but to augment it. By providing a standardized set of tools (prompts) and a clear process, we can leverage AI to handle routine tasks, allowing developers to focus on architecture and complex problem-solving. This leads to faster development, higher quality code, and a fully documented project history.

https://github.com/user-attachments/assets/acf70bc7-43e1-44dc-bc49-c37dd93b0e61

## **Core Concepts**

This workflow is built on a few key ideas:

| Concept | Implementation | Description |
| :---- | :---- | :---- |
| **Developer as Director** | Your role in the VS Code Chat | You are in control. You direct the AI, providing it with context and instructions, and you are the final arbiter of quality. |
| **Human-in-the-Loop (HITL)** | Approval workflows | Structured patterns for human oversight including approval-based reviews, audit trails, and expert guidance at critical decision points. |
| **Spec-Driven Development** | Specifications before code | Create detailed specifications (requirements, design, API contracts) before implementation for better quality and maintainability. |
| **External Tool Integration** | Kiro, Spec Kit support | The AI Dev Playbook seamlessly integrates with existing specification tools like Amazon's Kiro and GitHub's Spec Kit, allowing teams to leverage their existing planning workflows. |
| **Specification Sources** | Multiple input formats | Accept specifications from various sources: manual creation, Kiro design documents, Spec Kit artifacts, or existing documentation, providing flexibility for different team workflows. |
| **Specialized Agents** | ai-dev/prompts/ | A collection of prompt templates, each designed for a specific task (specifications, planning, coding, testing, incident management, etc.). You invoke these agents to perform work. |
| **Role-Based Prompting** | Expert personas in each agent | By assigning specific roles (e.g., "Martin Fowler for refactoring," "Richard Feynman for documentation"), we focus the AI's vast knowledge and trigger deep expert associations, just like telling a human to "think like a security expert." This provides more accurate, expert-level responses. |
| **GitHub Copilot Integration** | .github/ directory | Repository custom instructions and prompt files that provide the same guidance through native GitHub Copilot features. |
| **Workspace Context** | @workspace command | GitHub Copilot can read files directly from your workspace. You use this to provide context like requirements, existing code, or plans. |
| **Modular Memory** | .ai-dev/memory/ | A transient "scratchpad." The output of one agent (e.g., a plan) is saved here to be used as the input for the next agent, creating a clean chain of operations. Note the dot prefix: this is a hidden directory separate from ai-dev/prompts/ to ensure generated files are not committed. |
| **Context Engineering** | Gather and Glean Strategy | Strategic approach to information management: systematically gather all relevant context, then filter and distill it for maximum AI effectiveness while managing context window limits. |
| **Permanent Log (AIDEV.md)** | **The Project's Memory** | **Why this exists:** While Git history tells you *what* changed line-by-line, AIDEV.md tells you *why*. It's a human-readable ledger of all work completed, capturing the high-level plan and intent behind each feature. This creates an invaluable resource for long-term maintenance and onboarding, as it preserves the design decisions that are often lost over time. |
| **Plans as Primary Assets** | Spec-Driven Development | The specifications and implementation plans are more valuable than the code itself. A flawed plan leads to hundreds of lines of incorrect code; flawed research can lead to thousands. Code reviews focus on plan quality rather than line-by-line code inspection. |
| **Minimal Code Generation** | Enforced in Agent Prompts | **The AI should write as little code as possible.** It should only generate the minimum code necessary to implement the requested feature. This prevents code bloat and keeps commits small, focused, and easy to review. |
| **Iterative Refinement** | Continuous Feedback Loops | Built-in iteration cycles with evaluation tests (evals) to measure AI consistency and quality over time, enabling continuous improvement of both prompts and outcomes. |

## **Getting Started**

### **Quick Integration (Recommended)**

The fastest way to add AI Dev Playbook to any repository:

```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```

This AI-powered integration assistant will:
- ✅ **Analyze your repository** structure and technology stack
- ✅ **Choose the right architecture** (single project vs monorepo patterns)
- ✅ **Create customized prompts** with your actual project context
- ✅ **Set up complete workflow** with all 12 development steps (including Context Compactor and Incident Management)
- ✅ **Implement advanced context engineering** with gather-and-glean strategies
- ✅ **Generate operational documentation** for your team

### **Starting with Existing Specifications**

If you already have specifications from tools like Kiro or Spec Kit:

```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, please analyze this repository containing [Kiro/Spec Kit] artifacts and implement a complete AI Dev Playbook setup.
```

The Integration Assistant automatically detects and integrates:
- **Kiro Artifacts**: `design.md`, `requirements.md`, `tasks.md` files
- **Spec Kit Artifacts**: `specs/[###-feature-name]/` directories with comprehensive planning documents
- **Generic Documentation**: Any existing `.md` files containing specifications or requirements

### **Manual Setup**

For step-by-step setup or to understand the methodology:

1. **New Project**: Follow [docs/greenfield-project-guide.md](docs/greenfield-project-guide.md) for comprehensive new project setup
2. **From Design Documents**: Use [docs/documents-first-guide.md](docs/documents-first-guide.md) when starting with existing design.md, requirements.md, tasks.md files, Kiro artifacts, or Spec Kit specifications
3. **Single Project**: Clone this repository as a template  
4. **Monorepo**: See [docs/monorepo-integration-guide.md](docs/monorepo-integration-guide.md) for architecture decisions
5. **Existing Project**: Review [ai-docs/adoption-guide.md](ai-docs/adoption-guide.md) for integration guidance
6. **Context Engineering**: Learn advanced techniques in [ai-docs/context-engineering-guide.md](ai-docs/context-engineering-guide.md)
7. **Advanced AI Techniques**: Explore persona-based prompting in [ai-docs/advanced-ai-techniques.md](ai-docs/advanced-ai-techniques.md)
8. **Daily Workflow**: Study [ai-docs/ai-dev-playbook-workflow.md](ai-docs/ai-dev-playbook-workflow.md) for process details

### **Repository Types Supported**

- ✅ **Single Projects**: Standard AI Dev Playbook approach
- ✅ **Nx Monorepos**: Application-focused or repository-focused patterns

## **Step-by-Step Integration Guide**

### **Prerequisites**
- GitHub Copilot enabled in VS Code
- AI assistant access (GitHub Copilot, Claude, etc.)
- Your target repository open in VS Code

### **Method 1: AI-Powered Integration (Recommended)**

**Step 1**: Download the AI Dev Playbook repository
```bash
# In a directory adjacent to your project (not inside it)
git clone https://github.com/your-org/ai-dev-playbook.git

# Your directory structure should look like:
# parent-directory/
# ├── your-project/          (your existing repository)
# └── ai-dev-playbook/       (this repository)
```

**Step 2**: Open your project repository in VS Code
```bash
cd your-project
code .
```

**Step 3**: Use the Integration Assistant
In GitHub Copilot Chat, run this exact command:
```
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```

**Step 4**: Verify the integration
The assistant will create all necessary files and explain what was set up. Verify:
- ✅ AI Dev Playbook files are created in the right locations
- ✅ Prompts are customized with your project context
- ✅ Documentation explains how to use it in your repository

### **Method 2: Manual Integration**

**Step 1**: Download the AI Dev Playbook repository (same as above)

**Step 2**: Copy the appropriate files based on your project type

**For Single Projects:**
```bash
# From your project directory
cp -r ../ai-dev-playbook/.ai-dev/ .
cp -r ../ai-dev-playbook/.github/ .
cp ../ai-dev-playbook/AIDEV.md .
```

**For Monorepos:**
See [docs/monorepo-integration-guide.md](docs/monorepo-integration-guide.md) for detailed patterns and architecture decisions.

**Step 3**: Customize the configuration
- **Set Up Variables**: Create your project-specific configuration:
  ```bash
  # Create the config directory in your workspace
  mkdir -p .ai-dev/config
  
  # Copy the example variables file from the framework
  cp ai-dev/config/example.variables.json .ai-dev/config/variables.json
  
  # Edit with your project details (see ai-dev/config/example.variables.json for available options)
  ```
- Update `.github/copilot-instructions.md` with your project context
- Customize agent prompts as needed for your technology stack

**Step 4**: Create operational documentation
- Quick start guide for your team
- Example workflow with your project's specific paths
- Team-specific guidelines and conventions

### **Method 3: New Project Template**

**For New Projects:**
```bash
# Use this repository as a template for new projects
git clone https://github.com/your-org/ai-dev-playbook.git my-new-project
cd my-new-project
rm -rf .git
git init
# Start developing in src/ directory
```

### **Troubleshooting Integration**

**Integration Assistant Not Working?**
- Ensure the ai-dev-playbook directory is adjacent to your project
- Check that the path `../ai-dev-playbook/integration-assistant.prompt.md` is correct
- Verify GitHub Copilot has access to read files in both directories

**Files Not Copied Correctly?**
- Use the Integration Assistant instead of manual copying
- Check file permissions and directory structure
- Ensure you're running commands from the correct directory

**Prompts Not Customized?**
- The Integration Assistant automatically customizes prompts with real project context
- Manual setup requires editing `.ai-dev/config/variables.json` and prompt files
- Remove placeholder values like `{{PROJECT_NAME}}` with actual values

## **The Workflow: A Real-World Example**

Let's walk through adding a new feature: **"Create a new API endpoint /api/items that returns a list of items."**

### **Step 1: Create Specifications**

First, we ask the **Specification Developer Agent** to create detailed specifications for the feature. You can request either a single comprehensive specification file or multiple focused files.

**Option A: Single Specification File:**

**Your Chat Prompt:**

"Using the agent at @workspace ai-dev/prompts/00-specification-agent.md, create a comprehensive specification for a new API endpoint /api/items. The endpoint should fetch data from itemService.js and return it as JSON. Include requirements, design, API contract, and testing strategy. Save the output to @workspace .ai-dev/memory/get-items-spec.md."

**Option B: Multiple Specification Files:**

**Your Chat Prompt:**

"Using the agent at @workspace ai-dev/prompts/00-specification-agent.md, create separate specification files for a new API endpoint /api/items. The endpoint should fetch data from itemService.js and return it as JSON. Create requirements.md, design.md, and api-contract.md files in the .ai-dev/memory/ directory."

### **Step 2: Plan the Work**

Next, we ask the **Planner Agent** to break down the task based on our specifications. We give it the specifications and tell it where to save the output.

**Your Chat Prompt:**

"Using the agent at @workspace ai-dev/prompts/01-planner-agent.md, create a plan to implement the API endpoint based on the specifications in @workspace .ai-dev/memory/get-items-spec.md. Save the output to @workspace .ai-dev/memory/get-items-plan.md."

### **Step 3: Estimate the Work**

Before implementation, we use the **Estimator Agent** to get time and complexity estimates for our plan.

**Your Chat Prompt:**

"Using @workspace ai-dev/prompts/02-estimator-agent.md, provide time and complexity estimates for the plan in @workspace .ai-dev/memory/get-items-plan.md. Save the output to @workspace .ai-dev/memory/get-items-estimates.md."

### **Step 4: Write the Code**

Now, we execute the plan step-by-step using the **Coder Agent**.

**Your Chat Prompt:**

"Using @workspace ai-dev/prompts/03-coder-agent.md, implement Step 1 from the plan in @workspace .ai-dev/memory/get-items-plan.md."

### **Step 5: Write the Tests**

With the code written, we ask the **Tester Agent** to create the tests.

**Your Chat Prompt:**

"Using @workspace ai-dev/prompts/04-tester-agent.md, write unit tests for the new getItems function in @workspace src/services/itemService.js. Ensure you test the happy path and that it returns an array."

### **Step 6: Review and Refine**

Before finishing, we can use other agents like the **Security Reviewer** or **Refactorer** to ensure quality.

### **Step 7: Update Specifications**

If implementation details changed during development, we update our specifications to keep them in sync with the code.

**Your Chat Prompt:**

"Using @workspace ai-dev/prompts/06-documenter-agent.md, update the specifications in @workspace .ai-dev/memory/get-items-spec.md to reflect any changes made during implementation."

### **Step 8: Archive the History**

The feature is complete\! The final step is to use the **Archiver Agent** to create a permanent record in AIDEV.md.

**Your Chat Prompt:**

"Using @workspace ai-dev/prompts/08-archiver-agent.md, create a new entry in @workspace AIDEV.md titled 'Feature: Add /api/items Endpoint'. Compile the plan from @workspace .ai-dev/memory/get-items-plan.md into it."

## **Governance and Best Practices**

* **Prompts are Curated:** The agent prompts in ai-dev/prompts are the team's standard. Do not commit changes to them directly. If you discover a generally useful improvement, open a Pull Request to discuss it.  
* **AIDEV.md is the Project's Ledger:** This file is the project's long-term memory. The final step of every task is to append its story (plan, etc.) to this ledger. This ensures the "why" behind your code is preserved for future developers. You must include the updated AIDEV.md in your feature's Pull Request and be prepared to resolve merge conflicts.  
* **⚠️ SECURITY WARNING:** **NEVER** paste secrets, credentials, or sensitive customer data into a prompt. The AI is a third-party service. Use placeholders and reference environment variables, just as you would in your code.

## **Integration Assistant**

### **Quick Reference**
```bash
# 1. Download AI Dev Playbook adjacent to your project
git clone https://github.com/your-org/ai-dev-playbook.git

# 2. Open your project in VS Code and run:
@workspace Using the AI Dev Playbook Integration Assistant at ../ai-dev-playbook/integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```

The **Integration Assistant** (`integration-assistant.prompt.md`) is an AI-powered tool that automates the setup of AI Dev Playbook in any repository. It intelligently analyzes your project and creates a complete, production-ready integration.

### **How It Works**
1. **Analyzes** your repository structure and technology stack
2. **Decides** the right architecture pattern (single project vs monorepo)
3. **Creates** customized prompts with your actual project context
4. **Generates** operational documentation specific to your project
5. **Validates** complete workflow coverage and quality

### **Usage**
```
@workspace Using the AI Dev Playbook Integration Assistant at integration-assistant.prompt.md, please analyze this repository and implement a complete AI Dev Playbook setup.
```

### **Supported Repository Types**
- **Single Projects**: Traditional AI Dev Playbook setup
- **Monorepos**: Application-focused or repository-focused patterns
- **Technology Stacks**: TypeScript, Python, React, Node.js, AWS, and more

For detailed monorepo guidance, see [docs/monorepo-integration-guide.md](docs/monorepo-integration-guide.md).

## **Two Ways to Use the AI Dev Playbook**

The AI Dev Playbook now offers two complementary approaches to AI-assisted development:

### 1. Traditional Workflow with Agent Templates

Use the `@workspace` command with agent templates in `ai-dev/prompts/` for a structured, full-featured workflow:

```
Using @workspace ai-dev/prompts/01-planner-agent.md, create a plan for...
```

This approach is ideal for complex features and teams following the complete methodology.

### 2. GitHub Copilot Native Integration

Use GitHub Copilot's built-in features with our custom instructions and prompt files:

- **Repository Custom Instructions**: Automatic guidance for all Copilot interactions
- **Prompt Files**: Quick access to agent capabilities via `@prompt` command

```
@prompt plan-feature
```

This approach is ideal for quick tasks and teams already familiar with Copilot Chat.

For more details on the GitHub Copilot integration, see [ai-docs/github-copilot-integration.md](ai-docs/github-copilot-integration.md).