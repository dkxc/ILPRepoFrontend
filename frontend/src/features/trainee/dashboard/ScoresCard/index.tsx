import { type Scores } from "../../types/scores/Score.types";
import * as Card from "../../../ui/card";
import Skeleton from "@ui/skeleton";

import { cn } from "../../../../lib/utils";
import { ResponsivePie } from "@nivo/pie";
import { getPieDataFromPercent } from "../../../../lib/graphs/utils";
import type { SimpleQueryResult } from "@features/trainee/types/SimplerQuery.types";

export interface ScoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  query: SimpleQueryResult<Scores>;
}

function ScoreCard({
  query,
  className,
  ref,
  ...props
}: ScoreCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { data: scores, isLoading, isError } = query;

  if (isLoading) {
    return (
      <Card.Card className={cn("flex flex-col h-full", className)}>
        <Card.CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </Card.CardHeader>
        <Card.CardContent className="flex-1 flex items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </Card.CardContent>
      </Card.Card>
    );
  }

  if (isError) {
    return (
      <Card.Card
        className={cn(
          "flex flex-col h-full items-center justify-center",
          className,
        )}
      >
        <Card.CardHeader className="text-center">
          <Card.CardTitle>Something went wrong.</Card.CardTitle>
          <Card.CardDescription>Could not load scores.</Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

  if (!scores || scores.average === 0) {
    return (
      <Card.Card
        className={cn(
          "flex flex-col h-full items-center justify-center",
          className,
        )}
      >
        <Card.CardHeader className="text-center">
          <Card.CardDescription>
            Scores yet to be uploaded.
          </Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

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
                    {`${scores.average.toFixed(2)}%`}
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
                    : {datum.value.toFixed(2)}%
                  </div>
                  <div>
                    {datum.label === "Average Score" &&
                      scores.courses.map((course) => (
                        <div key={course.caption}>
                          <span className="font-medium">{course.caption}</span>:{" "}
                          {course.value.toFixed(2)}%
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
