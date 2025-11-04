import { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { getDetailedCompletionRate, type DetailedCompletionRate } from "./api";

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
  const [detailedData, setDetailedData] =
    useState<DetailedCompletionRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionRate = async () => {
      setLoading(true);
      const apiData = await getDetailedCompletionRate(projectId);

      if (apiData) {
        setRateData({ rate: apiData.rate, title: apiData.title || title });
        setDetailedData(apiData);
      } else {
        // Use props or default data as fallback
        setRateData({ rate: rate || 75, title: title });
        setDetailedData(null);
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
      <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full shadow-sm">
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
    <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full shadow-sm">
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
            tooltip={({ datum }) => (
              <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md w-80">
                <div className="font-semibold text-gray-800 mb-2">
                  {datum.id === "completed"
                    ? "Submitted Documents"
                    : "Not Submitted Documents"}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {datum.id === "completed"
                    ? `${detailedData?.submittedCount || 0} documents submitted`
                    : `${detailedData?.notSubmittedDocuments?.length || 0} documents pending`}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {datum.id === "completed"
                    ? detailedData?.submittedDocuments?.map((doc, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shrink-0"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">
                              {doc.documentName}
                            </div>
                            {doc.submissionDate && (
                              <div className="text-gray-500">
                                Submitted:{" "}
                                {new Date(
                                  doc.submissionDate,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    : detailedData?.notSubmittedDocuments?.map((doc, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 shrink-0 ${
                              doc.isOverdue ? "bg-red-500" : "bg-yellow-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">
                              {doc.documentName}
                            </div>
                            {doc.dueDate && (
                              <div
                                className={`${doc.isOverdue ? "text-red-600" : "text-gray-500"}`}
                              >
                                Due:{" "}
                                {new Date(doc.dueDate).toLocaleDateString()}
                                {doc.isOverdue && " (Overdue)"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            )}
          />
        </div>
        <div className="flex items-center justify-center mt-2">
          <span className="text-sm font-semibold text-gray-700">
            Completed: {rateData.rate}% ({detailedData?.submittedCount || 0}/
            {detailedData?.totalCount || 0})
          </span>
        </div>
      </div>
    </div>
  );
}

export default SubmissionRate;
