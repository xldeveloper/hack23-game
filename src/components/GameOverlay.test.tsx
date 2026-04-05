import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import {
  GameControls,
  GameInstructions,
  PauseOverlay,
  GameOverOverlay,
} from "./GameOverlay";
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

describe("GameControls Component", () => {
  const defaultProps = {
    gameState: createGameState(),
    isMuted: false,
    volume: 1.0,
    onTogglePause: vi.fn(),
    onReset: vi.fn(),
    onMuteToggle: vi.fn(),
    onVolumeChange: vi.fn(),
  };

  it("should render game status as Active when playing", () => {
    render(<GameControls {...defaultProps} />);
    expect(screen.getByTestId("game-status")).toHaveTextContent("Active");
  });

  it("should render game status as Paused when not playing", () => {
    render(
      <GameControls
        {...defaultProps}
        gameState={createGameState({ isPlaying: false })}
      />,
    );
    expect(screen.getByTestId("game-status")).toHaveTextContent("Paused");
  });

  it("should render Time's Up when time is 0", () => {
    render(
      <GameControls
        {...defaultProps}
        gameState={createGameState({ timeLeft: 0, isPlaying: false })}
      />,
    );
    expect(screen.getByTestId("game-status")).toHaveTextContent("Time's Up!");
  });

  it("should call onTogglePause when pause button clicked", async () => {
    const onTogglePause = vi.fn();
    const user = userEvent.setup();
    render(<GameControls {...defaultProps} onTogglePause={onTogglePause} />);
    await user.click(screen.getByTestId("pause-button"));
    expect(onTogglePause).toHaveBeenCalledOnce();
  });

  it("should disable pause button when game is over", () => {
    render(
      <GameControls
        {...defaultProps}
        gameState={createGameState({ timeLeft: 0, isPlaying: false })}
      />,
    );
    expect(screen.getByTestId("pause-button")).toBeDisabled();
  });

  it("should call onReset when reset button clicked", async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<GameControls {...defaultProps} onReset={onReset} />);
    await user.click(screen.getByTestId("reset-button"));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("should call onMuteToggle when mute button clicked", async () => {
    const onMuteToggle = vi.fn();
    const user = userEvent.setup();
    render(<GameControls {...defaultProps} onMuteToggle={onMuteToggle} />);
    await user.click(screen.getByTestId("mute-button"));
    expect(onMuteToggle).toHaveBeenCalledOnce();
  });

  it("should show Mute text when not muted", () => {
    render(<GameControls {...defaultProps} isMuted={false} />);
    expect(screen.getByTestId("mute-button")).toHaveTextContent("Mute");
  });

  it("should show Unmute text when muted", () => {
    render(<GameControls {...defaultProps} isMuted={true} />);
    expect(screen.getByTestId("mute-button")).toHaveTextContent("Unmute");
  });

  it("should render volume slider with correct value", () => {
    render(<GameControls {...defaultProps} volume={0.7} />);
    const slider = screen.getByTestId("volume-slider") as HTMLInputElement;
    expect(slider.value).toBe("0.7");
  });

  it("should display volume percentage", () => {
    render(<GameControls {...defaultProps} volume={0.7} />);
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("should show Pause text when playing", () => {
    render(<GameControls {...defaultProps} />);
    expect(screen.getByTestId("pause-button")).toHaveTextContent("Pause");
  });

  it("should show Resume text when paused", () => {
    render(
      <GameControls
        {...defaultProps}
        gameState={createGameState({ isPlaying: false })}
      />,
    );
    expect(screen.getByTestId("pause-button")).toHaveTextContent("Resume");
  });
});

describe("GameInstructions Component", () => {
  it("should show active instructions when playing", () => {
    render(<GameInstructions gameState={createGameState()} />);
    expect(screen.getByTestId("instructions-text")).toHaveTextContent(
      "Click targets to score",
    );
  });

  it("should show paused instructions when paused", () => {
    render(
      <GameInstructions gameState={createGameState({ isPlaying: false })} />,
    );
    expect(screen.getByTestId("instructions-text")).toHaveTextContent(
      "Game paused",
    );
  });

  it("should show game over instructions when time is up", () => {
    render(
      <GameInstructions
        gameState={createGameState({ timeLeft: 0, score: 15, isPlaying: false })}
      />,
    );
    expect(screen.getByTestId("instructions-text")).toHaveTextContent(
      "Game Over",
    );
    expect(screen.getByTestId("instructions-text")).toHaveTextContent("15");
  });

  it("should show multi-target message when multiple targets active", () => {
    const targets = [
      { id: 0, x: 0, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 },
      { id: 1, x: 1, y: 0, z: 0, velocityX: 0, velocityY: 0, velocityZ: 0, size: 0.5 },
    ];
    render(
      <GameInstructions gameState={createGameState({ targets })} />,
    );
    expect(screen.getByTestId("instructions-text")).toHaveTextContent(
      "2 targets active",
    );
  });

  it("should show accuracy in game over message", () => {
    render(
      <GameInstructions
        gameState={createGameState({
          timeLeft: 0,
          score: 10,
          isPlaying: false,
          successfulHits: 8,
          totalClicks: 10,
        })}
      />,
    );
    expect(screen.getByTestId("instructions-text")).toHaveTextContent("80%");
  });
});

describe("PauseOverlay Component", () => {
  it("should render when visible is true", () => {
    render(<PauseOverlay visible={true} />);
    expect(screen.getByTestId("pause-overlay")).toBeInTheDocument();
    expect(screen.getByText("GAME PAUSED")).toBeInTheDocument();
  });

  it("should not render when visible is false", () => {
    render(<PauseOverlay visible={false} />);
    expect(screen.queryByTestId("pause-overlay")).not.toBeInTheDocument();
  });
});

describe("GameOverOverlay Component", () => {
  it("should render when visible is true", () => {
    render(
      <GameOverOverlay
        visible={true}
        score={42}
        isNewHighScore={false}
        highScore={50}
      />,
    );
    expect(screen.getByTestId("gameover-overlay")).toBeInTheDocument();
    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("should not render when visible is false", () => {
    render(
      <GameOverOverlay
        visible={false}
        score={0}
        isNewHighScore={false}
        highScore={0}
      />,
    );
    expect(screen.queryByTestId("gameover-overlay")).not.toBeInTheDocument();
  });

  it("should show New High Score when isNewHighScore and score > 0", () => {
    render(
      <GameOverOverlay
        visible={true}
        score={42}
        isNewHighScore={true}
        highScore={42}
      />,
    );
    expect(screen.getByText("🏆 New High Score!")).toBeInTheDocument();
  });

  it("should show existing high score when not new high score", () => {
    render(
      <GameOverOverlay
        visible={true}
        score={10}
        isNewHighScore={false}
        highScore={50}
      />,
    );
    expect(screen.getByText("High Score: 50")).toBeInTheDocument();
  });

  it("should not show New High Score when score is 0", () => {
    render(
      <GameOverOverlay
        visible={true}
        score={0}
        isNewHighScore={true}
        highScore={0}
      />,
    );
    expect(screen.queryByText("🏆 New High Score!")).not.toBeInTheDocument();
    expect(screen.getByText("High Score: 0")).toBeInTheDocument();
  });
});
