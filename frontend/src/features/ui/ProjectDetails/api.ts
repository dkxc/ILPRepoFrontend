import axios, { AxiosError } from "axios";

// API Response Types based on the new structure
export interface Trainee {
  name: string;
  email: string;
}

export interface ProjectLink {
  id: number;
  linkId: number;
  linkUrl: string | null;
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
  status: string;
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

export interface DocumentStatus {
  documentName: string;
  isSubmitted: boolean;
  submissionDate?: string;
  dueDate?: string;
  isOverdue?: boolean;
}

export interface DetailedCompletionRate extends CompletionRate {
  submittedCount: number;
  totalCount: number;
  submittedDocuments: DocumentStatus[];
  notSubmittedDocuments: DocumentStatus[];
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
    const projectDetails = await getProjectDetails(projectId || "1");
    if (!projectDetails) return null;

    return {
      name: `Project ${projectDetails.id}`, // Use project ID as batch name since API doesn't have batchName
      projectName: projectDetails.projectName,
      trainees: projectDetails.trainees.length, // Updated to use trainees from API
      status: projectDetails.status,
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
    const projectDetails = await getProjectDetails(projectId || "1");
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
    const detailedRate = await getDetailedCompletionRate(projectId);
    return detailedRate
      ? {
          rate: detailedRate.rate,
          title: detailedRate.title,
        }
      : null;
  } catch (error) {
    console.error("API error, using mock completion rate data:", error);
    return {
      rate: 75,
      title: "Document Submission Rate",
    };
  }
};

export const getDetailedCompletionRate = async (
  projectId?: string,
): Promise<DetailedCompletionRate | null> => {
  try {
    const id = projectId || "1";

    // Get both document requirements and project details with submissions
    const [documentRequirements, projectDetails] = await Promise.all([
      getDocumentRequirementsByProject(id),
      getProjectDetails(id),
    ]);

    if (!documentRequirements && !projectDetails) {
      // Both APIs failed, return mock detailed completion rate
      console.log("Both APIs failed, using mock detailed completion rate data");
      return {
        rate: 75,
        title: "Document Submission Rate",
        submittedCount: 3,
        totalCount: 4,
        submittedDocuments: [
          {
            documentName: "Project Proposal",
            isSubmitted: true,
            submissionDate: "2024-11-01",
          },
          {
            documentName: "Technical Design",
            isSubmitted: true,
            submissionDate: "2024-11-02",
          },
          {
            documentName: "User Manual",
            isSubmitted: true,
            submissionDate: "2024-11-03",
          },
        ],
        notSubmittedDocuments: [
          {
            documentName: "Final Report",
            isSubmitted: false,
            dueDate: "2024-12-01",
            isOverdue: false,
          },
        ],
      };
    }

    // Calculate detailed completion rate based on document requirements vs submissions
    const requirements = documentRequirements || [];
    const submissions = projectDetails?.documentSubmissions || [];

    if (requirements.length === 0) {
      // No documents required yet
      return {
        rate: 0,
        title: "Document Submission Rate",
        submittedCount: 0,
        totalCount: 0,
        submittedDocuments: [],
        notSubmittedDocuments: [],
      };
    }

    const submittedDocuments: DocumentStatus[] = [];
    const notSubmittedDocuments: DocumentStatus[] = [];

    // Process each required document
    requirements.forEach((requirement) => {
      // Find corresponding submission
      const submission = submissions.find(
        (sub) =>
          sub.documentName.toLowerCase() ===
          requirement.documentTypeName.toLowerCase(),
      );

      const isSubmitted =
        submission &&
        submission.submissionLink &&
        submission.submissionLink.trim() !== "";
      const today = new Date();
      const dueDate = requirement.dueDate
        ? new Date(requirement.dueDate)
        : undefined;
      const isOverdue = dueDate ? today > dueDate && !isSubmitted : false;

      const documentStatus: DocumentStatus = {
        documentName: requirement.documentTypeName,
        isSubmitted: !!isSubmitted,
        submissionDate: submission?.submissionDate,
        dueDate: requirement.dueDate,
        isOverdue,
      };

      if (isSubmitted) {
        submittedDocuments.push(documentStatus);
      } else {
        notSubmittedDocuments.push(documentStatus);
      }
    });

    const submittedCount = submittedDocuments.length;
    const totalCount = requirements.length;
    const completionRate = Math.round((submittedCount / totalCount) * 100);

    console.log(
      `Detailed Completion Rate: ${submittedCount}/${totalCount} = ${completionRate}%`,
    );
    console.log(
      "Submitted:",
      submittedDocuments.map((d) => d.documentName),
    );
    console.log(
      "Not Submitted:",
      notSubmittedDocuments.map((d) => d.documentName),
    );

    return {
      rate: completionRate,
      title: "Document Submission Rate",
      submittedCount,
      totalCount,
      submittedDocuments,
      notSubmittedDocuments,
    };
  } catch (error) {
    console.error(
      "API error, using mock detailed completion rate data:",
      error,
    );
    // API call failed, return mock data as fallback
    return {
      rate: 75,
      title: "Document Submission Rate",
      submittedCount: 3,
      totalCount: 4,
      submittedDocuments: [
        {
          documentName: "Project Proposal",
          isSubmitted: true,
          submissionDate: "2024-11-01",
        },
        {
          documentName: "Technical Design",
          isSubmitted: true,
          submissionDate: "2024-11-02",
        },
        {
          documentName: "User Manual",
          isSubmitted: true,
          submissionDate: "2024-11-03",
        },
      ],
      notSubmittedDocuments: [
        {
          documentName: "Final Report",
          isSubmitted: false,
          dueDate: "2024-12-01",
          isOverdue: false,
        },
      ],
    };
  }
};

export const getTechStack = async (
  projectId?: string,
): Promise<TechStack | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "1");
    if (!projectDetails) return null;

    return {
      id: projectDetails.id,
      techStack: projectDetails.technologyStack
        ? projectDetails.technologyStack
            .split(",")
            .map((tech: string) => tech.trim())
        : [],
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
    const projectDetails = await getProjectDetails(projectId || "1");
    if (!projectDetails) return null;

    const repositoryLink = projectDetails.projectLinks?.find(
      (link) =>
        link.linkTypeName.toLowerCase().includes("repository") ||
        link.linkTypeName.toLowerCase().includes("repo") ||
        link.linkTypeName.toLowerCase().includes("git"),
    );

    const figmaLink = projectDetails.projectLinks?.find(
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
// API Response Types for Batch Links
export interface BatchLinkType {
  linkTypeId: number;
  linkTypeName: string;
  totalProjects: number;
  submittedProjects: number;
  pendingProjects: number;
  completionPercentage: number;
}

export interface BatchLinksResponse {
  status: number;
  data: BatchLinkType[];
  message: string;
  succeeded: boolean;
}

// Get batch links by batch ID
export const getBatchLinks = async (
  batchId: string,
): Promise<BatchLinkType[] | null> => {
  try {
    const response = await axios.get<BatchLinksResponse>(
      `https://localhost:7224/api/Links/batch/${batchId}`,
    );

    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    return handleError(error as AxiosError, "getBatchLinks");
  }
};

// API Response Types for Batch Documents
export interface BatchDocumentType {
  id: number;
  documentType: {
    id: number;
    name: string;
  };
  batchId: number;
  dueDate: string;
  isMultiple: boolean;
  isBroadcast: boolean;
}

export interface BatchDocumentsResponse {
  succeeded: boolean;
  data: BatchDocumentType[];
}

// API Response Types for Document Requirements
export interface DocumentRequirementType {
  documentRequestId?: number;
  documentTypeId: number;
  documentTypeName: string;
  documentTemplateUrl?: string;
  batchId?: number;
  projectId?: number;
  projectName?: string;
  dueDate: string;
  requestDate: string;
  projectIds?: number[];
  totalProjectsAffected?: number;
  isOverdue?: boolean;
  daysUntilDue?: number;
}

export interface DocumentRequirementsResponse {
  status: number;
  data: DocumentRequirementType[];
  message: string;
  succeeded: boolean;
}

// Get batch documents by batch ID
export const getBatchDocuments = async (
  batchId: string,
): Promise<BatchDocumentType[] | null> => {
  try {
    const response = await axios.get<BatchDocumentsResponse>(
      `https://localhost:7224/api/Documents/batch/${batchId}`,
    );

    console.log("Batch Documents Response:", response.data);

    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    return handleError(error as AxiosError, "getBatchDocuments");
  }
};

// Get document requirements by batch ID
export const getDocumentRequirements = async (
  batchId: string,
): Promise<DocumentRequirementType[] | null> => {
  try {
    const response = await axios.get<DocumentRequirementsResponse>(
      `https://localhost:7224/api/DocumentRequirements/batch/${batchId}`,
    );

    console.log("Document Requirements Response:", response.data);

    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    return handleError(error as AxiosError, "getDocumentRequirements");
  }
};

// Get document requirements by project ID
export const getDocumentRequirementsByProject = async (
  projectId: string,
): Promise<DocumentRequirementType[] | null> => {
  try {
    const response = await axios.get<DocumentRequirementsResponse>(
      `https://localhost:7224/api/DocumentRequirements/project/${projectId}`,
    );

    console.log("Document Requirements by Project Response:", response.data);

    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    return handleError(error as AxiosError, "getDocumentRequirementsByProject");
  }
};

// Create document requirement
export interface CreateDocumentRequirementRequest {
  documentTypeId: number;
  batchId: number;
  dueDate: string;
}

export const createDocumentRequirement = async (
  requirementData: CreateDocumentRequirementRequest,
): Promise<any> => {
  try {
    const response = await axios.post(
      "https://localhost:7224/api/DocumentRequirements",
      requirementData,
    );

    console.log("Create Document Requirement Response:", response.data);
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError, "createDocumentRequirement");
  }
};

// Delete Document Requirement
export interface DeleteDocumentRequirementResponse {
  status: number;
  data: boolean;
  message: string;
  succeeded: boolean;
}

export const deleteDocumentRequirement = async (
  documentTypeId: number,
  batchId: number,
): Promise<DeleteDocumentRequirementResponse | null> => {
  try {
    const response = await axios.delete(
      `https://localhost:7224/api/DocumentRequirements?documentTypeId=${documentTypeId}&batchId=${batchId}`,
    );

    console.log("Delete Document Requirement Response:", response.data);
    return response.data;
  } catch (error) {
    return handleError(error as AxiosError, "deleteDocumentRequirement");
  }
};

// Download Document Template
export const downloadDocumentTemplate = async (
  documentTypeId: number,
): Promise<Blob | null> => {
  try {
    console.log(
      `Attempting to download template for documentTypeId: ${documentTypeId}`,
    );
    console.log(
      `API URL: https://localhost:7224/api/Documents/template/${documentTypeId}`,
    );

    const response = await axios.get(
      `https://localhost:7224/api/Documents/template/${documentTypeId}`,
      {
        responseType: "blob", // Important for file downloads
      },
    );

    console.log("Download Template Response Status:", response.status);
    console.log("Download Template Response Headers:", response.headers);
    console.log("Download Template Response Data Size:", response.data?.size);
    console.log("Download Template Response Data Type:", response.data?.type);

    // Check if the response is actually a blob with content
    if (response.data && response.data instanceof Blob) {
      if (response.data.size > 0) {
        console.log(
          "Template download successful - blob received with size:",
          response.data.size,
        );
        return response.data;
      } else {
        console.warn("Template blob is empty (size: 0)");
        return null;
      }
    } else {
      console.warn("Response is not a valid blob:", typeof response.data);
      return null;
    }
  } catch (error) {
    console.error("Error downloading template:", error);
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error("Response status:", axiosError.response.status);
      console.error("Response data:", axiosError.response.data);
      console.error("Response headers:", axiosError.response.headers);

      // If it's a 404 or other error, the template might not exist
      if (axiosError.response.status === 404) {
        console.error("Template not found on server (404)");
      }
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }
    return null;
  }
};

