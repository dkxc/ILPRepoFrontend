import React from 'react';

interface SubmissionRateProps {
  rate?: number;
}

function SubmissionRate({ rate = 98 }: SubmissionRateProps) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Submission Rate</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
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
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{rate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmissionRate;