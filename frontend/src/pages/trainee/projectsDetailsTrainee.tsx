import { useParams } from "react-router";
import { useState, useEffect } from "react";
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import SubmissionRate from "../../features/ui/ProjectDetails/Completionrate";

function projectsDetailsTrainee() {
  const { id } = useParams<{ id: string }>();

  type TraineeType = {
    id: number;
    projectId: number;
    traineeName: string;
    email: string;
    phone: string;
    role: string;
  };
  type TechStackType = {
    id: number;
    projectId: number;
    stackName: string;
  };
  type LinkType = {
    id: number;
    projectId: number;
    linkName: string;
    linkUrl: string;
  };
  type BatchType = {
    id: number;
    batchName: string;
    startDate: string;
    endDate: string;
    createdAt: string;
  };
  type ProjectDataType = {
    id: number;
    projectName: string;
    batchId: number;
    status: string;
    progress: number;
    batch: BatchType;
    trainees: TraineeType[];
    techStacks: TechStackType[];
    links: LinkType[];
    noTrainees: number;
  };
  const [projectData, setProjectData] = useState<ProjectDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjectDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://localhost:7153/api/ProjectDetails`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === 200 && Array.isArray(result.data)) {
          const found = result.data.find(
            (p: any) => String(p.id) === String(id),
          );
          if (found) {
            setProjectData(found);
          } else {
            setError("Project not found");
          }
        } else {
          setError(result.message || "Failed to fetch project details");
          console.error("API error:", result);
        }
      } catch (err) {
        setError("Error fetching project details");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectDetails();
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  if (!projectData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        No project data found.
      </div>
    );
  }
  // Map tech stack and links for BatchMetadata
  const techStackArr = Array.isArray(projectData.techStacks)
    ? projectData.techStacks.map((s) => s.stackName)
    : [];
  // Find links by name
  const repoLink =
    projectData.links?.find((l) => l.linkName.toLowerCase().includes("github"))
      ?.linkUrl || "";
  const figmaLink =
    projectData.links?.find((l) => l.linkName.toLowerCase().includes("figma"))
      ?.linkUrl || "";
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <BatchMetadata
            id={projectData.id}
            projectName={projectData.projectName}
            name={
              projectData.batch?.batchName ??
              `Batch ${projectData.batchId ?? ""}`
            }
            trainees={projectData.noTrainees}
            techStack={techStackArr}
            repositoryUrl={repoLink}
            figmaUrl={figmaLink}
            canEdit={true}
            status={projectData.status}
            progress={projectData.progress}
          />
        </div>
        <div className="mb-6">
          <ProjectDocuments canUpload={true} canNotify={false} />
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-7/10 flex items-stretch">
            <TeamList
              data={projectData.trainees.map((t) => ({
                name: t.traineeName,
                role: t.role,
                mail: t.email,
              }))}
              columns={[
                { key: "name", header: "Name", width: "40%" },
                { key: "role", header: "Role", width: "30%" },
                { key: "mail", header: "Mail", width: "30%" },
              ]}
            />
          </div>
          <div className="w-full md:w-3/10 flex items-stretch">
            <SubmissionRate />
          </div>
        </div>
      </div>
    </div>
  );
}

export default projectsDetailsTrainee;
