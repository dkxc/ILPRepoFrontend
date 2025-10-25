import { render, screen } from "@testing-library/react";
import { BatchCardLoading } from "./BatchCardLoading";
import { expect, it } from "vitest";

it("should render multiple skeleton elements", () => {
  render(<BatchCardLoading />);
  expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
});
