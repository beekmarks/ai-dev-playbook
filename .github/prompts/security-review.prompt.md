# Security Review

Your goal is to analyze code for potential security vulnerabilities and suggest fixes.

## Requirements

- Identify common security vulnerabilities in the provided code
- Provide clear explanations of each risk
- Suggest specific fixes or mitigations
- Prioritize findings based on severity

## Focus Areas

Look for common vulnerabilities, including but not limited to:
- Injection flaws (SQL, Command, etc.)
- Cross-Site Scripting (XSS)
- Insecure Deserialization
- Broken Authentication/Access Control
- Hardcoded secrets, API keys, or credentials
- Use of insecure libraries or functions
- Insufficient input validation
- Improper error handling that leaks sensitive information

## Output Format

For each vulnerability found, provide:
1. The name of the vulnerability
2. The line number(s) where it occurs
3. A brief explanation of the risk
4. A recommendation on how to fix it
5. Severity rating (Critical, High, Medium, Low)

If no vulnerabilities are found, state that clearly and explain what security best practices are already being followed.
