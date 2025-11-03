import { useLocation, Navigate } from "react-router";
import { useEffect, useState } from "react";
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
import type { TeamMember } from "../../features/ui/ProjectDetails/TeamList";

function ProjectDetails() {
  const location = useLocation();
  const { projectId, projectData: selectedProject } = location.state || {};
  const [projectDetails, setProjectDetails] =
    useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect back to projects if no project ID is provided
  if (!projectId) {
    return <Navigate to="/projects" replace />;
  }

  const id = projectId.toString();

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

  // Team members data
  const teamMembers: TeamMember[] = [
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

  // Use the API data when available, fallback to selectedProject or defaults
  const projectData = {
    id: projectDetails?.id || selectedProject?.id || Number(id),
    projectName:
      projectDetails?.projectName || selectedProject?.name || `Project ${id}`,
    name:
      projectDetails?.batchName ||
      selectedProject?.batch ||
      "ILP 2024-25 BATCH 1", // Batch name from API
    trainees: projectDetails?.teamMembers?.length || teamMembers.length, // Updated to use teamMembers
    status: projectDetails?.status || selectedProject?.status || "Ongoing", // Already a string
    techStack: projectDetails?.technology
      ?.split(",")
      .map((tech) => tech.trim()) || [
      "React",
      ".NET",
      "TypeScript",
      "PostgreSQL",
      "Node.js",
    ], // Updated to use technology
    repositoryUrl: "https://github.com/dkxc/ILPRepo",
    figmaUrl:
      "https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0",
  };

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
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BatchMetadata
          projectName={projectData.projectName}
          name={projectData.name}
          trainees={projectData.trainees}
          status={projectData.status}
          projectId={id || "unknown"}
        />

        <div className="flex gap-4 mb-6">
          <div
            style={{ width: "30%" }}
            className="flex-shrink-0 flex flex-col gap-4"
          >
            <TechStack
              id={projectData.id}
              techStack={projectData.techStack}
              canEdit={true}
              projectId={id || "unknown"}
            />
            <ProjectLinks
              id={projectData.id}
              repositoryUrl={projectData.repositoryUrl}
              figmaUrl={projectData.figmaUrl}
              canEdit={true}
              projectId={id || "unknown"}
            />
          </div>
          <div style={{ width: "70%" }} className="flex-shrink-0">
            <ProjectDocuments
              canUpload={true}
              canNotify={true}
              teamMembers={teamMembers}
              isAdmin={true}
              projectId={id || "unknown"}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-7/10 flex items-stretch">
            <TeamList
              data={teamMembers}
              canDelete={true}
              projectId={id || "unknown"}
            />
          </div>
          <div className="w-full md:w-3/10 flex items-stretch">
            <SubmissionRate projectId={id || "unknown"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
