import type { GetResponseType } from "./AttendanceQuery.types";

export const AttendanceStatus = {
  Present: "P",
  Absent: "A",
  NotApplicable: "N/A",
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export type ProcessedTraineeData = GetResponseType & {
  presentFN: number;
  presentAN: number;
  totalPresentDays: number;
  totalPossibleDays: number;
};
