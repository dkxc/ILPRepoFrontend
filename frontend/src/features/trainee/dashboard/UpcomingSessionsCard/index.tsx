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
      className={cn("flex justify-between gap-4", className)}
      ref={ref}
      {...props}
    >
      <div className="flex flex-col w-full">
        <Card.CardHeader>
          <Card.CardTitle>Upcoming Sessions</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent className="flex flex-col gap-2 h-52 max-h-52 overflow-y-auto w-11/12 self-center-safe">
          {activities.map((activity) => (
            <div key={activity.id} className="w-full">
              <>
                <UpcomingSessionCardItem session={activity} />
              </>
            </div>
          ))}
        </Card.CardContent>
      </div>
    </Card.Card>
  );
}

export default UpcomingSessionCard;
