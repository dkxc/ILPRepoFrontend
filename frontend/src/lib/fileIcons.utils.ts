import * as FileIcons from "@lib/icons/documents";
import type { TraineeDocumentType } from "features/trainee/types/TraineeDocument.types";

interface FileIconInfo {
  path: string;
  colorClass: string;
  label: string;
}

export const fileIconMap: Record<TraineeDocumentType, FileIconInfo> = {
  pdf: {
    path: FileIcons.Pdf,
    colorClass: "group-hover:text-icon-pdf",
    label: "Pdf Filetype",
  },
  xlsx: {
    path: FileIcons.Xlsx,
    colorClass: "group-hover:text-icon-xls",
    label: "Xlsx Filetype",
  },
  xls: {
    path: FileIcons.Xls,
    colorClass: "group-hover:text-icon-xls",
    label: "Xls Filetype",
  },
  docx: {
    path: FileIcons.Docx,
    colorClass: "group-hover:text-icon-doc",
    label: "Docx Filetype",
  },
  doc: {
    path: FileIcons.Doc,
    colorClass: "group-hover:text-icon-doc",
    label: "Doc Filetype",
  },
  other: {
    path: FileIcons.Other,
    colorClass: "group-hover:text-icon-other",
    label: "Unknown Filetype",
  },
};
