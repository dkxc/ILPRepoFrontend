import { cn } from "../../../lib/utils";
import Skeleton from "../../ui/Skeleton";

export interface WelcomeHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  firstName: string;
  isLoading?: boolean;
}

function WelcomeHeader({
  firstName,
  isLoading,
  className,
  ref,
  ...props
}: WelcomeHeaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  if (isLoading) {
    return (
      <div className={cn("px-6 pt-4", className)}>
        <Skeleton className="h-8 w-64" />
      </div>
    );
  }

  return (
    <h1
      className={cn("px-6 pt-4 font-semibold text-2xl", className)}
      ref={ref}
      {...props}
    >
      Welcome, {firstName || "User"}
    </h1>
  );
}

export default WelcomeHeader;
