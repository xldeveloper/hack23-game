import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useCallback } from "react";
import type { JSX } from "react";
import * as THREE from "three";
import type { GameState } from "../hooks/useGameState";
import { ParticleExplosion } from "./ParticleExplosion";
import { TargetSphere } from "./TargetSphere";
import { BackgroundParticles } from "./BackgroundParticles";

/** Duration of camera shake effect in seconds */
const CAMERA_SHAKE_DURATION = 0.3;

/** Intensity multiplier for camera shake */
const CAMERA_SHAKE_INTENSITY = 0.3;

/** Props for the GameScene component */
export interface GameSceneProps {
  /** Current game state */
  gameState: GameState;
  /** Callback when a target is clicked */
  onTargetClick: (targetId: number) => void;
  /** Callback when the player misses (clicks background) */
  onMiss: () => void;
  /** Whether to show the particle explosion */
  showExplosion: boolean;
  /** Position of the particle explosion */
  explosionPosition: [number, number, number];
}

/**
 * Main 3D game scene containing lighting, targets, effects, and controls.
 * Handles camera shake feedback on target hits and delegates click events
 * to the parent App component.
 *
 * @param props - Game state and event handlers
 * @returns Rendered Three.js scene graph
 */
export function GameScene({
  gameState,
  onTargetClick,
  onMiss,
  showExplosion,
  explosionPosition,
}: GameSceneProps): JSX.Element {
  const shakeTimeRef = useRef(0);
  const basePositionRef = useRef(new THREE.Vector3(0, 2, 8));

  const handleTargetClick = useCallback(
    (targetId: number): void => {
      if (!gameState.isPlaying || gameState.timeLeft <= 0) return;
      onTargetClick(targetId);
      shakeTimeRef.current = CAMERA_SHAKE_DURATION;
    },
    [gameState.isPlaying, gameState.timeLeft, onTargetClick],
  );

  const handleBackgroundClick = useCallback((): void => {
    if (!gameState.isPlaying || gameState.timeLeft <= 0) return;
    onMiss();
  }, [gameState.isPlaying, gameState.timeLeft, onMiss]);

  // Camera shake effect
  useFrame((state, delta) => {
    const camera = state.camera;

    if (shakeTimeRef.current > 0) {
      shakeTimeRef.current -= delta;
      const intensity = shakeTimeRef.current * CAMERA_SHAKE_INTENSITY;
      camera.position.x = basePositionRef.current.x + (Math.random() - 0.5) * intensity;
      camera.position.y = basePositionRef.current.y + (Math.random() - 0.5) * intensity;
      camera.position.z = basePositionRef.current.z + (Math.random() - 0.5) * intensity;
    } else if (shakeTimeRef.current <= 0) {
      camera.position.lerp(basePositionRef.current, 0.1);
    }
  });

  const isGameOver = gameState.timeLeft <= 0;

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.7} color="#646cff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        castShadow
        color="#00ff88"
      />

      {/* Background particles */}
      <BackgroundParticles />

      {/* Particle explosion effect */}
      {showExplosion && (
        <ParticleExplosion position={explosionPosition} active={showExplosion} />
      )}

      {/* Multiple Target Spheres */}
      {gameState.targets.map((target) => (
        <TargetSphere
          key={target.id}
          position={[target.x, target.y, target.z]}
          onClick={() => handleTargetClick(target.id)}
          isActive={gameState.isPlaying && !isGameOver}
          size={target.size}
        />
      ))}

      {/* Grid floor with subtle glow */}
      <gridHelper args={[10, 10, "#30363d", "#21262d"]} position={[0, -2, 0]} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.01, 0]}
        receiveShadow
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0d1117" opacity={0.8} transparent />
      </mesh>

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
