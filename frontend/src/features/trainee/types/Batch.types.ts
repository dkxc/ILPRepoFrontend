export type BaseBatch = {
  id: number;
  title: string;
  type: string;
};

export type Batch = BaseBatch & {
  startDate: Date;
  endDate: Date;
  day: number;
  status: BatchStatus;
};
export type BatchStatus = "Not Started" | "Ongoing" | "Completed";

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
