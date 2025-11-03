import type { AttendanceStatus } from "./AttendanceRecord.types";

// For GET: /api/attendance/batch/{batchId}
export type GetQueryType = {
  start_date?: string;
  end_date?: string;
};

export type GetResponseType = {
  traineeId: number;
  traineeName: string;
  dates: {
    [date: string]: {
      forenoon: AttendanceStatus;
      afternoon: AttendanceStatus;
    };
  };
};

// For PUT: /api/attendance/batch/{batchId}
export type BulkUpdateStatus = Partial<{
  forenoon: AttendanceStatus;
  afternoon: AttendanceStatus;
}>;

export type UpdateQueryType = {
  traineeIds: number[];
  startDate: string;
  endDate: string;
  status: BulkUpdateStatus;
};

export type UpdateSuccessResponseType = {
  status: "success";
  updateRecordCount: number;
};

// For POST: /api/attendance/batch/{batchId}/upload
export type UploadJsonItem = {
  traineeName: string;
  date: string; // "yyyy-MM-dd"
  forenoon: AttendanceStatus;
  afternoon: AttendanceStatus;
};

export type UploadJsonQueryType = UploadJsonItem[];

export type ImportSuccessResponseType = {
  status: "success";
  message: string;
  updatedRecordCount: number;
  newTraineesCount: number;
};

// API Errors
export type ApiErrorResponse = {
  statusCode: number;
  message: string;
};
