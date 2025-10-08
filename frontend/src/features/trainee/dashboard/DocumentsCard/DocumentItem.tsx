import { DownloadIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { TraineeDocument } from "../../types/TraineeDocument.types";

export interface DocumentItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  document: TraineeDocument;
}

function DocumentItem({
  document,
  className,
  ref,
  ...props
}: DocumentItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "flex justify-between items-center-safe p-4 hover:bg-inactive-badge rounded-md",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex">
        <div></div>
        <div className="flex flex-col">
          <div className="text-sm">{document.title}</div>
          <div className="font-light text-xs">
            {document.uploadDate.toDateString()}
          </div>
        </div>
      </div>
      <div className="flex items-center-safe">
        <DownloadIcon />
      </div>
    </div>
  );
}

export default DocumentItem;
