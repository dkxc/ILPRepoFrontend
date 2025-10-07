import { type Batch } from "../types/Batch.types";
import * as Card from "../../ui/card";

import { cn } from "../../../lib/utils";
import { CalendarMinus, CalendarPlus } from "lucide-react";

export interface BatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  batch: Batch;
}

function BatchCard({
  batch,
  className,
  ref,
  ...props
}: BatchCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Card.Card
      className={cn("bg-sidebar-and-header-background", className)}
      ref={ref}
      {...props}
    >
      <Card.CardHeader>
        <Card.CardTitle>{batch.title}</Card.CardTitle>
        <Card.CardDescription>{batch.type}</Card.CardDescription>
      </Card.CardHeader>

      <Card.CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex gap-2">
          <span>
            <CalendarPlus className="w-4 h-4" />
          </span>
          <span>Start Date:</span>
          <span>{batch.startDate.toDateString()}</span>
        </div>
        <div className="flex gap-2 ">
          <span>
            <CalendarMinus className="w-4 h-4" />
          </span>
          <span>End Date:</span>
          <span>{batch.endDate.toDateString()}</span>
        </div>
      </Card.CardContent>

      <Card.CardFooter>
        <div className="flex bg-inactive-badge w-full p-4 align-middle justify-center font-medium rounded-md">
          DAY {batch.day}
        </div>
      </Card.CardFooter>
    </Card.Card>
  );
}

export default BatchCard;
