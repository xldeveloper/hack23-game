---
name: security-by-design
description: Defense-in-depth security principles — OWASP Top 10 prevention, input validation, secure error handling, encryption, least privilege
license: MIT
---

# Security-by-Design Skill

## Context

Applies to **all** code handling user input, state persistence, external assets, audio, networking, authentication, authorization, or sensitive configuration. Also applies to infrastructure config, CI/CD pipelines, and security-critical changes.

Aligned with [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC) — see
[Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) and
[Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md).

## Rules

1. **Assume Breach** — design so a single failure cannot cascade; limit blast radius
2. **Defense in Depth** — multiple independent layers (validate → sanitize → encode → CSP)
3. **Least Privilege** — minimum permissions for tokens, workflows, actions, agents
4. **Fail Securely** — fail-closed; generic error to users, detailed log server-side
5. **Never Trust Input** — validate, sanitize, and encode every external value (client *and* server)
6. **Secure by Default** — disable unused features; explicit opt-in for risky ones
7. **Encrypt Everything Sensitive** — AES-256 at rest, TLS 1.3+ in transit, SHA-256+ hashing
8. **No Secrets in Code** — env vars and `secrets.*` only; rotate on exposure
9. **Audit Everything** — log auth, authorization, security events; never log secrets/PII
10. **Minimize Attack Surface** — remove dead features, unused endpoints, unused deps
11. **Test Security Controls** — cover happy + failure paths (≥ 95 % coverage on security code)
12. **Patch Promptly** — Critical ≤ 7 d, High ≤ 30 d, Medium ≤ 90 d (Vulnerability Management)
13. **Document Decisions** — threat models, ADRs, ISMS policy citations in comments/PRs

## OWASP Top 10 Quick Mapping

| OWASP 2021 | Enforcement in this project |
|---|---|
| A01 Broken Access Control | No client-side authorization; render-based capabilities only |
| A02 Cryptographic Failures | TLS only, no custom crypto, no plaintext storage of sensitive data |
| A03 Injection | Validate + encode; never `dangerouslySetInnerHTML` without DOMPurify |
| A04 Insecure Design | Threat-model per Threat Modeling Policy; STRIDE for new features |
| A05 Security Misconfiguration | Security headers (`SECURITY_HEADERS.md`), secure defaults |
| A06 Vulnerable Components | `npm audit`, Dependabot, license gate, SBOMQS ≥ 7.0 |
| A07 Identification/Auth Failures | Not applicable (no user auth in this template) — document when added |
| A08 Software/Data Integrity | SLSA L3 attestations, SHA-pinned Actions, signed releases |
| A09 Logging/Monitoring Failures | GitHub audit + Scorecard + CodeQL alerts reviewed |
| A10 SSRF | Avoid arbitrary URL fetches from untrusted input |

## Compliance Controls

- **ISO 27001:2022** — A.8.25 secure development, A.8.28 secure coding, A.8.29 security testing
- **NIST CSF 2.0** — PROTECT (PR.DS, PR.PS, PR.IR), DETECT (DE.CM), RESPOND (RS.AN)
- **CIS Controls v8.1** — 2 (software inventory), 16 (app security), 18 (pen testing)

## Examples

### ✅ Input Validation + Encoding

```typescript
/**
 * Validate plain-text user input.
 * ISMS: Secure Development Policy §Phase 2 — Secure Coding
 */
function validatePlainText(input: unknown, max = 100): string {
  if (typeof input !== 'string') throw new TypeError('Input must be a string');
  const trimmed = input.trim();
  if (trimmed.length === 0) throw new RangeError('Input is required');
  if (trimmed.length > max) throw new RangeError('Input too long');
  return trimmed;
}

/** Encode untrusted text before inserting it into HTML. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// For rich HTML use DOMPurify — never ad-hoc stripping.
```

### ✅ Secure Error Handling

```typescript
function handleRequest(): { success?: true; error?: string } {
  try {
    // do work
    return { success: true };
  } catch {
    // In the browser, avoid console.error with raw details — users can see it.
    // Send structured telemetry to restricted server logs instead.
    return { error: 'An error occurred. Please try again.' };
  }
}
```

### ✅ Numeric / Boundary Validation

```typescript
/** ISMS: SDP §Phase 2 — Input Validation */
export function saveHighScore(score: number): void {
  if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
    throw new RangeError('Invalid score value');
  }
  localStorage.setItem('highScore', String(Math.floor(score)));
}
```

### ❌ Anti-Patterns

```typescript
// BAD: hardcoded secret
const API_KEY = "<API_KEY>";

// BAD: leaking stack trace to user
function handleError(e: Error) { return { error: e.stack }; }

// BAD: no input validation — XSS
document.body.innerHTML = userContent;

// BAD: trusting typeof-less JSON.parse output
const data = JSON.parse(input) as User; // no validation/narrowing!
```

## Validation Checklist

- [ ] Every external input is validated + typed + bounded
- [ ] Every output to HTML is encoded (or DOMPurify-sanitized)
- [ ] No secrets/credentials/tokens in code, logs, or error messages
- [ ] Errors fail closed; user message is generic
- [ ] Security-sensitive paths have ≥ 95 % test coverage
- [ ] New dependencies passed `npm audit` + license check
- [ ] Policy cited in comments/PR for security-relevant changes
- [ ] Threat model updated if attack surface changed
