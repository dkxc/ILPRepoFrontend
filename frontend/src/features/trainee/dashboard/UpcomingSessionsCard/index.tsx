import type { Session } from "../../types/Session.types";
import * as Card from "../../../ui/card";
import Skeleton from "@ui/skeleton";

import { cn } from "../../../../lib/utils";
import UpcomingSessionCardItem from "./UpcomingSessionCardItem";
import { type UseQueryResult } from "@tanstack/react-query";
import type { SimpleQueryResult } from "@features/trainee/types/SimplerQuery.types";

export interface UpcomingSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  query: SimpleQueryResult<Session[]>;
}

function UpcomingSessionCard({
  query,
  className,
  ref,
  ...props
}: UpcomingSessionCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { data: activities, isLoading, isError } = query;

  if (isLoading) {
    return (
      <Card.Card className={cn("flex flex-col h-full", className)}>
        <Card.CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </Card.CardHeader>
        <Card.CardContent className="flex-1 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </Card.CardContent>
      </Card.Card>
    );
  }

  if (isError) {
    return (
      <Card.Card
        className={cn(
          "flex flex-col h-full items-center justify-center",
          className,
        )}
      >
        <Card.CardHeader className="text-center">
          <Card.CardTitle>Something went wrong.</Card.CardTitle>
          <Card.CardDescription>
            Could not load upcoming sessions.
          </Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

  if (!activities) return null;

  return (
    <Card.Card
      className={cn("flex flex-col h-full", className)}
      ref={ref}
      {...props}
    >
      <Card.CardHeader>
        <Card.CardTitle>Upcoming Sessions</Card.CardTitle>
      </Card.CardHeader>

      <Card.CardContent className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {activities.map((activity) => (
            <div key={activity.id} className="w-full">
              <>
                <UpcomingSessionCardItem session={activity} />
              </>
            </div>
          ))}
        </div>
      </Card.CardContent>

      <Card.CardFooter />
    </Card.Card>
  );
}

export default UpcomingSessionCard;
