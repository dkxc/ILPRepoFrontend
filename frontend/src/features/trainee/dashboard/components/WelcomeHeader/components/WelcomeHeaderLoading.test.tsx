import { render, screen } from "@testing-library/react";
import { WelcomeHeaderLoading } from "./WelcomeHeaderLoading";
import { it, expect } from "vitest";

it("should render multiple skeleton elements", () => {
  render(<WelcomeHeaderLoading />);
  expect(screen.getAllByTestId("skeleton-loader").length).toBeGreaterThan(0);
});
