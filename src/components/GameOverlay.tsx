import type { JSX } from "react";
import type { GameState } from "../hooks/useGameState";
import { calculateAccuracy } from "../utils/gameConfig";

/** Props for the GameControls component */
export interface GameControlsProps {
  /** Current game state */
  gameState: GameState;
  /** Whether audio is currently muted */
  isMuted: boolean;
  /** Current volume level (0-1) */
  volume: number;
  /** Callback to toggle pause */
  onTogglePause: () => void;
  /** Callback to reset the game */
  onReset: () => void;
  /** Callback to toggle mute */
  onMuteToggle: () => void;
  /** Callback when volume changes */
  onVolumeChange: (event: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => void;
}

/**
 * Game control buttons (pause, reset, mute) and volume slider.
 * Positioned in the top-right corner of the screen.
 *
 * @param props - Game state and control callbacks
 * @returns Rendered controls overlay
 */
export function GameControls({
  gameState,
  isMuted,
  volume,
  onTogglePause,
  onReset,
  onMuteToggle,
  onVolumeChange,
}: GameControlsProps): JSX.Element {
  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "20px",
        zIndex: 10,
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <div
        data-testid="game-status"
        style={{
          background: "rgba(33, 38, 45, 0.7)",
          padding: "8px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
          color: gameState.isPlaying && gameState.timeLeft > 0 ? "#00ff88" : "#ffa500",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {gameState.timeLeft <= 0
          ? "⏱️ Time's Up!"
          : gameState.isPlaying
            ? "🎯 Active"
            : "⏸️ Paused"}
      </div>
      <button
        onClick={onTogglePause}
        data-testid="pause-button"
        disabled={gameState.timeLeft <= 0}
        style={{
          background:
            gameState.timeLeft <= 0
              ? "#666666"
              : gameState.isPlaying
                ? "#ff6b35"
                : "#00c851",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: gameState.timeLeft <= 0 ? "not-allowed" : "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {gameState.isPlaying ? "⏸️ Pause" : "▶️ Resume"}
      </button>
      <button
        onClick={onReset}
        data-testid="reset-button"
        style={{
          background: "#7c3aed",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        🔄 Reset
      </button>
      <button
        onClick={onMuteToggle}
        data-testid="mute-button"
        style={{
          background: isMuted ? "#666666" : "#10b981",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(33, 38, 45, 0.7)",
          padding: "8px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
        }}
      >
        <label htmlFor="volume-slider" style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>
          🔊
        </label>
        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          onInput={onVolumeChange}
          data-testid="volume-slider"
          style={{ width: "100px", cursor: "pointer" }}
        />
        <span style={{ color: "white", fontSize: "12px", minWidth: "35px" }}>
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );
}

/** Props for the GameInstructions component */
export interface GameInstructionsProps {
  /** Current game state */
  gameState: GameState;
}

/**
 * Context-sensitive instruction text shown at the bottom of the screen.
 * Changes message based on whether the game is active, paused, or over.
 *
 * @param props - Current game state
 * @returns Rendered instruction text overlay
 */
export function GameInstructions({ gameState }: GameInstructionsProps): JSX.Element {
  const accuracy = calculateAccuracy(gameState.successfulHits, gameState.totalClicks);

  const message =
    gameState.timeLeft <= 0
      ? `🎮 Game Over! Final Score: ${gameState.score} | Accuracy: ${accuracy}% - Click Reset to play again`
      : gameState.isPlaying
        ? `🎯 Click targets to score! ${gameState.targets.length > 1 ? `${gameState.targets.length} targets active!` : ""} Build combos for bonus points! Miss penalty applies.`
        : "⏸️ Game paused - Resume to continue";

  return (
    <div
      data-testid="instructions-text"
      style={{
        position: "absolute",
        background: "rgba(33, 38, 45, 0.7)",
        padding: "12px 20px",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
        zIndex: 10,
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "16px",
        textAlign: "center",
        color: gameState.isPlaying && gameState.timeLeft > 0 ? "#ffffff" : "#7d8590",
      }}
    >
      {message}
    </div>
  );
}

/** Props for the PauseOverlay component */
export interface PauseOverlayProps {
  /** Whether the game is currently paused (not game-over) */
  visible: boolean;
}

/**
 * Full-screen pause overlay with blur background.
 *
 * @param props - Visibility flag
 * @returns Rendered pause overlay or null
 */
export function PauseOverlay({ visible }: PauseOverlayProps): JSX.Element | null {
  if (!visible) return null;

  return (
    <div
      data-testid="pause-overlay"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        background: "rgba(0, 0, 0, 0.85)",
        padding: "40px 60px",
        borderRadius: "20px",
        textAlign: "center",
        backdropFilter: "blur(20px)",
        border: "2px solid rgba(100, 108, 255, 0.5)",
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>⏸️</div>
      <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold" }}>GAME PAUSED</div>
    </div>
  );
}

/** Props for the GameOverOverlay component */
export interface GameOverOverlayProps {
  /** Whether the game is over */
  visible: boolean;
  /** Final score */
  score: number;
  /** Whether this was a new high score */
  isNewHighScore: boolean;
  /** Current high score */
  highScore: number;
}

/**
 * Full-screen game over overlay showing final score and high score status.
 *
 * @param props - Visibility, score, and high score info
 * @returns Rendered game over overlay or null
 */
export function GameOverOverlay({
  visible,
  score,
  isNewHighScore,
  highScore,
}: GameOverOverlayProps): JSX.Element | null {
  if (!visible) return null;

  return (
    <div
      data-testid="gameover-overlay"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        background: "rgba(0, 0, 0, 0.85)",
        padding: "40px 60px",
        borderRadius: "20px",
        textAlign: "center",
        backdropFilter: "blur(20px)",
        border: "2px solid rgba(255, 68, 68, 0.5)",
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎮</div>
      <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
        GAME OVER
      </div>
      <div style={{ color: "#00ff88", fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>
        {score}
      </div>
      <div style={{ color: "#7d8590", fontSize: "16px" }}>
        {isNewHighScore && score > 0 ? "🏆 New High Score!" : `High Score: ${highScore}`}
      </div>
    </div>
  );
}
