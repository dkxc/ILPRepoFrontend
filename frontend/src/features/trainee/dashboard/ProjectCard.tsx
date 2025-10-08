import { type Project } from "../types/Project.types";
import * as Card from "../../ui/card";
import Button from "../../ui/Button";

import { cn } from "../../../lib/utils";

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
}

function ProjectCard({
  project,
  className,
  ref,
  ...props
}: ProjectCardProps & { ref?: React.Ref<HTMLDivElement> }) {
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
          <Card.CardTitle>{project.title}</Card.CardTitle>
          <Card.CardDescription>
            Team {project.team.number}
          </Card.CardDescription>
        </Card.CardHeader>

        <Card.CardContent className="flex flex-col gap-1 text-sm">
          <div>Status: {project.status}</div>
          <div>Technology Used: </div>
          <div>No. of Team Members: {project.team.members.length}</div>
        </Card.CardContent>

        <Card.CardFooter>
          <Button size="sm" className="rounded-2xl px-4">
            Upload Documents
          </Button>
        </Card.CardFooter>
      </div>
      <div className="flex-1">{/* Pie Chart */}</div>
    </Card.Card>
  );
}

export default ProjectCard;
