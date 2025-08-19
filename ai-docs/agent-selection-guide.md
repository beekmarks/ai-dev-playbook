# Agent Selection Guide

Choosing the right agent for each task is crucial for effective AI-assisted development. This guide helps you select the appropriate agent based on your current needs.

## Decision Tree for Agent Selection

```
Start
├── Need to define what to build? → Specification Developer Agent
│   └── Need high-level requirements only? → Use @prompt create-specifications
├── Have specifications but need implementation steps? → Planner Agent
│   └── Need quick, high-level steps only? → Use @prompt plan-feature
├── Need time and complexity estimates? → Estimator Agent
│   └── Need quick estimates only? → Use @prompt estimate-work
├── Ready to write code?
│   ├── Interactive development session? → Interactive Coder Agent
│   ├── Automated workflow? → Automated Coder Agent
│   └── Quick implementation? → Use @prompt implement-code
├── Need tests?
│   ├── Comprehensive test suite? → Tester Agent
│   └── Basic tests only? → Use @prompt write-tests
├── Need to improve existing code? → Refactor Agent
│   └── Simple improvements only? → Use @prompt refactor-code
├── Need documentation? → Documenter Agent
│   └── Basic documentation only? → Use @prompt document-code
├── Need security review? → Security Reviewer Agent
│   └── Basic security check only? → Use @prompt security-review
└── Completed feature ready for archiving? → Archiver Agent
    └── Simple archiving only? → Use @prompt archive-work
```

## Comparison: Traditional Workflow vs. GitHub Copilot Native

| Task Type | Traditional Workflow | GitHub Copilot Native | Best For |
|-----------|---------------------|----------------------|----------|
| Quick prototyping | ❌ Too structured | ✅ @prompt | Exploration, simple features |
| Complex features | ✅ Full agent workflow | ❌ Less structured | Production code, team collaboration |
| Code reviews | ✅ Review variant agents | ⚠️ Limited support | Thorough code analysis |
| Documentation | ✅ Documenter Agent | ✅ @prompt document-code | Both approaches work well |
| Security checks | ✅ Security Reviewer Agent | ⚠️ Basic checks only | Critical security reviews |

## When to Use Specialized Agent Variants

| Variant | Use When | Avoid When |
|---------|----------|------------|
| Interactive | Learning new concepts, complex implementations | Routine tasks, time constraints |
| Automated | CI/CD pipelines, batch processing | Need for explanations, learning |
| Review | Evaluating existing code, refactoring | Generating new code |
