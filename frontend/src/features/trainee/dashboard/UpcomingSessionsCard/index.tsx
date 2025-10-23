import type { Session } from "../../types/Session.types";
import * as Card from "../../../ui/card";

import { cn } from "../../../../lib/utils";
import UpcomingSessionCardItem from "./UpcomingSessionCardItem";

export interface UpcomingSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  activities: Session[];
}

function UpcomingSessionCard({
  activities,
  className,
  ref,
  ...props
}: UpcomingSessionCardProps & { ref?: React.Ref<HTMLDivElement> }) {
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
