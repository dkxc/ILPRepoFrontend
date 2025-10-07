import { useState, forwardRef } from "react";
import { Badge, ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Trash2 } from "lucide-react";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { useNavigate } from "react-router";
import Button from "../../features/ui/Button";

interface Project {
  name: string;
  batch: string;
  teamLead: string;
  status: "In Progress" | "Live" | "Not Live";
  startDate: string;
  endDate: string;
}

// Logo list
export const logos = {
  all: (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 27C22 29.7614 24.2386 32 27 32C29.7614 32 32 29.7614 32 27C32 24.2386 29.7614 22 27 22C24.2386 22 22 24.2386 22 27ZM22 27C18.0218 27 14.2064 25.4196 11.3934 22.6066C8.58035 19.7936 7 15.9782 7 12M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12ZM7 12V32"
        stroke="#DEE1E6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  inProgress: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.3327 14.3332C28.9251 11.4002 27.5645 8.6826 25.4604 6.599C23.3564 4.51539 20.6256 3.18137 17.6888 2.80242C14.752 2.42348 11.7721 3.02064 9.20802 4.50191C6.64398 5.98318 4.6381 8.2664 3.49935 10.9998M2.66602 4.33317V10.9998H9.33268M2.66602 17.6665C3.07361 20.5995 4.43423 23.3171 6.53828 25.4007C8.64233 27.4843 11.3731 28.8183 14.3099 29.1972C17.2467 29.5762 20.2266 28.979 22.7907 27.4977C25.3547 26.0165 27.3606 23.7333 28.4993 20.9998M29.3327 27.6665V20.9998H22.666"
        stroke="#DEE1E6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  live: (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0161 0.351562C18.3124 0.351641 19.5643 0.823847 20.5377 1.6799L20.7944 1.92156L21.9577 3.0849C22.277 3.40208 22.6939 3.60232 23.141 3.65323L23.366 3.66656H25.0327C26.3947 3.66649 27.7052 4.18751 28.6953 5.1228C29.6855 6.05808 30.2802 7.33674 30.3577 8.69656L30.366 8.9999V10.6666C30.366 11.1166 30.5194 11.5549 30.796 11.9049L30.946 12.0716L32.1077 13.2349C33.0706 14.1923 33.632 15.4809 33.6775 16.838C33.7231 18.1951 33.2493 19.5184 32.3527 20.5382L32.111 20.7949L30.9477 21.9582C30.6305 22.2775 30.4303 22.6944 30.3794 23.1416L30.366 23.3666V25.0332C30.3661 26.3953 29.8451 27.7057 28.9098 28.6958C27.9745 29.686 26.6959 30.2808 25.3361 30.3582L25.0327 30.3666H23.366C22.9167 30.3667 22.4805 30.5182 22.1277 30.7966L21.961 30.9466L20.7977 32.1082C19.8403 33.0711 18.5517 33.6325 17.1946 33.6781C15.8375 33.7236 14.5142 33.2498 13.4944 32.3532L13.2377 32.1116L12.0744 30.9482C11.7551 30.631 11.3382 30.4308 10.891 30.3799L10.666 30.3666H8.99938C7.63735 30.3666 6.32691 29.8456 5.33677 28.9103C4.34664 27.9751 3.75185 26.6964 3.67438 25.3366L3.66605 25.0332V23.3666C3.6659 22.9172 3.51443 22.481 3.23605 22.1282L3.08605 21.9616L1.92438 20.7982C0.96152 19.8408 0.400089 18.5522 0.354564 17.1951C0.309039 15.838 0.782848 14.5147 1.67938 13.4949L1.92105 13.2382L3.08438 12.0749C3.40157 11.7556 3.60181 11.3387 3.65272 10.8916L3.66605 10.6666V8.9999L3.67438 8.69656C3.7488 7.38897 4.30176 6.15448 5.22786 5.22838C6.15397 4.30227 7.38846 3.74932 8.69605 3.6749L8.99938 3.66656H10.666C11.1154 3.66641 11.5516 3.51494 11.9044 3.23656L12.071 3.08656L13.2344 1.9249C13.7299 1.42638 14.3192 1.03074 14.9682 0.760728C15.6172 0.490718 16.3131 0.351664 17.0161 0.351562ZM23.1777 12.4882C22.8652 12.1758 22.4413 12.0003 21.9994 12.0003C21.5574 12.0003 21.1336 12.1758 20.821 12.4882L15.3327 17.9749L13.1777 15.8216L13.021 15.6832C12.6861 15.4242 12.265 15.3024 11.8435 15.3426C11.422 15.3827 11.0315 15.5818 10.7515 15.8994C10.4714 16.217 10.3227 16.6293 10.3357 17.0526C10.3486 17.4758 10.5221 17.8783 10.821 18.1782L14.1544 21.5116L14.3111 21.6499C14.6317 21.8986 15.0321 22.0218 15.4372 21.9964C15.8422 21.9709 16.2241 21.7985 16.511 21.5116L23.1777 14.8449L23.316 14.6882C23.5648 14.3676 23.688 13.9671 23.6625 13.5621C23.6371 13.1571 23.4647 12.7752 23.1777 12.4882Z"
        fill="#DEE1E6"
      />
    </svg>
  ),
  notLive: (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.5 12.5L12.5 21.5M12.5 12.5L21.5 21.5M32 17C32 25.2843 25.2843 32 17 32C8.71573 32 2 25.2843 2 17C2 8.71573 8.71573 2 17 2C25.2843 2 32 8.71573 32 17Z"
        stroke="#DEDEDE"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

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
  }
);

