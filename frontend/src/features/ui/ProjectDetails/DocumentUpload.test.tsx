import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProjectDocuments from "./DocumentUpload";
import * as api from "./api";

// Mock the API
vi.mock("./api");
const mockedApi = vi.mocked(api);

// Mock the complex sub-components
vi.mock("../../ui/DocumentUpload", () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="document-modal">
        Document Upload Modal
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("../Table", () => ({
  default: ({ data }: any) => (
    <div data-testid="documents-table">
      {data.map((doc: any) => (
        <div key={doc.id} data-testid={`document-${doc.id}`}>
          {doc.name} - {doc.status}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("./SendNotification", () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="notification-modal">
        Send Notification Modal
        <button onClick={onClose} data-testid="close-notification">
          Close
        </button>
      </div>
    ) : null,
}));

describe("ProjectDocuments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockDocuments = [
    {
      id: "1",
      name: "Project Plan",
      filename: "plan.pdf",
      status: "Submitted" as const,
    },
    {
      id: "2",
      name: "Design Doc",
      filename: "",
      status: "Not Submitted" as const,
    },
  ];

  it("should render loading state initially", () => {
    mockedApi.getDocuments.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
      />,
    );

    expect(screen.getByText("Project Files")).toBeInTheDocument();
    // Loading skeleton should be visible
    expect(
      screen
        .getAllByRole("generic")
        .some((el) => el.className.includes("animate-pulse")),
    ).toBe(true);
  });

  it("should render API data when available", async () => {
    const apiDocuments = [
      {
        id: "3",
        name: "API Document",
        filename: "api.pdf",
        status: "Submitted" as const,
      },
    ];

    mockedApi.getDocuments.mockResolvedValue(apiDocuments);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("documents-table")).toBeInTheDocument();
      expect(screen.getByTestId("document-3")).toBeInTheDocument();
      expect(screen.getByText("API Document - Submitted")).toBeInTheDocument();
    });
  });

  it("should render fallback data when API fails", async () => {
    mockedApi.getDocuments.mockResolvedValue(null);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("documents-table")).toBeInTheDocument();
      expect(screen.getByTestId("document-1")).toBeInTheDocument();
      expect(screen.getByTestId("document-2")).toBeInTheDocument();
      expect(screen.getByText("Project Plan - Submitted")).toBeInTheDocument();
      expect(
        screen.getByText("Design Doc - Not Submitted"),
      ).toBeInTheDocument();
    });
  });

  it("should call API with correct projectId", async () => {
    mockedApi.getDocuments.mockResolvedValue(null);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-456"
      />,
    );

    await waitFor(() => {
      expect(mockedApi.getDocuments).toHaveBeenCalledWith("project-456");
    });
  });

  it("should show upload button when canUpload is true", async () => {
    mockedApi.getDocuments.mockResolvedValue(mockDocuments);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
        canUpload={true}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTitle("Upload Documents")).toBeInTheDocument();
    });
  });

  it("should hide upload button when canUpload is false", async () => {
    mockedApi.getDocuments.mockResolvedValue(mockDocuments);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
        canUpload={false}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTitle("Upload Documents")).not.toBeInTheDocument();
    });
  });

  it("should show notification button when canNotify is true and is admin", async () => {
    mockedApi.getDocuments.mockResolvedValue(mockDocuments);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
        canNotify={true}
        isAdmin={true}
        teamMembers={[
          {
            id: 1,
            name: "Test User",
            mail: "test@example.com",
            role: "Developer",
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTitle("Send Notifications")).toBeInTheDocument();
    });
  });

  it("should hide notification button when not admin", async () => {
    mockedApi.getDocuments.mockResolvedValue(mockDocuments);

    render(
      <ProjectDocuments
        initialDocuments={mockDocuments}
        projectId="project-123"
        canNotify={true}
        isAdmin={false}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByTitle("Send Notifications")).not.toBeInTheDocument();
    });
  });
});
