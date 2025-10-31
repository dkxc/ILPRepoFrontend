import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TeamList from "./TeamList";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

// Mock the DataTable component since it's complex
vi.mock("../Table", () => ({
  default: ({ data, onDelete }: any) => (
    <div data-testid="data-table">
      {data.map((item: any) => (
        <div key={item.id} data-testid={`team-member-${item.id}`}>
          {item.name} - {item.mail}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              data-testid={`delete-${item.id}`}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  ),
}));

describe("TeamList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTeamMembers = [
    { id: 1, name: "John Doe", mail: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", mail: "jane@example.com", role: "Designer" },
  ];

  it("should render loading state initially", () => {
    mockedApi.getTeamList.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TeamList data={mockTeamMembers} projectId="project-123" />);

    expect(screen.getByText("Team Members")).toBeInTheDocument();
    // Loading skeleton should be visible
    expect(
      screen
        .getAllByRole("generic")
        .some((el) => el.className.includes("animate-pulse")),
    ).toBe(true);
  });

  it("should render API data when available", async () => {
    const apiTeamMembers = [
      { id: 3, name: "API User", mail: "api@example.com", role: "Manager" },
    ];

    mockedApi.getTeamList.mockResolvedValue(apiTeamMembers);

    render(<TeamList data={mockTeamMembers} projectId="project-123" />);

    await waitFor(() => {
      expect(screen.getByTestId("team-member-3")).toBeInTheDocument();
      expect(
        screen.getByText("API User - api@example.com"),
      ).toBeInTheDocument();
    });
  });

  it("should render fallback data when API fails", async () => {
    mockedApi.getTeamList.mockResolvedValue(null);

    render(<TeamList data={mockTeamMembers} projectId="project-123" />);

    await waitFor(() => {
      expect(screen.getByTestId("team-member-1")).toBeInTheDocument();
      expect(screen.getByTestId("team-member-2")).toBeInTheDocument();
      expect(
        screen.getByText("John Doe - john@example.com"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Jane Smith - jane@example.com"),
      ).toBeInTheDocument();
    });
  });

  it("should call API with correct projectId", async () => {
    mockedApi.getTeamList.mockResolvedValue(null);

    render(<TeamList data={mockTeamMembers} projectId="project-456" />);

    await waitFor(() => {
      expect(mockedApi.getTeamList).toHaveBeenCalledWith("project-456");
    });
  });

  it("should support delete functionality when canDelete is true", async () => {
    mockedApi.getTeamList.mockResolvedValue(mockTeamMembers);

    render(
      <TeamList
        data={mockTeamMembers}
        projectId="project-123"
        canDelete={true}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("delete-1")).toBeInTheDocument();
      expect(screen.getByTestId("delete-2")).toBeInTheDocument();
    });
  });
});
