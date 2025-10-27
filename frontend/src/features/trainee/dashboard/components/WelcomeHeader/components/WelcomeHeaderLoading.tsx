import Skeleton from "@ui/skeleton";
import { cn } from "@lib/utils";

export function WelcomeHeaderLoading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-4", className)} {...props}>
      <Skeleton className="h-8 w-64" />
    </div>
  );
}
