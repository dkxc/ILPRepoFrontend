import { WelcomeHeaderLoading } from "./components/WelcomeHeaderLoading";
import { WelcomeHeaderSuccess } from "./components/WelcomeHeaderSuccess";

export interface WelcomeHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  firstName: string;
  isLoading?: boolean;
}

function WelcomeHeader({
  firstName,
  isLoading,
  className,
  ref,
  ...props
}: WelcomeHeaderProps & { ref?: React.Ref<HTMLDivElement> }) {
  if (isLoading) {
    return <WelcomeHeaderLoading className={className} {...props} />;
  }

  return (
    <WelcomeHeaderSuccess
      firstName={firstName}
      className={className}
      {...props}
    />
  );
}

export default WelcomeHeader;
