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

    route("admindash", "./pages/admin/Dashboard.tsx"),
    route("batches", "./pages/admin/Batches.tsx"),
    route("projects", "./pages/admin/Projects.tsx"),
    route("projectsDetailsAdmin/:id", "./pages/admin/ProjectDetailsAdmin.tsx"),
    route("documents", "./pages/admin/Documents_incoming.tsx"),
    route("adminres", "./pages/admin/Results.tsx"),
   // route("documentupload", "./pages/admin/DocumentUploadSection.tsx"),
  // route("documentsubmitdemo", "./features/admin/DocumentSubmitStepper.tsx"),
  ]),
] satisfies RouteConfig;
