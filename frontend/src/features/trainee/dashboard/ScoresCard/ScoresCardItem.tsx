import { cn } from "../../../../lib/utils";
import type { ScoreItem } from "../../types/scores/ScoreItem.types";

export interface ScoreCardItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  item: ScoreItem;
}

function ScoreCardItem({
  item,
  className,
  ref,
  ...props
}: ScoreCardItemProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center-safe justify-between text-center",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div>
        <h2 className="font-medium text-2xl">{item.value}</h2>
      </div>
      <div className="text-sm overflow-hidden">{item.caption}</div>
    </div>
  );
}

export default ScoreCardItem;
