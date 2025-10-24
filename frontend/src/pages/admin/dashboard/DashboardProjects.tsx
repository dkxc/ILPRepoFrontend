import DashboardProjectCard from "../../../features/admin/dashboard/DashboardProjectCard";
import SmallBatchCard from "../../../features/admin/dashboard/RecentBatchesCards";
import React from "react";

// Semicircle component: draws a partial semicircle from left->right showing percent of the semicircle
const Semicircle: React.FC<{ percent: number; width?: number; stroke?: number }> = ({
  percent,
  width = 60,
  stroke = 6,
}) => {
  const r = (width - stroke) / 2;
  const cx = width / 2;
  const cy = r + stroke / 2; // position so bottom of semicircle fits
  const length = Math.PI * r; // semicircle length
  const dash = Math.max(0, Math.min(1, percent / 100)) * length;
  const path = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <svg width={width} height={cy + stroke} viewBox={`0 0 ${width} ${cy + stroke}`}>
      <path d={path} stroke="#E5E7EB" strokeWidth={stroke} fill="none" strokeLinecap="round" />
      <path
        d={path}
        stroke="var(--color-brand-600)"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${length}`}
      />
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
  // The top card selection is managed by AdminDashboard, so we don't need it here
  const selectedBatch =
    sampleBatches.find((b) => b.id === selectedBatchId) || sampleBatches[0];

  const statuses = ["Live", "In Progress", "Not Completed", "Live", "In Progress", "Not Completed"];
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
    <>
      <div className="bg-[var(--color-card)] p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">All Batches</h3>
                <select
            className="border-gray-200 rounded px-3 py-1 text-sm"
            defaultValue="All Batch Types"
          >
            <option>All Batch Types</option>
            <option>Full Stack</option>
            <option>Frontend</option>
            <option>Backend</option>
          </select>
              </div>
              <div className="flex gap-4 overflow-x-auto py-1">
                {sampleBatches.map((b) => (
                  <SmallBatchCard
                    key={b.id}
                    batch={{
                      id: b.id,
                      title: b.title,
                      subtitle: b.subtitle,
                      status: b.status,
                    }}
                    selected={b.id === selectedBatchId}
                    onClick={() => setSelectedBatchId(b.id)}
                  />
                ))}
              </div>
            </div>

      <DashboardProjectCard title={`Projects - ${selectedBatch.title}`}>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="py-2">Name</th>
              <th className="py-2">Team Lead</th>
              <th className="py-2">No of Trainees</th>
              <th className="py-2">Tech Stack</th>
              <th className="py-2">Submission Rate</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                onClick={() => console.log("row clicked", p.id)}
              >
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-gray-500">{p.lead}</td>
                <td className="py-3">{p.trainees}</td>
                <td className="py-3">
                  {p.tech.split("+").map((t) => (
                    <span key={t} className="inline-block mr-2 px-2 py-1 rounded bg-[var(--color-brand-50)] text-sm font-medium text-[var(--color-brand-600)]">
                      {t.trim()}
                    </span>
                  ))}
                </td>
                <td className="py-3 text-[var(--color-brand-600)]">
                  <div className="flex items-center gap-3">
                    <Semicircle percent={p.rate} width={60} stroke={6} />
                    <div className="text-sm">{p.rate}%</div>
                  </div>
                </td>
                <td className="py-3">
                  {p.status === "Live" && (
                    <span className="inline-block px-3 py-1 rounded-full bg-bg-success/40 text-sm text-[var(--color-text-base)]">Live</span>
                  )}
                  {p.status === "In Progress" && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-brand-50)] text-sm text-[var(--color-brand-600)]">In Progress</span>
                  )}
                  {p.status === "Not Completed" && (
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">Not Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardProjectCard>
    </>
  );
}
