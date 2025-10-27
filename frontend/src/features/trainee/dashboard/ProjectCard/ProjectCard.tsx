import { type Project } from "../../types/Project.types";
import * as Card from "../../../ui/card";
import Badge from "../../../ui/badge/Badge";
import Button from "../../../ui/Button";
import Skeleton from "@ui/skeleton";

import { cn } from "../../../../lib/utils";
import { ResponsivePie } from "@nivo/pie";
import { getPieDataFromPercent } from "../../../../lib/graphs/utils";

import { FileText, Pencil, Radio } from "lucide-react";
import { useState } from "react";

import EditProjectDetailsModal from "../../../ui/ProjectDetails/EditProjectDetailsModal";
import DocumentSubmissionModal from "../../../ui/DocumentUpload";
import { createPortal } from "react-dom";
import { type UseQueryResult } from "@tanstack/react-query";

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  query: UseQueryResult<Project>;
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
  query,
  className,
  ref,
  ...props
}: ProjectCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { data: project, status } = query;
  const [showStepper, setShowStepper] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTechStack, setEditingTechStack] = useState<string[]>([]);
  const [editingRepoUrl, setEditingRepoUrl] = useState("");
  const [editingFigmaUrl, setEditingFigmaUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const openEditModal = () => {
    if (project) {
      setEditingTechStack([...project.technologies]);
      setEditingRepoUrl(project.repositoryUrl || "");
      setEditingFigmaUrl(project.figmaUrl || "");
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async ({
    techStack,
    repositoryUrl,
    figmaUrl,
  }: {
    techStack: string[];
    repositoryUrl: string;
    figmaUrl: string;
  }) => {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(
        "https://localhost:7153/api/ProjectDetails/edit-details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: project?.id,
            techStack: techStack.join(","),
            repositoryUrl,
            figmaUrl,
          }),
        },
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setShowEditModal(false);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (status === "pending") {
    return (
      <Card.Card className={cn("flex justify-between gap-1", className)}>
        <div className="flex justify-between w-full p-6">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
          <div className="w-48 flex items-center justify-center">
            <Skeleton className="h-36 w-36 rounded-full" />
          </div>
        </div>
      </Card.Card>
    );
  }

  if (status === "error") {
    return (
      <Card.Card
        className={cn(
          "flex flex-col h-full items-center justify-center",
          className,
        )}
      >
        <Card.CardHeader>
          <Card.CardTitle>Something went wrong.</Card.CardTitle>
          <Card.CardDescription>
            Could not load project data.
          </Card.CardDescription>
        </Card.CardHeader>
      </Card.Card>
    );
  }

  if (!project) return null;

  return (
    <>
      <Card.Card
        className={cn("flex justify-between gap-1", className)}
        ref={ref}
        {...props}
      >
        <div className="flex justify-between w-full">
          <div className="flex flex-col justify-between">
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
              <Button
                size="sm"
                className="px-4 text-xs"
                onClick={() => setShowStepper(true)}
              >
                <FileText /> Documents
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="px-4 text-xs"
                onClick={openEditModal}
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
      {showStepper &&
        createPortal(
          <DocumentSubmissionModal
            isOpen={showStepper}
            onClose={() => setShowStepper(false)}
            onSubmit={() => setShowStepper(false)}
          />,
          document.body,
        )}
      {showEditModal &&
        createPortal(
          <EditProjectDetailsModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSaveError(null);
            }}
            onSave={handleSaveEdit}
            initialTechStack={editingTechStack}
            initialRepositoryUrl={editingRepoUrl}
            initialFigmaUrl={editingFigmaUrl}
            saving={saving}
            saveError={saveError}
          />,
          document.body,
        )}
    </>
  );
}

export default ProjectCard;
