import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { type Batch } from "../../types/Batch.types";
import { type UseQueryResult } from "@tanstack/react-query";

import BatchCard from "./BatchCard";

// Mock Data (different from msw)
// MSW is already checked in Integration tests (pages)
const mockBatchData: Batch = {
  id: 101,
  title: "ILP Batch 2025-26",
  type: "SDET",
  status: "Ongoing",
  day: 42,
  startDate: new Date("2025-10-01T00:00:00.000Z"),
  endDate: new Date("2026-03-31T00:00:00.000Z"),
};

// Unit Tests
describe("BatchCard", () => {
  it("should render skeletons when the query is pending", () => {
    const query = { status: "pending" } as UseQueryResult<Batch>;
    render(<BatchCard query={query} />);
    expect(screen.queryByText(mockBatchData.title)).not.toBeInTheDocument();
    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render an error message when the query fails", () => {
    const query = { status: "error" } as UseQueryResult<Batch>;
    render(<BatchCard query={query} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText("Could not load batch data.")).toBeInTheDocument();
  });

  it("should render null if there is no data on success", () => {
    const query = {
      status: "success",
      data: undefined,
    } as unknown as UseQueryResult<Batch>;
    const { container } = render(<BatchCard query={query} />);
    expect(container.firstChild).toBeNull();
  });

  describe("when data is successfully loaded", () => {
    it("should render all batch data correctly for 'Ongoing' status", () => {
      const query = {
        status: "success",
        data: mockBatchData,
      } as UseQueryResult<Batch>;
      render(<BatchCard query={query} />);

      expect(screen.getByText(mockBatchData.title)).toBeInTheDocument();
      expect(screen.getByText(mockBatchData.type)).toBeInTheDocument();
      expect(
        screen.getByText(mockBatchData.startDate.toLocaleDateString()),
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockBatchData.endDate.toLocaleDateString()),
      ).toBeInTheDocument();
      expect(screen.getByText(`DAY ${mockBatchData.day}`)).toBeInTheDocument();

      // TODO: Check badge
    });
  });
});
