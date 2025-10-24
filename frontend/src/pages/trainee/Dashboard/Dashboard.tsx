import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  Responsive,
  WidthProvider,
  type Layout,
  type Layouts,
} from "react-grid-layout";

import { lazy } from "react";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { useDashboardData } from "../../../features/trainee/dashboard/hooks/useDashboardQueries";

const BatchCard = lazy(
  () => import("../../../features/trainee/dashboard/BatchCard"),
);
const DocumentsCard = lazy(
  () => import("../../../features/trainee/dashboard/DocumentsCard"),
);
const ProjectCard = lazy(
  () => import("../../../features/trainee/dashboard/ProjectCard"),
);
const UpcomingSessionsCard = lazy(
  () => import("../../../features/trainee/dashboard/UpcomingSessionsCard"),
);
const ScoreCard = lazy(
  () => import("../../../features/trainee/dashboard/ScoresCard"),
);
const WelcomeHeader = lazy(
  () => import("../../../features/trainee/dashboard/WelcomeHeader"),
);

const ResponsiveGridLayout = WidthProvider(Responsive);

/* TODO: Remove this dummy data */
function Dashboard() {
  const {
    profileQuery,
    projectQuery,
    batchQuery,
    sessionsQuery,
    documentsQuery,
    scoresQuery,
  } = useDashboardData();

  const initialLayouts = {
    lg: [
      { i: "project", x: 0, y: 0, w: 6, h: 9, minW: 4, minH: 9 },
      { i: "batch", x: 6, y: 0, w: 4, h: 9, minW: 3, minH: 9 },
      { i: "documents", x: 0, y: 2, w: 3, h: 12, minW: 3, minH: 9 },
      { i: "scores", x: 3, y: 2, w: 3, h: 12, minW: 3, minH: 9 },
      { i: "sessions", x: 6, y: 2, w: 4, h: 12, minW: 3, minH: 9 },
    ],
  };

  const [layouts, setLayouts] = useLocalStorage<Layouts>(
    "dashboard-layouts",
    initialLayouts,
  );
  const onLayoutChange = (_currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <>
      <WelcomeHeader
        className="pt-6"
        firstName={profileQuery.data?.firstName}
        isLoading={profileQuery.isLoading}
      />
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
          <ProjectCard query={projectQuery} className="h-full" />
        </div>
        <div key="batch">
          <BatchCard query={batchQuery} className="h-full" />
        </div>
        <div key="documents">
          <DocumentsCard query={documentsQuery} className="h-full" />
        </div>
        <div key="scores">
          <ScoreCard query={scoresQuery} className="h-full" />
        </div>
        <div key="sessions">
          <UpcomingSessionsCard query={sessionsQuery} className="h-full" />
        </div>
      </ResponsiveGridLayout>
    </>
  );
}

export default Dashboard;
