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
        "grid grid-cols-12 align-middle items-center-safe text-center text-sm w-full break-words p-2 border-gray-700 border",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="col-span-6 font-medium">{session.title}</div>
      <div className="col-span-3">{session.category}</div>
      <div className="col-span-3">{session.date.toLocaleDateString()}</div>
    </div>
  );
}

export default UpcomingSessionCardItem;
