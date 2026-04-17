---
name: isms-compliance
description: Hack23 ISMS alignment — ISO 27001:2022, NIST CSF 2.0, CIS Controls v8.1, GDPR, NIS2, EU CRA — with policy citations
license: MIT
---

# ISMS Compliance Skill

## Context

Applies when adding features, dependencies, or security controls; editing security code; documenting architecture; touching CI/CD; or handling any sensitive data.

All practices align with [Hack23 AB's ISMS-PUBLIC](https://github.com/Hack23/ISMS-PUBLIC), implementing ISO 27001:2022, NIST CSF 2.0, CIS Controls v8.1, GDPR, NIS2, and EU CRA readiness.

## Policy Catalogue (cite the one that applies)

| Concern | Policy |
|---|---|
| Overarching governance / incident / transparency | [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) |
| SDLC / CI / testing / deployment / threat modeling | [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) |
| Dependencies / licenses / SBOM / supply chain | [Open Source Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Open_Source_Policy.md) |
| Auth / identity / access | [Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Access_Control_Policy.md) |
| Encryption / keys / hashing | [Cryptography Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Cryptography_Policy.md) |
| Data handling / classification | [Data Classification Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Data_Classification_Policy.md) |
| Personal data / GDPR | [Privacy Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Privacy_Policy.md) |
| STRIDE / abuse cases / MITRE ATT&CK | [Threat Modeling](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md) |
| Vulnerability triage + patch SLAs | [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) |
| Copilot / LLM / MCP governance | [AI Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/AI_Policy.md) |
| Agent / MCP / workflow edits | [Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) |
| BCP / DR / backup | Business Continuity / Disaster Recovery / Backup Recovery |

## Rules

1. **Reference ISMS Policies** — security-relevant code, docs, and PRs must cite the applicable policy (e.g., "ISMS: SDP §Phase 3")
2. **Defense in Depth** — stack validation + sanitization + encoding + CSP + headers
3. **Document Decisions** — ADRs and threat models cite ISMS policies
4. **Verify Dependencies** — `npm audit` + `npm run test:licenses` + GitHub Advisory DB before adding
5. **Security Headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options (see `SECURITY_HEADERS.md`)
6. **Secure Defaults** — unused features off; risky options explicit opt-in
7. **Least Privilege** — minimum token scopes, minimum workflow permissions, minimum tool scopes
8. **Validate All Inputs** — never trust user input (validate / sanitize / encode)
9. **Encrypt Sensitive Data** — AES-256 at rest, TLS 1.3+ in transit, SHA-256+ hashing
10. **Log Security Events** — auth, authorization failures, security-relevant events; never secrets/PII
11. **Secure SDLC** — security baked into design → dev → test → deploy → operate
12. **Test Security Controls** — ≥ 95 % coverage on security-sensitive paths
13. **Patch within SLA** — Critical ≤ 7 d, High ≤ 30 d, Medium ≤ 90 d
14. **No Production Data in Tests** — anonymize / synthesize

## Secure SDLC Phase Gates (per SDP)

| Phase | Gate |
|---|---|
| Plan & Design | Classification (CIA triad) + threat model + policy links |
| Develop | OWASP-aligned, typed, no hardcoded secrets, least-privilege tokens |
| Test | CodeQL clean, `npm audit` clean, coverage ≥ 80 / 70 (≥ 95 % security) |
| Deploy | SHA-pinned Actions, SLSA L3 attestations, SBOM + SBOMQS ≥ 7.0 |
| Operate | Scorecard ≥ 8.0, Dependabot green, patch SLAs honored, incident drills |

## Compliance Framework Mapping

**ISO 27001:2022** — A.5.23, A.5.30, A.8.25, A.8.28, A.8.29, A.8.30, A.8.31, A.8.32

**NIST CSF 2.0** — GV (govern), ID.AM, PR.DS, PR.IR, DE.CM, RS.AN, RC.RP

**CIS Controls v8.1** — 2, 3, 4, 6, 7, 8, 11, 16, 18

**EU CRA** — SBOM, CVE handling, security updates, conformity self-assessment

## Example: ISMS-Cited Code

```typescript
/**
 * Persist the high score.
 * ISMS: Secure Development Policy §Phase 2 — Secure Coding (input validation)
 * ISMS: Data Classification Policy — local-only, non-PII
 * Compliance: ISO 27001:2022 A.8.28, NIST CSF PR.DS-1
 */
export function saveHighScore(score: number): void {
  if (!Number.isFinite(score) || score < 0) {
    throw new RangeError('Invalid score value');
  }
  localStorage.setItem('highScore', String(Math.floor(score)));
}
```

## Validation Checklist

- [ ] Applicable ISMS policy cited in code, commit, or PR description
- [ ] Threat model reviewed if attack surface changed (STRIDE)
- [ ] Dependency audit clean; licenses approved
- [ ] Security coverage ≥ 95 % on changed security code
- [ ] CodeQL + Scorecard + Dependabot status green
- [ ] No PII / production data in code, fixtures, or tests
- [ ] Docs updated (README / `ISMS_POLICY_MAPPING.md` / SECURITY.md as applicable)
