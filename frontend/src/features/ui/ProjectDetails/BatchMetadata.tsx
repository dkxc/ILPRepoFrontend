import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import {
  getBatchMetadata,
  type BatchMetadata as BatchMetadataType,
} from "./api";

interface BatchMetadataProps {
  name?: string;
  projectName?: string;
  trainees?: number;
  status?: string;
  progress?: number;
  projectId?: string;
}

// Default mock data
const defaultData: BatchMetadataType = {
  name: "ILP 2024-25 BATCH 1",
  projectName: "ILP Project",
  trainees: 5,
  status: "Ongoing",
  progress: 75,
};

function BatchMetadata({
  name,
  projectName,
  trainees,
  status,
  progress,
  projectId,
}: BatchMetadataProps) {
  const [metadata, setMetadata] = useState<BatchMetadataType>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      const apiData = await getBatchMetadata(projectId);

      if (apiData) {
        setMetadata(apiData);
      } else {
        // Use props or default data as fallback
        setMetadata({
          name: name || defaultData.name,
          projectName: projectName || defaultData.projectName,
          trainees: trainees || defaultData.trainees,
          status: status || defaultData.status,
          progress: progress || defaultData.progress,
        });
      }
      setLoading(false);
    };

    fetchMetadata();
  }, [projectId, name, projectName, trainees, status, progress]);

  if (loading) {
    return (
      <div className="bg-white px-4 md:px-8 py-6 rounded-lg border border-[#F8F9FA] mb-6 w-full shadow-sm animate-pulse">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full">
          <div className="flex items-center gap-4 min-w-[300px] flex-1">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white px-4 md:px-8 py-6 rounded-lg border border-[#F8F9FA] mb-6 w-full shadow-sm">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full">
        <div className="flex items-center gap-4 min-w-[300px] flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-700 whitespace-nowrap">
            {metadata.projectName}
          </h1>
          <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-semibold shadow-sm select-none border border-blue-200 whitespace-nowrap">
            {metadata.status}
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
            {metadata.trainees}
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