// API Response Types for Document Types
export interface DocumentType {
  id: number;
  name: string;
  link: string;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
  template?: File | null;
}

export interface DocumentTypesResponse {
  status: number;
  data: DocumentType[];
  message: string;
  succeeded: boolean;
}

// Get document types
export const getDocumentTypes = async (): Promise<DocumentType[] | null> => {
  try {
    const response = await axios.get<DocumentTypesResponse>(
      `https://localhost:7224/api/Documents`,
    );

    if (response.data.succeeded && response.data.data) {
      return response.data.data;
    }

    return null;
  } catch (error) {
    return handleError(error as AxiosError, "getDocumentTypes");
  }
};

// Create new document type
export interface CreateDocumentTypeRequest {
  name: string;
  template?: File;
}

export interface CreateDocumentTypeResponse {
  data: DocumentType | null;
  message: string;
  succeeded: boolean;
}

export const createDocumentType = async (
  documentTypeData: CreateDocumentTypeRequest,
): Promise<DocumentType | null> => {
  try {
    const formData = new FormData();
    formData.append("name", documentTypeData.name);

    console.log("Creating document type with data:", {
      name: documentTypeData.name,
      hasTemplate: !!documentTypeData.template,
      templateName: documentTypeData.template?.name,
      templateSize: documentTypeData.template?.size,
      templateType: documentTypeData.template?.type,
    });

    if (documentTypeData.template) {
      // Use the exact field name from Swagger: 'TemplateFile'
      formData.append("TemplateFile", documentTypeData.template);
      console.log(
        'Template file added to FormData as "TemplateFile":',
        documentTypeData.template.name,
      );
    } else {
      console.log("No template file provided");
    }

    // Log FormData contents
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `  ${key}:`,
        value instanceof File
          ? `File: ${value.name} (${value.size} bytes)`
          : value,
      );
    }

    console.log("Making API call without manual Content-Type header...");

    const response = await axios.post<CreateDocumentTypeResponse>(
      `https://localhost:7224/api/Documents`,
      formData,
      // Let axios automatically set headers for FormData
    );

    console.log("API Response:", response.data);

    if (response.data.succeeded && response.data.data) {
      console.log("Created document type:", response.data.data);
      return response.data.data;
    }

    console.log("API call failed or no data returned");
    return null;
  } catch (error) {
    return handleError(error as AxiosError, "createDocumentType");
  }
};

