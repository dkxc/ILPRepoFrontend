import { type Scores } from "../../types/scores/Score.types";
import * as Card from "../../../ui/card";
import Button from "../../../ui/Button";

import { cn } from "../../../../lib/utils";
import ScoreCardItem from "./ScoresCardItem";

export interface ScoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  scores: Scores;
}

function ScoreCard({
  scores,
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
      <div className="w-full">
        <Card.CardHeader>
          <Card.CardTitle>Scores</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent>
          <Button
            size="sm"
            className="rounded-2xl px-4 bg-red-700 hover:bg-red-900"
          >
            Under Construction
          </Button>
        </Card.CardContent>

        <Card.CardFooter>
          <div>

          </div>
          <div className="flex gap-4">
            {
              scores.courses.map((scoreItem) => (
                <div key={scoreItem.caption} className="flex-1">
                <>
                  <ScoreCardItem item={scoreItem} />
                </>
                </div>
              ))
            }
          </div>
        </Card.CardFooter>
      </div>
    </Card.Card>
  );
}

export default ScoreCard;
