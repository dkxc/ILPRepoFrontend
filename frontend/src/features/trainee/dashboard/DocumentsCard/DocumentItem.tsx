import { DownloadIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type {
  TraineeDocument,
  TraineeDocumentType,
} from "../../types/TraineeDocument.types";
import * as DocumentIcons from "./icons";

export interface DocumentItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  document: TraineeDocument;
  iconClassName?: string;
}

/* TODO: Merge this later! */
const documentIconMap: Record<TraineeDocumentType, string> = {
  pdf: DocumentIcons.PdfIcon,
  xlsx: DocumentIcons.XlsxIcon,
  xls: DocumentIcons.XlsIcon,
  docx: DocumentIcons.DocxIcon,
  doc: DocumentIcons.DocIcon,
  other: DocumentIcons.OtherIcon,
};

const documentIconColors: Record<TraineeDocumentType, string> = {
  pdf: "group-hover:text-icon-pdf",
  xlsx: "group-hover:text-icon-xls",
  xls: "group-hover:text-icon-xls",
  docx: "group-hover:text-icon-doc",
  doc: "group-hover:text-icon-doc",
  other: "group-hover:text-icon-other",
};

const getIcon = (documentType: TraineeDocumentType, iconClassName: string) => {
  const documentIconPath =
    documentIconMap[documentType] || DocumentIcons.OtherIcon;
  const ariaLabel = `${documentType} document icon`;
  return (
    <img src={documentIconPath} alt={ariaLabel} className={iconClassName} />
  );
};

function DocumentItem({
  document,
  className,
  iconClassName = "w-6 min-w-6 h-6 min-h-6",
  ref,
  ...props
}: DocumentItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "flex justify-between items-center-safe p-4 group hover:bg-inactive-badge rounded-md",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex items-center-safe gap-3">
        <div>{getIcon(document.type, iconClassName)}</div>
        <div className="flex flex-col">
          <div className="text-sm">{document.title}</div>
          <div className="font-light text-xs">
            {document.uploadDate.toDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center-safe">
        <DownloadIcon className={documentIconColors[document.type]} />
      </div>
    </div>
  );
}

export default DocumentItem;
