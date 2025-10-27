import type { UseQueryResult } from "@tanstack/react-query";
import type { TraineeDocument } from "../../../types/TraineeDocument.types";
import type React from "react";
import { PublicDocumentsCardLoading } from "./components/PublicDocumentsCardLoading";
import { GenericErrorCard } from "@ui/card/GenericErrorCard";
import { PublicDocumentsCardSuccess } from "./components/PublicDocumentsCardSuccess";

export interface PublicDocumentsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  query: UseQueryResult<TraineeDocument[]>;
  ref?: React.Ref<HTMLDivElement>;
}

function PublicDocumentsCard({
  query,
  className,
  ref,
  ...props
}: PublicDocumentsCardProps) {
  const { data: documents, status } = query;

  if (status === "pending") {
    return <PublicDocumentsCardLoading className={className} {...props} />;
  }

  if (status === "error") {
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
