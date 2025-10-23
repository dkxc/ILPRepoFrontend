import { Calendar1 } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { Session } from "../../types/Session.types";

export interface UpcomingSessionCardItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  row?: number;
  session: Session;
}

function UpcomingSessionCardItem({
  session,
  className,
  ref,
  ...props
}: UpcomingSessionCardItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "flex justify-between w-full border border-gray-200 p-3 rounded-md",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex gap-4 min-w-0">
        <div className="self-center-safe">
          <div>
            <Calendar1 />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-medium break-words">{session.title}</div>
          <div className="break-words">{session.category}</div>
        </div>
      </div>
      <div>{session.date.toLocaleDateString()}</div>
    </div>
  );
}

export default UpcomingSessionCardItem;
