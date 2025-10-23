import { useState, useEffect, forwardRef } from "react";
import { Badge } from "@mantine/core";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { useNavigate } from "react-router";
import { logos } from "../../assets/projects-svg";

interface Project {
  id: number;
  name: string;
  batch: string;
  teamLead: string;
  status: "In Progress" | "Live" | "Not Live" | "Completed" | string;
  startDate: string;
  endDate: string;
  techStack: string[];
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
  const [selectedBatch] = useState<string | null>("");
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://localhost:7153/api/ProjectDetails");
        if (!response.ok) {
          setError(`Network error: ${response.status} ${response.statusText}`);
          return;
        }
        const result = await response.json();
        if (!result) {
          setError("No response from server.");
          return;
        }
        if (typeof result !== "object") {
          setError("Invalid response format.");
          return;
        }
        if (!("status" in result)) {
          setError("Missing status in response.");
          return;
        }
        if (result.status !== 200) {
          setError(result.message || `API error: status ${result.status}`);
          return;
        }
        if (!Array.isArray(result.data)) {
          setError("Data is not an array.");
          return;
        }
        // Map API status values to display values and handle missing fields
        const mappedProjects = result.data.map((p: any, idx: number) => {
          // Find team lead from trainees array if available
          let teamLead = "Unknown Lead";
          if (Array.isArray(p.trainees)) {
            const lead = p.trainees.find((t: any) => t.role && t.role.toLowerCase().includes("lead"));
            if (lead) teamLead = lead.traineeName;
          }
          return {
            id: p.id ?? idx,
            name: p.projectName ?? "Unnamed Project",
            batch: p.batch?.batchName || (p.batchId ? `ILP Batch ${p.batchId}` : "Unknown Batch"),
            teamLead,
            status:
              p.status === "InProgress" ? "In Progress" :
              p.status === "NotLive" ? "Not Live" :
              p.status === "Completed" ? "Completed" :
              p.status === "Live" ? "Live" :
              p.status ?? "Unknown",
            startDate: p.startDate ?? "",
            endDate: p.endDate ?? "",
            techStack: Array.isArray(p.techStacks) ? p.techStacks.map((s: any) => s.stackName) : [],
          };
        });
        setProjectsData(mappedProjects);
      } catch (err) {
        if (err instanceof SyntaxError) {
          setError("Invalid JSON response from server.");
        } else if (err instanceof TypeError) {
          setError("Network error or CORS issue.");
        } else {
          setError("Unexpected error: " + ((err as Error)?.message || String(err)));
        }
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "yellow";
      case "Live":
        return "green";
      case "Not Live":
        return "red";
      case "Completed":
        return "blue";
      default:
        return "gray";
    }
  };

  const handleRowClick = (row: Project) => {
    console.log("Clicked project:", row);
    navigate(`/projectsDetailsTrainee/${row.id}`);
  };

  const columns: ColumnDef<Project>[] = [
    { key: "name", header: "Name", sortable: true, width: "20%" },
    { key: "batch", header: "Batch", sortable: true, width: "15%" },
    { key: "teamLead", header: "Team Lead", sortable: true, width: "15%" },
    {
      key: "techStack",
      header: "Tech Stack",
      sortable: false,
      width: "25%",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(value) && value.length > 0
            ? value.map((stack: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium mr-1">
                  {stack}
                </span>
              ))
            : <span className="text-gray-400 italic">No stack</span>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "10%",
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

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center">Loading projects...</div>;
  }
  if (error) {
    return <div className="min-h-screen w-full flex items-center justify-center text-red-500">{error}</div>;
  }
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
      {/* You may want to update these cards to use dynamic values from projectsData if API provides summary info */}
      <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 bg-w ml-4">
        <ProjectCard
          type="all"
          title="All Projects"
          value={projectsData.length}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="inProgress"
          title="Projects In Progress"
          value={projectsData.filter(p => p.status === "In Progress").length}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="live"
          title="Live Projects"
          value={projectsData.filter(p => p.status === "Live").length}
          className="text-sm w-60 h-16"
        />
        <ProjectCard
          type="notLive"
          title="Not Live Projects"
          value={projectsData.filter(p => p.status === "Not Live").length}
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
