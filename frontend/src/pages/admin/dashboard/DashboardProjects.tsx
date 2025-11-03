import { useNavigate } from "react-router";
import DashboardProjectCard from "../../../features/admin/dashboard/DashboardProjectCard";
import React from "react";

// Semicircle component: draws a partial semicircle from left->right showing percent of the semicircle
const Semicircle: React.FC<{
  percent: number;
  width?: number;
  stroke?: number;
}> = ({ percent, width = 60, stroke = 6 }) => {
  const r = (width - stroke) / 2;
  const cx = width / 2;
  const cy = r + stroke / 2; // position so bottom of semicircle fits
  const length = Math.PI * r; // semicircle length
  const dash = Math.max(0, Math.min(1, percent / 100)) * length;
  const path = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <svg
      width={width}
      height={cy + stroke}
      viewBox={`0 0 ${width} ${cy + stroke}`}
    >
      <path
        d={path}
        stroke="#E5E7EB"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={path}
        stroke="var(--color-brand-600)"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${length}`}
      />
      <text
        x={cx}
        y={cy - r / 3}
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={12}
        fill="var(--color-brand-600)"
        fontWeight="500"
      >
        {percent}%
      </text>
    </svg>
  );
};

const sampleBatches = [
  {
    id: "1",
    title: "ILP 2025 -26 Batch 4",
    subtitle: "Full Stack",
    status: "Ongoing",
  },
  {
    id: "2",
    title: "ILP 2025 -26 Batch 3",
    subtitle: "Full Stack",
    status: "Ongoing",
  },
  {
    id: "3",
    title: "ILP 2025 -26 Batch 2",
    subtitle: "Full Stack",
    status: "Ongoing",
  },
  {
    id: "4",
    title: "ILP 2025 -26 Batch 1",
    subtitle: "Full Stack",
    status: "Completed",
  },
  {
    id: "5",
    title: "ILP 2025 -26 Batch 8",
    subtitle: "Full Stack",
    status: "Completed",
  },
  {
    id: "6",
    title: "ILP 2025 -26 Batch 9",
    subtitle: "Full Stack",
    status: "Completed",
  },
];

type DashboardProjectsProps = {
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
};

export default function DashboardProjects({
  selectedBatchId,
  setSelectedBatchId,
}: DashboardProjectsProps) {
  const navigate = useNavigate();

  const selected =
    sampleBatches.find((b) => b.id === selectedBatchId) || sampleBatches[0];

  const statuses = [
    "Live",
    "In Progress",
    "Not Completed",
    "Live",
    "In Progress",
    "Not Completed",
  ];
  const projects = new Array(6).fill(0).map((_, idx) => ({
    id: String(idx + 1),
    name: `Project Name ABCDE`,
    lead: `Alex Joseph`,
    trainees: 7,
    tech: `React + .NET`,
    rate: 98 - idx * 2, // sample varying % as number
    status: statuses[idx % statuses.length],
  }));

  return (
    // <DashboardProjectCard title="Projects">
    <DashboardProjectCard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-600">{selected.title}</h2>
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-gray-50 rounded px-3 py-1.5 text-sm border border-gray-200 min-w-[200px]"
        >
          {sampleBatches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <div className="overflow-hidden bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                  Project Name
                </th>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                  Team Lead
                </th>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                  No of Trainees
                </th>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                  Tech Stack
                </th>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                  Submission Rate
                </th>
                <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate("/projectsDetailsAdmin", {
                      state: {
                        projectId: p.id,
                        projectData: p,
                      },
                    })
                  }
                >
                  <td className="py-3 px-6 text-sm text-gray-900">{p.name}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{p.lead}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">
                    {p.trainees}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    {p.tech.split("+").map((t) => (
                      <span
                        key={t}
                        className="inline-block mr-2 px-2 py-1 rounded-full bg-blue-50 text-sm font-medium text-blue-700"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <div className="flex items-center">
                      <Semicircle percent={p.rate} width={60} stroke={6} />
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    {p.status === "Live" && (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-sm text-green-800">
                        Live
                      </span>
                    )}
                    {p.status === "In Progress" && (
                      <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-sm text-orange-700">
                        In Progress
                      </span>
                    )}
                    {p.status === "Not Completed" && (
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                        Not Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardProjectCard>
  );
}
