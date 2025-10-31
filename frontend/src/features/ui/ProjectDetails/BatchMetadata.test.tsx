import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import BatchMetadata from "./BatchMetadata";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

describe("BatchMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    mockedApi.getBatchMetadata.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BatchMetadata
        name="B001"
        projectName="Test Project"
        trainees={25}
        status="Active"
        projectId="project-123"
      />,
    );

    expect(screen.getAllByRole("generic")).toHaveLength(4); // Loading skeleton elements
  });

  it("should render API data when available", async () => {
    const mockData = {
      name: "B002",
      projectName: "API Project",
      trainees: 30,
      status: "Completed",
    };

    mockedApi.getBatchMetadata.mockResolvedValue(mockData);

    render(
      <BatchMetadata
        name="B001"
        projectName="Test Project"
        trainees={25}
        status="Active"
        projectId="project-123"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("API Project")).toBeInTheDocument();
      expect(screen.getByText("B002")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
  });

  it("should render fallback data when API fails", async () => {
    mockedApi.getBatchMetadata.mockResolvedValue(null);

    render(
      <BatchMetadata
        name="B003"
        projectName="Fallback Project"
        trainees={20}
        status="In Progress"
        projectId="project-123"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Fallback Project")).toBeInTheDocument();
      expect(screen.getByText("B003")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
    });
  });

  it("should call API with correct projectId", async () => {
    mockedApi.getBatchMetadata.mockResolvedValue(null);

    render(
      <BatchMetadata
        name="B001"
        projectName="Test"
        trainees={25}
        status="Active"
        projectId="project-456"
      />,
    );

    await waitFor(() => {
      expect(mockedApi.getBatchMetadata).toHaveBeenCalledWith("project-456");
    });
  });
});
