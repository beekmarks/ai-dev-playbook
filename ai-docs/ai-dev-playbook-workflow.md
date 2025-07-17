# **AI Dev Playbook: Detailed Developer Workflow**

## **Introduction**

This document provides a detailed, step-by-step guide to using the AI Dev Playbook starter repository. While the README.md offers a high-level overview, this guide dives deeper into the nuances of each step, offering best practices and tips for getting the most out of the AI-assisted workflow.

The goal is to move beyond mechanical prompting and into a fluid, conversational collaboration with the AI, where you, the developer, are always the director.

### Two Implementation Approaches

The AI Dev Playbook now offers two complementary approaches to AI-assisted development:

1. **Traditional Workflow**: Using `@workspace` commands with agent templates in `.ai-dev/prompts/`
2. **GitHub Copilot Native Integration**: Using repository custom instructions and prompt files

This document primarily describes the traditional workflow. For details on the GitHub Copilot native integration, see [github-copilot-integration.md](github-copilot-integration.md).

### Development Approaches: "Vibe Coding" vs "Spec-Driven Development"

The AI Dev Playbook supports two development approaches:

1. **"Vibe Coding"**: Quick, ad-hoc prompting for rapid prototyping and simple features
   * **Best for**: Exploration, simple features, and quick prototypes
   * **Limitations**: Less structured, may lack documentation, harder to maintain

2. **"Spec-Driven Development"**: Creating detailed specifications before implementation
   * **Best for**: Complex features, production code, team collaboration
   * **Benefits**: Better documentation, more maintainable code, clearer design decisions
   
For more details on spec-driven development, see [spec-driven-development.md](spec-driven-development.md).

### Choosing the Right Tool: Model Selection

A key part of your role as the "director" is selecting the best foundation model for the task. GitHub Copilot provides access to multiple LLMs, and they have different strengths. Choosing the right one will significantly improve the quality of the output.

* **Creative & Reasoning Models (e.g., Anthropic Claude, OpenAI GPT-4):** These models excel at understanding context, planning, and generating human-like text. They are best for tasks that require deep reasoning.  
  * **Use for:** Specification Developer, Planner, Refactorer, Documenter, Security Reviewer.  
* **Coding & Logic Models (e.g., models optimized specifically for code):** These models are often faster and highly effective at direct code generation and creating boilerplate.  
  * **Use for:** Coder, Tester.

Before invoking an agent, check the \# RECOMMENDED MODEL comment in the prompt file, and then **manually select the most appropriate model** in the GitHub Copilot Chat interface. This is a critical step for achieving high-quality results.

### Phase 0: Specification Development

For complex features or production code, start with creating detailed specifications:

1. **Understand the Requirements:** Gather all available information about the feature request, user story, or bug ticket.

2. **Invoke the Specification Developer Agent:** Select a **reasoning model** and ask the agent to create comprehensive specifications.
   * **Example Prompt:** "Using @workspace .ai-dev/prompts/00-specification-agent.md, create detailed specifications for the user authentication feature described in @workspace docs/tickets/AUTH-123.md. Save the specifications to @workspace .ai-dev/memory/AUTH-123-spec.md."

3. **Review and Refine the Specifications:** Carefully review the generated specifications for accuracy, completeness, and alignment with project goals. Make any necessary adjustments.

4. **Use Specifications as Living Documentation:** These specifications will guide all subsequent phases and should be updated if requirements or implementation details change.

### Phase 1: Planning & Setup

With specifications in hand (or for simpler features), proceed to planning. A high-quality plan leads to high-quality code.

1. **Understand the Task:** Before you write a single prompt, make sure you fully understand the feature request, user story, or bug ticket. The AI can't read your mind; it can only work with the information you provide.  
2. **Invoke the Planner Agent:** Open the VS Code Chat, select an appropriate **reasoning model**, and craft your initial prompt.  
   * **Be Specific:** Don't just say "build a login page." Describe the requirements: "Create a plan for a login page that requires an email and password, has a 'Forgot Password' link, and validates the form on the client side."  
   * **Provide Context:** Use the @workspace command to point the AI to relevant files. This could include the ticket description, related code, or architectural diagrams.  
   * **Direct the Output:** Always tell the agent where to save the plan, creating a new file in the .ai-dev/memory/ directory.

**Example Prompt:**"Using @workspace .ai-dev/prompts/01-planner-agent.md, create a detailed plan for the feature described in @workspace docs/tickets/TICKET-123.md. Consider the existing code in @workspace src/auth/utils.js. Save the plan to @workspace .ai-dev/memory/TICKET-123-plan.md."

3. **Review and Refine the Plan:** The AI's first plan is a draft, not a final command. Read it carefully. Does it make sense? Did it miss anything? If the plan is flawed, ask the AI to revise it."That's a good start, but you forgot to include a step for adding rate limiting to the new endpoint. Please update the plan in @workspace .ai-dev/memory/TICKET-123-plan.md to include this."

### Phase 2: Estimation

Before diving into implementation, get time and complexity estimates to help with sprint planning and resource allocation.

1. **Invoke the Estimator Agent:** Select a **reasoning model** and ask the Estimator Agent to analyze your plan.
   * **Be Specific:** Provide any context about team experience or constraints that might affect estimates.
   * **Direct the Output:** Save the estimates to a file in the .ai-dev/memory/ directory.

**Example Prompt:** "Using @workspace .ai-dev/prompts/02-estimator-agent.md, provide time and complexity estimates for the plan in @workspace .ai-dev/memory/TICKET-123-plan.md. Our team has moderate experience with the technologies involved. Save the estimates to @workspace .ai-dev/memory/TICKET-123-estimates.md."

