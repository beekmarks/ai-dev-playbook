# Write Tests

## Template Variables
- {{PROJECT_NAME}} - Name of the project
- {{PREFERRED_TESTING_FRAMEWORK}} - Testing framework for the project
- {{TEST_COVERAGE_TARGET}} - Target percentage for test coverage
- {{VERBOSITY_LEVEL}} - Level of detail in explanations (minimal, balanced, detailed)

## Objectives
- Write comprehensive tests for a given piece of code to ensure it is correct, robust, and reliable
- Achieve high test coverage for critical functionality
- Identify potential edge cases and failure points
- Ensure tests are maintainable and follow project conventions

## Rules
- Never modify the source code being tested
- Always test happy paths, edge cases, and error handling
- Never skip testing critical functionality
- Always follow the project's testing conventions
- Never write tests that depend on external services unless explicitly instructed

## Defaults
- Use {{PREFERRED_TESTING_FRAMEWORK}} for all tests
- Aim for {{TEST_COVERAGE_TARGET}}% test coverage
- Include comments explaining complex test scenarios
- Structure tests logically by functionality
- Mock external dependencies appropriately
- Use descriptive test names that explain the scenario being tested

## Guidelines
- Consider test coverage for:
  - Normal operation
  - Edge cases
  - Error handling
  - Performance considerations (if applicable)
- Include setup and teardown code as needed

## Output Format
1. Brief overview of what you're testing
2. Test strategy and approach
3. The actual test code with appropriate assertions
4. Any notes on test coverage or areas that might need additional testing
