import { useState } from "react";
import AdminDashboardCard from "../../../features/admin/dashboard/AdminDashboardCard";
import RecentBatches from "./RecentBatches";
import DashboardProjects from "./DashboardProjects";
import TotalTrainingHours from "./TotalTrainingHours";
import batchIcon from "../../../assets/icons/All Batches icon.svg";
import projectIcon from "../../../assets/icons/AdminDashboardProjects.svg";
import clockIcon from "../../../assets/icons/clock.svg";

const topCards = [
  {
    id: "batches",
    title: "All Batches",
    value: <span className="text-2xl">1</span>,
    icon: <img src={batchIcon} alt="Batches"/>,
  },
  {
    id: "projects",
    title: "Projects",
    value: <span className="text-2xl">8</span>,
    icon: <img src={projectIcon} alt="Projects" />,
  },
  {
    id: "hours",
    title: "Total Training Hours",
    value: <span className="text-2xl">48</span>,
    icon: <img src={clockIcon} alt="Hours"/>,
  },
];

function Dashboard() {
  const [selected, setSelected] = useState<string | null>("batches");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("1");

  return (
    <div className="p-6 space-y-6">
      {" "}
      {/* overall padding for admin dashboard */}
      <div className="grid grid-cols-12 gap-4">
        {topCards.map((c) => (
          <div key={c.id} className="col-span-4">
            <AdminDashboardCard
              title={c.title}
              // subtitle={c.subtitle}
              value={c.value}
              icon={c.icon}
              selected={selected === c.id}
              onClick={() => {
                setSelected(c.id);
              }}
            />
          </div>
        ))}
      </div>
      {/* Only the content below the top cards changes */}
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
