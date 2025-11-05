import { useState, useEffect } from "react";
import DataTable from "../../admin/Table";
import type { ColumnDef } from "../../admin/Table";
import { getTeamList } from "./api";

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
  projectId?: string;
  canDelete?: boolean;
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
  data,
  title = "Team Members",
  showTitle = true,
  projectId,
}: TeamListProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    data || defaultData,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      const apiData = await getTeamList(projectId);

      if (apiData) {
        setTeamMembers(apiData);
      } else {
        // Use props data or default data as fallback
        setTeamMembers(data || defaultData);
      }
      setLoading(false);
    };

    fetchTeamMembers();
  }, [projectId, data]);

  const defaultColumns: ColumnDef<TeamMember>[] = [
    { key: "name", header: "Name", width: "35%" },
    { key: "role", header: "Role", width: "25%" },
    { key: "mail", header: "Mail", width: "30%" },
  ];

  const tableColumns = columns || defaultColumns;

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full overflow-x-auto animate-pulse shadow-sm">
        {showTitle && <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg mt-4 w-full overflow-x-auto shadow-sm">
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
