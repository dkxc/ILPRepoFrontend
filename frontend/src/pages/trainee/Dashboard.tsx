import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  Responsive,
  WidthProvider,
  type Layout,
  type Layouts,
} from "react-grid-layout";

import { lazy, useState } from "react";
import type { Batch } from "../../features/trainee/types/Batch.types";
import type { TraineeDocument } from "../../features/trainee/types/TraineeDocument.types";
import type { Project } from "../../features/trainee/types/Project.types";
import type { Scores } from "../../features/trainee/types/scores/Score.types";
import type { Session } from "../../features/trainee/types/Session.types";

const BatchCard = lazy(
  () => import("../../features/trainee/dashboard/BatchCard"),
);
const DocumentsCard = lazy(
  () => import("../../features/trainee/dashboard/DocumentsCard"),
);
const ProjectCard = lazy(
  () => import("../../features/trainee/dashboard/ProjectCard"),
);
const UpcomingSessionsCard = lazy(
  () => import("../../features/trainee/dashboard/UpcomingSessionsCard"),
);
const ScoreCard = lazy(
  () => import("../../features/trainee/dashboard/ScoresCard"),
);
const WelcomeHeader = lazy(
  () => import("../../features/trainee/dashboard/WelcomeHeader"),
);

const ResponsiveGridLayout = WidthProvider(Responsive);

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
    status: "Ongoing",
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

  const recent: Session[] = [
    {
      id: 1,
      title: ".NET Fundamentals",
      category: ".NET",
      date: new Date(2023, 8, 10, 11, 11, 11),
    },
    {
      id: 2,
      title: "React Hooks",
      category: "React",
      date: new Date(2025, 5, 3, 9, 7, 2),
    },
    {
      id: 3,
      title: "React epogQo{egvP EWgvPO:wkgvOPWmgpv",
      category: "wINDOWS",
      date: new Date(2025, 5, 3, 9, 7, 2),
    },
    {
      id: 4,
      title: "Java Fun",
      category: "iwnfovwqjevpoqvqejmfoqekfpoqejv",
      date: new Date(2025, 5, 3, 9, 7, 2),
    },
    {
      id: 5,
      title: "React Hooks",
      category: "React",
      date: new Date(2025, 5, 3, 9, 7, 2),
    },
    {
      id: 6,
      title: "React Hooks",
      category: "React",
      date: new Date(2025, 5, 3, 9, 7, 2),
    },
  ];

  const scores: Scores = {
    average: 79.75,
    rank: 19,
    courses: [
      { caption: "Tech Fundamentals", value: 78.1 },
      { caption: "Specialization", value: 81.4 },
    ],
  };

  const initialLayouts = {
    lg: [
      { i: "project", x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 9 },
      { i: "batch", x: 6, y: 0, w: 4, h: 9, minW: 3, minH: 9 },
      { i: "documents", x: 0, y: 2, w: 3, h: 12, minW: 3, minH: 9 },
      { i: "scores", x: 3, y: 2, w: 3, h: 12, minW: 3, minH: 9 },
      { i: "sessions", x: 6, y: 2, w: 4, h: 12, minW: 3, minH: 9 },
    ],
  };

  const [layouts, setLayouts] = useState<Layouts>(initialLayouts);
  const onLayoutChange = (_currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <>
      <WelcomeHeader className="pt-6" firstName={firstName} />
      <ResponsiveGridLayout
        className="layout p-4"
        layouts={layouts}
        onLayoutChange={onLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 10, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={20}
        draggableHandle=".drag-handle"
      >
        <div key="project">
          <ProjectCard project={project} className="h-full" />
        </div>
        <div key="batch">
          <BatchCard batch={batch} className="h-full" />
        </div>
        <div key="documents">
          <DocumentsCard documents={documents} className="h-full" />
        </div>
        <div key="scores">
          <ScoreCard scores={scores} className="h-full" />
        </div>
        <div key="sessions">
          <UpcomingSessionsCard activities={recent} className="h-full" />
        </div>
      </ResponsiveGridLayout>
    </>
  );
}

export default Dashboard;
