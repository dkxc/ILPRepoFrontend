import { cn } from "../../../lib/utils";

export interface WelcomeHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  firstName: string;
}

function WelcomeHeader({
  firstName,
  className,
  ref,
  ...props
}: WelcomeHeaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <h1
      className={cn("px-6 pt-4 font-semibold text-2xl", className)}
      ref={ref}
      {...props}
    >
      Welcome, {firstName}
    </h1>
  );
}

export default WelcomeHeader;
