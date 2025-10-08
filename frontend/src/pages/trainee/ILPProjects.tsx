import { useState, forwardRef } from "react";
import { Badge, ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Trash2 } from "lucide-react";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { useNavigate } from "react-router";
import Button from "../../features/ui/Button";
import { logos } from "../../assets/projects-svg";

interface Project {
  id: number;
  name: string;
  batch: string;
  teamLead: string;
  status: "In Progress" | "Live" | "Not Live";
  startDate: string;
  endDate: string;
}

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: keyof typeof logos;
  title: string;
  value: number | string;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ className, type, title, value, ...props }, ref) => {
    const icon = logos[type];

    return (
      <div
        ref={ref}
        className={`flex items-center gap-4 p-2 rounded-md border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${className}`}
        {...props}
      >
        <div className="flex items-center justify-center">{icon}</div>
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

export default function Projects() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>("");
  const navigate = useNavigate();

  const projectsData: Project[] = [
    {
      id: 1,
      name: "ILP Repo Project",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Alex Jose",
      status: "In Progress",
      startDate: "2025-01-15",
      endDate: "2025-06-30",
    },
    {
      id: 2,
      name: "Project Management Tool",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Amal Babu",
      status: "Live",
      startDate: "2024-09-01",
      endDate: "2025-03-15",
    },
    {
      id: 3,
      name: "Car Parking",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "George Mathew",
      status: "Not Live",
      startDate: "2025-02-01",
      endDate: "2025-07-31",
    },
    {
      id: 4,
      name: "Attendance Tracker",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Riya Thomas",
      status: "In Progress",
      startDate: "2025-03-10",
      endDate: "2025-08-20",
    },
    {
      id: 5,
      name: "E-Learning Portal",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Samuel Raj",
      status: "Live",
      startDate: "2024-08-15",
      endDate: "2025-02-28",
    },
    {
      id: 6,
      name: "Inventory Management System",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Neha Varghese",
      status: "In Progress",
      startDate: "2025-01-20",
      endDate: "2025-06-15",
    },
    {
      id: 7,
      name: "Online Voting System",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Vijay Kumar",
      status: "In Progress",
      startDate: "2024-11-01",
      endDate: "2025-04-30",
    },
    {
      id: 8,
      name: "Expense Tracker",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Kiran Das",
      status: "Not Live",
      startDate: "2025-04-01",
      endDate: "2025-09-30",
    },
    {
      id: 9,
      name: "Smart Library Management",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Anjali Nair",
      status: "In Progress",
      startDate: "2024-12-01",
      endDate: "2025-05-31",
    },
    {
      id: 10,
      name: "Health Monitoring Dashboard",
      batch: "ILP 2025-26 Batch 9",
      teamLead: "Mohammed Faisal",
      status: "Live",
      startDate: "2024-10-15",
      endDate: "2025-03-31",
    },
    {
      id: 11,
      name: "Task Scheduling App",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Sneha George",
      status: "In Progress",
      startDate: "2025-02-15",
      endDate: "2025-07-15",
    },
    {
      id: 12,
      name: "Chat Communication Platform",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Rahul Dev",
      status: "Not Live",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
    },
    {
      id: 13,
      name: "AI Resume Screener",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Priya Menon",
      status: "Live",
      startDate: "2024-09-20",
      endDate: "2025-02-28",
    },
    {
      id: 14,
      name: "Bug Tracking System",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Aditya Verma",
      status: "In Progress",
      startDate: "2025-01-10",
      endDate: "2025-06-10",
    },
    {
      id: 15,
      name: "Smart Attendance with QR",
      batch: "ILP 2025-26 Batch 9",
      teamLead: "Divya Suresh",
      status: "In Progress",
      startDate: "2025-02-20",
      endDate: "2025-07-20",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "yellow";
      case "Live":
        return "green";
      case "Not Live":
        return "red";
      default:
        return "gray";
    }
  };

  const handleDelete = (project: Project) => {
    modals.openConfirmModal({
      title: "Delete Project",
      centered: true,
      children: (
        <p>
          Are you sure you want to delete <b>{project.name}</b>?
        </p>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        notifications.show({
          title: "Deleted",
          message: `${project.name} was removed.`,
          color: "red",
        });
      },
    });
  };

  const handleRowClick = (row: Project) => {
    console.log("Clicked project:", row);
    navigate(`/projectsDetailsTrainee/${row.id}`);
  };

  const columns: ColumnDef<Project>[] = [
    { key: "name", header: "Name", sortable: true, width: "25%" },
    { key: "batch", header: "Batch", sortable: true, width: "25%" },
    { key: "teamLead", header: "Team Lead", sortable: true, width: "25%" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "15%",
      render: (value) => (
        <Badge
          color={getStatusColor(value)}
          variant="light"
          size="lg"
          radius="sm"
        >
          {value}
        </Badge>
      ),
    },
    // {
    //   key: "action",
    //   header: "Action",
    //   align: "center",
    //   width: "10%",
    //   render: (_, row) => (
    //     <ActionIcon
    //       variant="subtle"
    //       color="gray"
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         handleDelete(row);
    //       }}
    //     >
    //       <Trash2 size={18} />
    //     </ActionIcon>
    //   ),
    // },
  ];

  const filteredData = selectedBatch
    ? projectsData.filter((project) => project.batch === selectedBatch)
    : projectsData;

  return (
    <>
      <div className="flex items-center justify-between mt-10 bg">
        <h1
          className="text-2xl font-bold ml-10 text-[#565E6C] font-primary"
          style={{ color: "#565E6C" }}
        >
          Projects
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 bg-w ml-4">
        <ProjectCard
          type="all"
          title="All Projects"
          value={15}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="inProgress"
          title="Projects In Progress"
          value={9}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="live"
          title="Live Projects"
          value={4}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="notLive"
          title="Not Live Projects"
          value={2}
          className="text-sm w-60 h-16"
        />
      </div>
      <div className="bg">
        <DataTable
          columns={columns}
          data={filteredData}
          showHeaderSection={true}
          headerTitle="All Projects"
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableFilter={true}
          filterColumn="batch"
          filterOptions={[
            "ILP 2025-26 Batch 5",
            "ILP 2025-26 Batch 6",
            "ILP 2025-26 Batch 7",
            "ILP 2025-26 Batch 8",
            "ILP 2025-26 Batch 9",
          ]}
          enableSearch={true}
          enablePagination={true}
          enableDateFilter={true}
          dateFilterColumn="startDate"
          pageSize={5}
          pageSizeOptions={[5, 10, 25, 50]}
          striped={false}
          highlightOnHover={true}
          withBorder={true}
          onRowClick={handleRowClick}
          rowStyle={{
            fontSize: "16px",
            height: "56px",
            lineHeight: "1",
          }}
          headerStyle={{
            fontWeight: 500,
            fontSize: "16px",
            height: "40px",
            background: "#F8F9FA",
          }}
        />
      </div>
    </>
  );
}
