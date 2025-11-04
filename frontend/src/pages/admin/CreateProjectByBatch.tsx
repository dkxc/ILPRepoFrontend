import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  useEffect,
} from "react";
import { useSearchParams } from "react-router";
import * as XLSX from "xlsx";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { notifications } from "@mantine/notifications";
import { ProjectService } from "../../services/projectService";
import { Badge } from "@mantine/core";

interface Poc {
  name: string;
  email: string;
}

interface ProjectData {
  projectName: string;
  technology: string;
  teamLeadName: string;
  scrumMasterName: string;
  teamMembers: string[];
  codeMentor: string;
  projectMentor: string;
  baMentor: string;
  codeMentorEmail: string;
  projectMentorEmail: string;
  baMentorEmail: string;
  pocs: Poc[];
}

interface ExcelRow {
  "Project Name": string;
  Technology: string;
  "Team Lead": string;
  "Scrum Master": string;
  "Team Members": string;
  "Code Mentor": string;
  "Code Mentor Email": string;
  "Project Mentor": string;
  "Project Mentor Email": string;
  "BA Mentor": string;
  "BA Mentor Email": string;
  "POC Names": string;
  "POC Emails": string;
}

interface ApiErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
  statusCode?: number;
  succeeded?: boolean;
}

interface Trainee {
  id: number;
  name: string;
  email: string;
  username: string;
  batchId: number;
  batchName: string;
}

