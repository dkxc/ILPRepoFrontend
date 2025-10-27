import { render, screen } from "@testing-library/react";
import { WelcomeHeaderSuccess } from "./WelcomeHeaderSuccess";
import { expect, it } from "vitest";

it("renders welcome message correctly", () => {
  render(<WelcomeHeaderSuccess firstName="Bob" />);
  expect(screen.getByText("Welcome, Bob")).toBeInTheDocument();
});

it("renders user if undefined", () => {
  render(<WelcomeHeaderSuccess firstName={undefined} />);
  expect(screen.getByText("Welcome, User")).toBeInTheDocument();
});
