# **AI Dev Playbook Starter Repository**

Welcome\! This repository is a template for building software using a structured, repeatable, and high-quality **AI-Assisted Development** methodology. It's designed for teams using GitHub Copilot within VS Code.

The goal of this "AI Dev Playbook" is not to replace developer thinking, but to augment it. By providing a standardized set of tools (prompts) and a clear process, we can leverage AI to handle routine tasks, allowing developers to focus on architecture and complex problem-solving. This leads to faster development, higher quality code, and a fully documented project history.

## **Core Concepts**

This workflow is built on a few key ideas:

| Concept | Implementation | Description |
| :---- | :---- | :---- |
| **Developer as Director** | Your role in the VS Code Chat | You are in control. You direct the AI, providing it with context and instructions, and you are the final arbiter of quality. |
| **Human-in-the-Loop (HITL)** | Approval workflows | Structured patterns for human oversight including approval-based reviews, audit trails, and expert guidance at critical decision points. |
| **Specialized Agents** | .ai-dev/prompts/ | A collection of prompt templates, each designed for a specific task (planning, coding, testing, etc.). You invoke these agents to perform work. |
| **GitHub Copilot Integration** | .github/ directory | Repository custom instructions and prompt files that provide the same guidance through native GitHub Copilot features. |
| **Workspace Context** | @workspace command | GitHub Copilot can read files directly from your workspace. You use this to provide context like requirements, existing code, or plans. |
| **Modular Memory** | .ai-dev/memory/ | A transient "scratchpad." The output of one agent (e.g., a plan) is saved here to be used as the input for the next agent, creating a clean chain of operations. |
| **Permanent Log (AIDEV.md)** | **The Project's Memory** | **Why this exists:** While Git history tells you *what* changed line-by-line, AIDEV.md tells you *why*. It's a human-readable ledger of all work completed, capturing the high-level plan and intent behind each feature. This creates an invaluable resource for long-term maintenance and onboarding, as it preserves the design decisions that are often lost over time. |
| **Minimal Code Generation** | Enforced in Agent Prompts | **The AI should write as little code as possible.** It should only generate the minimum code necessary to implement the requested feature. This prevents code bloat and keeps commits small, focused, and easy to review. |

## **Getting Started**

1. Clone this repository.  
2. Read this README.md file carefully.  
3. For instructions on adopting this for a new or existing project, see [ai-docs/adoption-guide.md](ai-docs/adoption-guide.md).  
4. For a more detailed guide on the day-to-day process, review [ai-docs/ai-dev-playbook-workflow.md](ai-docs/ai-dev-playbook-workflow.md).

## **The Workflow: A Real-World Example**

Let's walk through adding a new feature: **"Create a new API endpoint /api/items that returns a list of items."**

### **Step 1: Plan the Work**

First, we ask the **Planner Agent** to break down the task. We give it the requirements and tell it where to save the output.

**Your Chat Prompt:**

"Using the agent at @workspace .ai-dev/prompts/01-planner-agent.md, create a plan to add a new API endpoint /api/items. The endpoint should fetch data from a itemService.js and return it as JSON. Save the output to @workspace .ai-dev/memory/get-items-plan.md."

### **Step 2: Estimate the Work**

Before implementation, we use the **Estimator Agent** to get time and complexity estimates for our plan.

**Your Chat Prompt:**

"Using @workspace .ai-dev/prompts/02-estimator-agent.md, provide time and complexity estimates for the plan in @workspace .ai-dev/memory/get-items-plan.md. Save the output to @workspace .ai-dev/memory/get-items-estimates.md."

### **Step 3: Write the Code**

Now, we execute the plan step-by-step using the **Coder Agent**.

**Your Chat Prompt:**

"Using @workspace .ai-dev/prompts/03-coder-agent.md, implement Step 1 from the plan in @workspace .ai-dev/memory/get-items-plan.md."

### **Step 4: Write the Tests**

With the code written, we ask the **Tester Agent** to create the tests.

**Your Chat Prompt:**

"Using @workspace .ai-dev/prompts/04-tester-agent.md, write unit tests for the new getItems function in @workspace src/services/itemService.js. Ensure you test the happy path and that it returns an array."

### **Step 5: Review and Refine**

Before finishing, we can use other agents like the **Security Reviewer** or **Refactorer** to ensure quality.

### **Step 6: Archive the History**

The feature is complete\! The final step is to use the **Archiver Agent** to create a permanent record in AIDEV.md.

**Your Chat Prompt:**

"Using @workspace .ai-dev/prompts/08-archiver-agent.md, create a new entry in @workspace AIDEV.md titled 'Feature: Add /api/items Endpoint'. Compile the plan from @workspace .ai-dev/memory/get-items-plan.md into it."

## **Governance and Best Practices**

* **Prompts are Curated:** The agent prompts in .ai-dev/prompts are the team's standard. Do not commit changes to them directly. If you discover a generally useful improvement, open a Pull Request to discuss it.  
* **AIDEV.md is the Project's Ledger:** This file is the project's long-term memory. The final step of every task is to append its story (plan, etc.) to this ledger. This ensures the "why" behind your code is preserved for future developers. You must include the updated AIDEV.md in your feature's Pull Request and be prepared to resolve merge conflicts.  
* **⚠️ SECURITY WARNING:** **NEVER** paste secrets, credentials, or sensitive customer data into a prompt. The AI is a third-party service. Use placeholders and reference environment variables, just as you would in your code.

## **Two Ways to Use the AI Dev Playbook**

The AI Dev Playbook now offers two complementary approaches to AI-assisted development:

### 1. Traditional Workflow with Agent Templates

Use the `@workspace` command with agent templates in `.ai-dev/prompts/` for a structured, full-featured workflow:

```
Using @workspace .ai-dev/prompts/01-planner-agent.md, create a plan for...
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