import type { Activity } from "../../types/Activity.types";
import * as Card from "../../../ui/card";

import { cn } from "../../../../lib/utils";
import RecentActivityCardItem from "./RecentActivityCardItem";

export interface RecentActivityCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  activities: Activity[];
}

function RecentActivityCard({
  activities,
  className,
  ref,
  ...props
}: RecentActivityCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Card.Card
      className={cn(
        "bg-sidebar-and-header-background flex justify-between gap-4",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex flex-col w-full">
        <Card.CardHeader>
          <Card.CardTitle>Recent Activity</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent className="flex flex-col items-center-safe self-center-safe justify-center-safe gap-4 w-3/4">
          {activities.map((activity) => (
            <div key={activity.id} className="w-full">
              <>
                <RecentActivityCardItem activity={activity} />
              </>
            </div>
          ))}
        </Card.CardContent>
      </div>
    </Card.Card>
  );
}

export default RecentActivityCard;
