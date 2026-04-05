import { Sparkles } from "@react-three/drei";
import type { JSX } from "react";

/**
 * Ambient background particle effect using the Sparkles drei helper.
 * Provides floating particles across the scene for visual atmosphere.
 *
 * @returns Rendered Sparkles component
 */
export function BackgroundParticles(): JSX.Element {
  return (
    <Sparkles
      count={100}
      scale={15}
      size={1}
      speed={0.2}
      opacity={0.3}
      color="#646cff"
    />
  );
}
