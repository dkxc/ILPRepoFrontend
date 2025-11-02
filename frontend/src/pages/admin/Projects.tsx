import { useState, useEffect, forwardRef } from "react";
import { Badge, ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Trash2,
  Pencil,
  FolderOpen,
  UserCheck,
  Users,
  FileText,
  LogIn,
} from "lucide-react";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { useNavigate } from "react-router";
import Button from "../../features/ui/Button";
import { logos } from "../../assets/projects-svg";
import { useAuth } from "../../context/AuthContext";
import { ProjectService } from "../../services/projectService";

// ============= GLOBAL CACHE =============
let projectsCache: {
  projects: Project[];
  pocs: POC[];
  mentors: Mentor[];
  documents: ProjectDocument[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000;

// ============= INTERFACES =============
interface Project {
  id: number;
  name: string;
  batch: string;
  teamLead: string;
  status: "In Progress" | "Live" | "Not Live";
  startDate: string;
  endDate: string;
}

interface POC {
  id: number;
  projectName: string;
  pocs: string[];
  pocEmails: string[];
}

interface Mentor {
  id: number;
  projectName: string;
  codeMentor: string;
  projectMentor: string;
  baMentor: string;
}

interface ProjectDocument {
  id: number;
  projectName: string;
  submittedDocs: number;
  requestedDocs: number;
  submissionRate: number;
}

export interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: keyof typeof logos;
  title: string;
  value: number | string;
  isActive?: boolean;
  onCardClick?: () => void;
}

// ============= CUSTOM DELETE MODAL COMPONENT =============
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemName: string;
  type: string;
}

function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  type,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md transform transition-all">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="mb-6">
            <p className="text-gray-600 mb-3">
              Are you sure you want to delete this {type.toLowerCase()}?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm font-medium text-red-800">{itemName}</p>
            </div>
            <p className="text-sm text-red-600 mt-3">
              ⚠️ This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= PROJECT CARD COMPONENT =============
