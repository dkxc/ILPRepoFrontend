import { useEffect, useState } from "react";
import axios from "axios";
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

function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummaryData>({
    totalBatches: 0,
    totalProjects: 0,
  });

  const [selected, setSelected] = useState<string | null>("batches");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("1");

  // Fetch data from backend API
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get<DashboardSummaryData>(
          "https://localhost:7224/api/AdminDashboard/summary"
        );
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      }
    };
    fetchSummary();
  }, []);

  const topCards = [
    {
      id: "batches",
      title: "All Batches",
      value: <span className="text-2xl">{summary.totalBatches}</span>,
      icon: <img src={batchIcon} alt="Batches" />,
    },
    {
      id: "projects",
      title: "Projects",
      value: <span className="text-2xl">{summary.totalProjects}</span>,
      icon: <img src={projectIcon} alt="Projects" />,
    },
    {
      id: "hours",
      title: "Total Training Hours",
      value: <span className="text-2xl">48</span>,
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
