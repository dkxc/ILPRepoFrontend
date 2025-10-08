import BatchCard from "../../features/trainee/dashboard/BatchCard";
import DocumentsCard from "../../features/trainee/dashboard/DocumentsCard";
import ProjectCard from "../../features/trainee/dashboard/ProjectCard";
import RecentActivityCard from "../../features/trainee/dashboard/RecentActivityCard";
import ScoreCard from "../../features/trainee/dashboard/ScoresCard";
import WelcomeHeader from "../../features/trainee/dashboard/WelcomeHeader";
import type { Batch } from "../../features/trainee/types/Batch.types";
import type { TraineeDocument } from "../../features/trainee/types/TraineeDocument.types";
import type { Project } from "../../features/trainee/types/Project.types";
import type { Scores } from "../../features/trainee/types/scores/Score.types";

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

        <ScoreCard className="col-span-3" scores={scores} />
        <DocumentsCard className="col-span-3" documents={documents} />
        <RecentActivityCard className="col-span-4" project={project} />
      </div>
    </>
  );
}

export default Dashboard;