2. **Review the Estimates:** Examine the time and complexity estimates. Do they align with your expectations? If the estimates reveal that certain steps are more complex or time-consuming than anticipated, you might want to:
   * Break down complex steps into smaller, more manageable tasks
   * Adjust the scope of the feature for the current sprint
   * Allocate additional resources to high-complexity areas

### Phase 3: Execution (Code & Test)

This phase is an iterative loop. You will likely cycle between the Coder and Tester agents multiple times.

1. **Code in Small Increments:** Select a **coding-optimized model**. Address one or two steps from your plan at a time. This keeps the context for the AI small and focused, leading to better results.  
2. **Enforce Minimal Code:** The Coder agent is explicitly instructed to write the minimum code necessary. When you review its output, ensure it has followed this rule. If it adds extra helper functions or logic that wasn't in the plan, ask it to revise and remove the unnecessary code. This keeps your commits clean and focused.  
   **Example Prompt:**"Using @workspace .ai-dev/prompts/03-coder-agent.md, please implement Step 1 ('Create Service File') from the plan in @workspace .ai-dev/memory/TICKET-123-plan.md."  
3. **Test Immediately:** Once a logical unit of code is complete, immediately ask the Tester agent (using a coding model) to write tests for it. This practice, known as Test-Driven Development (TDD), ensures quality is built-in, not bolted on.  
   **Example Prompt:**"Excellent. Now, using @workspace .ai-dev/prompts/04-tester-agent.md, write unit tests for the code you just generated in src/services/itemService.js."  
4. **Run the Tests:** The AI will generate test code, but it cannot run it for you. Execute the newly created tests locally to confirm they pass and that they fail when you expect them to (e.g., by temporarily breaking the source code).

### Phase 4: Quality & Refinement

Once the core functionality is built and tested, use the specialized agents to improve its quality.

1. **Refactor for Clarity:** Using a **reasoning model**, ask the Refactorer agent to clean up any complex or duplicative code.  
2. **Perform a Security Review:** This is a crucial final check. Use a powerful **reasoning model** to ensure the Security Reviewer agent can analyze the code for subtle vulnerabilities.  
   **Example Prompt:**"Please perform a security review of the new endpoint handler in src/routes/api.js using @workspace .ai-dev/prompts/07-security-reviewer-agent.md."  
3. **Add Documentation:** Use the Documenter agent with a **reasoning model** to generate clear, human-readable documentation.

### Phase 5: Archival & Completion

This final phase ensures your work becomes a permanent, useful part of the project's history.

1. **Invoke the Archiver:** This is your last AI command for the task. Point the Archiver agent to all the relevant files you created in the /memory directory.  
   **Example Prompt:**"Using @workspace .ai-dev/prompts/08-archiver-agent.md, create a new entry in @workspace AIDEV.md titled 'Feature \#123: User Login Endpoint'. Compile the following files into it: @workspace .ai-dev/memory/TICKET-123-plan.md and @workspace .ai-dev/memory/TICKET-123-security-review.md."  
2. **Review the AIDEV.md Entry:** Briefly check the AIDEV.md file to ensure the new entry was appended correctly and looks clean.  
3. **Clean Up:** Delete the files for your task from the .ai-dev/memory/ directory. Their purpose is served, and their story is now in AIDEV.md.  
4. **Submit Your Pull Request:** Commit all your changes, including the updated AIDEV.md. When you create your PR, you can even reference the AIDEV.md entry in your description to give reviewers instant context.

### Note for Monorepo Users

As explained in the adoption-guide.md, monorepos like Nx should have a separate .ai-dev and AIDEV.md for each application or library.

When following this workflow in a monorepo, remember that all @workspace file paths in your prompts must be relative to the **root of the repository**. Be explicit to ensure the AI looks in the correct project.

**Correct Monorepo Prompt:**

"Using @workspace apps/my-api/.ai-dev/prompts/02-coder-agent.md, implement the plan from @workspace apps/my-api/.ai-dev/memory/plan.md."

**Incorrect Monorepo Prompt (ambiguous):**

"Using @workspace .ai-dev/prompts/02-coder-agent.md..."

### Using Template Variables

To make agent prompts more adaptable to your specific project needs, you can use template variables in your prompt files. This allows you to customize the behavior of agents without modifying their core functionality.

#### How to Use Template Variables

1. **Define Variables in Your Prompt Files**

   Add placeholders in your prompt templates using the format `{{VARIABLE_NAME}}`:

   ```markdown
   # **AGENT: Coder**
   ...
   **CONSTRAINTS:**
   * Strictly adhere to the {{CODING_STYLE}} style guide.
   * Use {{PREFERRED_TESTING_FRAMEWORK}} for any test references.
   ```

2. **Create a Project Variables File**

   Create a `.ai-dev/config/variables.json` file to store your project-specific values:

   ```json
   {
     "CODING_STYLE": "Airbnb JavaScript",
     "PREFERRED_TESTING_FRAMEWORK": "Jest",
     "PROJECT_NAME": "Customer Portal",
     "TEAM_LEAD": "Alex Johnson"
   }
   ```

3. **Reference Variables in Your Prompts**

   When invoking an agent, include the variables file in your prompt:

   ```
   Using @workspace .ai-dev/prompts/02-coder-agent.md with variables from @workspace .ai-dev/config/variables.json, implement...
   ```

#### Best Practices for Template Variables

* **Keep Variables Focused**: Use variables for values that might change between projects or teams.
* **Document Variables**: Include a comment in each prompt template listing the variables it expects.
* **Use Sensible Defaults**: Structure your prompts so they work even if variables aren't provided.
* **Avoid Sensitive Data**: Never store secrets or sensitive information in variables files.

Template variables are especially useful for teams managing multiple projects with the AI Dev Playbook, as they allow for consistent customization across all agent interactions.