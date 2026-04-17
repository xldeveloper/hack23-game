# GitHub Copilot Agent Skills

Structured, reusable patterns for GitHub Copilot coding agent. Skills are automatically activated when your prompt matches their domain.

## Available Skills

| Skill | Description | Used By |
|---|---|---|
| 🔒 [security-by-design](security-by-design/SKILL.md) | OWASP Top 10, defense-in-depth, secure coding | security-specialist, all agents |
| 📋 [isms-compliance](isms-compliance/SKILL.md) | ISO 27001, NIST CSF, CIS Controls, Hack23 ISMS | security-specialist, documentation-writer |
| 🎮 [react-threejs-game](react-threejs-game/SKILL.md) | @react-three/fiber, `useFrame`, 60 fps, disposal | game-developer, test-engineer |
| 🧪 [testing-strategy](testing-strategy/SKILL.md) | Vitest + Cypress + RTL, ≥ 80 % coverage, Three.js mocking | test-engineer, all agents |
| 📝 [documentation-standards](documentation-standards/SKILL.md) | JSDoc, Mermaid, ADRs, C4 models, ISMS citations | documentation-writer, frontend-specialist |
| ⚡ [performance-optimization](performance-optimization/SKILL.md) | React re-renders, 60 fps, bundle size, Lighthouse budgets | game-developer, frontend-specialist |
| 🤖 [ai-augmented-sdlc](ai-augmented-sdlc/SKILL.md) | Copilot / MCP governance, change control, audit trail | all agents (mandatory) |

## How Skills Work

- **Automatic** — Copilot loads relevant skills based on the prompt + file context
- **Rule-based** — each skill defines clear, enforceable rules
- **Example-driven** — ✅ correct patterns and ❌ anti-patterns
- **Policy-linked** — security skills cite Hack23 ISMS policies

## Hierarchy

| Type | Scope | Location |
|---|---|---|
| Custom Instructions | Project defaults | [`.github/copilot-instructions.md`](../copilot-instructions.md) |
| Agents | Domain experts | [`.github/agents/`](../agents/) |
| Skills | Reusable patterns | `.github/skills/` |

## ISMS Policy Coverage Per Skill

| Skill | Primary policies |
|---|---|
| security-by-design | [ISP](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md), [SDP](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md), [Threat Modeling](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Threat_Modeling.md) |
| isms-compliance | All ISMS-PUBLIC policies |
| react-threejs-game | [SDP §Phase 2](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) |
| testing-strategy | [SDP §Testing](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md), test data protection |
| documentation-standards | [SDP §Architecture Documentation](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md), [ISP §Transparency](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) |
| performance-optimization | [SDP §Performance](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) |
| ai-augmented-sdlc | [AI Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/AI_Policy.md), [SDP §AI-Augmented Controls](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md), [Change Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Change_Management.md) |

## Skill Format

```text
.github/skills/<skill-name>/
└── SKILL.md    # YAML frontmatter + Context + Rules + Examples + Checklist
```

## Resources

- [Custom Agents](../agents/README.md)
- [Copilot Instructions](../copilot-instructions.md)
- [ISMS Policy Mapping](../../docs/ISMS_POLICY_MAPPING.md)
- [About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Hack23 ISMS-PUBLIC](https://github.com/Hack23/ISMS-PUBLIC)
