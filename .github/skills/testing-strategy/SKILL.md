---
name: testing-strategy
description: Vitest + Cypress + RTL — deterministic tests, ≥80% line / ≥70% branch coverage, ≥95% on security code, Three.js component testing
license: MIT
---

# Testing Strategy Skill

## Context

Applies when writing unit tests, E2E tests, testing Three.js components, mocking dependencies, measuring coverage, diagnosing flakes, or preparing test data.

Aligned with [Secure Development Policy §Unit Test Coverage & Quality](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md).

## Rules

1. **≥ 80 % line / ≥ 70 % branch coverage** across every module
2. **≥ 95 % coverage** on security-sensitive code (input validation, encoding, auth/authorization)
3. **Test pyramid** — many unit, fewer integration, fewest E2E
4. **Behavior, not implementation** — query by role/text; avoid internal-state checks
5. **AAA pattern** — Arrange → Act → Assert; one behavior per test
6. **Mock external dependencies** — APIs, timers, Three.js renderer — with proper types
7. **Cover error and edge cases** — not just the happy path
8. **React Testing Library** — prefer role/text queries; stable `data-testid` allowed on intent
9. **Test logic, not WebGL** — for Three.js, test state/logic; mock the renderer
10. **Isolate tests** — no shared mutable state; `vi.clearAllMocks()` in `beforeEach`
11. **Descriptive names** — "should \<behavior\> when \<condition\>"
12. **Deterministic** — mock `Date.now`, `Math.random`, timers; no real network
13. **Fast** — unit tests in ms, E2E in seconds; parallelize where safe
14. **No flaky tests** — fix the root cause, never retry blindly
15. **No production / PII data in tests** — anonymize or synthesize (per SDP §Test Data Protection)
16. **CI must pass** — no merging red

## Examples

### ✅ Component test with RTL

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HUD } from './HUD';

const mockGameState = {
  score: 42, isPlaying: true, timeLeft: 30, combo: 0,
  highScore: 100, targetSize: 0.5, level: 1, isNewHighScore: false,
  targets: [] as unknown[], totalClicks: 10, successfulHits: 5,
} as const;

describe('HUD', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should display the current score', () => {
    render(<HUD gameState={mockGameState} />);
    expect(screen.getByText(/42/)).toBeInTheDocument();
  });
});
```

### ✅ Pure-function (no Three.js) test

```typescript
import { describe, it, expect } from 'vitest';
import { calculateLevel, getTargetCountForLevel } from './gameConfig';

describe('gameConfig', () => {
  it('should return level 1 for score 0', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('should return 1 target for levels 1-3', () => {
    expect(getTargetCountForLevel(1)).toBe(1);
    expect(getTargetCountForLevel(3)).toBe(1);
  });
});
```

### ✅ Mocking Three.js

```tsx
import type { ReactNode } from 'react';
import { vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({ camera: {}, scene: {}, gl: {} }),
}));

vi.mock('@react-three/drei', () => ({
  Sparkles: ({ children }: { children?: ReactNode }) => <>{children}</>,
  Trail: ({ children }: { children?: ReactNode }) => <>{children}</>,
}));
```

### ✅ Deterministic RNG

```typescript
import { vi, afterEach } from 'vitest';

beforeEach(() => {
  const seq = [0.1, 0.2, 0.3];
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => seq[i++ % seq.length]);
});

afterEach(() => { vi.restoreAllMocks(); });
```

### ✅ Security-path test (failure mode)

```typescript
it('should reject non-finite scores', () => {
  expect(() => saveHighScore(Number.NaN)).toThrow(RangeError);
  expect(() => saveHighScore(Infinity)).toThrow(RangeError);
  expect(() => saveHighScore(-1)).toThrow(RangeError);
});
```

### ❌ Anti-Patterns

```typescript
// BAD: testing implementation
expect(component.state.internalValue).toBe(5);

// BAD: non-deterministic
expect(result).toBe(Math.random());

// BAD: vague test name
it('works', () => { /* … */ });

// BAD: shared state between tests
let counter = 0;
it('t1', () => { counter++; });
it('t2', () => { expect(counter).toBe(1); }); // order-dependent!

// BAD: production data
const user = { email: 'real.user@company.com' }; // PII in tests
```

## Flaky-Test Triage

1. Reproduce locally with the same seed/time
2. Classify: timing / network / shared-state / order-dependence
3. Fix at the root (fake timers / explicit mocks / cleanup); never `retry` as a workaround
4. Add a regression test for the fix

## Validation Checklist

- [ ] ≥ 80 % line / ≥ 70 % branch coverage on changed modules
- [ ] ≥ 95 % coverage on security-sensitive code
- [ ] Deterministic (no real clocks, RNG, network)
- [ ] Three.js mocked in unit tests; logic tested in `src/utils/`
- [ ] E2E covers at least one critical user flow for the feature
- [ ] No production / PII data in fixtures
- [ ] CI green locally (`npm run test:ci`, `npm run test:e2e:ci`)
