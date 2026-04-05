# GitHub Copilot Agent Skills

Structured, reusable patterns for GitHub Copilot coding agent. Skills are automatically activated when your prompt matches their domain.

## Available Skills

| Skill | Description | Used By |
|-------|-------------|---------|
| 🔒 **[security-by-design](security-by-design/SKILL.md)** | Defense-in-depth, OWASP, secure coding | security-specialist, all agents |
| 📋 **[isms-compliance](isms-compliance/SKILL.md)** | ISO 27001, NIST CSF, CIS Controls alignment | security-specialist, documentation-writer |
| 🎮 **[react-threejs-game](react-threejs-game/SKILL.md)** | Three.js patterns, useFrame, 60fps | game-developer, test-engineer |
| 🧪 **[testing-strategy](testing-strategy/SKILL.md)** | Vitest, Cypress, 80%+ coverage, mocking | test-engineer, all agents |
| 📝 **[documentation-standards](documentation-standards/SKILL.md)** | JSDoc, Mermaid diagrams, ISMS docs | documentation-writer, frontend-specialist |
| ⚡ **[performance-optimization](performance-optimization/SKILL.md)** | React re-renders, 60fps, bundle size | game-developer, frontend-specialist |

## How Skills Work

- **Automatic**: Copilot loads relevant skills based on context
- **Rule-based**: Each skill defines clear, enforceable rules
- **Example-driven**: Correct patterns and anti-patterns included

## Hierarchy

| Type | Scope | Location |
|------|-------|----------|
| **Custom Instructions** | Project defaults | `.github/copilot-instructions.md` |
| **Agents** | Domain experts | `.github/agents/` |
| **Skills** | Reusable patterns | `.github/skills/` |

## Skill Format

```
.github/skills/skill-name/
└── SKILL.md    # YAML frontmatter + Context + Rules + Examples
```

## Resources

- [Custom Agents](../agents/README.md)
- [Copilot Instructions](../copilot-instructions.md)
- [About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Hack23 ISMS](https://github.com/Hack23/ISMS-PUBLIC)
