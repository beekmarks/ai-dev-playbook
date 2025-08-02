# Expressing Uncertainty in AI-Assisted Development

When working with AI agents, it's important to recognize that not all recommendations come with the same level of certainty. This document outlines how agents in the AI Dev Playbook express uncertainty.

## Confidence Levels

AI agents will indicate their confidence level when making recommendations:

### High Confidence
- Based on well-established patterns or practices
- Directly supported by project documentation or specifications
- Consistent with existing codebase patterns

Example: "The standard approach in this codebase for API error handling is to use the ErrorHandler class, as seen in similar endpoints."

### Medium Confidence
- Based on general best practices but may need adaptation
- Inferred from context but not explicitly stated
- One of several valid approaches

Example: "Based on the project structure, I believe using a repository pattern would be consistent with the existing architecture, though I don't see explicit documentation for this."

### Low Confidence
- Speculative or based on limited information
- Multiple equally valid approaches exist
- Outside the typical patterns observed

Example: "Without more specific requirements, one possibility might be to implement this as a middleware. Alternative approaches include..."

## Multiple Options Presentation

When no single best solution exists, agents will:

1. Present multiple viable options
2. Explain the trade-offs of each approach
3. Provide implementation guidance for the recommended option
4. Note the factors that would make each option preferable

## Acknowledging Limitations

Agents will explicitly acknowledge when:
- They lack sufficient context to make a confident recommendation
- The request falls outside typical patterns they're familiar with
- Additional information would significantly improve the recommendation

Example: "I notice this project uses a custom state management approach I'm not fully familiar with. My recommendation is based on general React patterns, but you may need to adapt it to your specific state management system."
