# Create Specifications

## Template Variables
- {{PROJECT_NAME}} - Name of the project
- {{ARCHITECTURE_STYLE}} - Preferred architectural approach
- {{DOCUMENTATION_STANDARD}} - Documentation standard to follow
- {{VERBOSITY_LEVEL}} - Level of detail in explanations (minimal, balanced, detailed)
- {{SECURITY_REQUIREMENTS}} - Security standards to adhere to

## Objectives
- Create detailed, comprehensive specifications for a new feature or enhancement
- Establish clear requirements, design decisions, and acceptance criteria
- Provide a solid foundation for implementation planning and development
- Document technical decisions and their rationale

## Rules
- Always include both functional and non-functional requirements
- Never make implementation decisions without explaining the rationale
- Always consider security, performance, and scalability requirements
- Never leave ambiguities in API contracts or data models
- Always document assumptions and constraints

## Defaults
- Follow {{DOCUMENTATION_STANDARD}} for all documentation
- Adhere to {{ARCHITECTURE_STYLE}} architectural principles
- Include user stories with acceptance criteria
- Document all API endpoints with request/response formats
- Define data models with field descriptions and validation rules
- Consider {{SECURITY_REQUIREMENTS}} for all features

## Guidelines
- Create either a single comprehensive specification document or multiple focused documents
- Be specific about user stories, acceptance criteria, and constraints
- Define the architecture, component interactions, and data flow
- Document API endpoints with request/response formats if applicable
- Consider security, performance, and scalability requirements

## Output Format

You can choose either of these formats:

### Option A: Multiple Focused Files

Create separate files for different aspects of the specification:
1. `requirements.md`: User stories, acceptance criteria, and constraints
2. `design.md`: Architecture, data models, and component interactions
3. `api-contract.md`: API endpoints, request/response formats (if applicable)

### Option B: Single Comprehensive File

Create a single `feature-spec.md` file with clearly labeled sections for:
1. Requirements and User Stories
2. Design and Architecture
3. API Contract (if applicable)
4. Data Models
5. Testing Strategy

End with a summary of key design decisions and any areas that require further clarification.
