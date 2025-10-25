import { render, screen } from "@testing-library/react";
import { BatchCardError } from "./BatchCardError";
import { expect, it } from "vitest";

it("should render the error message", () => {
  render(<BatchCardError />);
  expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
});
