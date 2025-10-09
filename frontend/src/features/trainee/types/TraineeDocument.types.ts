export type TraineeDocumentType =
  | "pdf"
  | "xlsx"
  | "xls"
  | "docx"
  | "doc"
  | "other";

export type TraineeDocument = {
  id: number;
  title: string;
  type: TraineeDocumentType;
  uploadDate: Date;
  url: string;
};
