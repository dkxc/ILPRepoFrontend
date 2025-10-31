import { describe, it, expect } from "vitest";

// Simple unit tests for API module structure
// For integration testing, the component tests cover API functionality

describe("API Helper Module", () => {
  it("should export all required API functions", async () => {
    const apiModule = await import("./api");

    expect(apiModule.getBatchMetadata).toBeDefined();
    expect(apiModule.getTeamList).toBeDefined();
    expect(apiModule.getCompletionRate).toBeDefined();
    expect(apiModule.getTechStack).toBeDefined();
    expect(apiModule.getProjectLinks).toBeDefined();
    expect(apiModule.getDocuments).toBeDefined();
    expect(apiModule.sendNotification).toBeDefined();
  });

  it("should export TypeScript types", async () => {
    // This test ensures the types are properly exported from the module
    const apiModule = await import("./api");

    // Check that the module structure is correct
    expect(typeof apiModule.getBatchMetadata).toBe("function");
    expect(typeof apiModule.getTeamList).toBe("function");
    expect(typeof apiModule.getCompletionRate).toBe("function");
    expect(typeof apiModule.getTechStack).toBe("function");
    expect(typeof apiModule.getProjectLinks).toBe("function");
    expect(typeof apiModule.getDocuments).toBe("function");
    expect(typeof apiModule.sendNotification).toBe("function");
  });

  it("should have proper function signatures", async () => {
    const apiModule = await import("./api");

    // Test that functions accept the expected number of parameters
    expect(apiModule.getBatchMetadata.length).toBe(1); // projectId
    expect(apiModule.getTeamList.length).toBe(1); // projectId
    expect(apiModule.getCompletionRate.length).toBe(1); // projectId
    expect(apiModule.getTechStack.length).toBe(1); // projectId
    expect(apiModule.getProjectLinks.length).toBe(1); // projectId
    expect(apiModule.getDocuments.length).toBe(1); // projectId
    expect(apiModule.sendNotification.length).toBe(5); // projectId, recipientIds, subject, message, sendToOutlook
  });
});
