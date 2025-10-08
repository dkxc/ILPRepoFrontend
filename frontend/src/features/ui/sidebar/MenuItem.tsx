import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * Unlike other components, Sidebar components are fixed.
 */
const menuItemVariants = cva(
  "relative z-0 inline-flex items-center gap-3 whitespace-nowrap rounded-md p-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer overflow-hidden before:absolute before:inset-0 before:bg-brand before:w-0 before:transition-all before:duration-300 before:-z-10 hover:bg-brand/5 hover:text-brand w-full",
  {
    variants: {
      isActive: {
        true: "bg-brand-700/5 text-brand",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export interface MenuItemProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof menuItemVariants> {
  asChild?: boolean;
}

function MenuItem({
  isActive,
  className = "",
  asChild = false,
  ref,
  ...props
}: MenuItemProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      className={cn(menuItemVariants({ isActive }), className)}
      ref={ref}
      {...props}
    />
  );
}

export default MenuItem;
