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
      <div>{activity.time.toLocaleDateString()}</div>
    </div>
  );
}

export default RecentActivityCardItem;
