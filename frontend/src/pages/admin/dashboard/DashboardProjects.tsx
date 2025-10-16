import DashboardProjectCard from "../../../features/admin/dashboard/DashboardProjectCard";
import SmallBatchCard from "../../../features/admin/dashboard/RecentBatchesCards";

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

  const projects = new Array(6).fill(0).map((_, idx) => ({
    id: String(idx + 1),
    name: `Project Name ABCDE`,
    lead: `Alex Joseph`,
    trainees: 7,
    tech: `React + .NET`,
    rate: `98%`,
  }));

  return (
    <>
      <div className="bg-[var(--color-card)] p-6 rounded-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">All Batches</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto py-2">
          {sampleBatches.map((b) => (
            <SmallBatchCard
              key={b.id}
              batch={b}
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
                className="hover:bg-gray-50 cursor-pointer border-b"
                onClick={() => console.log("row clicked", p.id)}
              >
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-gray-500">{p.lead}</td>
                <td className="py-3">{p.trainees}</td>
                <td className="py-3">{p.tech}</td>
                <td className="py-3 text-[var(--color-brand-600)]">{p.rate}</td>
                <td className="py-3 text-gray-500">Not Confirmed</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardProjectCard>
    </>
  );
}
