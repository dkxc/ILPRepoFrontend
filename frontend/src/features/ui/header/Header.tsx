import { cn } from "../../../lib/utils";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo: string | React.ReactNode;
  logoWidth: string;
}

function Header({
  logo,
  logoWidth,
  children,
  className = "",
  ref,
  ...props
}: HeaderProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <header
      className={cn(
        "flex items-center-safe justify-between shrink-0",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div
        className={cn(
          "flex p-4 items-center-safe justify-center-safe",
          logoWidth,
        )}
      >
        {typeof logo === "string" ? <img src={logo} alt="Logo" /> : logo}
      </div>

      {children}
    </header>
  );
}

export default Header;
