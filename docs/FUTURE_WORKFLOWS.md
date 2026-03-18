# Future Workflows: Node.js 26 Upgrade Plan

## Overview

This document describes the planned upgrade of all CI/CD workflows, devcontainer configuration, and documentation from **Node.js 25** to **Node.js 26**.

Node.js 26 is expected in **April 2026**. This upgrade plan is designed to be executed immediately after the official Node.js 26 release.

---

## Node.js 26 Release Facts

| Attribute | Detail |
|-----------|--------|
| **Expected release** | April 2026 |
| **Initial status** | Current |
| **LTS graduation** | October 2026 |
| **Active LTS until** | October 2027 |
| **End of Maintenance** | April 2029 |
| **Why upgrade** | Node.js 25 bug fixes end April 1, 2026; security fixes end June 1, 2026 |

Node.js 26 is an even-numbered release and will become **Long-Term Support (LTS)** in October 2026. Adopting it early gives us:

- Forward compatibility validation before broad ecosystem adoption
- Alignment with the upcoming LTS baseline
- Coverage of the ~6-month "Current" phase before LTS promotion

---

## Upgrade Checklist

When Node.js 26 is officially released, execute the following steps in a single PR:

### Phase 1 — Core Configuration (Day 1)

- [ ] **`package.json`** — Update `engines.node` from `>=25` to `>=26`
- [ ] **`.devcontainer/devcontainer.json`** — Update image from `javascript-node:25-trixie` to `javascript-node:26-trixie`, and node feature version from `"25"` to `"26"`

### Phase 2 — GitHub Actions Workflows (Day 1)

Update `node-version` from `"25"` to `"26"` in each of the following files:

- [ ] **`.github/workflows/test-and-report.yml`** — 4 occurrences (prepare, build-validation, unit-tests, e2e-tests)
- [ ] **`.github/workflows/release.yml`** — 2 occurrences (prepare, build)
- [ ] **`.github/workflows/codeql.yml`** — 1 occurrence (analyze)
- [ ] **`.github/workflows/copilot-setup-steps.yml`** — 1 occurrence
- [ ] **`.github/workflows/copilot-setup.yml`** — 1 occurrence in `node-version`, 1 occurrence in setup report text (`Node.js 25` → `Node.js 26`)
- [ ] **`.github/workflows/test-and-report-latest-node.yml`** — 4 occurrences (update to next version beyond 26, e.g., `"27"` once it exists, or keep at `"26"` until 27 ships)

### Phase 3 — Documentation (Day 1–2)

- [ ] **`docs/End-of-Life-Strategy.md`** — Update "Current Status" table, highlight Node.js 26 as active
- [ ] **`docs/WORKFLOWS.md`** — Update "Current Node.js version" and all version references
- [ ] **`docs/FUTURE_WORKFLOWS.md`** (this file) — Update to reflect Node.js 27 as the next planned upgrade
- [ ] **`README.md`** — Update any Node.js version badges or requirements section if present

### Phase 4 — Validation (Day 2)

- [ ] Verify all CI jobs pass on the PR before merging
- [ ] Confirm `test-and-report-latest-node.yml` passes
- [ ] Confirm `release.yml` dry-run succeeds (workflow_dispatch with a pre-release tag)
- [ ] Confirm devcontainer builds successfully with Node.js 26
- [ ] Run `npm audit` to check for any dependency advisories under Node.js 26
- [ ] Check `npm run test:licenses` passes

---

## Sed Commands for Automation

The following commands can be run to perform the bulk of the Node.js 25 → 26 migration:

```bash
# Update all workflow node-version references (double-quoted)
find .github/workflows -name "*.yml" -exec sed -i 's/node-version: "25"/node-version: "26"/g' {} +

# Update copilot-setup.yml (single-quoted)
sed -i "s/node-version: '25'/node-version: '26'/g" .github/workflows/copilot-setup.yml

# Update text references
sed -i 's/Node\.js 25/Node.js 26/g' .github/workflows/copilot-setup.yml

# Update package.json engines field
sed -i 's/"node": ">=25"/"node": ">=26"/' package.json

# Update devcontainer image
sed -i 's/javascript-node:25-trixie/javascript-node:26-trixie/' .devcontainer/devcontainer.json
sed -i 's/"version": "25"/"version": "26"/' .devcontainer/devcontainer.json
```

---

## Compatibility Considerations

### Known Ecosystem Dependencies to Monitor

| Package | Concern | Action |
|---------|---------|--------|
| `vite` | May ship Node.js 26 support update | Check release notes |
| `cypress` | Historically supports new Node quickly | Verify with `npx cypress verify` |
| `vitest` | Tracks Vite compatibility | Validate test suite passes |
| `typescript` | Generally Node-agnostic | No action expected |

### V8 Engine Changes (Node.js 26)

Node.js 26 will ship with a new V8 engine version. This may affect:
- WebAssembly performance
- JavaScript language features (new syntax, built-ins)
- Three.js WebGL rendering path (test via `test-and-report-latest-node.yml` first)

### Breaking API Changes

Review the Node.js 26 migration guide at [nodejs.org/en/blog](https://nodejs.org/en/blog) for:
- Deprecated APIs removed
- Stream and buffer API changes
- Permission model updates
- `node:` prefix enforcement

---

## Rollback Plan

If CI fails after the upgrade to Node.js 26:

1. Revert the PR
2. Re-pin `test-and-report-latest-node.yml` to Node.js 26 and investigate failures
3. File issues against specific failing packages
4. Once all failures are resolved, re-open the upgrade PR

The project can safely remain on Node.js 25 until **June 1, 2026** (security EOL), providing a 2-month window to resolve compatibility issues.

---

## Future Roadmap Beyond Node.js 26

| Target | Expected Date | Action Required |
|--------|--------------|-----------------|
| Node.js 26 Active LTS | October 2026 | Update primary workflow from 25 to 26 (already planned) |
| Node.js 27 release | October 2026 | Update `test-and-report-latest-node.yml` to 27 |
| Node.js 25 security EOL | June 2026 | Must be on 26 by this date |
| Node.js 28 LTS | April 2027 | Next LTS evaluation |
| Node.js 26 EOL | April 2029 | Migrate to 28 before this date |

---

## Related Documents

- [End-of-Life-Strategy.md](./End-of-Life-Strategy.md) — Full Node.js lifecycle policy
- [WORKFLOWS.md](./WORKFLOWS.md) — Current CI/CD workflow documentation
- [Node.js Release Schedule](https://nodejs.org/en/about/previous-releases)
- [Node.js Changelog](https://github.com/nodejs/node/blob/main/CHANGELOG.md)