const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    { className, type, title, value, isActive = false, onCardClick, ...props },
    ref,
  ) => {
    const icon = logos[type];

    return (
      <div
        ref={ref}
        onClick={onCardClick}
        className={`flex items-center gap-4 p-2 rounded-md border transition-all duration-200 cursor-pointer ${
          isActive
            ? "border-blue-500 bg-blue-50 shadow-lg scale-[1.02] ring-2 ring-blue-200 text-blue-600"
            : "border-gray-200 bg-white hover:shadow-md hover:scale-[1.01] text-gray-400"
        } ${className}`}
        {...props}
      >
        <div
          className={`flex items-center justify-center transition-colors duration-200 ${
            isActive ? "text-blue-600" : "text-gray-400"
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <p
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-semibold transition-colors duration-200 ${
              isActive ? "text-blue-700" : "text-gray-800"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

// ============= EDIT MODAL COMPONENT =============
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  fields: {
    key: string;
    label: string;
    type?: string;
    options?: string[];
    isArray?: boolean;
  }[];
  onSave: (updatedData: any) => Promise<void>;
}

function EditModal({
  isOpen,
  onClose,
  title,
  data,
  fields,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !data || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleArrayChange = (key: string, value: string) => {
    const items = value.split("\n").filter((item) => item.trim() !== "");
    setFormData({ ...formData, [key]: items });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.isArray ? (
                  <textarea
                    value={
                      Array.isArray(formData[field.key])
                        ? formData[field.key].join("\n")
                        : formData[field.key] || ""
                    }
                    onChange={(e) =>
                      handleArrayChange(field.key, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter one item per line"
                  />
                ) : field.options ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "date" ? (
                  <input
                    type="date"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={formData[field.key] || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    min="0"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============= MAIN COMPONENT =============
export default function Projects() {
  const { isLoggedIn, authData } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Projects");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState<any>(null);
  const [currentEditType, setCurrentEditType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<string>("");

  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [pocData, setPocData] = useState<POC[]>([]);
  const [mentorData, setMentorData] = useState<Mentor[]>([]);
  const [documentsData, setDocumentsData] = useState<ProjectDocument[]>([]);

  // ============= DATA TRANSFORMATION =============
  const transformApiData = (apiProjects: any[]) => {
    const projects: Project[] = [];
    const pocs: POC[] = [];
    const mentors: Mentor[] = [];
    const documents: ProjectDocument[] = [];

    apiProjects.forEach((project) => {
      const statusMap: { [key: number]: "In Progress" | "Live" | "Not Live" } =
        {
          0: "Not Live",
          1: "Live",
          2: "In Progress",
        };

      projects.push({
        id: project.id,
        name: project.projectName,
        batch: project.batchName || "N/A",
        teamLead: project.teamLead || "N/A",
        status: statusMap[project.status] || "Not Live",
        startDate: project.createdAt ? project.createdAt.split("T")[0] : "",
        endDate: project.updatedAt ? project.updatedAt.split("T")[0] : "",
      });

      if (project.pocs && project.pocs.length > 0) {
        pocs.push({
          id: project.id,
          projectName: project.projectName,
          pocs: project.pocs.map((poc: any) => poc.name),
          pocEmails: project.pocs.map((poc: any) => poc.email),
        });
      }

      if (project.mentors && project.mentors.length > 0) {
        const mentorsByType: { [key: string]: string } = {
          codeMentor: "N/A",
          projectMentor: "N/A",
          baMentor: "N/A",
        };

        project.mentors.forEach((mentor: any) => {
          if (mentor.mentorType === 0) mentorsByType.codeMentor = mentor.name;
          if (mentor.mentorType === 1)
            mentorsByType.projectMentor = mentor.name;
          if (mentor.mentorType === 2) mentorsByType.baMentor = mentor.name;
        });

        mentors.push({
          id: project.id,
          projectName: project.projectName,
          codeMentor: mentorsByType.codeMentor,
          projectMentor: mentorsByType.projectMentor,
          baMentor: mentorsByType.baMentor,
        });
      }

      const submittedDocs =
        project.documentRequests?.filter((doc: any) => doc.isSubmitted)
          .length || 0;
      const requestedDocs = project.documentRequests?.length || 0;
      const submissionRate =
        requestedDocs > 0
          ? Math.round((submittedDocs / requestedDocs) * 100)
          : 0;

      documents.push({
        id: project.id,
        projectName: project.projectName,
        submittedDocs,
        requestedDocs,
        submissionRate,
      });
    });

    return { projects, pocs, mentors, documents };
  };

  // ============= FETCH DATA =============
  useEffect(() => {
    let isMounted = true;

    if (!isLoggedIn) {
      <LogIn />;
    }

    const now = Date.now();
    if (projectsCache && now - projectsCache.timestamp < CACHE_DURATION) {
      console.log("📦 Loading from cache...");
      setProjectsData(projectsCache.projects);
      setPocData(projectsCache.pocs);
      setMentorData(projectsCache.mentors);
      setDocumentsData(projectsCache.documents);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        console.log("🚀 Starting to fetch projects...");
        setLoading(true);

        const result = await ProjectService.getAllProjects();
        console.log("📦 Raw API Result:", result);

        if (!isMounted) {
          console.log("⚠️ Component unmounted, aborting");
          return;
        }

        if (result && result.data && Array.isArray(result.data)) {
          console.log(`✅ Received ${result.data.length} projects`);

          const transformed = transformApiData(result.data);

          setProjectsData(transformed.projects);
          setPocData(transformed.pocs);
          setMentorData(transformed.mentors);
          setDocumentsData(transformed.documents);

          projectsCache = {
            projects: transformed.projects,
            pocs: transformed.pocs,
            mentors: transformed.mentors,
            documents: transformed.documents,
            timestamp: Date.now(),
          };

          if (transformed.projects.length > 0) {
            notifications.show({
              title: "Success",
              message:
                result.message ||
                `Loaded ${transformed.projects.length} projects`,
              color: "green",
            });
          }
        } else {
          console.error("❌ Invalid response structure:", result);
          notifications.show({
            title: "Error",
            message: result?.message || "Invalid response from server",
            color: "red",
          });
        }
      } catch (error: any) {
        if (!isMounted) return;

        console.error("❌ Error fetching projects:", error);

        notifications.show({
          title: "Error",
          message: error.message || "Failed to connect to API",
          color: "red",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, navigate]);

  // ============= COMPUTED VALUES =============
  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "inProgress") return project.status === "In Progress";
    if (activeFilter === "live") return project.status === "Live";
    if (activeFilter === "notLive") return project.status === "Not Live";
    return true;
  });

  const stats = {
    all: projectsData.length,
    inProgress: projectsData.filter((p) => p.status === "In Progress").length,
    live: projectsData.filter((p) => p.status === "Live").length,
    notLive: projectsData.filter((p) => p.status === "Not Live").length,
  };

  // Debug effect to track state changes
  useEffect(() => {
    console.log("🔄 Projects data updated:", projectsData.length);
  }, [projectsData]);

  useEffect(() => {
    console.log("🔄 Filtered projects updated:", filteredProjects.length);
  }, [filteredProjects]);

  // ============= HELPER FUNCTIONS =============
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "yellow";
      case "Live":
        return "green";
      case "Not Live":
        return "red";
      default:
        return "gray";
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "Projects":
        return <FolderOpen size={16} />;
      case "POC":
        return <UserCheck size={16} />;
      case "Mentors":
        return <Users size={16} />;
      case "Documents":
        return <FileText size={16} />;
      default:
        return null;
    }
  };

  // ============= CARD CLICK HANDLER =============
  const handleCardClick = (filterType: string) => {
    console.log("Card clicked:", filterType);
    setActiveFilter(filterType);
    setActiveTab("Projects");
  };

  // ============= ROW CLICK HANDLERS =============
  const handleProjectRowClick = (row: Project) => {
    console.log(row.id);
    navigate(`/projectsDetailsAdmin/${row.id}`);
  };

  const handlePOCRowClick = (row: POC) => {
    console.log(row.id);
    navigate(`/projectsDetailsAdmin/${row.id}`);
  };

  const handleMentorRowClick = (row: Mentor) => {
    console.log(row.id);
    navigate(`/projectsDetailsAdmin/${row.id}`);
  };

  const handleDocumentRowClick = (row: ProjectDocument) => {
    console.log(row.id);
    navigate(`/projectsDetailsAdmin/${row.id}`);
  };

  // ============= EDIT HANDLER =============
  const handleEdit = (data: any, type: string) => {
    setCurrentEditData({ ...data });
    setCurrentEditType(type);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData: any) => {
    try {
      console.log("💾 Saving edit for type:", currentEditType);

      if (currentEditType === "Projects") {
        // Update local state immediately
        setProjectsData((prev) => {
          const newData = prev.map((p) =>
            p.id === updatedData.id ? updatedData : p,
          );
          console.log("💾 Projects after edit - updated item:", updatedData.id);
          return newData;
        });

        // Update cache
        if (projectsCache) {
          projectsCache.projects = projectsCache.projects.map((p) =>
            p.id === updatedData.id ? updatedData : p,
          );
        }

        // Make API call in background (don't wait for it)
        const apiData = {
          id: updatedData.id,
          projectName: updatedData.name,
          status:
            updatedData.status === "Live"
              ? 1
              : updatedData.status === "Not Live"
                ? 0
                : 2,
          batchName: updatedData.batch,
          teamLead: updatedData.teamLead,
          progress: 0,
          technology: "",
        };

        ProjectService.updateProject(updatedData.id, apiData)
          .then(() => {
            notifications.show({
              title: "Success",
              message: "Project updated successfully",
              color: "green",
            });
          })
          .catch((apiError) => {
            console.error("API update failed:", apiError);
            notifications.show({
              title: "Warning",
              message: "Project updated locally but sync with server failed",
              color: "yellow",
            });
          });
      } else if (currentEditType === "POC") {
        setPocData((prev) => {
          const newData = prev.map((p) =>
            p.id === updatedData.id ? updatedData : p,
          );
          console.log("💾 POC after edit - updated item:", updatedData.id);
          return newData;
        });

        if (projectsCache) {
          projectsCache.pocs = projectsCache.pocs.map((p) =>
            p.id === updatedData.id ? updatedData : p,
          );
        }

        notifications.show({
          title: "Success",
          message: "POC updated successfully",
          color: "green",
        });
      } else if (currentEditType === "Mentors") {
        setMentorData((prev) => {
          const newData = prev.map((m) =>
            m.id === updatedData.id ? updatedData : m,
          );
          console.log("💾 Mentors after edit - updated item:", updatedData.id);
          return newData;
        });

        if (projectsCache) {
          projectsCache.mentors = projectsCache.mentors.map((m) =>
            m.id === updatedData.id ? updatedData : m,
          );
        }

        notifications.show({
          title: "Success",
          message: "Mentor updated successfully",
          color: "green",
        });
      } else if (currentEditType === "Documents") {
        const submissionRate =
          updatedData.requestedDocs > 0
            ? Math.round(
                (updatedData.submittedDocs / updatedData.requestedDocs) * 100,
              )
            : 0;

        const dataWithRate = {
          ...updatedData,
          submissionRate,
        };

        setDocumentsData((prev) => {
          const newData = prev.map((d) =>
            d.id === dataWithRate.id ? dataWithRate : d,
          );
          console.log(
            "💾 Documents after edit - updated item:",
            dataWithRate.id,
          );
          return newData;
        });

        if (projectsCache) {
          projectsCache.documents = projectsCache.documents.map((d) =>
            d.id === dataWithRate.id ? dataWithRate : d,
          );
        }

        notifications.show({
          title: "Success",
          message: "Document submission status updated successfully",
          color: "green",
        });
      }
    } catch (error: any) {
      console.error("❌ Error updating:", error);
      throw error;
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditData(null);
    setCurrentEditType("");
  };

  // ============= DELETE HANDLER =============
  const handleDelete = (item: any, type: string) => {
    console.log("🗑️ Delete initiated:", { item, type });

    if (!item || !item.id) {
      notifications.show({
        title: "Error",
        message: "Invalid item selected for deletion",
        color: "red",
      });
      return;
    }

    setItemToDelete(item);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      console.log("🗑️ Deleting:", itemToDelete.id, deleteType);

      if (deleteType === "Projects") {
        // Update local state immediately
        setProjectsData((prev) => {
          const newData = prev.filter((p) => p.id !== itemToDelete.id);
          console.log(
            "🗑️ Projects after deletion - before:",
            prev.length,
            "after:",
            newData.length,
          );
          return newData;
        });

        // Update cache
        if (projectsCache) {
          projectsCache.projects = projectsCache.projects.filter(
            (p) => p.id !== itemToDelete.id,
          );
          console.log("🗑️ Cache updated");
        }

        // Make API call in background (don't wait for it)
        ProjectService.deleteProject(itemToDelete.id).catch((error) => {
          console.error("❌ Background delete failed:", error);
          // Optionally show a warning but don't revert UI
          notifications.show({
            title: "Warning",
            message: "Item was removed locally but sync with server failed",
            color: "yellow",
          });
        });
      } else if (deleteType === "POC") {
        setPocData((prev) => {
          const newData = prev.filter((p) => p.id !== itemToDelete.id);
          console.log(
            "🗑️ POC after deletion - before:",
            prev.length,
            "after:",
            newData.length,
          );
          return newData;
        });

        if (projectsCache) {
          projectsCache.pocs = projectsCache.pocs.filter(
            (p) => p.id !== itemToDelete.id,
          );
        }
      } else if (deleteType === "Mentors") {
        setMentorData((prev) => {
          const newData = prev.filter((m) => m.id !== itemToDelete.id);
          console.log(
            "🗑️ Mentors after deletion - before:",
            prev.length,
            "after:",
            newData.length,
          );
          return newData;
        });

        if (projectsCache) {
          projectsCache.mentors = projectsCache.mentors.filter(
            (m) => m.id !== itemToDelete.id,
          );
        }
      } else if (deleteType === "Documents") {
        setDocumentsData((prev) => {
          const newData = prev.filter((d) => d.id !== itemToDelete.id);
          console.log(
            "🗑️ Documents after deletion - before:",
            prev.length,
            "after:",
            newData.length,
          );
          return newData;
        });

        if (projectsCache) {
          projectsCache.documents = projectsCache.documents.filter(
            (d) => d.id !== itemToDelete.id,
          );
        }
      }

      notifications.show({
        title: "Deleted",
        message: `${deleteType} "${itemToDelete.name || itemToDelete.projectName}" was removed successfully.`,
        color: "green",
      });

      setDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleteType("");
    } catch (error: any) {
      console.error("❌ Error deleting:", error);

      let errorMessage = "Failed to delete item";

      if (error.response?.status === 404) {
        errorMessage = "Item not found - it may have already been deleted";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to delete this item";
      } else if (error.response?.status === 409) {
        errorMessage = "Cannot delete item - it may be in use elsewhere";
      } else if (error.message) {
        errorMessage = error.message;
      }

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteType("");
  };

  // ============= TABLE COLUMNS =============
  const projectColumns: ColumnDef<Project>[] = [
    { key: "name", header: "Name", sortable: true, width: "25%" },
    { key: "batch", header: "Batch", sortable: true, width: "25%" },
    { key: "teamLead", header: "Team Lead", sortable: true, width: "20%" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "15%",
      render: (value) => (
        <Badge
          color={getStatusColor(value)}
          variant="light"
          size="lg"
          radius="sm"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "15%",
      render: (_, row) => (
        <div className="flex gap-2 justify-center">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row, "Projects");
            }}
          >
            <Pencil size={18} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row, "Projects");
            }}
          >
            <Trash2 size={18} />
          </ActionIcon>
        </div>
      ),
    },
  ];

  const pocColumns: ColumnDef<POC>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      width: "30%",
    },
    {
      key: "pocs",
      header: "POC Names",
      sortable: false,
      width: "35%",
      render: (value: string[]) => (
        <div className="flex flex-col gap-1">
          {value.map((poc, index) => (
            <span key={index} className="text-sm">
              {poc}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "pocEmails",
      header: "POC Emails",
      sortable: false,
      width: "30%",
      render: (value: string[]) => (
        <div className="flex flex-col gap-1">
          {value.map((email, index) => (
            <a
              key={index}
              href={`mailto:${email}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {email}
            </a>
          ))}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => handleEdit(row, "POC")}
        >
          <Pencil size={18} />
        </ActionIcon>
      ),
    },
  ];

  const mentorColumns: ColumnDef<Mentor>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      width: "25%",
    },
    { key: "codeMentor", header: "Code Mentor", sortable: true, width: "25%" },
    {
      key: "projectMentor",
      header: "Project Mentor",
      sortable: true,
      width: "25%",
    },
    { key: "baMentor", header: "BA Mentor", sortable: true, width: "20%" },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => handleEdit(row, "Mentors")}
        >
          <Pencil size={18} />
        </ActionIcon>
      ),
    },
  ];

  const documentsColumns: ColumnDef<ProjectDocument>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      width: "35%",
    },
    {
      key: "submissionRate",
      header: "Submission Rate",
      sortable: true,
      width: "30%",
      align: "center",
      render: (value: number, row: ProjectDocument) => (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-800">
              {value}%
            </span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  value >= 80
                    ? "bg-green-500"
                    : value >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {row.submittedDocs} of {row.requestedDocs} documents
          </span>
        </div>
      ),
    },
    {
      key: "submittedDocs",
      header: "Submitted",
      sortable: true,
      width: "12%",
      align: "center",
      render: (value: number) => (
        <span className="text-sm font-medium text-green-600">{value}</span>
      ),
    },
    {
      key: "requestedDocs",
      header: "Requested",
      sortable: true,
      width: "13%",
      align: "center",
      render: (value: number) => (
        <span className="text-sm font-medium text-gray-600">{value}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={() => handleEdit(row, "Documents")}
        >
          <Pencil size={18} />
        </ActionIcon>
      ),
    },
  ];

  const getEditFields = () => {
    if (currentEditType === "Projects") {
      return [
        { key: "name", label: "Project Name" },
        { key: "batch", label: "Batch" },
        { key: "teamLead", label: "Team Lead" },
        {
          key: "status",
          label: "Status",
          options: ["In Progress", "Live", "Not Live"],
        },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "endDate", label: "End Date", type: "date" },
      ];
    } else if (currentEditType === "POC") {
      return [
        { key: "projectName", label: "Project Name" },
        { key: "pocs", label: "POC Names (one per line)", isArray: true },
        { key: "pocEmails", label: "POC Emails (one per line)", isArray: true },
      ];
    } else if (currentEditType === "Mentors") {
      return [
        { key: "projectName", label: "Project Name" },
        { key: "codeMentor", label: "Code Mentor" },
        { key: "projectMentor", label: "Project Mentor" },
        { key: "baMentor", label: "BA Mentor" },
      ];
    } else if (currentEditType === "Documents") {
      return [
        { key: "projectName", label: "Project Name" },
        {
          key: "submittedDocs",
          label: "Documents Submitted",
          type: "number",
        },
        {
          key: "requestedDocs",
          label: "Documents Requested",
          type: "number",
        },
      ];
    }
    return [];
  };

  const uniqueBatches = Array.from(
    new Set(projectsData.map((p) => p.batch)),
  ).filter((b) => b !== "N/A");

  // ============= LOADING STATE =============
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Loading projects...
          </div>
          <div className="text-sm text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  // ============= RENDER =============
  return (
    <>
      <div className="p-4 bg-gray-50 flex-grow flex-col">
        <h1
          className="text-2xl font-bold ml-10 text-[#565E6C] font-primary"
          style={{ color: "#565E6C" }}
        >
          Projects
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 bg-w ml-4">
        <ProjectCard
          type="all"
          title="All Projects"
          value={stats.all}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "all"}
          onCardClick={() => handleCardClick("all")}
        />
        <ProjectCard
          type="inProgress"
          title="Projects In Progress"
          value={stats.inProgress}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "inProgress"}
          onCardClick={() => handleCardClick("inProgress")}
        />
        <ProjectCard
          type="live"
          title="Live Projects"
          value={stats.live}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "live"}
          onCardClick={() => handleCardClick("live")}
        />
        <ProjectCard
          type="notLive"
          title="Not Live Projects"
          value={stats.notLive}
          className="text-sm w-60 h-16"
          isActive={activeFilter === "notLive"}
          onCardClick={() => handleCardClick("notLive")}
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-3 pt-2 ml-10 mr-10">
        <div className="flex justify-between gap-3 bg-bg-results-tabs px-3 py-0 rounded-lg">
          {["Projects", "POC", "Mentors", "Documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                tab === activeTab
                  ? "bg-blue-50 text-brand-600 my-1"
                  : "text-gray-600 hover:bg-gray-100 my-1"
              }`}
            >
              {getTabIcon(tab)}
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Table Rendering */}
      <div className="bg ml-10 mr-10">
        {activeTab === "Projects" && (
          <DataTable
            key={`projects-${projectsData.length}-${activeFilter}`}
            columns={projectColumns}
            data={filteredProjects}
            showHeaderSection={true}
            headerTitle={
              activeFilter === "all"
                ? "All Projects"
                : activeFilter === "inProgress"
                  ? "Projects In Progress"
                  : activeFilter === "live"
                    ? "Live Projects"
                    : "Not Live Projects"
            }
            headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
            enableFilter={uniqueBatches.length > 0}
            filterColumn="batch"
            filterOptions={uniqueBatches}
            enableSearch={true}
            enablePagination={true}
            // enableDateFilter={true}
            dateFilterColumn="startDate"
            pageSize={10}
            pageSizeOptions={[5, 10, 25, 50]}
            striped={false}
            highlightOnHover={true}
            withBorder={true}
            onRowClick={handleProjectRowClick}
            rowStyle={{
              fontSize: "16px",
              height: "56px",
              lineHeight: "1",
            }}
            headerStyle={{
              fontWeight: 500,
              fontSize: "16px",
              height: "40px",
              background: "#F8F9FA",
            }}
          />
        )}

        {activeTab === "POC" && (
          <DataTable
            key={`poc-${pocData.length}`}
            columns={pocColumns}
            data={pocData}
            showHeaderSection={true}
            headerTitle="Project POCs"
            enableSearch={true}
            enablePagination={true}
            pageSize={10}
            highlightOnHover={true}
            withBorder={true}
            onRowClick={handlePOCRowClick}
            rowStyle={{
              fontSize: "16px",
              minHeight: "56px",
            }}
          />
        )}

        {activeTab === "Mentors" && (
          <DataTable
            key={`mentors-${mentorData.length}`}
            columns={mentorColumns}
            data={mentorData}
            showHeaderSection={true}
            headerTitle="Project Mentors"
            enableSearch={true}
            enablePagination={true}
            pageSize={10}
            highlightOnHover={true}
            withBorder={true}
            onRowClick={handleMentorRowClick}
          />
        )}

        {activeTab === "Documents" && (
          <DataTable
            key={`documents-${documentsData.length}`}
            columns={documentsColumns}
            data={documentsData}
            showHeaderSection={true}
            headerTitle="Project Document Submission"
            enableSearch={true}
            enablePagination={true}
            pageSize={10}
            highlightOnHover={true}
            withBorder={true}
            onRowClick={handleDocumentRowClick}
            rowStyle={{
              fontSize: "16px",
              height: "56px",
            }}
            headerStyle={{
              fontWeight: 500,
              fontSize: "16px",
              height: "40px",
              background: "#F8F9FA",
            }}
          />
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={`Edit ${currentEditType}`}
        data={currentEditData}
        fields={getEditFields()}
        onSave={handleSaveEdit}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteType}`}
        itemName={itemToDelete?.name || itemToDelete?.projectName || ""}
        type={deleteType}
      />
    </>
  );
}
