import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center-safe justify-center-safe gap-2 whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-brand text-brand-foreground hover:bg-brand-hover",
        success: "bg-bg-success/40 text-text-base hover:bg-bg-success/90",
        error: "bg-bg-error text-text-base hover:bg-bg-error/90",
        warn: "bg-bg-warning text-text-base hover:bg-bg-warning/90",
        none: "bg-inactive-badge text-text-base hover:bg-inactive-badge-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.ButtonHTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  className,
  variant,
  children,
  asChild = false,
  ref,
  ...props
}: BadgeProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const Comp = asChild ? Slot : "span";
  return (
    <>
      <Comp
        className={cn(badgeVariants({ variant }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    </>
  );
}

export default Badge;
