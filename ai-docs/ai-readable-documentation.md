# Creating AI-Readable Documentation

As AI agents become more integrated into the development process, documentation serves both human and AI audiences. This guide provides patterns for creating documentation that serves both purposes effectively.

## Document Structure

### Metadata Section
Begin each document with a metadata section:

```yaml
---
title: "Component Name"
purpose: "Brief description of the component's purpose"
lastUpdated: "YYYY-MM-DD"
authors: ["Name1", "Name2"]
relatedComponents: ["ComponentA", "ComponentB"]
status: "stable | experimental | deprecated"
---
```

### Consistent Headings
Use a consistent heading hierarchy:

```markdown
# Component Name (H1)
## Overview (H2)
### Key Features (H3)
#### Feature Details (H4)
```

### Term Definitions
Define important terms explicitly:

```markdown
## Terminology

**Term1**: Definition of the term in plain language.

**Term2**: Definition with `code references` when appropriate.
```

## Code Examples

### Annotated Examples
Provide examples with annotations:

```markdown
```javascript
// This function validates user input
function validateInput(input) {
  // Check for empty input first
  if (!input || input.trim() === '') {
    return { valid: false, error: 'Input cannot be empty' };
  }
  
  // Additional validation logic
  // ...
  
  return { valid: true };
}
```
```

### Usage Patterns
Show common usage patterns:

```markdown
## Usage Patterns

### Basic Usage
```javascript
import { Component } from './component';

const instance = new Component();
instance.method();
```

### Advanced Configuration
```javascript
import { Component } from './component';

const instance = new Component({
  option1: 'value',
  option2: true
});
```
```

## Decision Documentation

### Decision Records
Document important decisions:

```markdown
## Decision Record: Authentication Approach

### Context
We needed to choose an authentication strategy for the API.

### Options Considered
1. **JWT-based authentication**: Stateless, scalable, but tokens can't be invalidated
2. **Session-based authentication**: Can be invalidated, but requires server-side storage
3. **OAuth 2.0**: Comprehensive but complex to implement

### Decision
We selected JWT-based authentication because:
- Our microservice architecture benefits from stateless authentication
- Performance is a priority for this API
- We implemented a short expiry time to mitigate the inability to invalidate tokens

### Consequences
- Positive: Improved performance, simplified scaling
- Negative: Need to implement token refresh flow, can't immediately invalidate sessions
```

## AI-Specific Patterns

### Structured Data
Use structured formats for complex data:

```markdown
## API Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|--------------|
| `/users` | GET | List all users | Yes |
| `/users/:id` | GET | Get user details | Yes |
| `/auth/login` | POST | Authenticate user | No |
```

### Relationship Maps
Explicitly document relationships:

```markdown
## Component Relationships

ComponentA → depends on → ComponentB
ComponentB → implements → InterfaceC
ComponentD → extends → ComponentA
```

### Version History
Track changes in a structured format:

```markdown
## Version History

| Version | Date | Changes | Breaking |
|---------|------|---------|----------|
| 2.1.0 | 2025-07-15 | Added pagination support | No |
| 2.0.0 | 2025-06-01 | Refactored API response format | Yes |
| 1.0.0 | 2025-05-10 | Initial release | - |
```