// Update document type
export interface UpdateDocumentTypeRequest {
  name: string;
  template?: File;
}

export interface UpdateDocumentTypeResponse {
  data: DocumentType | null;
  message: string;
  succeeded: boolean;
}

export const updateDocumentType = async (
  id: number,
  documentTypeData: UpdateDocumentTypeRequest,
): Promise<DocumentType | null> => {
  try {
    const formData = new FormData();
    formData.append("name", documentTypeData.name);

    console.log("Updating document type with data:", {
      id: id,
      name: documentTypeData.name,
      hasTemplate: !!documentTypeData.template,
      templateName: documentTypeData.template?.name,
      templateSize: documentTypeData.template?.size,
      templateType: documentTypeData.template?.type,
    });

    if (documentTypeData.template) {
      formData.append("TemplateFile", documentTypeData.template);
      console.log(
        'Template file added to FormData as "TemplateFile":',
        documentTypeData.template.name,
      );
    } else {
      console.log("No template file provided for update");
    }

    // Log FormData contents
    console.log("FormData entries for update:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `  ${key}:`,
        value instanceof File
          ? `File: ${value.name} (${value.size} bytes)`
          : value,
      );
    }

    const response = await axios.put<UpdateDocumentTypeResponse>(
      `https://localhost:7224/api/Documents/${id}`,
      formData,
    );

    console.log("Update API Response:", response.data);

    if (response.data.succeeded && response.data.data) {
      console.log("Updated document type:", response.data.data);
      return response.data.data;
    }

    console.log("Update API call failed or no data returned");
    return null;
  } catch (error) {
    return handleError(error as AxiosError, "updateDocumentType");
  }
};

