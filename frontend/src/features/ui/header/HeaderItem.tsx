import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * Unlike other components, Header components are fixed.
 */
const headerItemVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-menuitem hover:text-menuitem-text cursor-pointer",
  {
    variants: {
      variant: {
        default: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface HeaderItemProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof headerItemVariants> {
  asChild?: boolean;
}

function HeaderItem({
  variant,
  className = "",
  asChild = false,
  ref,
  ...props
}: HeaderItemProps & { ref?: React.Ref<HTMLAnchorElement> }) {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      className={cn(headerItemVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
}

export default HeaderItem;
