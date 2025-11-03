import React from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DashboardProjectCard from "../../../features/admin/dashboard/DashboardProjectCard";

// ✅ Semicircle component
const Semicircle: React.FC<{
  percent: number;
  width?: number;
  stroke?: number;
}> = ({ percent, width = 60, stroke = 6 }) => {
  const r = (width - stroke) / 2;
  const cx = width / 2;
  const cy = r + stroke / 2;
  const length = Math.PI * r;
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

type DashboardProjectsProps = {
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
};

export default function DashboardProjects({
  selectedBatchId,
  setSelectedBatchId,
}: DashboardProjectsProps) {
  const navigate = useNavigate();

  // ✅ Fetch batches
  const {
    data: batches = [],
    isLoading: loadingBatches,
    error: batchError,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await fetch(
        "https://localhost:7224/api/AdminDashboard/batches",
      );
      if (!res.ok) throw new Error("Failed to fetch batches");
      return res.json();
    },
  });

  // ✅ Fetch projects based on selected batch
  const {
    data: projects = [],
    isLoading: loadingProjects,
    error: projectError,
  } = useQuery({
    queryKey: ["projects", selectedBatchId],
    queryFn: async () => {
      if (!selectedBatchId) return [];
      const res = await fetch(
        `https://localhost:7224/api/AdminDashboard/projects/${selectedBatchId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    enabled: !!selectedBatchId, // Only fetch when batch is selected
  });

  if (loadingBatches) return <p>Loading batches...</p>;
  if (batchError) return <p>Error loading batches.</p>;

  const selectedBatch =
    batches.find((b: any) => String(b.id) === String(selectedBatchId)) ||
    batches[0];

  return (
    <DashboardProjectCard>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-600">
          {selectedBatch ? selectedBatch.batch_name : "Select Batch"}
        </h2>

        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-gray-50 rounded px-3 py-1.5 text-sm border border-gray-200 min-w-[200px]"
        >
          {batches?.map((b: { id: number; name: string }) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {loadingProjects ? (
        <p>Loading projects...</p>
      ) : projectError ? (
        <p>Error loading projects.</p>
      ) : (
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
                {projects.map((p: any) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/projectsDetailsAdmin/${p.id}`)}
                  >
                    <td className="py-3 px-6 text-sm text-gray-900">
                      {p.project_name || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {p.team_lead || "N/A"}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {p.no_trainees || 0}
                    </td>
                    <td className="py-3 px-6 text-sm">
                      {(p.tech_stack || "").split("+").map((t: string) => (
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
                        <Semicircle
                          percent={p.submission_rate || 0}
                          width={60}
                          stroke={6}
                        />
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
      )}
    </DashboardProjectCard>
  );
}
