import { useLocation, Navigate } from "react-router";
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import TechStack from "../../features/ui/ProjectDetails/TechStack";
import ProjectLinks from "../../features/ui/ProjectDetails/ProjectLinks";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import SubmissionRate from "../../features/ui/ProjectDetails/Completionrate";
import type { TeamMember } from "../../features/ui/ProjectDetails/TeamList";

function ProjectDetails() {
  const location = useLocation();
  const { projectId, projectData: selectedProject } = location.state || {};

  // Redirect back to projects if no project ID is provided
  if (!projectId) {
    return <Navigate to="/projects" replace />;
  }

  const id = projectId.toString();

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

  // You can use the selectedProject data passed from Projects page or fetch based on the ID
  // For now, using the existing hardcoded data but you can use selectedProject if needed
  const projectData = {
    id: 1,
    projectName: `Project ${id}`,
    name: "ILP 2024-25 BATCH 1",
    trainees: teamMembers.length,
    status: "Ongoing",
    techStack: ["React", ".NET", "TypeScript", "PostgreSQL", "Node.js"],
    repositoryUrl: "https://github.com/dkxc/ILPRepo",
    figmaUrl:
      "https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0",
  };
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
