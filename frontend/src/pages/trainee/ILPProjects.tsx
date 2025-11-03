import { useState, useEffect, forwardRef } from "react";
import { Badge, ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Trash2 } from "lucide-react";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { useNavigate } from "react-router";
import Button from "../../features/ui/Button";
import { logos } from "../../assets/projects-svg";
import { useAuth } from "../../context/AuthContext";
import { ProjectService } from "../../services/projectService";

// ============= GLOBAL CACHE =============
let traineeProjectsCache: {
  projects: Project[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ============= INTERFACES =============
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
  isActive?: boolean;
  onCardClick?: () => void;
}

// ============= PROJECT CARD COMPONENT =============
const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    { className, type, title, value, isActive = false, onCardClick, ...props },
    ref,
  ) => {
    const icon = logos[type];

    return (
      <div
        ref={ref}
        onClick={onCardClick}
        className={`flex items-center gap-4 p-2 rounded-md border transition-all duration-200 cursor-pointer ${
          isActive
            ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02] ring-2 ring-blue-200 text-blue-600"
            : "border-gray-200 bg-white hover:shadow-md hover:scale-[1.01] text-gray-400"
        } ${className}`}
        {...props}
      >
        <div
          className={`flex items-center justify-center transition-colors duration-200 ${
            isActive ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <p
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-semibold transition-colors duration-200 ${
              isActive ? "text-blue-700" : "text-gray-800"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

// ============= MAIN COMPONENT =============
export default function Projects() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // ============= DATA TRANSFORMATION =============
  const transformApiData = (apiProjects: any[]): Project[] => {
    return apiProjects.map((project) => {
      // Status mapping: 0 = Not Live, 1 = Live, 2 = In Progress
      const statusMap: { [key: number]: "In Progress" | "Live" | "Not Live" } =
        {
          0: "Not Live",
          1: "Live",
          2: "In Progress",
        };

      return {
        id: project.id,
        name: project.projectName,
        batch: project.batchName || "N/A",
        teamLead: project.teamLead || "N/A",
        status: statusMap[project.status] || "Not Live",
        startDate: project.createdAt ? project.createdAt.split("T")[0] : "",
        endDate: project.updatedAt ? project.updatedAt.split("T")[0] : "",
      };
    });
  };

  // ============= FETCH DATA =============
  useEffect(() => {
    let isMounted = true;

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Check if we have cached data that's still fresh
    const now = Date.now();
    if (
      traineeProjectsCache &&
      now - traineeProjectsCache.timestamp < CACHE_DURATION
    ) {
      console.log("📦 Loading from cache...");
      setProjectsData(traineeProjectsCache.projects);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        console.log("🚀 Starting to fetch projects...");
        setLoading(true);

        const result = await ProjectService.getAllProjects();
        console.log("📦 Raw API Result:", result);

        if (!isMounted) {
          console.log("⚠️ Component unmounted, aborting");
          return;
        }

        if (result && result.data && Array.isArray(result.data)) {
          console.log(`✅ Received ${result.data.length} projects`);

          const transformed = transformApiData(result.data);
          console.log("🔄 Transformed Data:", transformed.length, "projects");

          // Update state
          setProjectsData(transformed);

          // Store in cache
          traineeProjectsCache = {
            projects: transformed,
            timestamp: Date.now(),
          };
          console.log("💾 Data cached successfully");

          if (transformed.length > 0) {
            notifications.show({
              title: "Success",
              message:
                result.message || `Loaded ${transformed.length} projects`,
              color: "green",
            });
          }
        } else {
          console.error("❌ Invalid response structure:", result);
          notifications.show({
            title: "Error",
            message: result?.message || "Invalid response from server",
            color: "red",
          });
        }
      } catch (error: any) {
        if (!isMounted) return;

        console.error("❌ Error fetching projects:", error);
        notifications.show({
          title: "Error",
          message: error.message || "Failed to load projects",
          color: "red",
        });
      } finally {
        if (isMounted) {
          console.log("✓ Fetch complete");
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      console.log("🧹 Cleanup: Component unmounting");
      isMounted = false;
    };
  }, [isLoggedIn]);

  // ============= HELPER FUNCTIONS =============
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

  const handleCardClick = (filterType: string) => {
    console.log("Card clicked:", filterType);
    setActiveFilter(filterType);
    setSelectedBatch(null); // Reset batch filter when clicking status cards
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
    navigate("/projectsDetailsTrainee", {
      state: {
        projectId: row.id,
        projectData: row,
      },
    });
  };

  // ============= TABLE COLUMNS =============
  const columns: ColumnDef<Project>[] = [
    { key: "name", header: "Name", sortable: true, width: "30%" },
    { key: "batch", header: "Batch", sortable: true, width: "25%" },
    { key: "teamLead", header: "Team Lead", sortable: true, width: "25%" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "20%",
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
  ];

  // ============= COMPUTED VALUES =============
  const filteredData = projectsData.filter((project) => {
    // Apply status filter
    let statusMatch = true;
    if (activeFilter === "inProgress") {
      statusMatch = project.status === "In Progress";
    } else if (activeFilter === "live") {
      statusMatch = project.status === "Live";
    } else if (activeFilter === "notLive") {
      statusMatch = project.status === "Not Live";
    }

    // Apply batch filter
    const batchMatch = selectedBatch ? project.batch === selectedBatch : true;

    return statusMatch && batchMatch;
  });

  const stats = {
    all: projectsData.length,
    inProgress: projectsData.filter((p) => p.status === "In Progress").length,
    live: projectsData.filter((p) => p.status === "Live").length,
    notLive: projectsData.filter((p) => p.status === "Not Live").length,
  };

  const uniqueBatches = Array.from(
    new Set(projectsData.map((p) => p.batch)),
  ).filter((b) => b !== "N/A");

  const getHeaderTitle = () => {
    if (selectedBatch) {
      return `${selectedBatch} Projects${activeFilter !== "all" ? ` - ${activeFilter === "inProgress" ? "In Progress" : activeFilter === "live" ? "Live" : "Not Live"}` : ""}`;
    }

    if (activeFilter === "all") return "All Projects";
    if (activeFilter === "inProgress") return "Projects In Progress";
    if (activeFilter === "live") return "Live Projects";
    if (activeFilter === "notLive") return "Not Live Projects";

    return "All Projects";
  };

  // ============= LOADING STATE =============
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Loading projects...
          </div>
          <div className="text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  // ============= RENDER =============
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

      {/* Project Cards with Clickable Filters */}
      <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 bg-w ml-4">
        <ProjectCard
          type="all"
          title="All Projects"
          value={stats.all}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "all"}
          onCardClick={() => handleCardClick("all")}
        />
        <ProjectCard
          type="inProgress"
          title="Projects In Progress"
          value={stats.inProgress}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "inProgress"}
          onCardClick={() => handleCardClick("inProgress")}
        />
        <ProjectCard
          type="live"
          title="Live Projects"
          value={stats.live}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "live"}
          onCardClick={() => handleCardClick("live")}
        />
        <ProjectCard
          type="notLive"
          title="Not Live Projects"
          value={stats.notLive}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "notLive"}
          onCardClick={() => handleCardClick("notLive")}
        />
      </div>

      {/* Data Table */}
      <div className="bg ml-10 mr-10">
        <DataTable
          columns={columns}
          data={filteredData}
          showHeaderSection={true}
          headerTitle={getHeaderTitle()}
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableFilter={uniqueBatches.length > 0}
          filterColumn="batch"
          filterOptions={uniqueBatches}
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
