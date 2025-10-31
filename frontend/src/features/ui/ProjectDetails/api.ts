import axios, { AxiosError } from "axios";

// API Response Types based on the new structure
export interface Trainee {
  name: string;
  email: string;
}

export interface ProjectLink {
  id: number;
  linkId: number;
  linkUrl: string;
  linkTypeName: string;
}

export interface DocumentSubmission {
  id: number;
  fileName: string;
  fileType: string;
  submissionLink: string;
  submissionDate: string;
  documentName: string;
  requestDueDate: string;
}

export interface ProjectDetailsData {
  id: number;
  projectName: string;
  status: number;
  progress: number;
  technologyStack: string;
  trainees: Trainee[];
  projectLinks: ProjectLink[];
  documentSubmissions: DocumentSubmission[];
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
  succeeded: boolean;
}

// Legacy types for compatibility with existing components
export interface BatchMetadata {
  name: string;
  projectName: string;
  trainees: number;
  status?: string;
  progress?: number;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  mail: string;
}

export interface CompletionRate {
  rate: number;
  title?: string;
}

export interface TechStack {
  id?: number;
  techStack: string[];
}

export interface ProjectLinks {
  id?: number;
  repositoryUrl: string;
  figmaUrl: string;
}

export interface Document {
  id: string;
  name: string;
  filename: string;
  status: "Submitted" | "Not Submitted";
}

export interface NotificationData {
  recipients: TeamMember[];
  subject: string;
  message: string;
  sendToOutlook: boolean;
}

// Base API configuration
const api = axios.create({
  baseURL: "https://localhost:7224/api",
  timeout: 10000,
});

// Generic error handler
const handleError = (error: AxiosError, functionName: string): null => {
  console.error(`API Error in ${functionName}:`, error.message);
  return null;
};

// Main API function to get project details
export const getProjectDetails = async (
  projectId: string,
): Promise<ProjectDetailsData | null> => {
  try {
    const response = await api.get<ApiResponse<ProjectDetailsData>>(
      `/Projects/${projectId}/details`,
    );
    if (response.data.succeeded) {
      return response.data.data;
    } else {
      console.error("API Error:", response.data.message);
      return null;
    }
  } catch (error) {
    return handleError(error as AxiosError, "getProjectDetails");
  }
};

// API functions for each component - Updated to use the new endpoint
export const getBatchMetadata = async (
  projectId?: string,
): Promise<BatchMetadata | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    return {
      name: `Project ${projectDetails.id}`,
      projectName: projectDetails.projectName,
      trainees: projectDetails.trainees.length,
      status: projectDetails.status.toString(),
      progress: projectDetails.progress,
    };
  } catch (error) {
    return handleError(error as AxiosError, "getBatchMetadata");
  }
};

export const getTeamList = async (
  projectId?: string,
): Promise<TeamMember[] | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    return projectDetails.trainees.map((trainee, index) => ({
      id: index + 1,
      name: trainee.name,
      role: "Trainee", // Default role
      mail: trainee.email,
    }));
  } catch (error) {
    return handleError(error as AxiosError, "getTeamList");
  }
};

export const getCompletionRate = async (
  projectId?: string,
): Promise<CompletionRate | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    return {
      rate: projectDetails.progress,
      title: "Project Progress",
    };
  } catch (error) {
    return handleError(error as AxiosError, "getCompletionRate");
  }
};

export const getTechStack = async (
  projectId?: string,
): Promise<TechStack | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    return {
      id: projectDetails.id,
      techStack: projectDetails.technologyStack
        .split(",")
        .map((tech) => tech.trim()),
    };
  } catch (error) {
    return handleError(error as AxiosError, "getTechStack");
  }
};

// New interface for all project links
export interface AllProjectLinks {
  id: number;
  links: ProjectLink[];
}

export const getProjectLinks = async (
  projectId?: string,
): Promise<ProjectLinks | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    const repositoryLink = projectDetails.projectLinks.find(
      (link) =>
        link.linkTypeName.toLowerCase().includes("repository") ||
        link.linkTypeName.toLowerCase().includes("repo") ||
        link.linkTypeName.toLowerCase().includes("git"),
    );

    const figmaLink = projectDetails.projectLinks.find(
      (link) =>
        link.linkTypeName.toLowerCase().includes("figma") ||
        link.linkTypeName.toLowerCase().includes("design"),
    );

    return {
      id: projectDetails.id,
      repositoryUrl: repositoryLink?.linkUrl || "",
      figmaUrl: figmaLink?.linkUrl || "",
    };
  } catch (error) {
    return handleError(error as AxiosError, "getProjectLinks");
  }
};

