import { type Project } from "../types/Project.types";
import * as Card from "../../ui/card";
import Button from "../../ui/Button";

import { cn } from "../../../lib/utils";

export interface ScoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
}

function ScoreCard({
  project,
  className,
  ref,
  ...props
}: ScoreCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Card.Card
      className={cn(
        "bg-sidebar-and-header-background flex justify-between gap-4",
        className,
      )}
      ref={ref}
      {...props}
    >
      <div>
        <Card.CardHeader>
          <Card.CardTitle>Scores</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent></Card.CardContent>

        <Card.CardFooter>
          <Button
            size="sm"
            className="rounded-2xl px-4 bg-red-700 hover:bg-red-900"
          >
            Under Construction
          </Button>
        </Card.CardFooter>
      </div>
      <div className="flex-1">{/* Pie Chart */}</div>
    </Card.Card>
  );
}

export default ScoreCard;
