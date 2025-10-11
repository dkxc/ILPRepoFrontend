import { lazy } from "react";
import type { Batch } from "../../features/trainee/types/Batch.types";
import type { TraineeDocument } from "../../features/trainee/types/TraineeDocument.types";
import type { Project } from "../../features/trainee/types/Project.types";
import type { Scores } from "../../features/trainee/types/scores/Score.types";
import type { Activity } from "../../features/trainee/types/Activity.types";

const BatchCard = lazy(
  () => import("../../features/trainee/dashboard/BatchCard"),
);
const DocumentsCard = lazy(
  () => import("../../features/trainee/dashboard/DocumentsCard"),
);
const ProjectCard = lazy(
  () => import("../../features/trainee/dashboard/ProjectCard"),
);
const RecentActivityCard = lazy(
  () => import("../../features/trainee/dashboard/RecentActivityCard"),
);
const ScoreCard = lazy(
  () => import("../../features/trainee/dashboard/ScoresCard"),
);
const WelcomeHeader = lazy(
  () => import("../../features/trainee/dashboard/WelcomeHeader"),
);

/* TODO: Remove this dummy data */
function Dashboard() {
  const firstName = "Name";
  const project: Project = {
    id: 21231,
    title: "ILP Repo",
    status: "Live",
    technologies: [".NET", "React"],
    team: {
      number: 4,
      members: [
        "Dhanush Kovi",
        "Nino Jagadish",
        "Raihana Rasaldeen",
        "Merlin Baiju",
        "Nandhu Krishna",
        "Mohammed Aiman",
        "Alex Joseph Pius",
      ],
    },
    progress: 60,
  };

  const batch: Batch = {
    id: 12345,
    title: "ILP 2025-26 Batch 1",
    type: "Associate Software Developer Training",
    startDate: new Date(2025, 7, 4),
    endDate: new Date(2025, 11, 9),
    day: 23,
  };

  const documents: TraineeDocument[] = [
    {
      id: 1,
      title: "JS Module Test File",
      uploadDate: new Date(2025, 7, 12, 11, 11, 11),
      type: "xlsx",
      url: "https://example.com/",
    },
    {
      id: 2,
      title: "BRD Template",
      uploadDate: new Date(2024, 1, 1, 12, 11, 11),
      type: "pdf",
      url: "https://github.com/",
    },
    {
      id: 3,
      title: "Sprint Tracker 424242422222222222222 214115r2r 1 3251r",
      uploadDate: new Date(2024, 1, 1, 12, 11, 11),
      type: "docx",
      url: "https://github.com/",
    },
    {
      id: 4,
      title: "BRD Template (Old Version)",
      uploadDate: new Date(2024, 1, 1, 12, 11, 11),
      type: "xls",
      url: "https://github.com/",
    },
  ];

  const recent: Activity[] = [
    {
      id: 1,
      section: "BRD Document",
      type: "upload",
      time: new Date(2023, 8, 10, 11, 11, 11),
    },
    {
      id: 2,
      section: "Project Tracked",
      type: "view",
      time: new Date(2025, 1, 1, 15, 15, 15),
    },
  ];

  const scores: Scores = {
    average: 79.75,
    rank: 19,
    courses: [
      { caption: "Ranking in Current Batch", value: 19 },
      { caption: "Tech Fundamentals", value: 78.1 },
      { caption: "React Fundamentals", value: 81.4 },
    ],
  };

  return (
    <>
      <WelcomeHeader className="pt-6" firstName={firstName} />
      <div className="grid gap-2 p-4 md:grid-cols-2 lg:grid-cols-10">
        <ProjectCard className="col-span-6" project={project} />
        <BatchCard className="col-span-4" batch={batch} />

        <RecentActivityCard className="col-span-3" activities={recent} />
        <ScoreCard className="col-span-3" scores={scores} />
        <DocumentsCard className="col-span-4" documents={documents} />
      </div>
    </>
  );
}

export default Dashboard;
