import { cn } from "../../../../lib/utils";
import type { Activity } from "../../types/Activity.types";

export interface RecentActivtyCardItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  activity: Activity;
}

function RecentActivityCardItem({
  activity,
  className,
  ref,
  ...props
}: RecentActivtyCardItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn("flex justify-around items-center-sage text-sm", className)}
      ref={ref}
      {...props}
    >
      <div>
        <span className="font-medium">{activity.type}</span> {activity.section}
      </div>
      <div>
        {activity.time.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export default RecentActivityCardItem;
