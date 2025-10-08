import React from "react";
import DataTable from "../../admin/Table";
import type { ColumnDef } from "../../admin/Table";

interface TeamMember {
  name: string;
  role: string;
  mail: string;
}

const columns: ColumnDef<TeamMember>[] = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
  { key: "mail", header: "Mail" },
];

const data: TeamMember[] = [
  { name: "Alice Johnson", role: "Developer", mail: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
  { name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
  { name: "Alice Johnson", role: "Developer", mail: "alice@example.com" },
  { name: "Bob Smith", role: "Designer", mail: "bob@example.com" },
  { name: "Charlie Lee", role: "Tester", mail: "charlie@example.com" },
  { name: "Alice Johnson", role: "Developer", mail: "alice@example.com" },
];

export default function TeamList() {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow mt-4 overflow-x-auto">
      <h2 className="text-lg font-bold mb-4">Team Members</h2>
      <DataTable
        columns={columns}
        data={data}
        enableSearch={false}
        enablePagination={false}
        rowStyle={{
          lineHeight: '3',
          borderBottom: '1px solid #e5e7eb', // Tailwind's gray-200
        }}
        headerStyle={{
          height: '3rem',
        }}
      />
    </div>
  );
}
