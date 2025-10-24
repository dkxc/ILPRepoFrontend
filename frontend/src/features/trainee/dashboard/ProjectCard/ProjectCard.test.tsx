import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { type Project } from "../../types/Project.types";
import { type UseQueryResult } from "@tanstack/react-query";

import ProjectCard from "./ProjectCard";

// Mock Data (different from msw)
// MSW is already checked in Integration tests (pages)
const mockProjectData: Project = {
  id: 1,
  title: "Test Project",
  status: "In Progress",
  technologies: ["React", "Node.js"],
  team: { number: 5, members: ["Member 1", "Member 2"] },
  progress: 75,
};

// Unit Tests
describe("ProjectCard", () => {
  it("should render skeletons when the query is pending", () => {
    const query = { status: "pending" } as UseQueryResult<Project>;
    render(<ProjectCard query={query} />);
    expect(screen.queryByText(mockProjectData.title)).not.toBeInTheDocument();
    const skeletons = screen.getAllByTestId("skeleton-loader");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render an error message when the query fails", () => {
    const query = { status: "error" } as UseQueryResult<Project>;
    render(<ProjectCard query={query} />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(
      screen.getByText("Could not load project data."),
    ).toBeInTheDocument();
  });

  it("should render null if there is no data on success", () => {
    const query = {
      status: "success",
      data: undefined,
    } as unknown as UseQueryResult<Project>;
    const { container } = render(<ProjectCard query={query} />);
    expect(container.firstChild).toBeNull();
  });

  describe("renders project data", () => {
    const query = {
      status: "success",
      data: mockProjectData,
    } as unknown as UseQueryResult<Project>;

    afterEach(() => {
      expect(screen.getByText(mockProjectData.title)).toBeInTheDocument();
    });

    it("should render project data correctly with 'In Progress' status", () => {
      render(<ProjectCard query={query} />);
      expect(screen.getByText("In Progress")).toBeInTheDocument();
    });

    it("should render correctly with 'Live' status", () => {
      const liveProject = { ...mockProjectData, status: "Live" as const };
      const liveQuery = {
        ...query,
        data: liveProject,
      } as UseQueryResult<Project>;
      render(<ProjectCard query={liveQuery} />);
      expect(screen.getByText("Live")).toBeInTheDocument();
    });

    it("should render correctly with 'Completed' status", () => {
      const completedProject = {
        ...mockProjectData,
        status: "Completed" as const,
      };
      const completedQuery = {
        ...query,
        data: completedProject,
      } as UseQueryResult<Project>;
      render(<ProjectCard query={completedQuery} />);
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
  });

  it("should render the DocumentSubmissionModal when the upload button is clicked", async () => {
    const query = {
      status: "success",
      data: mockProjectData,
    } as UseQueryResult<Project>;
    const user = userEvent.setup();
    render(<ProjectCard query={query} />);

    const modalTitleText = "Document Submission";
    expect(screen.queryByText(modalTitleText)).not.toBeInTheDocument();

    const uploadButton = screen.getByRole("button", {
      name: /Upload Documents/i,
    });
    await user.click(uploadButton);

    const modalTitle = await screen.findByText(modalTitleText);
    expect(modalTitle).toBeInTheDocument();
  });
});
