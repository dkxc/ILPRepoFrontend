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
    route("batches/:id", "./pages/admin/BatchDetailsPage.tsx"),
    route("batchDetails/:id", "./pages/admin/TraineeProfile.tsx"),
    route("upload-trainee-data", "./pages/admin/UploadTraineeDataPage.tsx"),
    route("upload-project-data", "./pages/admin/CreateProjectByBatch.tsx"),
    route("traineeSettings", "./pages/trainee/TraineeSettings.tsx"),
    route("curriculum", "./pages/trainee/Curriculum.tsx"),

    route("projects", "./pages/admin/Projects.tsx"),
    route("projectsDetailsAdmin/:id", "./pages/admin/ProjectDetailsAdmin.tsx"),
    //route("documents", "./pages/admin/Documents_incoming.tsx"),
    route("adminres", "./pages/admin/Results.tsx"),
    route("adminSettings", "./pages/admin/AdminSettings.tsx"),
    // route("documentupload", "./pages/admin/DocumentUploadSection.tsx"),
    // route("documentsubmitdemo", "./features/admin/DocumentSubmitStepper.tsx"),
    route("curriculumAdmin", "./pages/admin/Curriculum.tsx"),
  ]),
] satisfies RouteConfig;
