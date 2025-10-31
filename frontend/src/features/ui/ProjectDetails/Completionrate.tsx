import { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { getCompletionRate } from "./api";

interface SubmissionRateProps {
  rate?: number;
  showTitle?: boolean;
  title?: string;
  projectId?: string;
}

function SubmissionRate({
  rate,
  showTitle = true,
  title = "Submission Rate",
  projectId,
}: SubmissionRateProps) {
  const [rateData, setRateData] = useState({ rate: rate || 75, title: title });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionRate = async () => {
      setLoading(true);
      const apiData = await getCompletionRate(projectId);

      if (apiData) {
        setRateData({ rate: apiData.rate, title: apiData.title || title });
      } else {
        // Use props or default data as fallback
        setRateData({ rate: rate || 75, title: title });
      }
      setLoading(false);
    };

    fetchCompletionRate();
  }, [projectId, rate, title]);

  const completionData = [
    { id: "completed", value: rateData.rate, color: "#2563EB" },
    { id: "remaining", value: 100 - rateData.rate, color: "#E5E7EB" },
  ];

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full">
        {showTitle && (
          <div className="h-6 bg-gray-200 rounded mb-3 w-32 animate-pulse"></div>
        )}
        <div className="w-full h-[280px] flex flex-col items-center">
          <div className="w-full max-w-[250px] h-[250px] bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex items-center justify-center mt-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full">
      {showTitle && (
        <h3 className="text-base font-bold mb-3 text-[#565E6C]">
          {rateData.title}
        </h3>
      )}
      <div className="w-full h-[280px] flex flex-col items-center">
        <div className="w-full max-w-[250px] h-[250px]">
          <ResponsivePie
            data={completionData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            innerRadius={0.6}
            padAngle={0.6}
            cornerRadius={2}
            activeOuterRadiusOffset={4}
            colors={{ datum: "data.color" }}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            legends={[]}
          />
        </div>
        <div className="flex items-center justify-center mt-2">
          <span className="text-sm font-semibold text-gray-700">
            Completed: {rateData.rate}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default SubmissionRate;
