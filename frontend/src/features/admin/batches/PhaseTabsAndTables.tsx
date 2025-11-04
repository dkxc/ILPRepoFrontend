import React from "react";
import { ActionIcon } from "@mantine/core";
import {
  Pencil,
  Users,
  Briefcase,
  Building2,
  LayoutDashboard,
  BarChart2,
} from "lucide-react";
import DataTable from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";

interface Trainee {
  id: number;
  traineeId?: number;
  userId?: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Inactive";
}

interface Specialization {
  id: number;
  traineeName: string;
  techStack: string;
  project: string;
}

interface BusinessOrientation {
  id: number;
  boPhaseId?: number;
  traineeName: string;
  buddy: string;
  du: string;
}

interface DUData {
  id: number;
  traineeDuId?: number;
  traineeName: string;
  duAllocated: string;
  location: string;
  ojtMentor: string;
}

interface ResultsData {
  id: number;
  traineeName: string;
  specializationScore: string;
  boScore: string;
  overallScore: string;
}

interface PhaseTabsAndTablesProps {
  activePhase: string;
  setActivePhase: (phase: string) => void;
  trainees: Trainee[];
  specializationData: Specialization[];
  businessOrientationData: BusinessOrientation[];
  duData: DUData[];
  resultsData: ResultsData[];
  handleRowClick: (row: Trainee) => void;
  handleEditRow: (row: any, phase: string) => void;
  availablePhases?: string[]; // Optional prop to filter which phases to show
}

