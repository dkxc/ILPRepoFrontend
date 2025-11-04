import { useParams, Navigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import TechStack from "../../features/ui/ProjectDetails/TechStack";
import ProjectLinks from "../../features/ui/ProjectDetails/ProjectLinks";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import SubmissionRate from "../../features/ui/ProjectDetails/Completionrate";
import {
  getProjectDetails,
  type ProjectDetailsData,
} from "../../features/ui/ProjectDetails/api";
import ErrorBoundary from "../../components/ErrorBoundary";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] =
    useState<ProjectDetailsData | null>(null);

  // Redirect back to projects if no project ID is provided
  if (!id) {
    return <Navigate to="/ilpprojects" replace />;
  }

  // Fetch project details from API
  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const details = await getProjectDetails(id);
        if (details) {
          setProjectDetails(details);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // Team members data - use API data when available, fallback to mock data
  const teamMembers = projectDetails?.trainees?.map((trainee, index) => ({
    id: index + 1,
    name: trainee.name,
    role: "Trainee", // Default role since API doesn't provide roles
    mail: trainee.email,
  })) || [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Developer",
      mail: "alice@example.com",
    },
    { id: 2, name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
    { id: 3, name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
    {
      id: 4,
      name: "Diana Prince",
      role: "Developer",
      mail: "diana@example.com",
    },
    {
      id: 5,
      name: "Eve Adams",
      role: "Project Manager",
      mail: "eve@example.com",
    },
  ];

  // Use the API data when available, fallback to defaults
  const projectData = useMemo(
    () => ({
      id: projectDetails?.id || Number(id),
      projectName: projectDetails?.projectName || `Project ${id}`,
      name: `Project ${projectDetails?.id || id}`, // Use project ID as batch name since API doesn't have batchName
      trainees: projectDetails?.trainees?.length || teamMembers.length,
      status: projectDetails?.status || "Ongoing",
      techStack: projectDetails?.technologyStack
        ? projectDetails.technologyStack
            .split(",")
            .map((tech: string) => tech.trim())
        : ["React", ".NET", "TypeScript", "PostgreSQL", "Node.js"],
      repositoryUrl:
        projectDetails?.projectLinks?.find(
          (link) =>
            link.linkTypeName.toLowerCase().includes("repository") ||
            link.linkTypeName.toLowerCase().includes("repo") ||
            link.linkTypeName.toLowerCase().includes("git"),
        )?.linkUrl || "https://github.com/dkxc/ILPRepo",
      figmaUrl:
        projectDetails?.projectLinks?.find(
          (link) =>
            link.linkTypeName.toLowerCase().includes("figma") ||
            link.linkTypeName.toLowerCase().includes("design"),
        )?.linkUrl ||
        "https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0",
    }),
    [id, projectDetails, teamMembers.length],
  );

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BatchMetadata
            projectName={projectData.projectName}
            name={projectData.name}
            trainees={projectData.trainees}
            status={projectData.status}
            projectId={id}
          />

          <div className="flex gap-4 mb-6">
            <div
              style={{ width: "30%" }}
              className="shrink-0 flex flex-col gap-4"
            >
              <TechStack
                techStack={projectData.techStack}
                canEdit={false}
                projectId={id || "unknown"}
              />
              <ProjectLinks canEdit={false} projectId={id || "unknown"} />
            </div>
            <div style={{ width: "70%" }} className="shrink-0">
              <ProjectDocuments
                canUpload={false}
                canNotify={false}
                teamMembers={teamMembers}
                isAdmin={false}
                projectId={id || "unknown"}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="w-full md:w-7/10 flex items-stretch">
              <TeamList projectId={id || "unknown"} />
            </div>
            <div className="w-full md:w-3/10 flex items-stretch">
              <SubmissionRate projectId={id || "unknown"} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ProjectDetails;
