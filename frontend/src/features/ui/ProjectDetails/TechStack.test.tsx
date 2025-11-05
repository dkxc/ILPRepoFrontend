import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TechStack from "./TechStack";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

// Mock the Button component
vi.mock("../Button", () => ({
  default: ({ children, onClick, disabled, variant, title, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      title={title}
      data-testid={props["data-testid"] || "button"}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock fetch for the save functionality
Object.defineProperty(globalThis, "fetch", {
  value: vi.fn(),
  writable: true,
});

describe("TechStack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  const defaultProps = {
    id: 1,
    techStack: ["React", "TypeScript", "Node.js"],
    projectId: "project-123",
    canEdit: false,
  };

  it("should render loading state initially", () => {
    mockedApi.getTechStack.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<TechStack {...defaultProps} />);

    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
    // Loading skeleton should be visible
    expect(
      screen
        .getAllByRole("generic")
        .some((el) => el.className.includes("animate-pulse")),
    ).toBe(true);
  });

  it("should render API data when available", async () => {
    const apiTechStack = {
      techStack: ["Vue.js", "Python", "MongoDB"],
    };

    mockedApi.getTechStack.mockResolvedValue(apiTechStack);

    render(<TechStack {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Vue.js")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
    });
  });

  it("should render fallback data when API fails", async () => {
    mockedApi.getTechStack.mockResolvedValue(null);

    render(<TechStack {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
  });

  it("should call API with correct projectId", async () => {
    mockedApi.getTechStack.mockResolvedValue(null);

    render(<TechStack {...defaultProps} projectId="project-456" />);

    await waitFor(() => {
      expect(mockedApi.getTechStack).toHaveBeenCalledWith("project-456");
    });
  });

  it("should show edit button when canEdit is true", async () => {
    mockedApi.getTechStack.mockResolvedValue(null);

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(() => {
      expect(screen.getByTitle("Edit Tech Stack")).toBeInTheDocument();
    });
  });

  it("should hide edit button when canEdit is false", async () => {
    mockedApi.getTechStack.mockResolvedValue(null);

    render(<TechStack {...defaultProps} canEdit={false} />);

    await waitFor(() => {
      expect(screen.queryByTitle("Edit Tech Stack")).not.toBeInTheDocument();
    });
  });

  it("should display empty state when no tech stack items", async () => {
    const emptyTechStack = {
      techStack: [],
    };

    mockedApi.getTechStack.mockResolvedValue(emptyTechStack);

    render(<TechStack {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("No stack added")).toBeInTheDocument();
    });
  });

  it("should handle pagination when tech stack has many items", async () => {
    const largeTechStack = {
      techStack: ["React", "TypeScript", "Node.js", "MongoDB", "Express"],
    };

    mockedApi.getTechStack.mockResolvedValue(largeTechStack);

    render(<TechStack {...defaultProps} />);

    await waitFor(() => {
      // With itemsPerPage = 2, should show first 2 items
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      // Should have pagination controls if more than 2 items
      if (largeTechStack.techStack.length > 2) {
        expect(screen.getByText("Next")).toBeInTheDocument();
      }
    });
  });

  it("should enter edit mode when edit button is clicked", async () => {
    mockedApi.getTechStack.mockResolvedValue(null);

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Tech Stack");
      await userEvent.click(editButton);

      // Should show edit interface
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  it("should handle adding new tech stack item in edit mode", async () => {
    mockedApi.getTechStack.mockResolvedValue({ techStack: ["React"] });

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Tech Stack");
      await userEvent.click(editButton);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Vue.js");

      const addButton = screen.getByText("+");
      await userEvent.click(addButton);

      expect(screen.getByText("Vue.js")).toBeInTheDocument();
    });
  });

  it("should handle save functionality with successful API call", async () => {
    mockedApi.getTechStack.mockResolvedValue({ techStack: ["React"] });
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Tech Stack");
      await userEvent.click(editButton);

      const saveButton = screen.getByText("Save");
      await userEvent.click(saveButton);

      expect(fetch).toHaveBeenCalledWith(
        "https://ilprepo.runasp.net/api/ProjectDetails/edit-techstack",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"stack":"React"'),
        }),
      );
    });
  });

  it("should handle save functionality with API error", async () => {
    mockedApi.getTechStack.mockResolvedValue({ techStack: ["React"] });
    (fetch as any).mockRejectedValue(new Error("Network error"));

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Tech Stack");
      await userEvent.click(editButton);

      const saveButton = screen.getByText("Save");
      await userEvent.click(saveButton);

      // Should show error message
      expect(screen.getByText(/Failed to save changes/i)).toBeInTheDocument();
    });
  });

  it("should handle cancel functionality", async () => {
    mockedApi.getTechStack.mockResolvedValue({ techStack: ["React"] });

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Tech Stack");
      await userEvent.click(editButton);

      // Make some changes
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Vue.js");

      const cancelButton = screen.getByText("Cancel");
      await userEvent.click(cancelButton);

      // Should exit edit mode and revert changes
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.queryByText("Vue.js")).not.toBeInTheDocument();
    });
  });

  it("should handle removing tech stack items in edit mode", async () => {
    mockedApi.getTechStack.mockResolvedValue({
      techStack: ["React", "TypeScript", "Node.js"],
    });

    render(<TechStack {...defaultProps} canEdit={true} />);

    await waitFor(async () => {
      const editButton = screen.getByTitle("Edit Tech Stack");
      await userEvent.click(editButton);

      // Should show remove buttons for each item
      const removeButtons = screen.getAllByText("×");
      if (removeButtons.length > 0) {
        await userEvent.click(removeButtons[0]);
        // Item should be removed from edit list
      }
    });
  });
});
