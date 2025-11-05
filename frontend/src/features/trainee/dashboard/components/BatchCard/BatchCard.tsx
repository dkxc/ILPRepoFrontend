import { type Batch } from "../../../types/Batch.types";

import { GenericErrorCard } from "@ui/card/GenericErrorCard";

import { BatchCardLoading } from "./components/BatchCardLoading";
import { BatchCardSuccess } from "./components/BatchCardSuccess";
import type { SimpleQueryResult } from "@features/trainee/types/SimplerQuery.types";

export interface BatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  query: SimpleQueryResult<Batch>;
  ref?: React.Ref<HTMLDivElement>;
}

function BatchCard({ query, className, ref, ...props }: BatchCardProps) {
  const { data: batch, isLoading, isError } = query;

  if (isLoading) {
    return <BatchCardLoading className={className} {...props} />;
  }

  if (isError) {
    return (
      <GenericErrorCard
        message="Could not load batch data."
        className={className}
        {...props}
      />
    );
  }

  if (!batch) {
    return null;
  }

  return (
    <BatchCardSuccess
      batch={batch}
      className={className}
      ref={ref}
      {...props}
    />
  );
}

export default BatchCard;
