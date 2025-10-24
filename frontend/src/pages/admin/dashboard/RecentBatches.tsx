type Batch = {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  trainees?: number;
  trainingHours?: number;
};

type RecentBatchesProps = {
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
};

import { SmallBatchCard } from "../../../features/admin/dashboard/RecentBatchesCards";
import batchIcon from "../../../assets/icons/icon.svg";

// Simple donut component using SVG stroke-dasharray
const Donut: React.FC<{ percent: number; size?: number }> = ({
  percent,
  size = 40,
}) => {
  const radius = (size - 6) / 2; // leave room for stroke
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E5E7EB"
        strokeWidth={4}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--color-brand-600)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={`${offset}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        fill="none"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={10}
        fill="var(--color-brand-600)"
      >
        {percent}%
      </text>
    </svg>
  );
};

const sampleBatches: Batch[] = [
  {
    id: "1",
    title: "ILP 2025 -26 Batch 4",
    subtitle: "Full Stack",
    status: "Ongoing",
    startDate: "20/09/25",
    endDate: "20/11/25",
    trainees: 36,
    trainingHours: 240,
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

export default function RecentBatches({
  selectedBatchId,
  setSelectedBatchId,
}: RecentBatchesProps) {
  const selected =
    sampleBatches.find((b) => b.id === selectedBatchId) || sampleBatches[0];

  return (
    <div className="space-y-6">
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

      {/* Batch Details area - three equal cards side-by-side */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="rounded-md p-6 bg-[var(--color-card)] h-full">
            <div className="h-full flex flex-col">
              {/* Header with title and icon circle */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-[var(--color-text-base)]">
                  Batch Details
                </h4>
                <div className="px-3 py-1.5 rounded-md bg-blue-50 text-sm text-blue-600 font-medium">
                  Day 47
                </div>
              </div>

              {/* Stats grid - more compact without icons */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Trainees */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    No. of Trainees
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-text-base)]">
                    {selected.trainees || 36}
                  </div>
                </div>

                {/* Training Hours */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Training Hours
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-text-base)]">
                    {selected.trainingHours || 240}
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Start Date
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-text-base)]">
                    {selected.startDate || "20/09/25"}
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    End Date
                  </div>
                  <div className="text-lg font-semibold text-[var(--color-text-base)]">
                    {selected.endDate || "20/11/25"}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="col-span-2 flex items-center">
                  <div className="text-sm font-medium text-gray-600">
                    Tech Stack:
                  </div>
                  <div className="ml-2 px-2.5 py-1 rounded bg-blue-50 text-sm font-medium text-blue-600">
                    React
                  </div>
                  <div className="ml-2 px-2.5 py-1 rounded bg-blue-50 text-sm font-medium text-blue-600">
                    Angular
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="rounded-md p-4 bg-[var(--color-card)] h-full max-h-[320px] overflow-y-auto">
            <h4 className="font-medium text-[var(--color-text-base)] mb-4">
              Projects
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: The team lead
                  </div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                  <Donut percent={98} size={40} />
                </div>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: The team lead
                  </div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                  <Donut percent={92} size={40} />
                </div>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: Theteamlead
                  </div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                  <Donut percent={88} size={40} />
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: Theteamlead
                  </div>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                  <Donut percent={98} size={40} />
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-4">
          <div className="rounded-md p-4 bg-[var(--color-card)] h-full max-h-[320px] overflow-y-auto">
            <h4 className="font-medium text-[var(--color-text-base)] mb-4">
              Top Trainees
            </h4>
              <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="pr-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Merlin</div>
                    <div className="text-sm text-gray-600">72%</div>
                  </div>
                  <div className="mt-2 w-full max-w-[160px] h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-yellow-400 rounded" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img src={batchIcon} alt="avatar" className="w-10 h-10 object-cover" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-sm text-gray-600">88%</div>
                  </div>
                  <div className="mt-2 w-full max-w-[160px] h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-yellow-400 rounded" style={{ width: '88%' }} />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img src={batchIcon} alt="avatar" className="w-10 h-10 object-cover" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="pr-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-sm text-gray-600">98%</div>
                  </div>
                  <div className="mt-2 w-full max-w-[160px] h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-yellow-400 rounded" style={{ width: '98%' }} />
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img src={batchIcon} alt="avatar" className="w-10 h-10 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
