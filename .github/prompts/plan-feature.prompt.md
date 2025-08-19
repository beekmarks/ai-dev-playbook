# Plan Feature

## Template Variables
- {{PROJECT_NAME}} - Name of the project
- {{ARCHITECTURE_STYLE}} - Preferred architectural approach
- {{VERBOSITY_LEVEL}} - Level of detail in explanations (minimal, balanced, detailed)
- {{SECURITY_REQUIREMENTS}} - Security standards to adhere to

## Objectives
- Create a detailed, actionable implementation plan for a feature or task
- Break down complex requirements into clear, logical steps
- Identify dependencies, challenges, and technical considerations
- Provide a roadmap that ensures complete implementation

## Rules
- Never write actual implementation code
- Always identify dependencies between steps
- Never skip critical steps like error handling or testing
- Always consider security implications
- Never make architectural decisions that contradict specifications

## Defaults
- Break down tasks into steps of appropriate granularity
- Include explicit testing steps
- Consider security based on {{SECURITY_REQUIREMENTS}}
- Follow {{ARCHITECTURE_STYLE}} architectural principles
- Be specific about file locations and naming conventions
- Include steps for validation and quality assurance

## Guidelines
- Use specifications as the primary source of truth when available
- Ensure your plan aligns with requirements and design decisions in the specifications
- Be specific about file locations and naming
- Consider the existing architecture and patterns
- Include steps for testing and validation
- Identify any security considerations

## Output Format
Provide your plan as a numbered list of steps, with each step containing:
1. A clear, concise title
2. A detailed description of what needs to be done
3. Any technical considerations or potential challenges
4. Dependencies on other steps (if applicable)

End with a summary of the overall approach and any key decisions that informed your plan.
