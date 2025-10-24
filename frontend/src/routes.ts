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
    route("batches", "./pages/admin/Batches.tsx"),
    route("batches/:id", "./pages/admin/BatchDetailsPage.tsx"),
    route("batchDetails/:id", "./pages/admin/TraineeProfile.tsx"),
    route("upload-trainee-data", "./pages/admin/UploadTraineeDataPage.tsx"),
    route("upload-project-data", "./pages/admin/CreateProjectByBatch.tsx"),
    route("traineeSettings", "./pages/trainee/TraineeSettings.tsx"),
    route("curriculum", "./pages/trainee/Curriculum.tsx"),
    route("profile", "./pages/trainee/TraineeProfile.tsx"),
    
    route("projects", "./pages/admin/Projects.tsx"),
    route("projectsDetailsAdmin/:id", "./pages/admin/ProjectDetailsAdmin.tsx"),
    route("adminSettings", "./pages/admin/AdminSettings.tsx"),
    route("curriculumAdmin", "./pages/admin/Curriculum.tsx"),
    route("upload-results", "./pages/admin/ResultsUp.tsx"),
    route("upload-curriculum", "./pages/admin/CurriculumUp.tsx"),
  ]),
] satisfies RouteConfig;
