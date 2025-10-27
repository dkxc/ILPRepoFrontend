import { fileIconMap } from "@lib/fileIcons.utils";
import { cn } from "@lib/utils";
import type { TraineeDocument } from "features/trainee/types/TraineeDocument.types";
import { DownloadIcon } from "lucide-react";

export interface PublicDocumentsCardItem
  extends React.HTMLAttributes<HTMLDivElement> {
  document: TraineeDocument;
  iconClasses?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function PublicDocumentsCardItem({
  document,
  className,
  iconClasses = "w-6 min-w-6 h-6 min-h-6",
  ref,
  ...props
}: PublicDocumentsCardItem) {
  const fileIcon = fileIconMap[document.type] || fileIconMap["other"];
  return (
    <div
      className={cn(
        "flex justify-between items-center-safe p-4 group hover:bg-inactive-badge rounded-md",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex items-center-safe gap-3 min-w-0">
        <div>
          <img
            src={fileIcon.path}
            alt={fileIcon.label}
            className={iconClasses}
          />
        </div>
        <div className="flex flex-col pr-6 overflow-hidden">
          <div className="text-sm break-words">{document.title}</div>
          <div className="font-light text-xs">
            {document.uploadDate.toDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center-safe">
        <DownloadIcon className={fileIcon.colorClass} />
      </div>
    </div>
  );
}
