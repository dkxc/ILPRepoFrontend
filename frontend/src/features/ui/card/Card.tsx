import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function Card({
  className = "",
  asChild = false,
  ref,
  ...props
}: CardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn("rounded-lg shadow-sm", className)}
      ref={ref}
      {...props}
    ></Comp>
  );
}

export default Card;
