export interface HeaderBarProps extends React.HTMLAttributes<HTMLDivElement> {}

function HeaderBar({
  className = "",
  ref,
  ...props
}: HeaderBarProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={`flex items-center-safe gap-1 px-4 ${className}`}
      {...props}
    />
  );
}

export default HeaderBar;
