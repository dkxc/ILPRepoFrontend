import type { TraineeDocument } from "../../types/TraineeDocument.types";
import * as Card from "../../../ui/card";

import { cn } from "../../../../lib/utils";
import DocumentItem from "./DocumentItem";
import { NavLink } from "react-router";

import { type UseQueryResult } from "@tanstack/react-query";
import Skeleton from "../../../ui/Skeleton";

export interface DocumentsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  query: UseQueryResult<TraineeDocument[]>;
}

function DocumentsCard({
  query,
  className,
  ref,
  ...props
}: DocumentsCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { data: documents, status } = query;

  if (status === "pending") {
    return (
      <Card.Card className={cn("flex flex-col h-full", className)}>
        <Card.CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </Card.CardHeader>
        <Card.CardContent className="flex-1 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </Card.CardContent>
      </Card.Card>
    );
  }

  if (status === "error") {
    return (
      <Card.Card
        className={cn(
          "flex flex-col h-full items-center justify-center",
          className,
        )}
      >
        <Card.CardHeader className="text-center">
          <Card.CardTitle>Something went wrong.</Card.CardTitle>
          <Card.CardDescription>Could not load documents.</Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

  if (!documents) return null;

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
