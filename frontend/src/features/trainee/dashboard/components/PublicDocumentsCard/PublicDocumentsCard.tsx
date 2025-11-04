import type { UseQueryResult } from "@tanstack/react-query";
import type { TraineeDocument } from "../../../types/TraineeDocument.types";
import { PublicDocumentsCardLoading } from "./components/PublicDocumentsCardLoading";
import { GenericErrorCard } from "@ui/card/GenericErrorCard";
import { PublicDocumentsCardSuccess } from "./components/PublicDocumentsCardSuccess";
import type { SimpleQueryResult } from "@features/trainee/types/SimplerQuery.types";

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

  if (!documents) {
    return null;
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
