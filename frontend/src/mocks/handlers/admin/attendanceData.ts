import type { GetResponseType } from "features/admin/attendance/types/AttendanceQuery.types";

export const MOCK_BATCH_ID = 12345;

/**
 * The mock "database" of pivoted attendance records.
 * This data is a direct representation of the JSON that the API would return.
 * Declared with `let` so it can be modified by the MSW PUT handler.
 */
export let mockAttendanceRecords: GetResponseType[] = [
  {
    traineeId: 201,
    traineeName: "Liam Carter",
    dates: {
      "2025-10-27": { forenoon: "P", afternoon: "P" },
      "2025-10-28": { forenoon: "N/A", afternoon: "P" },
      "2025-10-29": { forenoon: "P", afternoon: "P" },
      "2025-10-30": { forenoon: "P", afternoon: "P" },
      "2025-10-31": { forenoon: "N/A", afternoon: "N/A" },
    },
  },
  {
    traineeId: 202,
    traineeName: "Sophia Rodriguez",
    dates: {
      "2025-10-27": { forenoon: "P", afternoon: "P" },
      "2025-10-28": { forenoon: "N/A", afternoon: "A" },
      "2025-10-29": { forenoon: "P", afternoon: "P" },
      "2025-10-30": { forenoon: "P", afternoon: "A" },
      "2025-10-31": { forenoon: "N/A", afternoon: "N/A" },
    },
  },
  {
    traineeId: 203,
    traineeName: "Noah Patel",
    dates: {
      "2025-10-27": { forenoon: "A", afternoon: "A" },
      "2025-10-28": { forenoon: "N/A", afternoon: "P" },
      "2025-10-29": { forenoon: "P", afternoon: "P" },
      "2025-10-30": { forenoon: "A", afternoon: "P" },
      "2025-10-31": { forenoon: "N/A", afternoon: "N/A" },
    },
  },
  {
    traineeId: 204,
    traineeName: "Olivia Chen",
    dates: {
      "2025-10-27": { forenoon: "P", afternoon: "P" },
      "2025-10-28": { forenoon: "N/A", afternoon: "P" },
      "2025-10-29": { forenoon: "P", afternoon: "P" },
      "2025-10-30": { forenoon: "P", afternoon: "P" },
      "2025-10-31": { forenoon: "N/A", afternoon: "N/A" },
    },
  },
  {
    traineeId: 205,
    traineeName: "Ethan Williams",
    dates: {
      "2025-10-27": { forenoon: "P", afternoon: "P" },
      "2025-10-28": { forenoon: "N/A", afternoon: "A" },
      "2025-10-29": { forenoon: "A", afternoon: "A" },
      "2025-10-30": { forenoon: "A", afternoon: "A" },
      "2025-10-31": { forenoon: "N/A", afternoon: "N/A" },
    },
  },
];
