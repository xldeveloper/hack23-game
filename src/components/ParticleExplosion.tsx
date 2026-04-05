import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import type { JSX } from "react";
import * as THREE from "three";

/** Duration of particle explosion animation in milliseconds */
export const PARTICLE_EXPLOSION_DURATION_MS = 600;

/** Number of particles in an explosion */
const PARTICLE_COUNT = 50;

/** Particle rise speed per frame */
const PARTICLE_RISE_SPEED = 0.02;

/** Explosion scale growth rate */
const EXPLOSION_SCALE_RATE = 8;

/**
 * Generate particle positions and colors for explosion effect.
 * Positions are distributed on a sphere surface, colors alternate
 * between green and yellow hues.
 */
function generateParticleData(): {
  particleCount: number;
  positions: Float32Array;
  colors: Float32Array;
} {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.3;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Mix of green and yellow colors
    colors[i3] = Math.random() > 0.5 ? 0 : 1;
    colors[i3 + 1] = 1;
    colors[i3 + 2] = Math.random() > 0.5 ? 0.5 : 0;
  }

  return { particleCount: PARTICLE_COUNT, positions, colors };
}

/** Props for the ParticleExplosion component */
export interface ParticleExplosionProps {
  /** World position of the explosion center */
  position: [number, number, number];
  /** Whether the explosion is currently active */
  active: boolean;
}

/**
 * Animated particle explosion effect that expands outward and fades.
 * Uses `useFrame` for animation with additive blending for a glow effect.
 *
 * @param props - Explosion position and active state
 * @returns Rendered Points mesh or null when inactive
 */
export function ParticleExplosion({ position, active }: ParticleExplosionProps): JSX.Element | null {
  const particlesRef = useRef<THREE.Points>(null);
  const visibleRef = useRef(active);
  const startTimeRef = useRef(0);

  const particleData = useMemo(() => generateParticleData(), []);

  // Reset visibility when a new explosion is triggered
  if (active && !visibleRef.current) {
    visibleRef.current = true;
    startTimeRef.current = 0;
  }

  useFrame((state) => {
    if (!visibleRef.current || !particlesRef.current) return;

    if (startTimeRef.current === 0) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const duration = PARTICLE_EXPLOSION_DURATION_MS / 1000;

    if (elapsed < duration) {
      const scale = 1 + elapsed * EXPLOSION_SCALE_RATE;
      particlesRef.current.scale.set(scale, scale, scale);

      const geometry = particlesRef.current.geometry;
      const positionAttr = geometry.attributes.position;

      if (positionAttr?.array) {
        const positions = positionAttr.array as Float32Array;

        for (let i = 1; i < positions.length; i += 3) {
          const current = positions[i];
          if (current !== undefined) {
            positions[i] = current + PARTICLE_RISE_SPEED;
          }
        }
        positionAttr.needsUpdate = true;
      }

      const opacity = 1 - elapsed / duration;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = opacity;
    } else {
      visibleRef.current = false;
      startTimeRef.current = 0;
    }
  });

  if (!visibleRef.current) return null;

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
