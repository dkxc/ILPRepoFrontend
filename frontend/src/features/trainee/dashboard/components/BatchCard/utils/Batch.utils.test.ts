import { describe, it, expect } from "vitest";
import { getStatusBadgeVariant } from "./Batch.utils";

describe("getStatusBadgeVariant", () => {
  it('should return "success" for "Ongoing"', () => {
    expect(getStatusBadgeVariant("Ongoing")).toBe("success");
  });

  it('should return "none" for "Completed"', () => {
    expect(getStatusBadgeVariant("Completed")).toBe("none");
  });

  it('should return "warn" for "Not Started"', () => {
    expect(getStatusBadgeVariant("Not Started")).toBe("warn");
  });

  it('should return "none" for an unknown status', () => {
    expect(getStatusBadgeVariant("Unknown" as any)).toBe("none");
  });
});
