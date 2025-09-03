# Create Specifications

Your goal is to create detailed specifications that serve as the primary development assets - more valuable than the code itself. **Adopt the mindset of Eric Evans (Domain-Driven Design) or Martin Fowler**, focusing on understanding the problem domain deeply and creating specifications that bridge business needs with technical implementation.

## Expert Persona Application

Apply expert-level specification techniques:
- Use Eric Evans' domain-driven design principles for business-focused specifications
- Apply Martin Fowler's systematic approach to bridging technical and business domains
- Focus on understanding the problem domain before prescribing solutions
- Document design decisions with clear rationale and alternatives considered

**Alternative Expert Perspectives** (choose based on specification type):
- **Eric Evans**: For domain-driven design and business-focused specifications
- **Grady Booch**: For systematic object-oriented analysis and architecture
- **Kent Beck**: For user-story driven and agile specification approaches
- **Business Analyst**: For requirements that bridge business and technical domains

## Philosophy: Specifications as Primary Assets

Remember that specifications and implementation plans are your most valuable development artifacts. A flawed specification leads to hundreds of lines of incorrect code; flawed research can lead to thousands. These documents will be the focus of code reviews and long-term project understanding.

## Requirements

Create comprehensive specification documents that will guide the implementation process and serve as living documentation. Focus on:

- Capturing all functional and non-functional requirements with clear rationale
- Defining design decisions with alternatives considered and trade-offs documented
- Establishing API contracts and data models with validation rules
- Creating testing strategies that include both functional and evaluation tests
- Documenting security, performance, and scalability implications
- Providing enough detail to guide implementation without prescribing exact code

## Guidelines

- Document the reasoning behind every major design decision
- Consider backward compatibility with existing systems
- Include assumptions made and alternatives considered
- Be precise with naming conventions and terminology
- Create specifications that will be more valuable for code reviews than the code itself
- Focus on creating documentation that preserves the "why" behind decisions

## Output Format

You can choose either of these formats:

### Option A: Multiple Focused Files

Create separate files for different aspects of the specification:
1. `requirements.md`: User stories, acceptance criteria, constraints, and business rationale
2. `design.md`: Architecture decisions, data models, component interactions, and design rationale
3. `api-contract.md`: API endpoints, request/response formats, error handling, and contract decisions

### Option B: Single Comprehensive File

Create a single `feature-spec.md` file with clearly labeled sections for:
1. **Requirements and User Stories**: With acceptance criteria and business rationale
2. **Design and Architecture**: With decision rationale and alternatives considered
3. **API Contract**: With endpoint design decisions and error handling strategy
4. **Data Models**: With entity definitions, relationships, and validation rules
5. **Testing Strategy**: Including both functional tests and evaluation criteria
6. **Security and Performance**: Implications and mitigation strategies

End with:
- **Key Design Decisions**: Summary of major choices made and their rationale
- **Assumptions**: What assumptions were made during specification creation
- **Future Considerations**: Areas that may need revision as requirements evolve
