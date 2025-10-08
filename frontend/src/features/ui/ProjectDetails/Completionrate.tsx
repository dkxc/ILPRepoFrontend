

interface SubmissionRateProps {
  rate?: number;
  showTitle?: boolean;
  title?: string;
}

function SubmissionRate({ rate = 75, showTitle = true, title = "Submission Rate" }: SubmissionRateProps) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg mt-4">
      {showTitle && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-xs h-40 mx-auto">
          <svg className="w-full h-full">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#E5E7EB"
              strokeWidth="16"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#2563EB"
              strokeWidth="16"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Right side text */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-3xl font-bold text-gray-900">{rate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmissionRate;
