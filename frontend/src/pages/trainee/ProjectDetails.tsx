
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import CompletionRate from "../../features/ui/ProjectDetails/Completionrate";

// Read-only BatchMetadata wrapper
interface BatchMetadataProps {
  name: string;
  trainees: number;
  techStack: string[];
  repositoryUrl: string;
  figmaUrl: string;
}

function BatchMetadataReadOnly({ name, trainees, techStack, repositoryUrl, figmaUrl }: BatchMetadataProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 bg-white px-2 sm:px-4 md:px-8 py-4 mt-5 gap-y-4 gap-x-2">
      <div className="flex flex-col items-start px-2 py-2">
        <span className="font-bold mb-2 flex items-center gap-2">
          {/* FolderPen icon */}
          <span className="inline-block" style={{ color: '#7B7575' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9z"/><path d="M18 12.5V12a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v.5"/></svg>
          </span>
          Batch
        </span>
        <span className="text-gray-800">{name}</span>
      </div>
      <div className="flex flex-col items-start px-2 py-2">
        <span className="font-bold mb-2 flex items-center gap-2">
          <span className="inline-block" style={{ color: '#7B7575' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="17" cy="7" r="4"/></svg>
          </span>
          No of Trainees
        </span>
        <span className="text-gray-800">{trainees}</span>
      </div>
      <div className="flex flex-col items-start px-2 py-2">
        <span className="font-bold mb-2 flex items-center gap-2">
          <span className="inline-block" style={{ color: '#7B7575' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18V3H3zm2 2h14v14H5V5zm2 2v10h10V7H7z"/></svg>
          </span>
          Tech Stack
        </span>
        <div className="flex flex-wrap gap-2">
          {techStack.length === 0 ? (
            <span className="text-gray-400 italic">Stack not given</span>
          ) : (
            techStack.map((stack: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
              >
                {stack}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col items-start px-2 py-2">
        <span className="font-bold mb-2 flex items-center gap-2">
          <span className="inline-block" style={{ color: '#7B7575' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
          </span>
          Links
        </span>
        <span className="flex gap-4 items-center">
          <span className="flex items-center gap-2">
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Repository
            </a>
          </span>
          <span className="flex items-center gap-2">
            <a
              href={figmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Figma
            </a>
          </span>
        </span>
      </div>
    </div>
  );
}

// Read-only ProjectDocuments wrapper
function ProjectDocumentsReadOnly() {
  // Use the same initial documents as before
  const documents = [
    { id: "1", name: "BRD file", filename: "brd_PROJECT.pdf" },
    { id: "2", name: "UAT file", filename: "repo_uat.docx" },
    { id: "3", name: "Sprint Tracker file", filename: "tracker.docx" },
    { id: "4", name: "UAT file", filename: "repo_uat.docx" },
  ];
  return (
    <div className="bg-white px-4 md:px-8 py-6 mt-10">
      <div className="pl-4 pr-5">
        <h2 className="text-lg font-bold text-gray-900">Project Document</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {doc.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {doc.filename}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectDetails() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <BatchMetadataReadOnly
            name="ILP 2024-25 BATCH 1"
            trainees={7}
            techStack={["React", ".NET"]}
            repositoryUrl="https://github.com/dkxc/ILPRepo"
            figmaUrl="https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0"
          />
        </div>
        <div className="mb-6">
          <ProjectDocumentsReadOnly />
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

export default ProjectDetails;