export const getAllProjectLinks = async (
  projectId?: string,
): Promise<AllProjectLinks | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "1");
    if (!projectDetails) {
      // API failed to return project details, return mock data as fallback
      console.log("API failed, using mock project links data");
      return {
        id: parseInt(projectId || "1"),
        links: [
          {
            id: 1,
            linkId: 1,
            linkUrl: "https://github.com/example/project",
            linkTypeName: "Repository",
          },
          {
            id: 2,
            linkId: 2,
            linkUrl: "https://www.figma.com/design/example",
            linkTypeName: "Figma",
          },
          {
            id: 3,
            linkId: 3,
            linkUrl: null,
            linkTypeName: "Documentation",
          },
        ],
      };
    }

    const allLinks = projectDetails.projectLinks || [];

    return {
      id: projectDetails.id,
      links: allLinks,
    };
  } catch (error) {
    console.error("API error, using mock project links data:", error);
    // API call failed, return mock data as fallback
    return {
      id: parseInt(projectId || "1"),
      links: [
        {
          id: 1,
          linkId: 1,
          linkUrl: "https://github.com/example/project",
          linkTypeName: "Repository",
        },
        {
          id: 2,
          linkId: 2,
          linkUrl: "https://www.figma.com/design/example",
          linkTypeName: "Figma",
        },
        {
          id: 3,
          linkId: 3,
          linkUrl: null,
          linkTypeName: "Documentation",
        },
      ],
    };
  }
};