// New function to get all project links dynamically
export const getAllProjectLinks = async (
  projectId?: string,
): Promise<AllProjectLinks | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    let allLinks = projectDetails.projectLinks;

    // For testing pagination: If there are fewer than 3 links, add some test links
    if (allLinks.length < 3) {
      const testLinks: ProjectLink[] = [
        ...allLinks,
        {
          id: 999,
          linkId: 3,
          linkUrl: "https://example.com/documentation",
          linkTypeName: "Documentation",
        },
        {
          id: 998,
          linkId: 4,
          linkUrl: "https://example.com/api-docs",
          linkTypeName: "API Documentation",
        },
        {
          id: 997,
          linkId: 5,
          linkUrl: "https://example.com/deployment",
          linkTypeName: "Deployment",
        },
      ];
      allLinks = testLinks;
    }

    return {
      id: projectDetails.id,
      links: allLinks,
    };
  } catch (error) {
    return handleError(error as AxiosError, "getAllProjectLinks");
  }
};

export const getDocuments = async (
  projectId?: string,
): Promise<Document[] | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    return projectDetails.documentSubmissions.map((doc) => ({
      id: doc.id.toString(),
      name: doc.documentName,
      filename: doc.fileName,
      status: doc.submissionLink ? "Submitted" : ("Not Submitted" as const),
    }));
  } catch (error) {
    return handleError(error as AxiosError, "getDocuments");
  }
};

// For DocumentUpload component - returns data in UploadedDocument format
export interface UploadedDocument {
  id: number;
  filename: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
}

export const getUploadedDocuments = async (
  projectId?: string,
): Promise<UploadedDocument[] | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "default");
    if (!projectDetails) return null;

    return projectDetails.documentSubmissions.map((doc) => ({
      id: doc.id,
      filename: doc.fileName,
      type: doc.fileType || doc.documentName,
      uploadDate: new Date(doc.submissionDate).toLocaleDateString("en-CA"), // YYYY-MM-DD format
      fileUrl: doc.submissionLink,
    }));
  } catch (error) {
    return handleError(error as AxiosError, "getUploadedDocuments");
  }
};

export const sendNotification = async (
  data: NotificationData,
): Promise<boolean> => {
  try {
    await api.post("/notifications/send", data);
    return true;
  } catch (error) {
    console.error(
      "API Error in sendNotification:",
      (error as AxiosError).message,
    );
    return false;
  }
};

// Document upload API
export interface UploadDocumentPayload {
  projectId: string;
  file: File;
  type: string;
}

export const uploadDocument = async (
  payload: UploadDocumentPayload,
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("type", payload.type);
    formData.append("projectId", payload.projectId);
    await api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return true;
  } catch (error) {
    handleError(error as AxiosError, "uploadDocument");
    return false;
  }
};

// Update tech stack API
export const updateTechStack = async (
  projectId: string,
  techStack: string[],
): Promise<boolean> => {
  try {
    const technologyString = techStack.join(", ");
    console.log("API: Sending tech stack update request:", {
      projectId,
      originalArray: techStack,
      technologyString,
      endpoint: `/Projects/${projectId}/technology`,
    });

    const response = await api.put<ApiResponse<boolean>>(
      `/Projects/${projectId}/technology`,
      {
        technology: technologyString,
      },
    );

    console.log("API: Tech stack update response:", response.data);

    if (response.data.succeeded) {
      return response.data.data;
    } else {
      console.error("Update tech stack failed:", response.data.message);
      return false;
    }
  } catch (error) {
    console.error("Tech stack API error:", error);
    handleError(error as AxiosError, "updateTechStack");
    return false;
  }
};

// Update project links API
export const updateProjectLinks = async (
  projectId: string,
  links: { repositoryUrl: string; figmaUrl: string },
): Promise<boolean> => {
  try {
    await api.put(`/project-links/${projectId}`, links);
    return true;
  } catch (error) {
    handleError(error as AxiosError, "updateProjectLinks");
    return false;
  }
};

// Update individual project link API
export const updateProjectLink = async (
  projectId: string,
  linkId: number,
  linkUrl: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log(
      "API: Updating project link for project:",
      projectId,
      "linkId:",
      linkId,
      "url:",
      linkUrl,
    );
    console.log(
      "API: Full request URL:",
      `https://localhost:7224/api/Projects/${projectId}/links`,
    );
    console.log("API: Request body:", { linkId, linkUrl });

    const response = await api.put<ApiResponse<boolean>>(
      `/Projects/${projectId}/links`,
      {
        linkId,
        linkUrl,
      },
    );

    console.log("API: Project link update response status:", response.status);
    console.log("API: Project link update response data:", response.data);

    if (response.data && response.data.succeeded) {
      console.log("API: Update successful, returning true");
      return { success: true };
    } else {
      const errorMessage =
        response.data?.message || "Unknown error from backend";
      console.error("Update project link failed - succeeded is false");
      console.error("Response message:", errorMessage);
      console.error("Full response:", response.data);
      return { success: false, message: errorMessage };
    }
  } catch (error: any) {
    console.error("Project link API error caught:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    const errorMessage =
      error.response?.data?.message || error.message || "Network error";
    return { success: false, message: errorMessage };
  }
};
