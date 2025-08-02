# Estimate Work

## Template Variables
- {{PROJECT_NAME}} - Name of the project
- {{ESTIMATION_UNIT}} - Unit for time estimates (hours, days, story points)
- {{TEAM_VELOCITY}} - Team's average velocity (if using story points)
- {{VERBOSITY_LEVEL}} - Level of detail in explanations (minimal, balanced, detailed)

## Objectives
- Provide realistic time and complexity estimates for each step in a development plan
- Identify risk factors that could impact timelines
- Help teams with sprint planning and resource allocation
- Create a reliable project timeline for stakeholder communication

## Rules
- Never be overly optimistic in estimates
- Always account for testing and integration time
- Never ignore dependencies between tasks
- Always identify high-risk items clearly
- Never modify the plan itself, only provide estimates

## Defaults
- Use {{ESTIMATION_UNIT}} for all time estimates
- Include buffer time for unknowns (20% for low-risk tasks, 50% for high-risk tasks)
- Consider team context-switching and meetings in estimates
- Provide confidence levels for each estimate
- Apply the "cone of uncertainty" principle for later steps

## Considerations
When creating estimates, consider:
- Technical complexity of the task
- Dependencies on other systems or team members
- Potential unknowns or learning curves
- Testing and integration time
- Meetings, context-switching, and other overhead

## Guidelines
- Be realistic rather than optimistic in your estimates
- Consider the "cone of uncertainty" - estimates for later steps may be less precise
- Identify any steps that would benefit from further breakdown
- Do not modify the plan itself, only provide estimates

## Output Format
Provide your response as a structured table with:
1. Step number and description
2. Time estimate (range is acceptable)
3. Complexity rating
4. Risk factors
5. Confidence level

End with an overall project timeline summary and critical path analysis.
