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

const sampleBatches: Batch[] = [
  { id: "1", title: "ILP 2025 -26 Batch 4", subtitle: "Full Stack", status: "Ongoing", startDate: "20-09-25", endDate: "20-11-25", trainees: 36, trainingHours: 240 },
  { id: "2", title: "ILP 2025 -26 Batch 3", subtitle: "Full Stack", status: "Ongoing" },
  { id: "3", title: "ILP 2025 -26 Batch 2", subtitle: "Full Stack", status: "Ongoing" },
  { id: "4", title: "ILP 2025 -26 Batch 1", subtitle: "Full Stack", status: "Completed" },
];

export default function RecentBatches({ selectedBatchId, setSelectedBatchId }: RecentBatchesProps) {
  const selected = sampleBatches.find((b) => b.id === selectedBatchId) || sampleBatches[0];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-base)]">All batches</h3>
          <div className="text-sm text-gray-500">All Batches</div>
        </div>

        <div className="flex gap-4 overflow-x-auto py-2">
          {sampleBatches.map((b) => (
            <SmallBatchCard key={b.id} batch={{ id: b.id, title: b.title, subtitle: b.subtitle, status: b.status }} selected={b.id === selectedBatchId} onClick={() => setSelectedBatchId(b.id)} />
          ))}
        </div>
      </div>

      {/* Batch Details area */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <div className="bg-white shadow-md rounded-lg p-4">
            <BackgroundBatchCard>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 p-4">
                  <div className="border rounded-md p-4 h-full">
                    <div className="text-xs text-[var(--color-menuitem-text)] font-medium">Full Stack</div>
                    <div className="text-sm text-gray-500">{selected.title}</div>
                  </div>
                </div>

                <div className="col-span-3 p-4">
                  <div className="border rounded-md p-4 h-full">
                    <div className="text-xs text-[var(--color-menuitem-text)] font-medium">Start date</div>
                    <div className="text-sm text-gray-500">{selected.startDate || "-"}</div>
                  </div>
                </div>

                <div className="col-span-3 p-4">
                  <div className="border rounded-md p-4 h-full">
                    <div className="text-xs text-[var(--color-menuitem-text)] font-medium">No of Trainees</div>
                    <div className="text-sm text-gray-500">{selected.trainees ?? "-"}</div>
                  </div>
                </div>

                <div className="col-span-3 p-4">
                  <div className="border rounded-md p-4 h-full">
                    <div className="text-xs text-[var(--color-menuitem-text)] font-medium">Training Hours</div>
                    <div className="text-sm text-gray-500">{selected.trainingHours ?? "-"} hrs</div>
                  </div>
                </div>
              </div>
            </BackgroundBatchCard>
          </div>
        </div>

        <div className="col-span-4">
          <div className="border rounded-md p-4 bg-[var(--color-card)]">
            <h4 className="font-medium text-[var(--color-text-base)] mb-4">Projects</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">Team Lead: The team lead</div>
                </div>
                <div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs text-[var(--color-brand-600)]">98%</div>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">Team Lead: The team lead</div>
                </div>
                <div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs text-[var(--color-brand-600)]">98%</div>
              </li>

              <li className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Project Name</div>
                  <div className="text-xs text-gray-500">Team Lead: Theteamlead</div>
                </div>
                <div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs text-[var(--color-brand-600)]">98%</div>
              </li>
            </ul>
          </div>

          <div className="mt-4 border rounded-md p-4 bg-[var(--color-card)]">
            <h4 className="font-medium text-[var(--color-text-base)] mb-4">Top Trainees</h4>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { SmallBatchCard, BackgroundBatchCard } from "../../../features/admin/dashboard/RecentBatchesCards";
