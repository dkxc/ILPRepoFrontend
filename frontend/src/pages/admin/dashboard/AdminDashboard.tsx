import { useState } from "react";
import { useNavigate } from "react-router";
import AdminDashboardCard from "../../../features/admin/dashboard/AdminDashboardCard";
import RecentBatches from "./RecentBatches";
import DashboardProjects from "./DashboardProjects";
import TotalTrainingHours from "./TotalTrainingHours";

const topCards = [
  { id: "batches", title: "All Batches", subtitle: "1", value: <span className="text-2xl">1</span> },
  { id: "projects", title: "Projects", subtitle: "8", value: <span className="text-2xl">8</span> },
  { id: "hours", title: "Total Training Hours", subtitle: "hr/week", value: <span className="text-2xl">48</span> },
];


function Dashboard() {
  const [selected, setSelected] = useState<string | null>("batches");
  const [selectedBatchId, setSelectedBatchId] = useState<string>("1");
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6"> {/* overall padding for admin dashboard */}

      <div className="grid grid-cols-12 gap-4">
        {topCards.map((c) => (
          <div key={c.id} className="col-span-4">
            <AdminDashboardCard
              title={c.title}
              subtitle={c.subtitle}
              value={c.value}
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
