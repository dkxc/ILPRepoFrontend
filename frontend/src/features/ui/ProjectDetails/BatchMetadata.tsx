import { FolderPen, Users } from "lucide-react";

interface BatchMetadataProps {
  name: string;
  projectName: string;
  trainees: number;
  status?: string;
  progress?: number;
}

function BatchMetadata({
  name,
  projectName,
  trainees,
  status,
  progress,
}: BatchMetadataProps) {
  return (
    <div className="bg-white px-4 md:px-8 py-6 rounded-lg border border-[#F8F9FA] mb-6 w-full shadow-sm">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full">
        <div className="flex items-center gap-4 min-w-[300px] flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-700 whitespace-nowrap">
            {projectName || "ILP Project"}
          </h1>
          <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-semibold shadow-sm select-none border border-blue-200 whitespace-nowrap">
            {status || "Ongoing"}
          </span>
        </div>
        <div className="flex items-center gap-4 min-w-[250px]">
          <FolderPen
            className="h-5 w-5 flex-shrink-0"
            style={{ color: "#7B7575" }}
          />
          <span className="font-bold text-gray-700 whitespace-nowrap">
            Batch:
          </span>
          <span className="text-gray-800 text-base font-medium truncate">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-4 min-w-[180px]">
          <Users
            className="h-5 w-5 flex-shrink-0"
            style={{ color: "#7B7575" }}
          />
          <span className="font-bold text-gray-700 whitespace-nowrap">
            Trainees:
          </span>
          <span className="text-gray-800 text-base font-medium">
            {trainees}
          </span>
        </div>
        {typeof progress === "number" && (
          <span className="ml-2 text-sm font-semibold text-green-700">
            Progress: {progress}%
          </span>
        )}
      </div>
    </div>
  );
}

export default BatchMetadata;
