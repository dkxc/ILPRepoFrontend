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
      className={cn("flex flex-col h-full", className)}
      ref={ref}
      {...props}
    >
      <Card.CardHeader>
        <Card.CardTitle>Average Score</Card.CardTitle>
      </Card.CardHeader>

      <Card.CardContent className="flex-1 relative p-0">
        <div className="absolute top-0 left-0 w-full h-full p-5 pt-0">
          <ResponsivePie
            data={getPieDataFromPercent(scores.average, {
              1: "Average Score",
              2: "Gap",
            })}
            colors={["var(--color-brand-500)", "var(--color-inactive-badge)"]}
            innerRadius={0.65}
            padAngle={0.65}
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
            layers={[
              "arcs",
              ({ centerX, centerY }) => (
                <>
                  <text
                    x={centerX}
                    y={centerY}
                    dy={-10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-xl font-semibold"
                    style={{ fill: "var(--color-text-base)" }}
                  >
                    {`${scores.average}%`}
                  </text>
                  <text
                    x={centerX}
                    y={centerY}
                    dy={14}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-xs"
                    style={{ fill: "var(--color-text-base)" }}
                  >
                    Average Score
                  </text>
                </>
              ),
            ]}
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
                          <span className="font-medium">{course.caption}</span>:{" "}
                          {course.value}%
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          />
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}

export default ScoreCard;
