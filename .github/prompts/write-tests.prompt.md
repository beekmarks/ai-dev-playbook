# Write Tests

Your goal is to create comprehensive tests including evaluation tests (evals) for a specific piece of code or functionality.

## Requirements

Write a comprehensive test suite that includes:
- **Unit Tests**: For individual functions/methods
- **Integration Tests**: For component interactions and data flow
- **Happy Path Tests**: Expected inputs and outputs
- **Edge Case Tests**: Empty, null, invalid, or unusual inputs
- **Error Handling Tests**: Graceful failure scenarios
- **Performance Tests**: Basic performance validation for critical paths
- **Evaluation Tests (Evals)**: To measure AI-generated code quality over time

## Evaluation Test Guidelines

Create **Evaluation Tests (Evals)** to measure AI consistency and quality:
- **Correctness Evals**: Verify AI consistently produces correct implementations
- **Consistency Evals**: Ensure similar requests produce similar code patterns
- **Regression Evals**: Catch when AI performance degrades on previously working scenarios
- **Performance Benchmarks**: Track performance metrics over time
- **Quality Metrics**: Code quality scores and standards compliance

## Guidelines

- Use the project's preferred testing framework
- Write tests that are isolated and don't depend on external services when possible
- Include setup and teardown code as needed
- Use descriptive test names that explain what is being tested
- Create "golden examples" that represent ideal outputs for comparison
- Include test metrics and success criteria for evaluation tests
- Design eval tests that fail clearly when AI output degrades

## Output Format

1. **Test Strategy Overview**: Brief description of testing approach
2. **Unit and Integration Tests**: Core functionality tests
3. **Edge Case and Error Tests**: Boundary condition tests
4. **Evaluation Tests**: AI quality measurement tests with metrics
5. **Test Coverage Notes**: Areas covered and any gaps
6. **Evaluation Criteria**: Success/failure thresholds for evals
