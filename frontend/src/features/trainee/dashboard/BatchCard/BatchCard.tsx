import { type Batch } from "../../types/Batch.types";
import { type UseQueryResult } from "@tanstack/react-query";
import { BatchCardError } from "./components/BatchCardError";
import { BatchCardLoading } from "./components/BatchCardLoading";
import { BatchCardSuccess } from "./components/BatchCardSuccess";

export interface BatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  query: UseQueryResult<Batch>;
  ref?: React.Ref<HTMLDivElement>;
}

function BatchCard({ query, className, ref, ...props }: BatchCardProps) {
  const { data: batch, status } = query;

  if (status === "pending") {
    return <BatchCardLoading className={className} {...props} />;
  }

  if (status === "error") {
    return <BatchCardError className={className} {...props} />;
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
