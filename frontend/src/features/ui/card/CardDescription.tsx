import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

function CardDescription({
  className = "",
  asChild = false,
  ref,
  ...props
}: CardDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) {
  const Comp = asChild ? Slot : "p";
  return <Comp className={cn("text-sm font-medium", className)} ref={ref} {...props} />;
}

export default CardDescription;
