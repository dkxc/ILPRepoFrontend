import { useLocation, useNavigation, Navigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import BatchMetadata from "../../features/ui/ProjectDetails/BatchMetadata";
import TechStack from "../../features/ui/ProjectDetails/TechStack";
import ProjectLinks from "../../features/ui/ProjectDetails/ProjectLinks";
import ProjectDocuments from "../../features/ui/ProjectDetails/DocumentUpload";
import TeamList from "../../features/ui/ProjectDetails/TeamList";
import SubmissionRate from "../../features/ui/ProjectDetails/Completionrate";
import {
  getProjectDetails,
  type ProjectDetailsData,
} from "../../features/ui/ProjectDetails/api";
import ErrorBoundary from "../../components/ErrorBoundary";

function ProjectDetails() {
  const location = useLocation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [projectDetails, setProjectDetails] =
    useState<ProjectDetailsData | null>(null);
  const { projectId, projectData: selectedProject } = location.state || {};

  // Redirect back to projects if no project ID is provided
  if (!projectId) {
    return <Navigate to="/ilpprojects" replace />;
  }

  // Fetch project details from API
  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getProjectDetails(projectId.toString());
        if (details) {
          setProjectDetails(details);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();

    return () => {
      // Cleanup any pending promises or subscriptions
      console.debug("ProjectDetails component unmounting, cleaning up...");
    };
  }, [projectId]);

  // Use the API data when available, fallback to selectedProject or defaults
  const projectData = useMemo(
    () => ({
      id: projectDetails?.id || Number(projectId),
      projectName:
        projectDetails?.projectName ||
        selectedProject?.name ||
        `Project ${projectId}`,
      name:
        projectDetails?.batchName ||
        selectedProject?.batch ||
        "ILP 2024-25 BATCH 1", // Batch name from API
      trainees: projectDetails?.teamMembers?.length || 7, // Updated to use teamMembers
      status: projectDetails?.status || selectedProject?.status || "Ongoing", // Already a string
      techStack: projectDetails?.technology
        ?.split(",")
        .map((tech) => tech.trim()) || [
        "React",
        ".NET",
        "TypeScript",
        "PostgreSQL",
        "Node.js",
      ], // Updated to use technology
      repositoryUrl: "https://github.com/dkxc/ILPRepo",
      figmaUrl:
        "https://www.figma.com/design/DvtEbqQRsDcXu7zlO8x439/ILP-REPO?node-id=0-1&p=f&t=mBJIveNfwYtTfhga-0",
    }),
    [projectId, selectedProject, projectDetails],
  );

  // Show loading state during navigation
  if (navigation.state === "loading" || isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BatchMetadata
            projectName={projectData.projectName}
            name={projectData.name}
            trainees={projectData.trainees}
            status={projectData.status}
            projectId={projectId}
          />

          <div className="flex gap-4 mb-6">
            <div
              style={{ width: "30%" }}
              className="shrink-0 flex flex-col gap-4"
            >
              <TechStack
                techStack={projectData.techStack}
                canEdit={false}
                projectId={projectId}
              />
              <ProjectLinks
                repositoryUrl={projectData.repositoryUrl}
                figmaUrl={projectData.figmaUrl}
                canEdit={false}
                projectId={projectId}
              />
            </div>
            <div style={{ width: "70%" }} className="shrink-0">
              <ProjectDocuments
                canUpload={false}
                canNotify={false}
                projectId={projectId}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="w-full md:w-7/10 flex items-stretch">
              <TeamList projectId={projectId} />
            </div>
            <div className="w-full md:w-3/10 flex items-stretch">
              <SubmissionRate projectId={projectId} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ProjectDetails;