export default function CreateProjectByBatch() {
  const [searchParams] = useSearchParams();
  const batchId = parseInt(searchParams.get("batchId") || "0");
  const batchName = searchParams.get("batchName") || "";

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ApiErrorResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [batchTrainees, setBatchTrainees] = useState<Trainee[]>([]);
  const [isLoadingTrainees, setIsLoadingTrainees] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"basic" | "detailed">("basic");
  const [currentBatchName, setCurrentBatchName] = useState<string>(batchName);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Debug props on mount
  useEffect(() => {
    console.log("🔍 CreateProjectByBatch URL Params:", { batchId, batchName });
    if (!batchId || batchId === 0) {
      console.error("❌ ERROR: batchId is missing or invalid!");
      notifications.show({
        title: "Error",
        message:
          "Batch ID is missing or invalid. Please go back and try again.",
        color: "red",
      });
    }
    if (!batchName) {
      console.error("❌ ERROR: batchName is missing or undefined!");
    }
  }, [batchId, batchName]);

  useEffect(() => {
    if (batchId && batchId !== 0) {
      fetchBatchData();
    } else {
      console.error(
        "❌ Cannot fetch batch data: batchId is missing or invalid",
      );
      notifications.show({
        title: "Error",
        message: "Batch ID is missing. Cannot load batch data.",
        color: "red",
      });
    }
  }, [batchId]);

  // Update current batch name when prop changes
  useEffect(() => {
    if (batchName) {
      setCurrentBatchName(batchName);
    }
  }, [batchName]);

  const fetchBatchData = async (): Promise<void> => {
    if (!batchId || batchId === 0) {
      console.error(
        "❌ Cannot fetch batch data: batchId is undefined or invalid",
      );
      return;
    }

    try {
      setIsLoadingTrainees(true);

      notifications.show({
        id: "loading-batch",
        title: "Loading Batch Data...",
        message: `Fetching information for ${currentBatchName}...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      console.log("📡 Fetching trainees for batchId:", batchId);
      const traineesResponse = await ProjectService.getBatchTrainees(batchId);

      console.log("✅ Trainees API Response:", traineesResponse);

      let traineesData = traineesResponse;

      if (traineesResponse.ok !== undefined) {
        if (!traineesResponse.ok) {
          throw new Error(
            `Failed to fetch trainees: ${traineesResponse.statusText}`,
          );
        }
        traineesData = await traineesResponse.json();
      }

      if (
        traineesData.status !== 200 &&
        traineesData.succeeded === false &&
        !traineesData.data
      ) {
        throw new Error(traineesData.message || "Failed to fetch trainees");
      }

      let trainees: Trainee[] = [];
      let batchNameFromApi = currentBatchName;

      if (traineesData.data && Array.isArray(traineesData.data)) {
        trainees = traineesData.data.map((trainee: any) => ({
          id: trainee.id,
          name: trainee.username,
          email: trainee.email,
          username: trainee.username,
          batchId: trainee.batchId,
          batchName: trainee.batchName,
        }));

        if (
          trainees.length > 0 &&
          trainees[0].batchName &&
          trainees[0].batchName !== "string"
        ) {
          batchNameFromApi = trainees[0].batchName;
        }
      } else if (Array.isArray(traineesData)) {
        trainees = traineesData.map((trainee: any) => ({
          id: trainee.id,
          name: trainee.username,
          email: trainee.email,
          username: trainee.username,
          batchId: trainee.batchId,
          batchName: trainee.batchName,
        }));

        if (
          trainees.length > 0 &&
          trainees[0].batchName &&
          trainees[0].batchName !== "string"
        ) {
          batchNameFromApi = trainees[0].batchName;
        }
      }

      setCurrentBatchName(batchNameFromApi);
      setBatchTrainees(trainees);

      notifications.update({
        id: "loading-batch",
        title: "Batch Data Loaded",
        message: `✓ ${trainees.length} trainees found in ${batchNameFromApi}`,
        color: "green",
        loading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("❌ Error fetching batch data:", error);

      notifications.update({
        id: "loading-batch",
        title: "Error Loading Batch Data",
        message:
          error.message ||
          "Failed to fetch trainee list. Validation will be limited.",
        color: "red",
        loading: false,
        autoClose: 5000,
      });

      setBatchTrainees([]);
    } finally {
      setIsLoadingTrainees(false);
    }
  };

  const validateTraineesInBatch = (
    projectsToValidate: ProjectData[],
  ): string[] => {
    const errors: string[] = [];

    if (batchTrainees.length === 0) {
      errors.push(
        "⚠️ Warning: Batch trainee list is empty. Cannot validate team members.",
      );
      return errors;
    }

    const traineeUsernamesSet = new Set(
      batchTrainees.map((t) => t.username.toLowerCase().trim()),
    );

    const traineeNameMapping = new Map(
      batchTrainees.map((t) => [t.username.toLowerCase().trim(), t.username]),
    );

    projectsToValidate.forEach((project, index) => {
      const rowNumber = index + 2;

      const teamLeadLower = project.teamLeadName.toLowerCase().trim();
      if (!traineeUsernamesSet.has(teamLeadLower)) {
        errors.push(
          `Row ${rowNumber} (${project.projectName}): Team Lead "${project.teamLeadName}" is not a trainee in this batch`,
        );
      }

      const scrumMasterLower = project.scrumMasterName.toLowerCase().trim();
      if (!traineeUsernamesSet.has(scrumMasterLower)) {
        errors.push(
          `Row ${rowNumber} (${project.projectName}): Scrum Master "${project.scrumMasterName}" is not a trainee in this batch`,
        );
      }

      project.teamMembers.forEach((member) => {
        const memberLower = member.toLowerCase().trim();
        if (!traineeUsernamesSet.has(memberLower)) {
          errors.push(
            `Row ${rowNumber} (${project.projectName}): Team Member "${member}" is not a trainee in this batch`,
          );
        }
      });

      const allRoles = [
        project.teamLeadName,
        project.scrumMasterName,
        ...project.teamMembers,
      ].map((name) => name.toLowerCase().trim());

      const duplicates = allRoles.filter(
        (name, index) => allRoles.indexOf(name) !== index,
      );
      const uniqueDuplicates = [...new Set(duplicates)];

      if (uniqueDuplicates.length > 0) {
        const duplicateDisplayNames = uniqueDuplicates.map(
          (name) => traineeNameMapping.get(name) || name,
        );
        errors.push(
          `Row ${rowNumber} (${project.projectName}): Duplicate assignments found: ${duplicateDisplayNames.join(", ")}`,
        );
      }
    });

    return errors;
  };

  const basicColumns: ColumnDef<ProjectData>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      align: "left",
      width: "20%",
    },
    {
      key: "technology",
      header: "Technology",
      sortable: true,
      align: "left",
      width: "20%",
    },
    {
      key: "teamLeadName",
      header: "Team Lead",
      sortable: true,
      align: "left",
      width: "15%",
    },
    {
      key: "scrumMasterName",
      header: "Scrum Master",
      sortable: true,
      align: "left",
      width: "15%",
    },
    {
      key: "teamMembers",
      header: "Team Size",
      sortable: false,
      align: "center",
      width: "10%",
      render: (value: string[]) => (
        <Badge color="blue" variant="light" size="md">
          {value.length} members
        </Badge>
      ),
    },
    {
      key: "pocs",
      header: "POCs",
      sortable: false,
      align: "center",
      width: "10%",
      render: (value: Poc[]) => (
        <Badge color="green" variant="light" size="md">
          {value.length} POCs
        </Badge>
      ),
    },
  ];

  const detailedColumns: ColumnDef<ProjectData>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      align: "left",
      width: "12%",
    },
    {
      key: "technology",
      header: "Technology",
      sortable: true,
      align: "left",
      width: "10%",
    },
    {
      key: "teamLeadName",
      header: "Team Lead",
      sortable: true,
      align: "left",
      width: "8%",
    },
    {
      key: "scrumMasterName",
      header: "Scrum Master",
      sortable: true,
      align: "left",
      width: "8%",
    },
    {
      key: "teamMembers",
      header: "Team Members",
      sortable: false,
      align: "left",
      width: "12%",
      render: (value: string[]) => (
        <div className="text-xs">
          {value.slice(0, 2).join(", ")}
          {value.length > 2 && ` +${value.length - 2} more`}
        </div>
      ),
    },
    {
      key: "codeMentor",
      header: "Code Mentor",
      sortable: true,
      align: "left",
      width: "8%",
      render: (value: string, row: ProjectData) => (
        <div className="text-xs">
          <div className="font-medium">{value}</div>
          <div className="text-gray-500">{row.codeMentorEmail}</div>
        </div>
      ),
    },
    {
      key: "projectMentor",
      header: "Project Mentor",
      sortable: true,
      align: "left",
      width: "8%",
      render: (value: string, row: ProjectData) => (
        <div className="text-xs">
          <div className="font-medium">{value}</div>
          <div className="text-gray-500">{row.projectMentorEmail}</div>
        </div>
      ),
    },
    {
      key: "baMentor",
      header: "BA Mentor",
      sortable: true,
      align: "left",
      width: "8%",
      render: (value: string, row: ProjectData) => (
        <div className="text-xs">
          <div className="font-medium">{value}</div>
          <div className="text-gray-500">{row.baMentorEmail}</div>
        </div>
      ),
    },
    {
      key: "pocs",
      header: "POCs",
      sortable: false,
      align: "left",
      width: "16%",
      render: (value: Poc[]) => (
        <div className="text-xs">
          {value.slice(0, 2).map((poc, idx) => (
            <div key={idx} className="truncate">
              <div className="font-medium">{poc.name}</div>
              <div className="text-gray-500">{poc.email}</div>
            </div>
          ))}
          {value.length > 2 && ` +${value.length - 2} more`}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (projectsData.length > 0 && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [projectsData]);

  useEffect(() => {
    setApiError(null);
    setValidationErrors([]);
  }, [uploadedFile]);

  const parseExcelFile = async (file: File): Promise<void> => {
    try {
      setIsLoading(true);
      setApiError(null);
      setValidationErrors([]);

      notifications.show({
        id: "validating",
        title: "Validating...",
        message: "Reading and validating Excel file...",
        color: "blue",
        loading: true,
        autoClose: false,
      });

      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (jsonData.length === 0) {
        notifications.hide("validating");
        throw new Error("Excel file is empty. Please add project data.");
      }

      const requiredColumns = [
        "Project Name",
        "Technology",
        "Team Lead",
        "Scrum Master",
        "Team Members",
        "Code Mentor",
        "Code Mentor Email",
        "Project Mentor",
        "Project Mentor Email",
        "BA Mentor",
        "BA Mentor Email",
        "POC Names",
        "POC Emails",
      ];

      const missingColumns = requiredColumns.filter(
        (col) => !Object.keys(jsonData[0] || {}).includes(col),
      );

      if (missingColumns.length > 0) {
        notifications.hide("validating");
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}. Please use the provided template.`,
        );
      }

      notifications.update({
        id: "validating",
        title: "Validating...",
        message: `Checking ${jsonData.length} rows...`,
        color: "blue",
        loading: true,
      });

      const errors: string[] = [];
      const parsedProjects: ProjectData[] = [];

      jsonData.forEach((row, index) => {
        const rowNumber = index + 2;

        const teamMembers = row["Team Members"]
          .split(",")
          .map((member) => member.trim())
          .filter((member) => member !== "");

        const pocNames = row["POC Names"]
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name !== "");

        const pocEmails = row["POC Emails"]
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email !== "");

        if (pocNames.length !== pocEmails.length) {
          errors.push(
            `Row ${rowNumber}: Number of POC names (${pocNames.length}) does not match number of POC emails (${pocEmails.length})`,
          );
        }

        const pocs: Poc[] = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        pocNames.forEach((name, idx) => {
          const email = pocEmails[idx] || "";
          if (name && email) {
            if (!emailRegex.test(email)) {
              errors.push(
                `Row ${rowNumber}: Invalid POC email format for "${name}": ${email}`,
              );
            } else {
              pocs.push({ name, email });
            }
          } else if (name && !email) {
            errors.push(`Row ${rowNumber}: POC "${name}" is missing email`);
          } else if (!name && email) {
            errors.push(
              `Row ${rowNumber}: POC email "${email}" is missing name`,
            );
          }
        });

        const project: ProjectData = {
          projectName: row["Project Name"]?.toString()?.trim() || "",
          technology: row["Technology"]?.toString()?.trim() || "",
          teamLeadName: row["Team Lead"]?.toString()?.trim() || "",
          scrumMasterName: row["Scrum Master"]?.toString()?.trim() || "",
          teamMembers: teamMembers,
          codeMentor: row["Code Mentor"]?.toString()?.trim() || "",
          codeMentorEmail: row["Code Mentor Email"]?.toString()?.trim() || "",
          projectMentor: row["Project Mentor"]?.toString()?.trim() || "",
          projectMentorEmail:
            row["Project Mentor Email"]?.toString()?.trim() || "",
          baMentor: row["BA Mentor"]?.toString()?.trim() || "",
          baMentorEmail: row["BA Mentor Email"]?.toString()?.trim() || "",
          pocs: pocs,
        };

        if (!project.projectName) {
          errors.push(`Row ${rowNumber}: Project Name is required`);
        }

        if (!project.teamLeadName) {
          errors.push(`Row ${rowNumber}: Team Lead is required`);
        }

        if (!project.scrumMasterName) {
          errors.push(`Row ${rowNumber}: Scrum Master is required`);
        }

        if (teamMembers.length === 0) {
          errors.push(`Row ${rowNumber}: At least one Team Member is required`);
        }

        if (project.codeMentor && !emailRegex.test(project.codeMentorEmail)) {
          errors.push(`Row ${rowNumber}: Invalid Code Mentor Email format`);
        }

        if (
          project.projectMentor &&
          !emailRegex.test(project.projectMentorEmail)
        ) {
          errors.push(`Row ${rowNumber}: Invalid Project Mentor Email format`);
        }

        if (project.baMentor && !emailRegex.test(project.baMentorEmail)) {
          errors.push(`Row ${rowNumber}: Invalid BA Mentor Email format`);
        }

        if (project.projectName.trim() !== "") {
          parsedProjects.push(project);
        }
      });

      if (parsedProjects.length === 0) {
        errors.push(
          "No valid projects found in the file. Please check that Project Name fields are filled.",
        );
      }

      if (parsedProjects.length > 0 && batchTrainees.length > 0) {
        notifications.update({
          id: "validating",
          title: "Validating Trainees...",
          message: "Checking if team members belong to the batch...",
          color: "blue",
          loading: true,
        });

        const batchValidationErrors = validateTraineesInBatch(parsedProjects);
        errors.push(...batchValidationErrors);
      } else if (parsedProjects.length > 0 && batchTrainees.length === 0) {
        errors.push(
          "⚠️ Cannot validate team members: Batch trainee list is not available.",
        );
      }

      notifications.hide("validating");

      if (errors.length > 0) {
        setValidationErrors(errors);

        notifications.show({
          title: "Validation Errors",
          message: `Found ${errors.length} error(s) in the Excel file. Please check the error list below.`,
          color: "red",
          autoClose: false,
        });
      } else {
        setValidationErrors([]);
      }

      setProjectsData(parsedProjects);
      setShowPreview(true);

      if (errors.length === 0) {
        notifications.show({
          title: "Validation Complete",
          message: `✓ Successfully validated ${parsedProjects.length} projects`,
          color: "green",
        });
      }
    } catch (error: any) {
      console.error("Error reading Excel file:", error);

      notifications.hide("validating");

      let errorMessage =
        "Error reading Excel file. Please check the file format.";

      if (error.message.includes("Missing required columns")) {
        errorMessage = error.message;
      } else if (error.message.includes("empty")) {
        errorMessage = error.message;
      }

      notifications.show({
        title: "Validation Failed",
        message: errorMessage,
        color: "red",
      });

      setValidationErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProjects = async (): Promise<void> => {
    if (!uploadedFile || projectsData.length === 0) return;

    if (validationErrors.length > 0) {
      notifications.show({
        title: "Cannot Save",
        message: "Please fix all validation errors before saving projects.",
        color: "red",
      });
      return;
    }

    if (!batchId || batchId === 0) {
      notifications.show({
        title: "Error",
        message: "Batch ID is missing. Cannot save projects.",
        color: "red",
      });
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      notifications.show({
        id: "saving",
        title: "Saving Projects...",
        message: `Creating ${projectsData.length} projects for ${currentBatchName}...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      const apiData = {
        batchId: batchId,
        projects: projectsData.map((project) => ({
          projectName: project.projectName,
          technology: project.technology,
          status: 2,
          progress: 0,
          teamMembers: project.teamMembers,
          teamLeadName: project.teamLeadName,
          scrumMasterName: project.scrumMasterName,
          mentors: [
            {
              name: project.codeMentor,
              email: project.codeMentorEmail,
              mentorType: 0,
            },
            {
              name: project.projectMentor,
              email: project.projectMentorEmail,
              mentorType: 1,
            },
            {
              name: project.baMentor,
              email: project.baMentorEmail,
              mentorType: 2,
            },
          ].filter((mentor) => mentor.name && mentor.email),
          pocs: project.pocs.map((poc) => ({
            name: poc.name,
            email: poc.email,
          })),
        })),
      };

      console.log("📤 Sending data to API:", apiData);

      const result = await ProjectService.createBatchProjects(apiData);

      console.log("📥 API Response:", result);

      notifications.hide("saving");

      if (result.succeeded === true || result.status === 200) {
        notifications.show({
          title: "Success!",
          message:
            result.message ||
            `✓ ${projectsData.length} projects created successfully for ${currentBatchName}`,
          color: "green",
          icon: "✓",
        });

        setUploadedFile(null);
        setProjectsData([]);
        setShowPreview(false);
        setValidationErrors([]);
        setApiError(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorResponse: ApiErrorResponse = {
          message: result.message || "Failed to create projects",
          errors: result.errors,
          statusCode: result.status,
          succeeded: result.succeeded,
        };

        setApiError(errorResponse);
        throw new Error(errorResponse.message);
      }
    } catch (error: any) {
      console.error("❌ Error saving projects:", error);

      notifications.hide("saving");

      let errorMessage = "Failed to save projects. Please try again.";
      let statusCode = 500;
      let detailedErrors: string[] = [];

      if (error.response) {
        statusCode = error.response.status;
        const responseData = error.response.data;

        if (responseData) {
          errorMessage = responseData.message || errorMessage;
          if (responseData.errors) {
            detailedErrors = Object.entries(responseData.errors).flatMap(
              ([field, messages]) =>
                (messages as string[]).map((msg) => `${field}: ${msg}`),
            );
          }
        }
      } else if (error.status) {
        statusCode = error.status;
        if (error.data) {
          errorMessage = error.data.message || errorMessage;
          if (error.data.errors) {
            detailedErrors = Object.entries(error.data.errors).flatMap(
              ([field, messages]) =>
                (messages as string[]).map((msg) => `${field}: ${msg}`),
            );
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      const apiErrorResponse: ApiErrorResponse = {
        message: errorMessage,
        errors:
          detailedErrors.length > 0
            ? { Validation: detailedErrors }
            : undefined,
        statusCode: statusCode,
      };

      setApiError(apiErrorResponse);

      notifications.show({
        title: `Error ${statusCode}`,
        message: errorMessage,
        color: "red",
        autoClose: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (file: File | null): void => {
    if (!file) return;

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setUploadedFile(file);
      parseExcelFile(file);
    } else {
      notifications.show({
        title: "Error",
        message: "Please upload an Excel file (.xlsx or .xls)",
        color: "red",
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUploadClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancel = (): void => {
    setUploadedFile(null);
    setProjectsData([]);
    setShowPreview(false);
    setApiError(null);
    setValidationErrors([]);
    setViewMode("basic");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = (): void => {
    const sampleData: ExcelRow[] = [
      {
        "Project Name": "ILP Repo Management System",
        Technology: "React, .NET, PostgreSQL",
        "Team Lead": "Alex Jose Philip",
        "Scrum Master": "Nino Jagadish",
        "Team Members":
          "Carol George, Maria Mathew, Jacob Holmes, Garvin Haines",
        "Code Mentor": "John Smith",
        "Code Mentor Email": "john.smith@company.com",
        "Project Mentor": "Sarah Johnson",
        "Project Mentor Email": "sarah.johnson@company.com",
        "BA Mentor": "Mike Davis",
        "BA Mentor Email": "mike.davis@company.com",
        "POC Names": "Client Manager,Technical Lead",
        "POC Emails": "client.manager@company.com,tech.lead@company.com",
      },
      {
        "Project Name": "E-Commerce Platform",
        Technology: "Angular, Spring Boot, MongoDB",
        "Team Lead": "Emma Wilson",
        "Scrum Master": "David Brown",
        "Team Members": "Lisa Taylor, Kevin Martin, Amy Clark, Ryan Lee",
        "Code Mentor": "Robert Wilson",
        "Code Mentor Email": "robert.wilson@company.com",
        "Project Mentor": "Jennifer Lee",
        "Project Mentor Email": "jennifer.lee@company.com",
        "BA Mentor": "Thomas Anderson",
        "BA Mentor Email": "thomas.anderson@company.com",
        "POC Names": "Product Owner",
        "POC Emails": "product.owner@company.com",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

    const colWidths = [
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 50 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, "project_batch_template.xlsx");
  };

  const toggleView = (): void => {
    setViewMode(viewMode === "basic" ? "detailed" : "basic");
  };

  const currentColumns = viewMode === "basic" ? basicColumns : detailedColumns;

  // Show error if props are missing
  if (!batchId || batchId === 0 || !batchName) {
    return (
      <div className="mt-10 ml-10 mr-10">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                Missing Required Information
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p className="mb-2">
                  This component requires batch information to function
                  properly:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {(!batchId || batchId === 0) && (
                    <li>Batch ID is missing or invalid</li>
                  )}
                  {!batchName && <li>Batch Name is missing</li>}
                </ul>
                <p className="mt-4">
                  Please ensure you navigate to this page with proper URL
                  parameters:
                </p>
                <code className="block mt-2 p-2 bg-red-100 rounded">
                  /upload-project-data?batchId=123&batchName=Batch+Name
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4 sm:mt-6 md:mt-10 ml-4 sm:ml-6 md:ml-10 bg">
        <h1 className="text-[#565E6C] text-xl sm:text-2xl font-bold pb-4 font-primary">
          Create Projects {batchName}
        </h1>

        {(validationErrors.length > 0 || apiError) && (
          <div className="mr-4 md:mr-10 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    {apiError
                      ? `API Error ${apiError.statusCode ? `(${apiError.statusCode})` : ""}`
                      : "Validation Errors"}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {apiError ? (
                      <div>
                        <p className="font-medium">{apiError.message}</p>
                        {apiError.errors && (
                          <ul className="mt-2 list-disc list-inside space-y-1">
                            {Object.entries(apiError.errors).flatMap(
                              ([field, messages]) =>
                                (messages as string[]).map((msg, idx) => (
                                  <li key={`${field}-${idx}`}>{msg}</li>
                                )),
                            )}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 max-h-60 overflow-y-auto">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex mr-4 md:mr-10 bg-white p-4 md:p-8">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full px-2 sm:px-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 rounded-md border-dashed p-6 sm:p-8 md:p-12 text-center transition-colors min-h-[200px] sm:min-h-[250px] md:h-46 w-full cursor-pointer border-brand-500 ${
                  isDragging
                    ? "bg-brand-50"
                    : uploadedFile
                      ? "bg-brand-50 "
                      : "bg-white "
                } ${isLoading || isLoadingTrainees ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={
                  isLoading || isLoadingTrainees ? undefined : handleUploadClick
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isLoading || isLoadingTrainees}
                />

                <div className="flex flex-col items-center">
                  {isLoading || isLoadingTrainees ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin">
                      <svg fill="none" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600">
                      <svg
                        width="23"
                        height="19"
                        viewBox="0 0 23 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.49947 15.0002C5.25174 15.0002 4.05512 14.5261 3.17285 13.6822C2.29058 12.8383 1.79492 11.6937 1.79492 10.5002C1.79492 9.30672 2.29058 8.16213 3.17285 7.31822C4.05512 6.4743 5.25174 6.0002 6.49947 6.0002C6.79415 4.68737 7.65623 3.53368 8.89605 2.79291C9.50995 2.42612 10.1981 2.17174 10.9212 2.04431C11.6444 1.91687 12.3883 1.91887 13.1106 2.0502C13.8328 2.18152 14.5193 2.43959 15.1308 2.80968C15.7422 3.17976 16.2667 3.65461 16.6742 4.20712C17.0818 4.75963 17.3644 5.37898 17.506 6.02979C17.6476 6.68061 17.6454 7.35015 17.4995 8.0002H18.4995C19.4277 8.0002 20.318 8.36894 20.9743 9.02532C21.6307 9.6817 21.9995 10.5719 21.9995 11.5002C21.9995 12.4285 21.6307 13.3187 20.9743 13.9751C20.318 14.6314 19.4277 15.0002 18.4995 15.0002H17.4995"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.5 12L11.5 9L14.5 12"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.5 9V18"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  {isLoadingTrainees ? (
                    <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">
                      Loading batch data...
                    </p>
                  ) : isLoading ? (
                    <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">
                      Processing file...
                    </p>
                  ) : uploadedFile ? (
                    <>
                      <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">
                        File uploaded successfully!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 break-all px-2">
                        {uploadedFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base sm:text-lg font-medium mb-2 text-blue-600 px-2">
                        Click or drag file to this area to upload
                      </p>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 mt-4">
                Format accepted is .xlsx
              </p>
              <div className="w-full bg-gray-300 h-0.25"></div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-0">
                  If you do not have a file you can use this sample:
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  disabled={isLoading || isLoadingTrainees}
                  className="p-1 px-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm border border-gray-300 rounded whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 1V5C10 5.26522 10.1054 5.51957 10.2929 5.70711C10.4804 5.89464 10.7348 6 11 6H15"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H10L15 6V17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19Z"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 9H12V16H4V9Z"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 13H12"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 9V16"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download Template
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validationErrors.length > 0 || apiError
                    ? "Start Over"
                    : "Cancel"}
                </button>
                <button
                  onClick={handleSaveProjects}
                  disabled={
                    !uploadedFile ||
                    projectsData.length === 0 ||
                    isLoading ||
                    validationErrors.length > 0 ||
                    isLoadingTrainees
                  }
                  className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                    uploadedFile &&
                    projectsData.length > 0 &&
                    !isLoading &&
                    validationErrors.length === 0 &&
                    !isLoadingTrainees
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save Projects"}
                </button>
              </div>

              {validationErrors.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please fix all validation errors before saving projects.
                    No projects will be saved until all errors are resolved.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showPreview && projectsData.length > 0 && (
          <div ref={previewRef} className="mt-10 mr-10 sm:mt-8 px-2 sm:px-0">
            <div className="justify-start bg overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Projects Preview - {currentBatchName} ({projectsData.length}{" "}
                  projects)
                  {validationErrors.length > 0 && (
                    <span className="ml-2 text-sm text-red-600">
                      ({validationErrors.length} errors need to be fixed)
                    </span>
                  )}
                </h3>
                <button
                  onClick={toggleView}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {viewMode === "basic" ? "Show Details" : "Hide Details"}
                </button>
              </div>

              <DataTable
                key={`preview-${projectsData.length}-${viewMode}`}
                showHeaderSection={false}
                columns={currentColumns}
                data={projectsData}
                enableSearch={true}
                enablePagination={true}
                pageSize={10}
                pageSizeOptions={[5, 10, 25, 50]}
                striped={true}
                highlightOnHover={true}
                withBorder={true}
                rowStyle={{
                  fontSize: "14px",
                  height: "56px",
                  lineHeight: "1",
                }}
                headerStyle={{
                  fontWeight: 500,
                  fontSize: "14px",
                  height: "40px",
                  background: "#F8F9FA",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
