import { useState } from "react";
import { Trash2 } from "lucide-react";
import DataTable from "../../admin/Table";
import type { ColumnDef } from "../../admin/Table";

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  mail: string;
}

interface TeamListProps {
  columns?: ColumnDef<TeamMember>[];
  data?: TeamMember[];
  title?: string;
  showTitle?: boolean;
  canDelete?: boolean;
  onDelete?: (member: TeamMember) => void;
}

const defaultData: TeamMember[] = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Developer",
    mail: "alice@example.com",
  },
  { id: 2, name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
  { id: 3, name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
  {
    id: 4,
    name: "Alice Johnson",
    role: "Developer",
    mail: "alice@example.com",
  },
  { id: 5, name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
  { id: 6, name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
  {
    id: 7,
    name: "Alice Johnson",
    role: "Developer",
    mail: "alice@example.com",
  },
];

export default function TeamList({
  columns,
  data = defaultData,
  title = "Team Members",
  showTitle = true,
  canDelete = false,
  onDelete,
}: TeamListProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(data);

  const handleDelete = (member: TeamMember) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
    onDelete?.(member);
  };

  const defaultColumns: ColumnDef<TeamMember>[] = [
    { key: "name", header: "Name", width: "35%" },
    { key: "role", header: "Role", width: "25%" },
    { key: "mail", header: "Mail", width: "30%" },
    ...(canDelete
      ? [
          {
            key: "actions",
            header: "Actions",
            width: "10%",
            align: "center" as const,
            render: (_: any, row: TeamMember) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row);
                }}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-gray-700"
                title="Remove from project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]
      : []),
  ];

  const tableColumns = columns || defaultColumns;
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full overflow-x-auto">
      {showTitle && (
        <h2 className="text-base font-semibold mb-6 text-[#565E6C]">{title}</h2>
      )}
      <div className="w-full">
        <DataTable
          columns={tableColumns}
          data={teamMembers}
          enableSearch={false}
          enablePagination={false}
          rowStyle={{
            lineHeight: "2.8",
            fontSize: "0.95rem",
            borderBottom: "1px solid #e5e7eb",
          }}
          headerStyle={{
            height: "2.2rem",
            fontSize: "0.98rem",
            color: "#565E6C",
          }}
        />
      </div>
    </div>
  );
}
