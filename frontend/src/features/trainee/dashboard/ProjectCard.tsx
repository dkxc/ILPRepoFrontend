import { type Project } from "../types/Project.types";
import * as Card from "../../ui/card";
import Button from "../../ui/Button";

import { cn } from "../../../lib/utils";
import { ResponsivePie } from "@nivo/pie";
import { getPieDataFromPercent } from "../../../lib/graphs/utils";
import { Pencil, Radio, UploadCloud } from "lucide-react";
import Badge from "../../ui/badge/Badge";

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
}

const getProgressBadgeVariant = (
  status: "Live" | "In Progress" | "Completed",
) => {
  if (status === "Live") {
    return "success";
  } else if (status === "In Progress") {
    return "warn";
  } else {
    return "none";
  }
};

function ProjectCard({
  project,
  className,
  ref,
  ...props
}: ProjectCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <Card.Card
      className={cn("flex justify-between gap-1", className)}
      ref={ref}
      {...props}
    >
      <div className="flex justify-between w-full">
        <div className="self-center-safe">
          <Card.CardHeader>
            <Card.CardTitle>{project.title}</Card.CardTitle>
            <Card.CardDescription>
              Team {project.team.number}
            </Card.CardDescription>
          </Card.CardHeader>

          <Card.CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex items-center-safe gap-1">
              <span>Status:</span>
              <Badge variant={getProgressBadgeVariant(project.status)}>
                <Radio />
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center-safe gap-1">
              <span>Technology Used:</span>
              {project.technologies.map((tech) => (
                <Badge variant="none" key={tech}>
                  {tech}
                </Badge>
              ))}
            </div>
            <div>
              No. of Team Members:{" "}
              <span className="font-semibold">
                {project.team.members.length}
              </span>
            </div>
          </Card.CardContent>

          <Card.CardFooter className="flex gap-2">
            <Button size="sm" className="px-4 text-xs">
              <UploadCloud /> Upload Documents
            </Button>
            <Button
              size="sm"
              className="px-4 text-text-base bg-gray-200 hover:bg-gray-300 text-xs"
            >
              <Pencil /> Edit Details
            </Button>
          </Card.CardFooter>
        </div>
        <div className="w-48 m-4">
          <ResponsivePie
            data={getPieDataFromPercent(project.progress, {
              1: "Uploaded",
              2: "Not Uploaded",
            })}
            colors={["var(--color-brand-500)", "var(--color-inactive-badge)"]}
            innerRadius={0.6}
            padAngle={0.6}
            cornerRadius={2}
            activeOuterRadiusOffset={8}
            enableArcLinkLabels={false}
            enableArcLabels={false}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
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
                    className="text-2xl font-semibold"
                    style={{ fill: "var(--color-text-base)" }}
                  >
                    {`${project.progress}%`}
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
                    Uploaded
                  </text>
                </>
              ),
            ]}
            tooltip={({ datum }) => (
              <div className="p-2 bg-background rounded-md shadow-md text-sm font-secondary whitespace-nowrap">
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
            )}
          />
        </div>
      </div>
    </Card.Card>
  );
}

export default ProjectCard;
