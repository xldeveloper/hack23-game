import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Sparkles, Trail } from "@react-three/drei";
import { useRef, useState, useCallback, useEffect } from "react";
import type { JSX } from "react";
import * as THREE from "three";

/** Multiplier for invisible hit area to make clicking easier */
const HIT_AREA_MULTIPLIER = 2.5;

/** Props for the TargetSphere component */
export interface TargetSphereProps {
  /** World position of the target */
  position: [number, number, number];
  /** Callback when the target is clicked */
  onClick: () => void;
  /** Whether the target is active (clickable and animated) */
  isActive: boolean;
  /** Radius of the target sphere */
  size: number;
}

/**
 * Interactive 3D target sphere with rings, sparkles, and trail effects.
 * Features hover feedback, pulse animation, and an enlarged invisible
 * hit area for easier clicking.
 *
 * Performance note: Pulse animation uses a ref instead of useState
 * to avoid triggering React re-renders at 60fps.
 *
 * @param props - Target position, click handler, active state, and size
 * @returns Rendered target group with visual effects
 */
export function TargetSphere({ position, onClick, isActive, size }: TargetSphereProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Use ref for pulse scale to avoid re-renders in useFrame
  const pulseScaleRef = useRef(1);

  // Cleanup cursor on unmount
  useEffect(() => {
    return (): void => {
      document.body.style.cursor = "default";
    };
  }, []);

  // Enhanced rotation and pulse animation
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isActive) {
      meshRef.current.rotation.y += delta * 1.2;
      meshRef.current.rotation.x += delta * 0.6;

      // Animate rings
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z += delta * 0.9;
      }
      if (middleRingRef.current) {
        middleRingRef.current.rotation.z -= delta * 1.2;
      }

      // Pulsing effect for hover state - use ref to avoid re-renders
      if (hovered) {
        pulseScaleRef.current = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
      } else {
        pulseScaleRef.current = 1;
      }
    }

    // Always apply scale so inactive state (0.6) is correctly set
    const targetScale = isActive ? (hovered ? 1.4 * pulseScaleRef.current : 1) : 0.6;
    meshRef.current.scale.setScalar(targetScale);
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>): void => {
      e.stopPropagation();
      if (isActive) {
        onClick();
      }
    },
    [isActive, onClick],
  );

  const handlePointerOver = useCallback((): void => {
    if (isActive) {
      setHovered(true);
      document.body.style.cursor = "crosshair";
    }
  }, [isActive]);

  const handlePointerOut = useCallback((): void => {
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  return (
    <group position={position}>
      <Trail
        width={hovered ? 5 : 3}
        length={hovered ? 8 : 6}
        color={isActive ? (hovered ? "#00ffff" : "#00ff88") : "#666666"}
        attenuation={(t) => t * t}
      >
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={isActive ? (hovered ? "#00ffff" : "#00cc66") : "#666666"}
            emissive={isActive ? (hovered ? "#00ffff" : "#00ff88") : "#333333"}
            emissiveIntensity={hovered ? 1.2 : 0.6}
            metalness={0.7}
            roughness={0.1}
          />
          {/* Animated outer ring for target effect */}
          <mesh ref={outerRingRef} position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.8, 0.03, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? (hovered ? "#ffff00" : "#ffffff") : "#999999"}
              transparent
              opacity={hovered ? 1.0 : 0.8}
              emissive={hovered ? "#ffff00" : "#ffffff"}
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
          {/* Animated middle ring */}
          <mesh ref={middleRingRef} position={[0, 0, 0]}>
            <torusGeometry args={[size * 0.5, 0.03, 16, 32]} />
            <meshStandardMaterial
              color={isActive ? (hovered ? "#ffff00" : "#ffffff") : "#999999"}
              transparent
              opacity={hovered ? 1.0 : 0.8}
              emissive={hovered ? "#ffff00" : "#ffffff"}
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
          {/* Center dot for precise aiming */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[size * 0.15, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={hovered ? 2.0 : 1.0}
            />
          </mesh>
        </mesh>
      </Trail>

      {/* Invisible larger hit area for easier clicking */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        visible={false}
      >
        <sphereGeometry args={[size * HIT_AREA_MULTIPLIER, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Enhanced sparkle effect around target */}
      {isActive && (
        <Sparkles
          count={hovered ? 40 : 25}
          scale={size * (hovered ? 4 : 3)}
          size={hovered ? 3 : 2}
          speed={hovered ? 0.6 : 0.4}
          color={hovered ? "#ffff00" : "#00ff88"}
        />
      )}

      {/* Outer glow ring when hovered */}
      {isActive && hovered && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[size * 1.5, 0.05, 16, 32]} />
          <meshStandardMaterial
            color="#ffff00"
            transparent
            opacity={0.6}
            emissive="#ffff00"
            emissiveIntensity={1.5}
          />
        </mesh>
      )}
    </group>
  );
}
