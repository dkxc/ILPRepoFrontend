import { type TraineeDocument } from "../../../../types/TraineeDocument.types";
import * as Card from "../../../../../ui/card";
import { NavLink } from "react-router";
import { cn } from "@lib/utils";
import { PublicDocumentsCardItem } from "./PublicDocumentsCardItem";

export interface PublicDocumentsCardSuccessProps
  extends React.HTMLAttributes<HTMLDivElement> {
  documents: TraineeDocument[];
  ref?: React.Ref<HTMLDivElement>;
}

export function PublicDocumentsCardSuccess({
  documents,
  className,
  ref,
  ...props
}: PublicDocumentsCardSuccessProps) {
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
              key={doc.id}
              to={doc.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <>
                <PublicDocumentsCardItem document={doc} />
              </>
            </NavLink>
          ))}
        </div>
      </Card.CardContent>

      <Card.CardFooter />
    </Card.Card>
  );
}
