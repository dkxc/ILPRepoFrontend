import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./App.tsx", [
    index("./pages/trainee/Dashboard.tsx"),
    route("myproject", "./pages/trainee/MyProject.tsx"),
    route("ilpprojects", "./pages/trainee/ILPProjects.tsx"),
    route("results", "./pages/trainee/Results.tsx"),

    route("admindash", "./pages/admin/Dashboard.tsx"),
    route("batches", "./pages/admin/Batches.tsx"),
    route("projects", "./pages/admin/Projects.tsx"),
    route("documents", "./pages/admin/Documents.tsx"),
    route("adminres", "./pages/admin/Results.tsx"),
    route("createProject", "./pages/admin/CreateProject.tsx"),
    route("projectsDetailsAdmin/:id", "./pages/admin/ProjectDetails.tsx"),
  ]),
] satisfies RouteConfig;
