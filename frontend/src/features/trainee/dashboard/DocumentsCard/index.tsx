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
      className={cn("flex flex-col h-full", className)}
      ref={ref}
      {...props}
    >
      <Card.CardHeader>
        <Card.CardTitle>Public Documents</Card.CardTitle>
      </Card.CardHeader>

      <Card.CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-5 pt-0">
          {documents.map((doc) => (
            <NavLink
              key={doc.url}
              to={doc.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <>
                <DocumentItem document={doc} />
              </>
            </NavLink>
          ))}
        </div>
      </Card.CardContent>

      <Card.CardFooter />
    </Card.Card>
  );
}

export default DocumentsCard;
