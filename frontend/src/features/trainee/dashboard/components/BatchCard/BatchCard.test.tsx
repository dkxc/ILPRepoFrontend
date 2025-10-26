import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { type UseQueryResult } from "@tanstack/react-query";

import { type Batch } from "../../../types/Batch.types";
import BatchCard from "./BatchCard";

vi.mock("./components/BatchCardLoading", () => ({
  BatchCardLoading: () => <div>Loading</div>,
}));
vi.mock("@ui/card/GenericErrorCard", () => ({
  GenericErrorCard: () => <div>Error</div>,
}));
vi.mock("./components/BatchCardSuccess", () => ({
  BatchCardSuccess: () => <div>Success</div>,
}));

describe("BatchCard", () => {
  it("should render the loading component when the query is pending", () => {
    const query = { status: "pending" } as UseQueryResult<Batch>;
    render(<BatchCard query={query} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should render the error component when the query fails", () => {
    const query = { status: "error" } as UseQueryResult<Batch>;
    render(<BatchCard query={query} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should render the success component when data is loaded", () => {
    const query = { status: "success", data: {} } as UseQueryResult<Batch>;
    render(<BatchCard query={query} />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("should render null if there is no data on success", () => {
    const query = {
      status: "success",
      data: undefined,
    } as unknown as UseQueryResult<Batch>;
    const { container } = render(<BatchCard query={query} />);
    expect(container.firstChild).toBeNull();
  });
});
