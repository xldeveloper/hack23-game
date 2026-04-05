import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { HUD } from "./HUD";
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

describe("HUD Component", () => {
  it("should render timer display with initial time", () => {
    render(<HUD gameState={createGameState()} />);
    expect(screen.getByTestId("timer-display")).toHaveTextContent("60s");
  });

  it("should render score display", () => {
    render(<HUD gameState={createGameState({ score: 25 })} />);
    expect(screen.getByTestId("score-value")).toHaveTextContent("25");
    expect(screen.getByTestId("score-label")).toHaveTextContent("SCORE");
  });

  it("should render level display", () => {
    render(<HUD gameState={createGameState({ level: 3 })} />);
    expect(screen.getByTestId("level-display")).toHaveTextContent("3");
  });

  it("should render accuracy display at 100% with no clicks", () => {
    render(<HUD gameState={createGameState()} />);
    expect(screen.getByTestId("accuracy-display")).toHaveTextContent("100%");
  });

  it("should render accuracy correctly with hits and misses", () => {
    render(
      <HUD gameState={createGameState({ successfulHits: 3, totalClicks: 4 })} />,
    );
    expect(screen.getByTestId("accuracy-display")).toHaveTextContent("75%");
    expect(screen.getByTestId("accuracy-display")).toHaveTextContent("3/4");
  });

  it("should render target count", () => {
    const targets = [
      { id: 0, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 },
      { id: 1, x: 1, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 },
    ];
    render(<HUD gameState={createGameState({ targets })} />);
    expect(screen.getByTestId("targets-display")).toHaveTextContent("2");
  });

  it("should show combo indicator when combo > 0", () => {
    render(<HUD gameState={createGameState({ combo: 3 })} />);
    expect(screen.getByTestId("score-display")).toHaveTextContent("COMBO x3");
  });

  it("should not show combo indicator when combo is 0", () => {
    render(<HUD gameState={createGameState({ combo: 0 })} />);
    expect(screen.getByTestId("score-display")).not.toHaveTextContent("COMBO");
  });

  it("should show high score when available", () => {
    render(<HUD gameState={createGameState({ highScore: 42 })} />);
    expect(screen.getByTestId("level-display")).toHaveTextContent("HIGH: 42");
  });

  it("should not show high score when it's 0", () => {
    render(<HUD gameState={createGameState({ highScore: 0 })} />);
    expect(screen.getByTestId("level-display")).not.toHaveTextContent("HIGH:");
  });

  it("should show timer in red when time is low", () => {
    render(
      <HUD gameState={createGameState({ timeLeft: 5 })} />,
    );
    // Timer value should display
    expect(screen.getByTestId("timer-display")).toHaveTextContent("5s");
  });
});
