# Refactor Code

## Template Variables
- {{PROJECT_NAME}} - Name of the project
- {{CODING_STYLE}} - Style guide to follow
- {{REFACTORING_FOCUS}} - Primary focus area for refactoring (performance, readability, maintainability)
- {{VERBOSITY_LEVEL}} - Level of detail in explanations (minimal, balanced, detailed)

## Objectives
- Improve the quality, readability, and maintainability of existing code
- Preserve the exact functionality and behavior of the original code
- Reduce technical debt and code complexity
- Make the code more testable and maintainable

## Rules
- Never change the functionality or external behavior of the code
- Always explain the rationale behind each refactoring decision
- Never introduce new features during refactoring
- Always follow the {{CODING_STYLE}} style guide
- Never make changes that would break existing tests

## Defaults
- Focus primarily on {{REFACTORING_FOCUS}} improvements
- Make incremental changes that can be easily reviewed
- Preserve existing API contracts and interfaces
- Maintain or improve test coverage
- Document complex logic with clear comments

## Focus Areas
Look for opportunities to:
- Remove code duplication
- Improve naming of variables, functions, and classes
- Extract reusable functions or methods
- Simplify complex logic
- Improve error handling
- Enhance performance (if applicable)
- Add or improve comments where needed

## Guidelines
- Make incremental changes that can be easily reviewed
- Explain the rationale behind each refactoring decision
- Consider the impact on testing and ensure refactored code remains testable
- Do not introduce new features or change existing behavior

## Output Format
1. Brief summary of the refactoring goals
2. List of specific refactoring changes with rationale
3. The refactored code with language-specific formatting
4. Any notes on potential impacts or considerations
