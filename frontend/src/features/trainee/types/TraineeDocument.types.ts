export type TraineeDocumentType =
  | "pdf"
  | "xlsx"
  | "xls"
  | "docx"
  | "doc"
  | "other";

export type TraineeDocumentBase = {
  id: number;
  title: string;
  type: TraineeDocumentType;
  url: string;
};

export type TraineeDocument = TraineeDocumentBase & {
  uploadDate: Date;
};

export type ApiTraineeDocument = TraineeDocumentBase & {
  uploadDate: string;
};
