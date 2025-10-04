import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../../lib/utils";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

function CardHeader({
  className = "",
  asChild = false,
  ref,
  ...props
}: CardTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) {
  const Comp = asChild ? Slot : "h3";
  return (
    <Comp
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
}

export default CardHeader;
