import { render, screen } from "@testing-library/react";
import { GenericErrorCard } from "./GenericErrorCard";
import { expect, it } from "vitest";

it("should render the provided title and message", () => {
  render(
    <GenericErrorCard title="Custom Title" message="Custom error message." />,
  );
  expect(screen.getByText("Custom Title")).toBeInTheDocument();
  expect(screen.getByText("Custom error message.")).toBeInTheDocument();
});

it("should render a default title if none is provided", () => {
  render(<GenericErrorCard message="A simple error." />);
  expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
});
