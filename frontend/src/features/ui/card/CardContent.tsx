import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

function CardContent({
  className = "",
  asChild = false,
  ref,
  ...props
}: CardContentProps & { ref?: React.Ref<HTMLDivElement> }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn("p-6 pt-0 font-normal", className)}
      ref={ref}
      {...props}
    />
  );
}

export default CardContent;
