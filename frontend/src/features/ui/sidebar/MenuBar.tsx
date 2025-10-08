import { cn } from "../../../lib/utils";

export interface MenuBarProps extends React.HTMLAttributes<HTMLElement> {}

function MenuBar({
  className = "",
  children,
  ref,
  ...props
}: MenuBarProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <nav
      ref={ref}
      className={cn("flex flex-col gap-2 py-6 px-4", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export default MenuBar;
