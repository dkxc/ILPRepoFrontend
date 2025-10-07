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
        "flex justify-between align-middle p-4 hover:bg-inactive-badge rounded-md",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex align-middle">
        <div></div>
        <div className="flex flex-col justify-center">
          <div>{document.title}</div>
          <div className="font-light text-sm">
            {document.uploadDate.toDateString()}
          </div>
        </div>
      </div>
      <div className="h-full">
        <DownloadIcon />
      </div>
    </div>
  );
}

export default DocumentItem;
