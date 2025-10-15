import { type Scores } from "../../types/scores/Score.types";
import * as Card from "../../../ui/card";

import { cn } from "../../../../lib/utils";
import { ResponsivePie } from "@nivo/pie";
import { getPieDataFromPercent } from "../../../../lib/graphs/utils";

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
      className={cn("flex justify-between gap-4", className)}
      ref={ref}
      {...props}
    >
      <div className="w-full">
        <Card.CardHeader>
          <Card.CardTitle>Average Score</Card.CardTitle>
        </Card.CardHeader>

        <Card.CardContent className="flex h-4/5">
          <div className="flex-1">
            <ResponsivePie
              data={getPieDataFromPercent(scores.average, {
                1: "Average Score",
                2: "Gap",
              })}
              colors={["var(--color-brand-500)", "var(--color-inactive-badge)"]}
              cornerRadius={2}
              activeOuterRadiusOffset={8}
              margin={{ top: 16, right: 16, bottom: 16 }}
              enableArcLinkLabels={false}
              enableArcLabels={false}
              theme={{
                labels: {
                  text: {
                    fontWeight: "bold",
                    fontSize: 12,
                  },
                },
              }}
              tooltip={({ datum }) => (
                <>
                  <div className="p-2 bg-background rounded-md shadow-md text-sm font-secondary whitespace-nowrap">
                    <div>
                      <span
                        className={cn(
                          "font-medium",
                          (datum.color === "var(--color-brand-500)" &&
                            "text-brand") ||
                            "text-text-error",
                        )}
                      >
                        {datum.label}
                      </span>
                      : {datum.value}%
                    </div>
                    <div>
                      {datum.label === "Average Score" &&
                        scores.courses.map((course) => (
                          <div key={course.caption}>
                            <span className="font-medium">
                              {course.caption}
                            </span>
                            : {course.value}%
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            />
          </div>
        </Card.CardContent>
      </div>
    </Card.Card>
  );
}

export default ScoreCard;
