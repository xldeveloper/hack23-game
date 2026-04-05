import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import type { ReactElement } from "react";

// Mock @react-three/drei
vi.mock("@react-three/drei", (): object => ({
  Sparkles: (props: Record<string, unknown>): ReactElement => (
    <div
      data-testid="mocked-sparkles"
      data-count={String(props.count)}
      data-scale={String(props.scale)}
      data-color={String(props.color)}
    />
  ),
}));

import { BackgroundParticles } from "./BackgroundParticles";

describe("BackgroundParticles Component", () => {
  it("should render sparkles with correct configuration", () => {
    render(<BackgroundParticles />);
    const sparkles = screen.getByTestId("mocked-sparkles");
    expect(sparkles).toBeInTheDocument();
    expect(sparkles).toHaveAttribute("data-count", "100");
    expect(sparkles).toHaveAttribute("data-scale", "15");
    expect(sparkles).toHaveAttribute("data-color", "#646cff");
  });
});
