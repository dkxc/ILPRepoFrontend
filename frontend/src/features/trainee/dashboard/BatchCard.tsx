import { type Batch, type BatchStatus } from "../types/Batch.types";
import * as Card from "../../ui/card";

import { CalendarMinus, CalendarPlus } from "lucide-react";
import { cn } from "../../../lib/utils";
import Badge from "../../ui/badge/Badge";
import Skeleton from "../../ui/Skeleton";
import { type UseQueryResult } from "@tanstack/react-query";

const getStatusBadgeVariant = (status: BatchStatus) => {
  if (status === "Ongoing") {
    return "success";
  } else if (status === "Completed") {
    return "none";
  } else if (status === "Not Started") {
    return "warn";
  } else {
    return "none";
  }
};

export interface BatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  query: UseQueryResult<Batch>;
}

function BatchCard({
  query,
  className,
  ref,
  ...props
}: BatchCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { data: batch, status } = query;

  if (status === "pending") {
    return (
      <Card.Card className={cn("flex flex-col h-full", className)}>
        <Card.CardHeader className="pb-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </Card.CardHeader>
        <Card.CardContent className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </Card.CardContent>
        <Card.CardFooter>
          <Skeleton className="h-14 w-full" />
        </Card.CardFooter>
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
        <Card.CardHeader>
          <Card.CardTitle>Something went wrong.</Card.CardTitle>
          <Card.CardDescription>
            Could not load batch data.
          </Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

  if (!batch) return null;

  return (
    <Card.Card
      className={cn("flex flex-col h-full", className)}
      ref={ref}
      {...props}
    >
      <Card.CardHeader className="pb-4">
        <Card.CardTitle>{batch.title}</Card.CardTitle>
        <Card.CardDescription className="flex flex-col gap-2">
          <div>{batch.type}</div>
          <div>
            <Badge variant={getStatusBadgeVariant(batch.status)}>
              {" "}
              {batch.status}
            </Badge>
          </div>
        </Card.CardDescription>
      </Card.CardHeader>

      <Card.CardContent className="flex-1">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between items-center"></div>
          <div className="flex gap-2">
            <span>
              <CalendarPlus className="w-4 h-4" />
            </span>
            <span>Start Date:</span>
            <span>{batch.startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 ">
            <span>
              <CalendarMinus className="w-4 h-4" />
            </span>
            <span>End Date:</span>
            <span>{batch.endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </Card.CardContent>

      <Card.CardFooter>
        <div className="flex bg-inactive-badge w-full p-4 items-center-safe justify-center font-medium rounded-md">
          DAY {batch.day}
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}

export default BatchCard;
