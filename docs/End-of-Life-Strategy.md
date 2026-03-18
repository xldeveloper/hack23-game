# Node.js End-of-Life Strategy

## Overview

This document defines the strategy for managing Node.js runtime versions in the **game** project, ensuring we stay on actively maintained releases and plan upgrades proactively. All version decisions align with the [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC).

---

## Current Status (March 2026)

| Node.js | Release Date | Status | Bug Fixes Until | Security Fixes Until |
|---------|-------------|--------|-----------------|----------------------|
| **25 (Current)** | Oct 15, 2025 | ✅ **Active — in use** | Apr 1, 2026 | Jun 1, 2026 |
| 24 (LTS – Krypton) | May 2025 | Active LTS | Oct 2026 | Apr 28, 2028 |
| 22 (LTS – Jod) | Apr 2024 | Maintenance | Oct 2025 | Apr 30, 2027 |
| 20 (LTS – Iron) | Apr 2023 | Maintenance | Oct 2024 | Apr 30, 2026 |

> **Note:** Node.js 25 is an odd-numbered "Current" release, meaning it does **not** receive LTS status. It is supported for approximately 6 months before reaching end-of-life. We use it to validate readiness for Node.js 26.

---

## Node.js Release Cadence

The OpenJS Foundation follows a predictable release schedule:

- **Every April** — A new **even-numbered** major version is published as "Current"; odd-numbered Current versions reach EOL
- **Every October** — The April even-numbered release graduates to "Active LTS", and a new odd-numbered major is published as "Current"
- **Active LTS** lasts 12 months; **Maintenance LTS** lasts an additional 18 months

```
Version  | Release   | Current  | Active LTS    | Maintenance LTS | EOL
---------|-----------|----------|---------------|-----------------|----------
Node 20  | Apr 2023  | ~6 mo    | Oct 2023      | Oct 2024        | Apr 2026
Node 22  | Apr 2024  | ~6 mo    | Oct 2024      | Oct 2025        | Apr 2027
Node 24  | May 2025  | ~6 mo    | Oct 2025      | Oct 2026        | Apr 2028
Node 25  | Oct 2025  | ~6 mo    | N/A (odd)     | N/A             | Jun 2026
Node 26  | Apr 2026  | ~6 mo    | Oct 2026      | Oct 2027        | Apr 2029
Node 27  | Oct 2026  | ~6 mo    | N/A (odd)     | N/A             | Jun 2027
Node 28  | Apr 2027  | ~6 mo    | Oct 2027      | Oct 2028        | Apr 2030
```

---

## Version Upgrade Policy

### Principles

1. **Never run end-of-life Node.js in CI/CD or production** — upgrade within 30 days of EOL.
2. **Track even-numbered LTS releases for stability** — use Current (odd) releases for forward compatibility testing.
3. **Upgrade CI/CD and dev containers together** — single PR, all-or-nothing.
4. **Test on the next version before it is released** — reduce upgrade friction.

### Upgrade Triggers

| Trigger | Action | Timeline |
|---------|--------|----------|
| New major version release | Update `test-and-report-latest-node.yml` to new version | Within 1 week of release |
| Current version reaches EOL | Upgrade all workflows to next version | Before EOL date |
| LTS version graduates | Evaluate adoption for main workflow | Within 2 weeks |
| Security advisory | Apply patch or upgrade immediately | Within 24 hours |

---

## Upcoming Milestones

### ⚠️ Immediate — Node.js 25 End of Bug Fixes: April 1, 2026

Node.js 25 receives its final bug-fix release around **April 1, 2026**. Security-only patches continue until **June 1, 2026**.

Action required: Upgrade all CI/CD workflows to Node.js 26 immediately after its release in April 2026. See [FUTURE_WORKFLOWS.md](./FUTURE_WORKFLOWS.md) for the detailed upgrade plan.

### 🔜 Upcoming — Node.js 26 Release: April 2026

Node.js 26 is expected in **April 2026**. It will:

- Enter "Current" status immediately upon release
- Graduate to **Active LTS in October 2026**
- Be maintained (Active + Maintenance) until **April 2029**

**Planned upgrade:** Within **2 weeks** of the Node.js 26 release. See [FUTURE_WORKFLOWS.md](./FUTURE_WORKFLOWS.md).

### 📅 Future — Node.js 26 Active LTS: October 2026

When Node.js 26 enters Active LTS, it becomes the recommended production runtime. At this point:

- Node.js 24 transitions from Active LTS to Maintenance LTS
- The primary workflow (`test-and-report.yml`) should target Node.js 26

### 📅 Future — Node.js 24 EOL: April 2028

Node.js 24 reaches end-of-life in April 2028. By this date, all workflows and devcontainers must have moved to Node.js 26 or later.

---

## Version Matrix

The project maintains two parallel test workflows:

| Workflow | Purpose | Current Node Version |
|----------|---------|----------------------|
| `test-and-report.yml` | Primary CI — stable, production-ready | **25** |
| `test-and-report-latest-node.yml` | Forward-compat — tests next version | **25** (will become 26) |

When a new Node.js version is released:
1. Update `test-and-report-latest-node.yml` to the new version first
2. Once validated (typically within the same sprint), update `test-and-report.yml`
3. Update all other workflows (`release.yml`, `codeql.yml`, copilot setup) together

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Security vulnerability in EOL Node.js | High (after EOL) | Critical | Upgrade before EOL |
| Incompatible npm packages | Medium | High | Run tests on new version early |
| Breaking API changes | Low | High | Test on Current release before it becomes primary |
| CI/CD downtime during upgrade | Low | Medium | Upgrade in dedicated PR with rollback plan |

---

## References

- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Node.js End-of-Life Dates — endoflife.date](https://endoflife.date/nodejs)
- [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC)
- [WORKFLOWS.md](./WORKFLOWS.md) — Current CI/CD workflow documentation
- [FUTURE_WORKFLOWS.md](./FUTURE_WORKFLOWS.md) — Planned Node.js 26 upgrade
