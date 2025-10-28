export const AttendanceStatus = {
  Present: "P",
  Absent: "A",
  NotApplicable: "N/A",
} as const;

export const FullAttendanceStatus = {
  ...AttendanceStatus,
  PartiallyPresent: "PP",
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export type FullAttendanceStatus =
  (typeof FullAttendanceStatus)[keyof typeof FullAttendanceStatus];

// For GET: /api/attendance/batch/{batchId}
export type GetQueryType = {
  start_date?: string;
  end_date?: string;
  status?: FullAttendanceStatus;
};

export type GetResponseType = {
  traineeId: number;
  traineeName: string;
  date: string;
  forenoon: AttendanceStatus;
  afternoon: AttendanceStatus;
  total: FullAttendanceStatus;
};

// For PUT: /api/attendance/batch/{batchId}
export type UpdateQueryType = {
  traineeIds: number[];
  startDate: string;
  endDate: string;
  status: {
    forenoon: AttendanceStatus;
    afternoon: AttendanceStatus;
  };
};

export type UpdateSuccessResponseType = {
  status: "success";
  updateRecordCount: number;
};

// API Errors
export type ApiErrorResponse = {
  statusCode: number;
  message: string;
};
