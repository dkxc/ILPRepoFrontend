import type { UseQueryResult } from "@tanstack/react-query";
import type { TraineeDocument } from "../../../types/TraineeDocument.types";
import { PublicDocumentsCardLoading } from "./components/PublicDocumentsCardLoading";
import { GenericErrorCard } from "@ui/card/GenericErrorCard";
import { PublicDocumentsCardSuccess } from "./components/PublicDocumentsCardSuccess";
import type { SimpleQueryResult } from "@features/trainee/types/SimplerQuery.types";
import * as Card from "@features/ui/card";
import { cn } from "@lib/utils";

export interface PublicDocumentsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  query: SimpleQueryResult<TraineeDocument[]>;
  ref?: React.Ref<HTMLDivElement>;
}

function PublicDocumentsCard({
  query,
  className,
  ref,
  ...props
}: PublicDocumentsCardProps) {
  const { data: documents, isLoading, isError } = query;

  if (isLoading) {
    return <PublicDocumentsCardLoading className={className} {...props} />;
  }

  if (isError) {
    return (
      <GenericErrorCard
        message="Could not load project data."
        className={className}
        {...props}
      />
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card.Card
        className={cn(
          "flex flex-col h-full items-center justify-center",
          className,
        )}
      >
        <Card.CardHeader className="text-center">
          <Card.CardDescription>
            No Documents uploaded yet.
          </Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

  return (
    <PublicDocumentsCardSuccess
      documents={documents}
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export default PublicDocumentsCard;
