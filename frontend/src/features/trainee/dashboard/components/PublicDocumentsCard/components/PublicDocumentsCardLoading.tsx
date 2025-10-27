import * as Card from "../../../../../ui/card";
import Skeleton from "@ui/skeleton";
import { cn } from "@lib/utils";

export function PublicDocumentsCardLoading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card.Card className={cn("flex flex-col h-full", className)} {...props}>
      <Card.CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </Card.CardHeader>
      <Card.CardContent className="flex-1 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-8" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </Card.CardContent>
    </Card.Card>
  );
}