const PhaseTabsAndTables: React.FC<PhaseTabsAndTablesProps> = ({
  activePhase,
  setActivePhase,
  trainees,
  specializationData,
  businessOrientationData,
  duData,
  resultsData,
  handleRowClick,
  handleEditRow,
  availablePhases,
}) => {
  // All possible phases
  const allPhases = [
    "Trainees",
    "Specialization",
    "Business Orientation",
    "DU",
    "Scores",
  ];

  // Check if specialization phase exists in available phases
  // Only show specialization if:
  // 1. availablePhases is provided and is an array
  // 2. availablePhases has at least one item
  // 3. One of the items matches specialization
  const hasSpecializationPhase =
    Array.isArray(availablePhases) &&
    availablePhases.length > 0 &&
    availablePhases.some((available) => {
      if (!available || typeof available !== "string") return false;
      const lowerPhase = available.toLowerCase();
      return (
        lowerPhase === "specialization" ||
        lowerPhase === "spec" ||
        lowerPhase.includes("specialization")
      );
    });

  // Filter phases based on availablePhases if provided
  const phasesToShow = allPhases.filter((phase) => {
    // Always show Trainees, Business Orientation, DU, and Scores
    if (
      phase === "Trainees" ||
      phase === "Business Orientation" ||
      phase === "DU" ||
      phase === "Scores"
    )
      return true;
    // Only show Specialization phase if it exists in availablePhases
    if (phase === "Specialization") {
      return hasSpecializationPhase;
    }
    return true;
  });

  // Ensure activePhase is valid - if current phase is not in phasesToShow, switch to first available
  React.useEffect(() => {
    if (!phasesToShow.includes(activePhase) && phasesToShow.length > 0) {
      setActivePhase(phasesToShow[0]);
    }
  }, [phasesToShow, activePhase, setActivePhase]);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Trainees":
        return <Users size={16} />;
      case "Specialization":
        return <Briefcase size={16} />;
      case "Business Orientation":
        return <Building2 size={16} />;
      case "DU":
        return <LayoutDashboard size={16} />;
      case "Scores":
        return <BarChart2 size={16} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Phase Tabs */}
      <div className="bg-white px-3 pt-2">
        <div className="flex justify-between gap-3 bg-bg-results-tabs px-3 py-0 rounded-lg">
          {phasesToShow.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${phase === activePhase ? "bg-blue-50 text-brand-600 my-1" : "text-gray-600 hover:bg-gray-100 my-1"}`}
            >
              {getPhaseIcon(phase)}
              <span>{phase}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Phase Tables */}
      {activePhase === "Trainees" && (
        <DataTable
          columns={[
            { key: "name", header: "Name", sortable: true, width: "20%" },
            {
              key: "email",
              header: "Email",
              sortable: true,
              width: "25%",
              render: (v) => (
                <a
                  href={`mailto:${v}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {v}
                </a>
              ),
            },
            {
              key: "phoneNumber",
              header: "Phone Number",
              sortable: true,
              width: "15%",
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
              align: "center",
              width: "15%",
              render: (v) => (
                <StatusBadge status={v as "Active" | "Inactive"} />
              ),
            },
            {
              key: "action",
              header: "Action",
              align: "center",
              width: "12%",
              render: (_, row) => (
                <div className="flex justify-center items-center gap-2">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    className="transition-transform transform hover:scale-110 hover:text-blue-600"
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation();
                      handleEditRow(row, "Trainees");
                    }}
                  >
                    <Pencil size={18} />
                  </ActionIcon>
                </div>
              ),
            },
          ]}
          data={trainees}
          showHeaderSection
          headerTitle="Trainees"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          onRowClick={handleRowClick}
        />
      )}

      {/* Specialization Table - Only shown if specialization phase exists for this batch */}
      {activePhase === "Specialization" && hasSpecializationPhase && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "35%",
            },
            {
              key: "techStack",
              header: "Tech Stack",
              sortable: true,
              width: "30%",
            },
            {
              key: "project",
              header: "Project Involved",
              sortable: true,
              width: "35%",
            },
          ]}
          data={specializationData}
          showHeaderSection
          headerTitle="Specialization Phase"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          enableMultipleFilters
          columnFilters={{
            techStack: Array.from(
              new Set(
                specializationData
                  .map((item) => item.techStack)
                  .filter((tech) => tech && tech.trim() !== ""),
              ),
            ).sort(),
            project: Array.from(
              new Set(
                specializationData
                  .map((item) => item.project)
                  .filter((proj) => proj && proj.trim() !== ""),
              ),
            ).sort(),
          }}
        />
      )}

      {/* Business Orientation Table */}
      {activePhase === "Business Orientation" && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "30%",
            },
            { key: "buddy", header: "Buddy", sortable: true, width: "25%" },
            { key: "du", header: "DU", sortable: true, width: "25%" },
            {
              key: "action",
              header: "Action",
              width: "10%",
              align: "center",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  className="transition-transform transform hover:scale-110 hover:text-blue-600"
                  onClick={() => handleEditRow(row, "Business Orientation")}
                >
                  <Pencil size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={businessOrientationData}
          showHeaderSection
          headerTitle="Business Orientation"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          enableMultipleFilters
          columnFilters={{
            buddy: Array.from(
              new Set(
                businessOrientationData
                  .map((item) => item.buddy)
                  .filter((buddy) => buddy && buddy.trim() !== ""),
              ),
            ).sort(),
            du: Array.from(
              new Set(
                businessOrientationData
                  .map((item) => item.du)
                  .filter((du) => du && du.trim() !== ""),
              ),
            ).sort(),
          }}
        />
      )}

      {/* DU Table */}
      {activePhase === "DU" && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "25%",
            },
            {
              key: "duAllocated",
              header: "DU Allocated",
              sortable: true,
              width: "25%",
            },
            {
              key: "location",
              header: "Location",
              sortable: true,
              width: "25%",
            },
            {
              key: "ojtMentor",
              header: "OJT Mentor",
              sortable: true,
              width: "15%",
            },
            {
              key: "action",
              header: "Action",
              width: "10%",
              align: "center",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  className="transition-transform transform hover:scale-110 hover:text-blue-600"
                  onClick={() => handleEditRow(row, "DU")}
                >
                  <Pencil size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={duData}
          showHeaderSection
          headerTitle="DU"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
          enableMultipleFilters
          columnFilters={{
            duAllocated: Array.from(
              new Set(
                duData
                  .map((item) => item.duAllocated)
                  .filter((du) => du && du.trim() !== ""),
              ),
            ).sort(),
            location: Array.from(
              new Set(
                duData
                  .map((item) => item.location)
                  .filter((loc) => loc && loc.trim() !== ""),
              ),
            ).sort(),
          }}
        />
      )}

      {/* Scores Table */}
      {activePhase === "Scores" && (
        <DataTable
          columns={[
            {
              key: "traineeName",
              header: "Trainee Name",
              sortable: true,
              width: "20%",
            },
            {
              key: "specializationScore",
              header: "Specialization Score",
              sortable: true,
              width: "20%",
            },
            {
              key: "boScore",
              header: "BO Score",
              sortable: true,
              width: "15%",
            },
            {
              key: "overallScore",
              header: "Overall Score",
              sortable: true,
              width: "15%",
            },
            {
              key: "action",
              header: "Action",
              width: "10%",
              align: "center",
              render: (_, row) => (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  className="transition-transform transform hover:scale-110 hover:text-blue-600"
                  onClick={() => handleEditRow(row, "Results")}
                >
                  <Pencil size={18} />
                </ActionIcon>
              ),
            },
          ]}
          data={resultsData}
          showHeaderSection
          headerTitle="Scores"
          enableSearch
          enablePagination
          pageSize={5}
          highlightOnHover
          withBorder
        />
      )}
    </>
  );
};

export default PhaseTabsAndTables;
