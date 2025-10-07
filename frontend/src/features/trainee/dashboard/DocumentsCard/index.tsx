import type { TraineeDocument } from "../../types/TraineeDocument.types";
import * as Card from "../../../ui/card";

import { cn } from "../../../../lib/utils";
import DocumentItem from "./DocumentItem";
import { NavLink } from "react-router";

export interface DocumentsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  documents: TraineeDocument[];
}

function DocumentsCard({
  documents,
  className,
  ref,
  ...props
}: DocumentsCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Card.Card
      className={cn(
        "bg-sidebar-and-header-background flex justify-between gap-4",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="w-full">
        <Card.CardHeader>
          <Card.CardTitle>Documents</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent className="flex flex-col">
          {documents.map((doc) => (
            <NavLink key={doc.url} to={doc.url}>
              <>
                <DocumentItem document={doc} />
              </>
            </NavLink>
          ))}
        </Card.CardContent>
      </div>
    </Card.Card>
  );
}

export default DocumentsCard;
