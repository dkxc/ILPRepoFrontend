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
      className={cn("flex justify-between gap-4", className)}
      ref={ref}
      {...props}
    >
      <div className="w-full">
        <Card.CardHeader>
          <Card.CardTitle>Public Documents</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent className="flex flex-col h-52 max-h-52 overflow-y-auto">
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
        </Card.CardContent>

        <Card.CardFooter />
      </div>
    </Card.Card>
  );
}

export default DocumentsCard;
