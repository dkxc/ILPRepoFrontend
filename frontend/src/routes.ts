import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./App.tsx", [
    index("./pages/trainee/Dashboard.tsx"),
    route("ilpprojects", "./pages/trainee/ILPProjects.tsx"),
    route(
      "projectsDetailsTrainee/:id",
      "./pages/trainee/projectsDetailsTrainee.tsx",
    ),
    route("results", "./pages/trainee/Results.tsx"),

  route("admindash", "./pages/admin/dashboard/AdminDashboard.tsx"),
  // route("training-hours", "./pages/admin/dashboard/DashboardTrainingHours.tsx"),
    route("batches", "./pages/admin/Batches.tsx"),
    route("projects", "./pages/admin/Projects.tsx"),
    route("projectsDetailsAdmin/:id", "./pages/admin/ProjectDetailsAdmin.tsx"),
    route("documents", "./pages/admin/Documents.tsx"),
    route("adminres", "./pages/admin/Results.tsx"),
    route("documentupload", "./pages/admin/DocumentUploadSection.tsx"),
  ]),
] satisfies RouteConfig;