ProjectCard.displayName = "ProjectCard";

export default function Projects() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>("");
  const navigate = useNavigate();

  const projectsData: Project[] = [
    {
      name: "ILP Repo Project",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Alex Jose",
      status: "In Progress",
      startDate: "2025-01-15",
      endDate: "2025-06-30",
    },
    {
      name: "Project Management Tool",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Amal Babu",
      status: "Live",
      startDate: "2024-09-01",
      endDate: "2025-03-15",
    },
    {
      name: "Car Parking",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "George Mathew",
      status: "Not Live",
      startDate: "2025-02-01",
      endDate: "2025-07-31",
    },
    {
      name: "Attendance Tracker",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Riya Thomas",
      status: "In Progress",
      startDate: "2025-03-10",
      endDate: "2025-08-20",
    },
    {
      name: "E-Learning Portal",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Samuel Raj",
      status: "Live",
      startDate: "2024-08-15",
      endDate: "2025-02-28",
    },
    {
      name: "Inventory Management System",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Neha Varghese",
      status: "In Progress",
      startDate: "2025-01-20",
      endDate: "2025-06-15",
    },
    {
      name: "Online Voting System",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Vijay Kumar",
      status: "In Progress",
      startDate: "2024-11-01",
      endDate: "2025-04-30",
    },
    {
      name: "Expense Tracker",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Kiran Das",
      status: "Not Live",
      startDate: "2025-04-01",
      endDate: "2025-09-30",
    },
    {
      name: "Smart Library Management",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Anjali Nair",
      status: "In Progress",
      startDate: "2024-12-01",
      endDate: "2025-05-31",
    },
    {
      name: "Health Monitoring Dashboard",
      batch: "ILP 2025-26 Batch 9",
      teamLead: "Mohammed Faisal",
      status: "Live",
      startDate: "2024-10-15",
      endDate: "2025-03-31",
    },
    {
      name: "Task Scheduling App",
      batch: "ILP 2025-26 Batch 7",
      teamLead: "Sneha George",
      status: "In Progress",
      startDate: "2025-02-15",
      endDate: "2025-07-15",
    },
    {
      name: "Chat Communication Platform",
      batch: "ILP 2025-26 Batch 5",
      teamLead: "Rahul Dev",
      status: "Not Live",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
    },
    {
      name: "AI Resume Screener",
      batch: "ILP 2025-26 Batch 8",
      teamLead: "Priya Menon",
      status: "Live",
      startDate: "2024-09-20",
      endDate: "2025-02-28",
    },
    {
      name: "Bug Tracking System",
      batch: "ILP 2025-26 Batch 6",
      teamLead: "Aditya Verma",
      status: "In Progress",
      startDate: "2025-01-10",
      endDate: "2025-06-10",
    },
    {
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
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
        >
          <Trash2 size={18} />
        </ActionIcon>
      ),
    },
  ];

  const filteredData = selectedBatch
    ? projectsData.filter((project) => project.batch === selectedBatch)
    : projectsData;

  return (
    <>
      <div className="flex items-center justify-between mt-10">
        <h1
          className="text-2xl font-bold ml-10 text-[#565E6C] font-primary"
          style={{ color: "#565E6C" }}
        >
          Projects
        </h1>
        <div className="pr-6 mr-6 ">
          <Button
            size="sm"
            className="font-secondary"
            onClick={() => navigate("/createProject")}
          >
            + Create Project
          </Button>
        </div>
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