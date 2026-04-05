# Copilot Instructions

## Project Overview

**Target Shooter** — a 3D target-clicking game built with React 19, TypeScript 6, Three.js (@react-three/fiber + @react-three/drei), Vite 8, and Howler.js. Node ≥25 required.

**Security & Compliance:** Aligned with [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC). See [ISMS Policy Mapping](../docs/ISMS_POLICY_MAPPING.md).

## Quick Reference

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:5173
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run coverage     # Tests with coverage
npm run test:e2e     # Cypress E2E tests
npm run test:licenses # License compliance check
```

## Project Structure

```
src/
├── App.tsx                    # Root: game loop, audio, overlays
├── components/
│   ├── GameScene.tsx          # 3D scene (targets, particles, lights)
│   ├── TargetSphere.tsx       # Clickable 3D target
│   ├── BackgroundParticles.tsx # Particle effects
│   ├── ParticleExplosion.tsx   # Hit explosion effect
│   ├── HUD.tsx                # Score/time/combo display
│   └── GameOverlay.tsx        # Controls, instructions, overlays
├── hooks/
│   ├── useGameState.ts        # Game state management (score, level, targets)
│   └── useAudioManager.ts     # Howler.js audio integration
├── utils/
│   ├── gameConfig.ts          # Game constants and level progression
│   └── targetPhysics.ts       # Target creation and movement
└── test/setup.ts              # Vitest test setup
```

## Coding Standards

- **TypeScript strict mode**: `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess` enabled
- **No `any`**: Use `unknown` if needed. Type all function params and returns
- **Functional components only** with explicit return types: `function X(): JSX.Element`
- **Props interfaces**: Always define interfaces for component props
- **Import order**: React → external libs → internal components → hooks → types → styles

## Three.js Patterns

- Use `@react-three/fiber` declarative JSX for 3D scenes
- Use `useFrame` with delta time for animations — never `setInterval`/`setTimeout`
- Type refs explicitly: `useRef<THREE.Mesh>(null)`
- Use mesh event props (`onClick`, `onPointerOver`) — not DOM listeners
- Dispose geometries/materials/textures on unmount
- Use `InstancedMesh` for >10 similar objects
- Target 60fps (16.67ms per frame)

## Testing

- **Vitest** with jsdom for unit tests, **Cypress** for E2E
- Colocate tests: `ComponentName.test.tsx` next to source
- **80%+ coverage** target; AAA pattern (Arrange-Act-Assert)
- Mock Three.js (`@react-three/fiber`, `@react-three/drei`) in unit tests
- Test behavior, not implementation details

## Rules

### ALWAYS
1. Use TypeScript strict mode with explicit types
2. Run `npm run lint` and `npm run test` before committing
3. Aim for 80%+ test coverage
4. Use `useFrame` with delta time for animations
5. Dispose Three.js resources in cleanup functions
6. Follow existing patterns in the codebase

### NEVER
1. Use `any` type — use `unknown` if needed
2. Commit secrets, API keys, or credentials
3. Use `setInterval`/`setTimeout` for game animations
4. Update state inside `useFrame` (use refs for high-frequency updates)
5. Add dependencies without `npm audit` + `npm run test:licenses`
6. Use GPL/AGPL licensed dependencies

## Naming Conventions

- Components: PascalCase (`TargetSphere`)
- Hooks: `use` prefix (`useGameState`)
- Types/Interfaces: PascalCase (`GameState`, `Target`)
- Constants: UPPER_SNAKE_CASE (`GAME_DURATION`)
- Functions: camelCase (`incrementScore`)

## Decision Framework

**Complete without asking** when pattern exists in codebase, requirements are clear, change is small.
**Ask first** when multiple approaches exist with tradeoffs, security implications unclear, or new dependencies needed.
