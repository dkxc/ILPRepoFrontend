import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminDashboardCard from "../../../features/admin/dashboard/AdminDashboardCard";
import RecentBatches from "./RecentBatches";
import DashboardProjects from "./DashboardProjects";
import TotalTrainingHours from "./TotalTrainingHours";
import batchIcon from "../../../assets/icons/All Batches icon.svg";
import projectIcon from "../../../assets/icons/AdminDashboardProjects.svg";
import clockIcon from "../../../assets/icons/clock.svg";

interface DashboardSummaryData {
  totalBatches: number;
  totalProjects: number;
}

// Define a function to fetch data
const fetchDashboardSummary = async (): Promise<DashboardSummaryData> => {
  const res = await fetch("https://localhost:7224/api/AdminDashboard/summary");
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard summary");
  }
  return res.json();
};

function Dashboard() {
  const [selected, setSelected] = useState<string | null>("batches");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("1");
  // ✅ Fetch total training hours for last 5 years
  const fetchTotalTrainingHours = async () => {
    // ✅ Always fixed start date (01-01-2020)
    const startDate = "2020-01-01";

    // ✅ Current date as end date (YYYY-MM-DD)
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    const params = new URLSearchParams({
      startDate,
      endDate,
      // ❌ DO NOT send batchTypeId — API treats missing id as "All Batches"
    });

    const res = await fetch(
      `https://localhost:7224/api/AdminDashboard/training-hours-report?${params}`,
    );

    if (!res.ok) throw new Error("Failed to fetch total training hours");

    return res.json();
  };
  const {
    data: trainingHours,
    isLoading: isHoursLoading,
    isError: isHoursError,
  } = useQuery({
    queryKey: ["dashboardTrainingHours"],
    queryFn: fetchTotalTrainingHours,
  });

  // Fetch data from backend API
  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery<DashboardSummaryData>({
    queryKey: ["dashboardSummary"],
    queryFn: fetchDashboardSummary,
  });

  // Handle loading and error states
  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  const topCards = [
    {
      id: "batches",
      title: "All Batches",
      value: <span className="text-2xl">{summary?.totalBatches ?? 0}</span>,
      icon: <img src={batchIcon} alt="Batches" />,
    },
    {
      id: "projects",
      title: "Projects",
      value: <span className="text-2xl">{summary?.totalProjects ?? 0}</span>,
      icon: <img src={projectIcon} alt="Projects" />,
    },
    {
      id: "hours",
      title: "Total Training Hours",
      value: (
        <span className="text-2xl">
          {isHoursLoading
            ? "..."
            : isHoursError
              ? "0"
              : (() => {
                  if (typeof trainingHours?.totalHours === "number") {
                    return trainingHours.totalHours; // ✅ always correct for All Batches
                  }

                  if (Array.isArray(trainingHours?.batchDetails)) {
                    return trainingHours.batchDetails.reduce(
                      (sum: number, b: { totalTrainingHours?: number }) =>
                        sum + (b.totalTrainingHours ?? 0),
                      0,
                    );
                  }

                  return 0;
                })()}
        </span>
      ),
      icon: <img src={clockIcon} alt="Hours" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top summary cards */}
      <div className="grid grid-cols-12 gap-4">
        {topCards.map((c) => (
          <div key={c.id} className="col-span-4">
            <AdminDashboardCard
              title={c.title}
              value={c.value}
              icon={c.icon}
              selected={selected === c.id}
              onClick={() => setSelected(c.id)}
            />
          </div>
        ))}
      </div>

      {/* Conditional rendering below cards */}
      {selected === "projects" ? (
        <DashboardProjects
          selectedBatchId={selectedBatchId}
          setSelectedBatchId={setSelectedBatchId}
        />
      ) : selected === "hours" ? (
        <TotalTrainingHours />
      ) : (
        <RecentBatches
          selectedBatchId={selectedBatchId}
          setSelectedBatchId={setSelectedBatchId}
        />
      )}
    </div>
  );
}

export default Dashboard;
