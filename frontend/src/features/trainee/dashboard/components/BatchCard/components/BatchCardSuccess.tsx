import React from "react";
import { type Batch } from "../../../../types/Batch.types";
import { getStatusBadgeVariant } from "../utils/Batch.utils";
import * as Card from "../../../../../ui/card";
import Badge from "../../../../../ui/badge/Badge";
import { CalendarMinus, CalendarPlus } from "lucide-react";
import { cn } from "@lib/utils";

export interface BatchCardSuccessProps
  extends React.HTMLAttributes<HTMLDivElement> {
  batch: Batch;
  ref?: React.Ref<HTMLDivElement>;
}

export function BatchCardSuccess({
  batch,
  className,
  ref,
  ...props
}: BatchCardSuccessProps) {
  return (
    <Card.Card
      className={cn("flex flex-col h-full", className)}
      ref={ref}
      {...props}
    >
      <Card.CardHeader className="pb-4">
        <Card.CardTitle>{batch.title}</Card.CardTitle>
        <Card.CardDescription asChild className="flex flex-col gap-2">
          <div>
            <div>{batch.type}</div>
            <div>
              <Badge variant={getStatusBadgeVariant(batch.status)}>
                {batch.status}
              </Badge>
            </div>
          </div>
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="flex-1">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2 items-center">
            <CalendarPlus className="w-4 h-4" />
            <span>Start Date:</span>
            <span>{batch.startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 items-center">
            <CalendarMinus className="w-4 h-4" />
            <span>End Date:</span>
            <span>{batch.endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </Card.CardContent>
      <Card.CardFooter>
        <div className="flex bg-inactive-badge w-full p-4 items-center justify-center font-medium rounded-md">
          DAY {batch.day}
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}
