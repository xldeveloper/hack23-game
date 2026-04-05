import { useMemo } from "react";
import type { JSX } from "react";
import type { GameState } from "../hooks/useGameState";
import { calculateAccuracy } from "../utils/gameConfig";

/** Style constants for overlay UI elements */
const OVERLAY_BASE_STYLES = {
  background: "rgba(33, 38, 45, 0.7)",
  padding: "10px 20px",
  borderRadius: "8px",
  backdropFilter: "blur(10px)",
} as const;

/** Props for the HUD component */
export interface HUDProps {
  /** Current game state */
  gameState: GameState;
}

/**
 * Heads-up display showing timer, score, level, accuracy, and target count.
 * Positioned absolutely over the game canvas.
 *
 * @param props - Current game state
 * @returns Rendered HUD overlay
 */
export function HUD({ gameState }: HUDProps): JSX.Element {
  const accuracy = useMemo(
    () => calculateAccuracy(gameState.successfulHits, gameState.totalClicks),
    [gameState.successfulHits, gameState.totalClicks],
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        left: "20px",
        zIndex: 10,
        display: "flex",
        gap: "20px",
      }}
    >
      {/* Timer */}
      <div data-testid="timer-display" style={OVERLAY_BASE_STYLES}>
        <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>TIME</div>
        <div
          style={{
            color: gameState.timeLeft <= 10 ? "#ff4444" : "#00ff88",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {gameState.timeLeft}s
        </div>
      </div>

      {/* Score */}
      <div data-testid="score-display" style={OVERLAY_BASE_STYLES}>
        <div data-testid="score-label" style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>
          SCORE
        </div>
        <div data-testid="score-value" style={{ color: "#00ff88", fontSize: "24px", fontWeight: "bold" }}>
          {gameState.score}
        </div>
        {gameState.combo > 0 && (
          <div style={{ color: "#ffa500", fontSize: "12px" }}>🔥 COMBO x{gameState.combo}</div>
        )}
      </div>

      {/* Level */}
      <div data-testid="level-display" style={OVERLAY_BASE_STYLES}>
        <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>LEVEL</div>
        <div style={{ color: "#646cff", fontSize: "24px", fontWeight: "bold" }}>
          {gameState.level}
        </div>
        {gameState.highScore > 0 && (
          <div style={{ color: "#ffa500", fontSize: "10px" }}>HIGH: {gameState.highScore}</div>
        )}
      </div>

      {/* Accuracy */}
      <div data-testid="accuracy-display" style={OVERLAY_BASE_STYLES}>
        <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>ACCURACY</div>
        <div style={{ color: "#00ffff", fontSize: "24px", fontWeight: "bold" }}>{accuracy}%</div>
        <div style={{ color: "#7d8590", fontSize: "10px" }}>
          {gameState.successfulHits}/{gameState.totalClicks}
        </div>
      </div>

      {/* Active Targets */}
      <div data-testid="targets-display" style={OVERLAY_BASE_STYLES}>
        <div style={{ color: "#7d8590", fontSize: "10px", marginBottom: "4px" }}>TARGETS</div>
        <div style={{ color: "#ff66ff", fontSize: "24px", fontWeight: "bold" }}>
          {gameState.targets.length}
        </div>
      </div>
    </div>
  );
}
