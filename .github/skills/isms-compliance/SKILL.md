---
name: isms-compliance
description: ISMS policy alignment and compliance verification for Hack23 AB security standards (ISO 27001, NIST CSF 2.0, CIS Controls v8.1)
license: MIT
---

# ISMS Compliance Skill

## Context
Applies when adding features, dependencies, or security controls; documenting security practices; conducting reviews; or handling sensitive data.

All security practices align with [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC) implementing ISO 27001:2022, NIST CSF 2.0, and CIS Controls v8.1.

## Rules

1. **Reference ISMS Policies**: Security code changes must cite applicable policies in comments/docs
2. **Defense in Depth**: Multiple control layers (validation + sanitization + CSP + encoding)
3. **Document Decisions**: Security architecture decisions need ISMS policy references
4. **Verify Dependencies**: Check new deps for vulnerabilities before adding
5. **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
6. **Secure Defaults**: All configs secure by default, unused features disabled
7. **Least Privilege**: Minimal permissions for functionality
8. **Validate All Inputs**: Never trust user input — validate, sanitize, encode
9. **Encrypt Sensitive Data**: AES-256 at rest, TLS 1.3+ in transit
10. **Log Security Events**: Auth attempts, authorization failures, security events
11. **Secure SDLC**: Security in design, development, testing, deployment
12. **Test Security Controls**: Tests for auth, authorization, validation, encryption

## Key Policies

- [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
- [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md)
- [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md)

## Example

### ✅ ISMS Policy Reference in Code

```typescript
/**
 * Game state persistence
 * ISMS: Secure Development Policy — input validation
 * Compliance: ISO 27001:2022 A.8.28
 */
export function saveHighScore(score: number): void {
  if (!Number.isFinite(score) || score < 0) {
    throw new Error('Invalid score value');
  }
  localStorage.setItem('highScore', String(Math.floor(score)));
}
```
