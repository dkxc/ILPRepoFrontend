import * as Card from "../../features/ui/card";
import { cn } from "../../lib/utils";

export interface GenericErrorCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
}

export function GenericErrorCard({
  title = "Something went wrong.",
  message,
  className,
  ...props
}: GenericErrorCardProps) {
  return (
    <Card.Card
      className={cn(
        "flex flex-col h-full items-center justify-center text-center",
        className,
      )}
      {...props}
    >
      <Card.CardHeader>
        <Card.CardTitle>{title}</Card.CardTitle>
        <Card.CardDescription>{message}</Card.CardDescription>
      </Card.CardHeader>
    </Card.Card>
  );
}
