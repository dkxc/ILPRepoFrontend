import { render, screen } from "@testing-library/react";
import { BatchCardSuccess } from "./BatchCardSuccess";
import { type Batch } from "../../../../types/Batch.types";
import { expect, it } from "vitest";

const mockBatch: Batch = {
  id: 1,
  title: "Test Batch",
  type: "Test",
  status: "Ongoing",
  day: 10,
  startDate: new Date("2025-01-01"),
  endDate: new Date("2025-06-01"),
};

it("renders all batch data correctly", () => {
  render(<BatchCardSuccess batch={mockBatch} />);
  expect(screen.getByText("Test Batch")).toBeInTheDocument();
  expect(screen.getByText("Ongoing")).toBeInTheDocument();
  expect(screen.getByText("DAY 10")).toBeInTheDocument();
  expect(
    screen.getByText(new Date("2025-01-01").toLocaleDateString()),
  ).toBeInTheDocument();
});
