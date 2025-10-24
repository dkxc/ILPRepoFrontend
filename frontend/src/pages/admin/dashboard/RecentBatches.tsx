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
        <div className="mb-4">
          <h3 className="text-lg font-semibold">All Batches</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto py-2">
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
              {/* Header with title and day count */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-[var(--color-text-base)] mb-4">
                  Batch Details
                </h4>
                <div className="px-3 py-1.5 rounded-full bg-blue-50 text-sm text-blue-600">
                  Day {47}
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="rounded-md p-4 bg-[var(--color-card)] h-full">
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
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs text-[var(--color-brand-600)]">
                  98%
                </div>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: The team lead
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs text-[var(--color-brand-600)]">
                  98%
                </div>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: Theteamlead
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs text-[var(--color-brand-600)]">
                  98%
                </div>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">
                    Team Lead: Theteamlead
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs text-[var(--color-brand-600)]">
                  98%
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-4">
          <div className="rounded-md p-4 bg-[var(--color-card)] h-full">
            <h4 className="font-medium text-[var(--color-text-base)] mb-4">
              Top Trainees
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Merlin</div>
                  <div className="text-xs text-gray-500">Project Name</div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs text-gray-500">Project Name</div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs text-gray-500">Project Name</div>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
