---
name: performance-optimization
description: React re-render optimization, Three.js rendering performance, useMemo/useCallback, bundle size, 60 fps profiling, Lighthouse budgets
license: MIT
---

# Performance Optimization Skill

## Context

Applies when building performance-sensitive features, optimizing re-renders, reducing draw calls, minimizing bundle size, fixing memory leaks, profiling bottlenecks, or implementing game loops.

## Rules

1. **60 fps target** — 16.67 ms per frame max in game rendering
2. **Minimize re-renders** — `React.memo`, `useMemo`, `useCallback` used deliberately after profiling
3. **Refs for 60 Hz mutations** — never `useState` for per-frame updates
4. **Batch draw calls** — group similar geometries/materials in Three.js
5. **InstancedMesh** for > 10 similar objects (particles, enemies, bullets)
6. **Optimize geometry** — low polycounts; LOD for distant objects; frustum culling
7. **Lazy-load assets** — textures/models/sounds on demand; preload only critical
8. **Code-split** — dynamic `import()` by route/feature; `React.lazy` + `Suspense`
9. **Memoize expensive calculations** — `useMemo` with stable deps
10. **Debounce/throttle** resize, scroll, input handlers
11. **Profile first** — React DevTools Profiler + Chrome Performance + Spector.js before optimizing
12. **Bundle budget** — < 500 KB gzipped initial load (matches `budget.json`)
13. **Tree-shake** — import individual symbols, not whole modules
14. **Audio**: reuse Howler instances; unload unused sounds
15. **Memory**: dispose Three.js resources on unmount; break ref cycles

## Lighthouse Budget (aligned with `budget.json`)

| Metric | Target |
|---|---|
| Performance score | ≥ 90 |
| LCP | < 2.5 s |
| TTI | < 3.5 s |
| CLS | < 0.1 |
| Initial JS gzipped | < 500 KB |

## Examples

### ✅ Memoized leaf component

```tsx
import { memo, useCallback, useMemo } from 'react';

interface HUDProps {
  score: number;
  health: number;
  onPause: () => void;
}

function GameHUDInner({ score, health, onPause }: HUDProps): JSX.Element {
  const healthColor = useMemo(() => (health > 50 ? '#0f0' : '#f00'), [health]);
  const handlePause = useCallback(() => onPause(), [onPause]);

  return (
    <div className="hud">
      <span>Score: {score}</span>
      <span style={{ color: healthColor }}>Health: {health}%</span>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}

export const GameHUD = memo(GameHUDInner);
```

### ✅ Ref-based animation — zero re-renders

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Spinner(): JSX.Element {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta;
  });
  return <mesh ref={mesh}><boxGeometry /><meshStandardMaterial /></mesh>;
}
```

### ✅ Stable references outside render

```tsx
const ORIGIN = [0, 0, 0] as const;

function At(): JSX.Element {
  return <mesh position={ORIGIN}><sphereGeometry /></mesh>;
}
```

### ✅ Code-splitting a heavy overlay

```tsx
import { lazy, Suspense } from 'react';

const HelpOverlay = lazy(() => import('./HelpOverlay'));

function App(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <HelpOverlay />
    </Suspense>
  );
}
```

### ❌ Anti-Patterns

```tsx
// BAD: useState in useFrame — 60 re-renders/sec
useFrame(() => setRotation(r => r + 0.01));

// BAD: new object every render
<mesh position={[0, 0, 0]}>…</mesh>

// BAD: unmemoized expensive calc inside render
const sorted = data.sort((a, b) => a - b);

// BAD: importing entire lodash
import _ from 'lodash';

// BAD: forgetting to dispose geometry / material / texture
```

## Profiling Workflow

1. **Measure before** — React Profiler (component renders), Performance panel (frame times), Spector.js (draw calls)
2. **Identify** the hottest component or the longest task
3. **Hypothesize** (re-render? layout thrash? draw calls? allocation?)
4. **Change one thing** and re-measure
5. **Record evidence** in the PR (screenshots, numbers, flamegraphs)

## Memory-Leak Patterns

- Forgotten `setInterval` / subscriptions → cleanup in `useEffect` return
- Undisposed `THREE.Geometry` / `Material` / `Texture` → dispose on unmount
- Global event listeners → `removeEventListener` in cleanup
- Closures capturing large data → `useRef` or restructure

## Validation Checklist

- [ ] Profile shows no regression (or documented acceptable trade-off)
- [ ] No `useState` in `useFrame`; 60 Hz updates use refs
- [ ] `InstancedMesh` used for > 10 similar objects
- [ ] Three.js resources disposed on unmount
- [ ] Bundle within budget (`budget.json`) after changes
- [ ] Lighthouse score ≥ 90 for changed paths
- [ ] No memory leak in 5-minute soak test (DevTools Memory)
