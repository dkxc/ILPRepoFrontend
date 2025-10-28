import type { GetResponseType } from "features/admin/attendance/types/AttendanceRecord.types";

export const MOCK_BATCH_ID = 12345;

/**
 * The mock "database" of attendance records.
 * This data is a direct representation of the JSON that the API would return.
 * Declared with `let` so it can be modified by the MSW PUT handler.
 */
export let mockAttendanceRecords: GetResponseType[] = [
  // --- Date: 2025-10-27 ---
  {
    traineeId: 201,
    traineeName: "Liam Carter",
    date: "2025-10-27",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 202,
    traineeName: "Sophia Rodriguez",
    date: "2025-10-27",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 203,
    traineeName: "Noah Patel",
    date: "2025-10-27",
    forenoon: "A",
    afternoon: "A",
    total: "A",
  },
  {
    traineeId: 204,
    traineeName: "Olivia Chen",
    date: "2025-10-27",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 205,
    traineeName: "Ethan Williams",
    date: "2025-10-27",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },

  // --- Date: 2025-10-28 ---
  {
    traineeId: 201,
    traineeName: "Liam Carter",
    date: "2025-10-28",
    forenoon: "N/A",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 202,
    traineeName: "Sophia Rodriguez",
    date: "2025-10-28",
    forenoon: "N/A",
    afternoon: "A",
    total: "A",
  },
  {
    traineeId: 203,
    traineeName: "Noah Patel",
    date: "2025-10-28",
    forenoon: "N/A",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 204,
    traineeName: "Olivia Chen",
    date: "2025-10-28",
    forenoon: "N/A",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 205,
    traineeName: "Ethan Williams",
    date: "2025-10-28",
    forenoon: "N/A",
    afternoon: "A",
    total: "A",
  },

  // --- Date: 2025-10-29 ---
  {
    traineeId: 201,
    traineeName: "Liam Carter",
    date: "2025-10-29",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 202,
    traineeName: "Sophia Rodriguez",
    date: "2025-10-29",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 203,
    traineeName: "Noah Patel",
    date: "2025-10-29",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 204,
    traineeName: "Olivia Chen",
    date: "2025-10-29",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 205,
    traineeName: "Ethan Williams",
    date: "2025-10-29",
    forenoon: "A",
    afternoon: "A",
    total: "A",
  },

  // --- Date: 2025-10-30 ---
  {
    traineeId: 201,
    traineeName: "Liam Carter",
    date: "2025-10-30",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 202,
    traineeName: "Sophia Rodriguez",
    date: "2025-10-30",
    forenoon: "P",
    afternoon: "A",
    total: "PP",
  },
  {
    traineeId: 203,
    traineeName: "Noah Patel",
    date: "2025-10-30",
    forenoon: "A",
    afternoon: "P",
    total: "PP",
  },
  {
    traineeId: 204,
    traineeName: "Olivia Chen",
    date: "2025-10-30",
    forenoon: "P",
    afternoon: "P",
    total: "P",
  },
  {
    traineeId: 205,
    traineeName: "Ethan Williams",
    date: "2025-10-30",
    forenoon: "A",
    afternoon: "A",
    total: "A",
  },

  // --- Date: 2025-10-31 ---
  {
    traineeId: 201,
    traineeName: "Liam Carter",
    date: "2025-10-31",
    forenoon: "N/A",
    afternoon: "N/A",
    total: "N/A",
  },
  {
    traineeId: 202,
    traineeName: "Sophia Rodriguez",
    date: "2025-10-31",
    forenoon: "N/A",
    afternoon: "N/A",
    total: "N/A",
  },
  {
    traineeId: 203,
    traineeName: "Noah Patel",
    date: "2025-10-31",
    forenoon: "N/A",
    afternoon: "N/A",
    total: "N/A",
  },
  {
    traineeId: 204,
    traineeName: "Olivia Chen",
    date: "2025-10-31",
    forenoon: "N/A",
    afternoon: "N/A",
    total: "N/A",
  },
  {
    traineeId: 205,
    traineeName: "Ethan Williams",
    date: "2025-10-31",
    forenoon: "N/A",
    afternoon: "N/A",
    total: "N/A",
  },
];
