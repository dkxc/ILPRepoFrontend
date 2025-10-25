import * as Card from "../../../../ui/card";
import { cn } from "../../../../../lib/utils";

export function BatchCardError({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card.Card
      className={cn(
        "flex flex-col h-full items-center justify-center text-center",
        className,
      )}
      {...props}
    >
      <Card.CardHeader>
        <Card.CardTitle>Something went wrong.</Card.CardTitle>
        <Card.CardDescription>Could not load batch data.</Card.CardDescription>
      </Card.CardHeader>
    </Card.Card>
  );
}