export const getDocuments = async (
  projectId?: string,
): Promise<Document[] | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "1");
    if (!projectDetails) return null;

    return (
      projectDetails.documentSubmissions?.map((doc) => ({
        id: doc.id.toString(),
        name: doc.documentName,
        filename: doc.fileName,
        status: doc.submissionLink ? "Submitted" : ("Not Submitted" as const),
      })) || []
    );
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

// New interface for submitted documents API response
export interface SubmittedDocument {
  id: number;
  fileName: string;
  fileType: string;
  submissionLink: string;
  submissionDate: string;
  documentTypeId: number;
  documentTypeName: string;
  projectId: number;
  projectName: string;
  dueDate: string;
  isLateSubmission: boolean;
}

export interface SubmittedDocumentsResponse {
  status: number;
  data: SubmittedDocument[];
  message: string;
  succeeded: boolean;
}

export const getUploadedDocuments = async (
  projectId?: string,
): Promise<UploadedDocument[] | null> => {
  try {
    const projectDetails = await getProjectDetails(projectId || "1");
    if (!projectDetails) return null;

    return (
      projectDetails.documentSubmissions?.map((doc) => ({
        id: doc.id,
        filename: doc.fileName,
        type: doc.fileType || doc.documentName,
        uploadDate: new Date(doc.submissionDate).toLocaleDateString("en-CA"), // YYYY-MM-DD format
        fileUrl: doc.submissionLink,
      })) || []
    );
  } catch (error) {
    return handleError(error as AxiosError, "getUploadedDocuments");
  }
};

