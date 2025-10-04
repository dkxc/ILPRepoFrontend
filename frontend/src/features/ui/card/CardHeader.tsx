import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function CardHeader({
  className = "",
  asChild = false,
  ref,
  ...props
}: CardHeaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      ref={ref}
      {...props}
    />
  );
}

export default CardHeader;
