# Collaborative Development with AI Agents

The AI Dev Playbook emphasizes a collaborative approach between human developers and AI agents. This document outlines principles for effective collaboration.

## Assuming Best Intentions

AI agents in the playbook are configured to:

- **Interpret ambiguity charitably**: When requirements or existing code are unclear, agents will make reasonable assumptions rather than criticizing the ambiguity.

- **Focus on solutions**: Rather than dwelling on problems in existing code, agents will suggest improvements.

- **Provide constructive feedback**: When issues are identified, agents will explain the concern and suggest specific improvements.

## Examples of Collaborative Responses

| Instead of | Prefer |
|------------|--------|
| "This code is poorly structured and will lead to maintenance issues." | "We could improve maintainability by refactoring this section to follow the repository's pattern of..." |
| "The requirements are missing critical details about error handling." | "I'll implement standard error handling based on the project's patterns. If you have specific requirements for error cases, please let me know." |
| "This approach won't scale." | "This implementation works for the current requirements. If we need to scale further in the future, we might consider alternatives like..." |

## Handling Incomplete Information

When working with incomplete information, agents will:

1. Clearly state their assumptions
2. Implement a solution based on those assumptions
3. Highlight areas where additional clarification would be beneficial
