import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function CardFooter({
  className = "",
  asChild = false,
  ref,
  ...props
}: CardFooterProps & { ref?: React.Ref<HTMLDivElement> }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn("flex items-center p-6 pt-0", className)}
      ref={ref}
      {...props}
    />
  );
}

export default CardFooter;
