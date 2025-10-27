import { cn } from "@lib/utils";

function Skeleton({
  className,
  "data-testid": dataTestId = "skeleton-loader",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { "data-testid"?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-inactive-badge", className)}
      data-testid={dataTestId}
      {...props}
    />
  );
}

export default Skeleton;
