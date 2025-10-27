import { useParams } from "react-router";
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import TechStack from "../../features/ui/ProjectDetails/TechStack";
import ProjectLinks from "../../features/ui/ProjectDetails/ProjectLinks";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import SubmissionRate from "../../features/ui/ProjectDetails/Completionrate";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  // You can fetch project data based on the ID here
  // For now, using the existing hardcoded data
  const projectData = {
    id: 1,
    projectName: `Project ${id}`,
    name: "ILP 2024-25 BATCH 1",
    trainees: 7,
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
        />

        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-3 flex flex-col gap-4">
            <TechStack techStack={projectData.techStack} canEdit={false} />
            <div className="flex-1">
              <ProjectLinks
                repositoryUrl={projectData.repositoryUrl}
                figmaUrl={projectData.figmaUrl}
                canEdit={false}
              />
            </div>
          </div>
          <div className="col-span-9">
            <ProjectDocuments canUpload={false} canNotify={false} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-7/10 flex items-stretch">
            <TeamList />
          </div>
          <div className="w-full md:w-3/10 flex items-stretch">
            <SubmissionRate />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
