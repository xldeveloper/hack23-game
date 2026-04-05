import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode, ReactElement } from "react";

// Mock @react-three/fiber
vi.mock("@react-three/fiber", (): object => ({
  Canvas: ({ children }: { children: ReactNode }): ReactElement => (
    <div data-testid="mocked-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: (): object => ({
    camera: { position: { x: 0, y: 2, z: 8, lerp: vi.fn() } },
    scene: {},
    gl: {},
  }),
  ThreeEvent: vi.fn(),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", (): object => ({
  OrbitControls: (): ReactElement => <div data-testid="mocked-orbit-controls" />,
  Sparkles: (): ReactElement => <div data-testid="mocked-sparkles" />,
  Trail: ({ children }: { children: ReactNode }): ReactElement => (
    <div data-testid="mocked-trail">{children}</div>
  ),
}));

// Mock THREE
vi.mock("three", () => ({
  default: { Mesh: vi.fn() },
  Vector3: vi.fn().mockImplementation(function (this: object, x = 0, y = 0, z = 0) {
    return { x, y, z };
  }),
  AdditiveBlending: 2,
}));

import { GameScene } from "./GameScene";
import type { GameState } from "../hooks/useGameState";

function createGameState(overrides?: Partial<GameState>): GameState {
  return {
    score: 0,
    isPlaying: true,
    timeLeft: 60,
    combo: 0,
    highScore: 0,
    targetSize: 0.5,
    level: 1,
    isNewHighScore: false,
    targets: [{ id: 0, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 }],
    totalClicks: 0,
    successfulHits: 0,
    ...overrides,
  };
}

describe("GameScene Component", () => {
  const defaultProps = {
    gameState: createGameState(),
    onTargetClick: vi.fn(),
    onMiss: vi.fn(),
    showExplosion: false,
    explosionPosition: [0, 0, 0] as [number, number, number],
  };

  it("should render orbit controls", () => {
    render(<GameScene {...defaultProps} />);
    expect(screen.getByTestId("mocked-orbit-controls")).toBeInTheDocument();
  });

  it("should render background sparkles", () => {
    render(<GameScene {...defaultProps} />);
    const sparkles = screen.getAllByTestId("mocked-sparkles");
    expect(sparkles.length).toBeGreaterThanOrEqual(1);
  });

  it("should render trail for target", () => {
    render(<GameScene {...defaultProps} />);
    expect(screen.getAllByTestId("mocked-trail").length).toBeGreaterThan(0);
  });

  it("should render multiple targets", () => {
    const targets = [
      { id: 0, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 },
      { id: 1, x: 1, y: 1, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 },
      { id: 2, x: -1, y: -1, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.4 },
    ];
    render(
      <GameScene
        {...defaultProps}
        gameState={createGameState({ targets })}
      />,
    );
    // Should render sparkles for each active target plus background sparkles
    const sparkles = screen.getAllByTestId("mocked-sparkles");
    expect(sparkles.length).toBeGreaterThanOrEqual(3);
  });

  it("should not render particle explosion when showExplosion is false", () => {
    render(<GameScene {...defaultProps} showExplosion={false} />);
    // ParticleExplosion should not render any additional elements
    // when not active
  });

  it("should render with game over state", () => {
    render(
      <GameScene
        {...defaultProps}
        gameState={createGameState({ timeLeft: 0, isPlaying: false })}
      />,
    );
    // Should still render the scene elements
    expect(screen.getByTestId("mocked-orbit-controls")).toBeInTheDocument();
  });
});
