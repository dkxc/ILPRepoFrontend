import { ResponsivePie } from "@nivo/pie";

interface SubmissionRateProps {
  rate?: number;
  showTitle?: boolean;
  title?: string;
}

function SubmissionRate({
  rate = 75,
  showTitle = true,
  title = "Submission Rate",
}: SubmissionRateProps) {
  const completionData = [
    { id: "completed", value: rate, color: "#2563EB" },
    { id: "remaining", value: 100 - rate, color: "#E5E7EB" },
  ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full">
      {showTitle && <h3 className="text-base font-bold mb-3">{title}</h3>}
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
            Completed:{rate}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default SubmissionRate;
