import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectLinks from "./ProjectLinks";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

// Mock the Button component
vi.mock("../Button", () => ({
  default: ({ children, onClick, disabled, title, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      data-testid={props["data-testid"] || "button"}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe("ProjectLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    id: 1,
    repositoryUrl: "https://github.com/user/repo",
    figmaUrl: "https://figma.com/design/123",
    projectId: "project-123",
    canEdit: false,
  };

  it("should render loading state initially", () => {
    mockedApi.getProjectLinks.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<ProjectLinks {...defaultProps} />);

    expect(screen.getByText("Project Links")).toBeInTheDocument();
    // Loading skeleton should be visible
    expect(
      screen
        .getAllByRole("generic")
        .some((el) => el.className.includes("animate-pulse")),
    ).toBe(true);
  });

  it("should render API data when available", async () => {
    const apiLinks = {
      repositoryUrl: "https://github.com/api/repo",
      figmaUrl: "https://figma.com/api/design",
    };

    mockedApi.getProjectLinks.mockResolvedValue(apiLinks);

    render(<ProjectLinks {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Repository")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
      expect(screen.getByText("Submitted")).toBeInTheDocument();
    });
  });

  it("should render fallback data when API fails", async () => {
    mockedApi.getProjectLinks.mockResolvedValue(null);

    render(<ProjectLinks {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Repository")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
      expect(screen.getAllByText("Submitted")).toHaveLength(2);
    });
  });

  it("should call API with correct projectId", async () => {
    mockedApi.getProjectLinks.mockResolvedValue(null);

    render(<ProjectLinks {...defaultProps} projectId="project-456" />);

    await waitFor(() => {
      expect(mockedApi.getProjectLinks).toHaveBeenCalledWith("project-456");
    });
  });

  it("should show edit button when canEdit is true", async () => {
    mockedApi.getProjectLinks.mockResolvedValue(null);

    render(<ProjectLinks {...defaultProps} canEdit={true} />);

    await waitFor(() => {
      expect(screen.getByTitle("Edit Links")).toBeInTheDocument();
    });
  });

  it("should hide edit button when canEdit is false", async () => {
    mockedApi.getProjectLinks.mockResolvedValue(null);

    render(<ProjectLinks {...defaultProps} canEdit={false} />);

    await waitFor(() => {
      expect(screen.queryByTitle("Edit Links")).not.toBeInTheDocument();
    });
  });

  it("should display Not Submitted for empty URLs", async () => {
    const emptyLinks = {
      repositoryUrl: "",
      figmaUrl: "",
    };

    mockedApi.getProjectLinks.mockResolvedValue(emptyLinks);

    render(<ProjectLinks {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getAllByText("Not Submitted")).toHaveLength(2);
    });
  });

  it("should show copy buttons for submitted links", async () => {
    const links = {
      repositoryUrl: "https://github.com/user/repo",
      figmaUrl: "https://figma.com/design/123",
    };

    mockedApi.getProjectLinks.mockResolvedValue(links);

    render(<ProjectLinks {...defaultProps} />);

    await waitFor(() => {
      const copyButtons = screen.getAllByTitle(/Copy.*link/i);
      expect(copyButtons).toHaveLength(2);
    });
  });

  it("should handle copy link functionality", async () => {
    const links = {
      repositoryUrl: "https://github.com/user/repo",
      figmaUrl: "https://figma.com/design/123",
    };

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    mockedApi.getProjectLinks.mockResolvedValue(links);

    render(<ProjectLinks {...defaultProps} />);

    await waitFor(async () => {
      const copyButton = screen.getAllByTitle(/Copy.*link/i)[0];
      await userEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "https://github.com/user/repo",
      );
    });
  });

  it("should open edit modal when edit button is clicked", async () => {
    mockedApi.getProjectLinks.mockResolvedValue(null);

    render(<ProjectLinks {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Links");
      await userEvent.click(editButton);

      // Edit modal should be visible (assuming it shows input fields)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
