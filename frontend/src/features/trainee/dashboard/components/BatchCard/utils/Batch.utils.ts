import type { BatchStatus } from "../../../../types/Batch.types";

export const getStatusBadgeVariant = (status: BatchStatus) => {
  if (status === "Ongoing") return "success";
  if (status === "Completed") return "none";
  if (status === "Not Started") return "warn";
  return "none";
};
