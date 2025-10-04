export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo: string | React.ReactNode;
  logoWidth: string;
}

function Header({
  logo,
  logoWidth,
  className = "",
  ref,
  ...props
}: HeaderProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <header
      className={`flex align-middle justify-between ${className}`}
      ref={ref}
      {...props}
    >
      <div className={`${logoWidth} flex p-4 align-middle justify-center-safe`}>
        {typeof logo === "string" ? <img src={logo} alt="Logo" /> : logo}
      </div>
    </header>
  );
}

export default Header;
