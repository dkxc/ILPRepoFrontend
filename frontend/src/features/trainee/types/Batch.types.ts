export type BatchStatus = "Not Started" | "Ongoing" | "Completed";

export type BaseBatch = {
  id: number;
  title: string;
  type: string;
};

export type BaseBatchWithDayAndStatus = BaseBatch & {
  day: number;
  status: BatchStatus;
};

export type Batch = BaseBatchWithDayAndStatus & {
  startDate: Date;
  endDate: Date;
};

export type ApiBatch = BaseBatchWithDayAndStatus & {
  startDate: string;
  endDate: string;
};

/* Batch Assessment */
export type BatchAssessment = BaseBatch & {
  totalTrainees: number;
  status: "Pending" | "Completed";
};

export type BatchDocument = BaseBatch & {
  totalTrainees: number;
};

export type Assessment = {
  id: number;
  batchId: string;
  documentType:
    | "Tech Fundamentals"
    | "Specialisation"
    | "Overall Assessment"
    | "Others";
  documentName?: string;
  fileName?: string;
  uploadedDate?: Date;
};
