import * as Card from "../../../../ui/card";
import Skeleton from "../../../../ui/Skeleton";
import { cn } from "../../../../../lib/utils";

export function BatchCardLoading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card.Card className={cn("flex flex-col h-full", className)} {...props}>
      <Card.CardHeader className="pb-4">
        <Skeleton className="h-6 w-3/4" data-testid="skeleton" />
        <Skeleton className="h-4 w-1/2 mt-2" data-testid="skeleton" />
      </Card.CardHeader>
      <Card.CardContent className="flex-1 space-y-3">
        <Skeleton className="h-4 w-full" data-testid="skeleton" />
        <Skeleton className="h-4 w-full" data-testid="skeleton" />
      </Card.CardContent>
      <Card.CardFooter>
        <Skeleton className="h-14 w-full" data-testid="skeleton" />
      </Card.CardFooter>
    </Card.Card>
  );
}
