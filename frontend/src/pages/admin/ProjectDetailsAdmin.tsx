import { useParams } from "react-router";
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import SubmissionRate from "../../features/ui/ProjectDetails/Completionrate";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  
  // You can fetch project data based on the ID here
  // For now, using the existing hardcoded data
  const projectData = {
    projectName: `Project ${id}`,
    name: "ILP 2024-25 BATCH 1",
    trainees: 7,
    techStack: ["React", ".NET"],
    repositoryUrl: "https://github.com/dkxc/ILPRepo",
    figmaUrl: "https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0"
  };
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <BatchMetadata
            projectName={projectData.projectName}
            name={projectData.name}
            trainees={projectData.trainees}
            techStack={projectData.techStack}
            repositoryUrl={projectData.repositoryUrl}
            figmaUrl={projectData.figmaUrl}
            canEdit={true}
          />
        </div>
        <div className="mb-6">
          <ProjectDocuments canUpload={true} canNotify={true} />
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