// New API function for getting submitted documents from the new endpoint
export const getSubmittedDocuments = async (
  projectId: number | string,
): Promise<UploadedDocument[] | null> => {
  try {
    const response = await axios.get<SubmittedDocumentsResponse>(
      `https://localhost:7224/api/submitted-documents/project/${projectId}`,
    );

    console.log("Submitted Documents Response:", response.data);

    if (response.data.succeeded && response.data.data) {
      // Transform the API response to match UploadedDocument interface
      return response.data.data.map((doc) => ({
        id: doc.id,
        filename: doc.fileName,
        type: doc.documentTypeName,
        uploadDate: new Date(doc.submissionDate).toLocaleDateString("en-CA"), // YYYY-MM-DD format
        fileUrl: doc.submissionLink,
        isLateSubmission: doc.isLateSubmission,
        dueDate: new Date(doc.dueDate).toLocaleDateString("en-CA"),
      }));
    }

    return null;
  } catch (error) {
    console.error("Error fetching submitted documents:", error);
    return handleError(error as AxiosError, "getSubmittedDocuments");
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

// Submit Document Response Types
export interface SubmittedDocumentData {
  submissionId: number;
  fileName: string;
  fileType: string;
  submissionLink: string;
  submissionDate: string;
  documentTypeName: string;
  projectName: string;
  isLateSubmission: boolean;
}

export interface SubmitDocumentResponse {
  status: number;
  data: SubmittedDocumentData;
  message: string;
  succeeded: boolean;
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

// Submit Document API
export const submitDocument = async (
  documentRequestId: number,
  file: File,
): Promise<SubmittedDocumentData | null> => {
  try {
    console.log(`Submitting document with requestId: ${documentRequestId}`);
    console.log(`File: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    const formData = new FormData();
    formData.append("DocumentRequestId", documentRequestId.toString());
    formData.append("DocumentFile", file);

    console.log(
      "Making API request to:",
      "https://localhost:7224/api/submitted-documents/submit",
    );
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Test server connectivity first with a known working endpoint
    try {
      console.log("Testing server connectivity with document requirements...");
      const testResponse = await api.get(
        `/DocumentRequirements/project/${documentRequestId}`,
      );
      console.log("✅ Server is reachable, status:", testResponse.status);
    } catch (testError) {
      console.error("❌ Server connectivity test failed:", testError);
      console.error(
        "This might indicate server issues that could affect document submission",
      );
    }

    console.log("Proceeding with document submission...");
    console.log("⏰ Starting submission at:", new Date().toISOString());

    try {
      const response = (await Promise.race([
        api.post<SubmitDocumentResponse>(
          "/submitted-documents/submit",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000, // 30 second timeout for file upload
          },
        ),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Manual timeout after 15 seconds")),
            15000,
          ),
        ),
      ])) as any;

      console.log("✅ Submit Document Response Status:", response.status);
      console.log("✅ Submit Document Response:", response.data);

      if (response.data.succeeded && response.data.data) {
        console.log("🎉 Document submission successful!");
        return response.data.data;
      } else {
        console.error(
          "❌ Document submission failed - API returned succeeded: false",
        );
        console.error("Error message:", response.data.message);
        return null;
      }
    } catch (submitError) {
      console.error("💥 Exception during document submission:", submitError);

      const axiosError = submitError as AxiosError;
      if (axiosError.response) {
        console.error("📡 Response received but failed:");
        console.error("Status:", axiosError.response.status);
        console.error("Status Text:", axiosError.response.statusText);
        console.error("Data:", axiosError.response.data);
        console.error("Headers:", axiosError.response.headers);
      } else if (axiosError.request) {
        console.error("📤 Request made but no response received:");
        console.error("Request:", axiosError.request);
        console.error("Ready State:", axiosError.request.readyState);
        console.error("Status:", axiosError.request.status);
      } else {
        console.error("⚠️ Request setup error:", axiosError.message);
      }

      throw submitError; // Re-throw to trigger the outer catch block
    }
  } catch (error) {
    console.error("Error submitting document - Exception caught:", error);

    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error("Response status:", axiosError.response.status);
      console.error("Response data:", axiosError.response.data);
      console.error("Response headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Request setup error:", axiosError.message);
    }

    // Return null instead of calling handleError since handleError might not return what we expect
    return null;
  }
};

// Delete Submitted Document API
export const deleteSubmittedDocument = async (
  submissionId: number,
): Promise<boolean> => {
  try {
    console.log(`🗑️ Deleting submitted document with ID: ${submissionId}`);

    const response = await api.delete(`/submitted-documents/${submissionId}`);

    console.log("✅ Delete Document Response Status:", response.status);
    console.log("✅ Delete Document Response:", response.data);

    if (response.status === 200 || response.status === 204) {
      console.log("🎉 Document deletion successful!");
      return true;
    } else {
      console.error("❌ Document deletion failed");
      return false;
    }
  } catch (error) {
    console.error("💥 Error deleting submitted document:", error);

    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error("📡 Response received but failed:");
      console.error("Status:", axiosError.response.status);
      console.error("Status Text:", axiosError.response.statusText);
      console.error("Data:", axiosError.response.data);
    } else if (axiosError.request) {
      console.error("📤 Request made but no response received:");
      console.error("Request:", axiosError.request);
    } else {
      console.error("⚠️ Request setup error:", axiosError.message);
    }

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
