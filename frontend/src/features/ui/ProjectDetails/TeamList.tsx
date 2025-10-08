import DataTable from "../../admin/Table";
import type { ColumnDef } from "../../admin/Table";

export interface TeamMember {
  name: string;
  role: string;
  mail: string;
}

interface TeamListProps {
  columns?: ColumnDef<TeamMember>[];
  data?: TeamMember[];
  title?: string;
  showTitle?: boolean;
}

const defaultColumns: ColumnDef<TeamMember>[] = [
  { key: "name", header: "Name", width: "40%" },
  { key: "role", header: "Role", width: "30%" },
  { key: "mail", header: "Mail", width: "30%" },
];

const defaultData: TeamMember[] = [
  { name: "Alice Johnson", role: "Developer", mail: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
  { name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
  { name: "Alice Johnson", role: "Developer", mail: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
  { name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
  { name: "Alice Johnson", role: "Developer", mail: "alice@example.com" },
];

export default function TeamList({
  columns = defaultColumns,
  data = defaultData,
  title = "Team Members",
  showTitle = true,
}: TeamListProps) {
  return (
    <div className="bg-white px-2 sm:px-4 md:px-6 py-4 rounded-lg shadow mt-4 w-full overflow-x-auto">
      {showTitle && <h2 className="text-lg font-bold mb-4">{title}</h2>}
      <div className="min-w-[400px]">
        <DataTable
          columns={columns}
          data={data}
          enableSearch={false}
          enablePagination={false}
          rowStyle={{
            lineHeight: "3",
            borderBottom: "1px solid #e5e7eb", // Tailwind's gray-200
          }}
          headerStyle={{
            height: "3rem",
          }}
        />
      </div>
    </div>
  );
}
