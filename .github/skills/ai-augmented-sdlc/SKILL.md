---
name: ai-augmented-sdlc
description: AI-assisted development governance — Copilot custom agents, MCP servers, change control, audit trail — per Hack23 ISMS AI Policy
license: MIT
---

# AI-Augmented SDLC Skill

## Context

Applies whenever GitHub Copilot, custom agents, MCP servers, or any LLM-based tool participates in a code, docs, or configuration change.

Codifies the requirements from:

- [Information Security Policy — AI-First Operations Governance](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)
- [Secure Development Policy — AI-Augmented Development Controls](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- [AI Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/AI_Policy.md)
- [Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md)

## Rules

1. **AI outputs are proposals, not authority** — every AI-generated change needs human review before merge
2. **No autonomous deployment** — AI may not bypass CI gates, branch protection, signing, or approvals
3. **Human accountability** — the merging human owns the change regardless of AI assistance
4. **Document AI assistance** — PR descriptions note the agent/skill used (e.g., "assisted by Copilot `frontend-specialist`")
5. **Security gates unchanged or tightened** — AI may never weaken linting, CodeQL, tests, or branch protection
6. **Least-privilege tooling** — each agent uses tools appropriate to its role; widening is a governed change
7. **Curator-agent changes are Normal Changes** — edits to `.github/agents/*.md`, `.github/skills/*/SKILL.md`, `.github/copilot-mcp*.json`, and `.github/workflows/copilot-setup-steps.yml` require CEO or security-owner approval
8. **MCP governance** — MCP server config uses `secrets.COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` (never hard-coded tokens) and is reviewed like other security-sensitive code
9. **Audit trail** — every agent action is captured in PRs, commits, CI runs, and issue history
10. **Risk assessment for capability expansion** — new MCP servers, new integrations, broader tool scopes need a documented risk note
11. **Policy-cited commits** — security-relevant AI-generated changes cite the applicable ISMS policy
12. **No secret leakage through prompts** — never paste credentials, tokens, PII, or production data into prompts or shared memory
13. **Avoid data-dependency leaks** — do not accept AI output that fabricates API signatures, options, URLs, or dependencies

## Agent Tiers (per ISP §AI-First Operations)

| Tier | Purpose |
|---|---|
| **Curator-agent** | Maintains agent + MCP + workflow configuration |
| **Task agents** | Product analysis, issue creation, ISMS mapping |
| **Specialist agents** | Domain-specific implementation (game / UI / test / security / docs) |

## Copilot Coding-Agent Tool Catalogue

| Tool | Purpose |
|---|---|
| `assign_copilot_to_issue(owner, repo, issue_number, [base_ref], [custom_instructions])` | Start autonomous implementation on an issue |
| `create_pull_request_with_copilot(owner, repo, title, body, [base_ref], [custom_agent])` | Create a PR where Copilot implements changes |
| `get_copilot_job_status(owner, repo, id)` | Track agent job progress / completion |

### `base_ref` use cases

| Scenario | `base_ref` |
|---|---|
| Feature branch | `feature/new-auth` |
| Stacked PR | `copilot/issue-123` |
| Release branch | `release/v2.0` |

### `custom_instructions` template

```text
- Follow existing patterns in src/components/
- Add tests (≥ 80 % coverage, ≥ 95 % on security paths)
- Cite ISMS: Secure Development Policy §Phase 3 in the PR body
- Do not add new dependencies without `npm audit` + license check
```

## Review Checklist for AI-Assisted Changes

- [ ] PR description documents the agent/skill used
- [ ] Diff reviewed for fabricated imports, APIs, URLs
- [ ] No hardcoded secrets, tokens, or PII introduced
- [ ] No weakening of validation, encoding, auth, or authorization
- [ ] No new network calls or `eval`/`Function` usage without justification
- [ ] Tests added; coverage thresholds met
- [ ] ISMS policy cited where applicable
- [ ] Dependencies audited + licensed; SBOM still valid
- [ ] CodeQL / Scorecard / Dependabot remain green

## Change Management for Agent / MCP / Workflow Edits

1. Open an issue describing the capability and risk
2. Draft the change on a dedicated branch
3. Reviewer verifies: least-privilege, secret wiring, policy citations, audit trail
4. CEO or designated security owner approves
5. Merge behind branch protection; monitor agent behavior after merge

## Anti-Patterns

- ❌ Merging an AI PR without reading the diff
- ❌ Disabling a failing security test to make CI green
- ❌ Adding a new dependency the agent "said was fine"
- ❌ Pasting secrets or production data into a prompt or agent memory
- ❌ Silently widening a tool scope (e.g., `tools: ["*"]` for a specialist who previously had a narrow set) without review

## Remember

AI accelerates delivery; **humans** remain accountable for security, quality, and compliance. Every change passes the same gates regardless of authorship. Policy citations, audit trail, and least-privilege are non-negotiable.
