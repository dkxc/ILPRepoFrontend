import { ActionIcon, Tooltip } from "@mantine/core";
import { Trash } from "lucide-react";

export interface Batch {
  id: number;
  name: string;
  type: string;
  totalTrainees: number;
  status: "Not Started" | "Completed" | "Ongoing";
  startDate?: string;
  endDate?: string;
}

interface BatchTableProps {
  data: Batch[];
  onDelete?: (id: number) => void; // 👈 added prop for parent-driven delete
}

export default function BatchTable({ data, onDelete }: BatchTableProps) {
  // Badge styles based on status
  const getStatusBadge = (status: Batch["status"]) => {
    const styles = {
      Completed: "bg-[#E3F2FD] text-[#1565C0]",
      Ongoing: "bg-[#E8F5E8] text-[#2E7D32]",
      "Not Started": "bg-[#F3F4F6] text-[#6B7280]",
    }[status];

    return (
      <span
        className={`px-3 py-1 rounded-full text-base font-regular ${styles}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white px-5">
      {/* Header */}
      <div className="pt-4 pb-2">
        <h2 className="text-lg font-medium text-[#565E6C]">All Batches</h2>
      </div>

      <div className="h-0 border-t border-gray-300 pb-3"></div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-base font-medium text-[#565E6C]">
                Name
              </th>
              <th className="px-6 py-3 text-left text-base font-medium text-[#565E6C]">
                Type
              </th>
              <th className="px-6 py-3 text-center text-base font-medium text-[#565E6C]">
                Total Trainees
              </th>
              <th className="px-6 py-3 text-center text-base font-medium text-[#565E6C]">
                Status
              </th>
              <th className="px-6 py-3 text-center text-base font-medium text-[#565E6C]">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  No batches found
                </td>
              </tr>
            ) : (
              data.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#F6F8FE]">
                  <td className="px-6 py-4 text-base font-medium text-gray-800">
                    {batch.name}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-500">
                    {batch.type}
                  </td>
                  <td className="px-6 py-4 text-base text-gray-500 text-center">
                    {batch.totalTrainees}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(batch.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Tooltip label="Delete">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={() => onDelete?.(batch.id)} // 👈 delegate delete to parent
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
