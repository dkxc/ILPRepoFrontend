import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { server } from "../../../mocks/server";
import { http, HttpResponse } from "msw";

import { renderWithRouter } from "../../../test/utils";
import Dashboard from "./Dashboard";

describe("Trainee Dashboard", () => {
  it("should fetch data from MSW and render all cards successfully", async () => {
    renderWithRouter(<Dashboard />);

    // WelcomeHeader (MSW delay: 200ms)
    // regex is more robust to changes in surrounding text.
    expect(await screen.findByText(/Welcome, Name/)).toBeInTheDocument();

    // ProjectCard (MSW delay: 2000ms)
    expect(
      await screen.findByText("ILP Repo", {}, { timeout: 3000 }),
    ).toBeInTheDocument();

    // BatchCard (MSW delay: 1500ms)
    expect(
      await screen.findByText("ILP 2025-26 Batch 1", {}, { timeout: 2000 }),
    ).toBeInTheDocument();

    // DocumentsCard (MSW delay: 1200ms)
    expect(
      await screen.findByText("JS Module Test File", {}, { timeout: 2000 }),
    ).toBeInTheDocument();

    // ScoreCard (MSW delay: 500ms)
    expect(
      await screen.findByText("Average Score", {}, { timeout: 1000 }),
    ).toBeInTheDocument();

    // UpcomingSessionsCard (MSW delay: 3000ms)
    expect(
      await screen.findByText(".NET Fundamentals", {}, { timeout: 4000 }),
    ).toBeInTheDocument();
  });

  it("should show an error in a card if its specific API call fails", async () => {
    // Override the documents handler to return 500
    server.use(
      http.get("/api/project/:projectId", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithRouter(<Dashboard />);

    // ASSERT Behavior:
    // The rest of the dashboard should still load correctly.
    expect(await screen.findByText(/Welcome, Name/)).toBeInTheDocument();
    expect(await screen.findByText("Average Score")).toBeInTheDocument();

    // ASSERT Behavior:
    // The ProjectCard should now show "Something went wrong"
    expect(
      await screen.findByText("Something went wrong."),
    ).toBeInTheDocument();

    // ASSERT Behavior:
    // Crucially, the project's actual data should NOT be rendered.
    expect(screen.queryByText("ILP Repo")).not.toBeInTheDocument();
  });

  it("should show an empty state message when an API returns an empty array", async () => {
    // Override the documents handler to return an empty array
    server.use(
      http.get("/api/documents", () => {
        return HttpResponse.json([]);
      }),
    );

    renderWithRouter(<Dashboard />);

    // ASSERT Behavior:
    // DocumentsCard component should return "No documents found."
    // TODO: Need to implement this
    expect(await screen.findByText("No documents found.")).toBeInTheDocument();

    // ASSERT Behavior:
    // The original mock data should not be present.
    expect(screen.queryByText("JS Module Test File")).not.toBeInTheDocument();

    // ASSERT Behavior:
    // Other parts of the dashboard should load normally.
    expect(
      await screen.findByText("ILP Repo", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("should handle failure of the critical profile API call", async () => {
    // Override the profile handler to simulate a failure
    server.use(
      http.get("/api/profile", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithRouter(<Dashboard />);

    // ASSERT Behavior:
    // The welcome header won't have a name.
    // The dependent queries (project, batch) will likely fail immediately
    // because they won't have an ID to query with.

    // The generic welcome message should appear.
    expect(await screen.findByText(/Welcome, User/)).toBeInTheDocument();

    // We expect to see multiple error messages as the dependent queries fail.
    const errorMessages = await screen.findAllByText("Something went wrong.");
    expect(errorMessages.length).toBeGreaterThan(0);

    // No data-specific content should be rendered.
    expect(screen.queryByText("ILP Repo")).not.toBeInTheDocument();
    expect(screen.queryByText("ILP 2025-26 Batch 1")).not.toBeInTheDocument();
  });
});
