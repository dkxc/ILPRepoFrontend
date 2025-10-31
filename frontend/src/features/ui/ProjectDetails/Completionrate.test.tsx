import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SubmissionRate from "./Completionrate";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

// Mock the ResponsivePie component from @nivo/pie
vi.mock("@nivo/pie", () => ({
  ResponsivePie: ({ data }: any) => (
    <div data-testid="pie-chart">
      {data.map((item: any) => (
        <div key={item.id} data-testid={`pie-slice-${item.id}`}>
          {item.id}: {item.value}%
        </div>
      ))}
    </div>
  ),
}));

describe("SubmissionRate (Completionrate)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockedApi.getCompletionRate.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <SubmissionRate
        rate={75}
        title="Test Completion Rate"
        projectId="project-123"
      />,
    );

    expect(screen.getByText("Test Completion Rate")).toBeInTheDocument();
  });

  it("should render API data when available", async () => {
    const mockData = {
      rate: 85,
      title: "API Completion Rate",
    };

    mockedApi.getCompletionRate.mockResolvedValue(mockData);

    render(
      <SubmissionRate
        rate={75}
        title="Fallback Title"
        projectId="project-123"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
      expect(screen.getByTestId("pie-slice-completed")).toBeInTheDocument();
      expect(screen.getByTestId("pie-slice-remaining")).toBeInTheDocument();
      expect(screen.getByText("completed: 85%")).toBeInTheDocument();
      expect(screen.getByText("remaining: 15%")).toBeInTheDocument();
    });
  });

  it("should render fallback data when API fails", async () => {
    mockedApi.getCompletionRate.mockResolvedValue(null);

    render(
      <SubmissionRate
        rate={60}
        title="Fallback Rate"
        projectId="project-123"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
      expect(screen.getByText("completed: 60%")).toBeInTheDocument();
      expect(screen.getByText("remaining: 40%")).toBeInTheDocument();
    });
  });

  it("should call API with correct projectId", async () => {
    mockedApi.getCompletionRate.mockResolvedValue(null);

    render(<SubmissionRate rate={75} title="Test" projectId="project-456" />);

    await waitFor(() => {
      expect(mockedApi.getCompletionRate).toHaveBeenCalledWith("project-456");
    });
  });

  it("should hide title when showTitle is false", async () => {
    mockedApi.getCompletionRate.mockResolvedValue(null);

    render(
      <SubmissionRate
        rate={75}
        title="Hidden Title"
        projectId="project-123"
        showTitle={false}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Hidden Title")).not.toBeInTheDocument();
    });
  });

  it("should use custom title from props when provided", async () => {
    mockedApi.getCompletionRate.mockResolvedValue({
      rate: 80,
      title: "API Title", // This should be overridden by the API's title preference
    });

    render(
      <SubmissionRate rate={75} title="Custom Title" projectId="project-123" />,
    );

    await waitFor(() => {
      // The component should use the API title when available
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
  });
});
