// Batch type includes fields used across dashboard pages
export type Batch = {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  trainees?: number;
  trainingHours?: number;
};

export const sampleBatches: Batch[] = [
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

export default function BatchSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ||
        "bg-gray-50 rounded px-3 py-1.5 text-sm border border-gray-200 min-w-[200px]"
      }
    >
      {sampleBatches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.title}
        </option>
      ))}
    </select>
  );
}
