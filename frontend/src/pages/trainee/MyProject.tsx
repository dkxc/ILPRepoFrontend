import BatchMetadata from "../../features/trainee/myproject/BatchMetadata";
import ProjectDocuments from "../../features/trainee/myproject/DocumentUpload";
import TeamList from "../../features/trainee/myproject/TeamList";
import CompletionRate from "../../features/trainee/myproject/Completionrate";

function MyProject() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <BatchMetadata
            name="ILP 2024-25 BATCH 1"
            trainees={7}
            techStack={["React", ".NET"]}
            repositoryUrl="https://github.com/dkxc/ILPRepo"
            figmaUrl="https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0"
          />
        </div>
        <div className="mb-6">
          <ProjectDocuments />
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-7/10">
            <TeamList />
          </div>
          <div className="w-full md:w-3/10 mt-6 md:mt-0">
            <CompletionRate />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProject;
