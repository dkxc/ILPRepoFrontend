import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useParams } from "react-router";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Layers,
  Send,
  FileText,
  Link,
  Edit2,
  Download,
  Check,
  X,
} from "lucide-react";
import { notifications } from "@mantine/notifications";

// Utility function to format date to dd-mm-yyyy
const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Utility function to convert dd-mm-yyyy back to yyyy-mm-dd for input fields
const formatDateToInputValue = (dateString: string): string => {
  if (!dateString) return "";

  // If already in yyyy-mm-dd format, return as is
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // If in dd-mm-yyyy format, convert to yyyy-mm-dd
  if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  // Try to parse as date and format
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  return dateString;
};
import type { ColumnDef } from "../../ui/Table";
import Button from "../../ui/Button";
import DataTable from "../../ui/Table";
import {
  getBatchLinks,
  getDocumentRequirements,
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  createDocumentRequirement,
  deleteDocumentRequirement,
  downloadDocumentTemplate,
  type BatchLinkType,
  type DocumentRequirementType,
  type DocumentType,
  type CreateDocumentTypeRequest,
  type UpdateDocumentTypeRequest,
  type CreateDocumentRequirementRequest,
} from "../../ui/ProjectDetails/api";

// DropdownMenu for action column
function DropdownMenu({
  row,
  setEditingRowId,
  setEditDraft,
  handleDeleteRow,
  handleToggleMultiple,
  handleToggleBroadcast,
  notifications,
}: {
  row: DocumentRow;
  setEditingRowId: (id: number) => void;
  setEditDraft: (draft: { documentName: string; deadline: string }) => void;
  handleDeleteRow: (id: number) => Promise<void>;
  handleToggleMultiple: (id: number) => void;
  handleToggleBroadcast: (id: number) => void;
  notifications: typeof import("@mantine/notifications").notifications;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [dropUp, setDropUp] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = 180;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const shouldDropUp = spaceBelow < menuHeight && spaceAbove > menuHeight;
        setDropUp(shouldDropUp);
        setMenuStyle({
          position: "absolute",
          top: shouldDropUp
            ? rect.top + window.scrollY - menuHeight - 4
            : rect.bottom + window.scrollY + 4,
          left: rect.right - 176 + window.scrollX,
          zIndex: 9999,
          minWidth: 176,
        });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        title="Actions"
        type="button"
      >
        <MoreHorizontal className="w-6 h-6 text-gray-700" />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className={`w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 flex flex-col ${
              dropUp ? "animate-dropup" : ""
            }`}
          >
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
              onClick={() => {
                setEditingRowId(row.id);
                setEditDraft({
                  documentName: row.documentName,
                  deadline: row.deadline,
                });
                setOpen(false);
              }}
              type="button"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
              onClick={async () => {
                await handleDeleteRow(row.id);
                setOpen(false);
              }}
              type="button"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
              onClick={() => {
                handleToggleMultiple(row.id);
                notifications.show({
                  title: "Multiple Upload",
                  message: `Multiple upload ${row.isMultiple ? "disabled" : "enabled"} for ${row.documentName}`,
                  color: "blue",
                });
                setOpen(false);
              }}
              type="button"
            >
              <Layers className="w-4 h-4" />{" "}
              {row.isMultiple ? "Disable" : "Enable"} Multiple
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
              onClick={() => {
                handleToggleBroadcast(row.id);
                notifications.show({
                  title: "Broadcast",
                  message: `Broadcast ${row.isBroadcast ? "disabled" : "enabled"} for ${row.documentName}`,
                  color: "teal",
                });
                setOpen(false);
              }}
              type="button"
            >
              <Send className="w-4 h-4" />{" "}
              {row.isBroadcast ? "Disable" : "Enable"} Broadcast
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

// Submission type enum
const SubmissionType = {
  PDF: "pdf",
  XLSX: "xlsx",
  EXCEL: "excel",
  DOCX: "docx",
  IMAGE: "image",
  PPTX: "pptx",
} as const;

type SubmissionType = (typeof SubmissionType)[keyof typeof SubmissionType];

interface DocumentRow {
  id: number;
  documentName: string;
  deadline: string;
  templateFile: File | null;
  submissionType: SubmissionType;
  isMultiple: boolean;
  isBroadcast: boolean;
  documentTypeId: number;
}

interface LinkRow {
  id: number;
  linkName: string;
  urlPrefix?: string | undefined;
  totalProjects?: number;
  submittedProjects?: number;
  pendingProjects?: number;
  completionPercentage?: number;
}

interface AddLinkRow {
  isAddRow: true;
}

interface LinkType {
  id: number;
  name: string;
}

interface DocumentUploadProps {
  batchTitle?: string;
  batchId?: string;
  initialDocuments?: DocumentRow[];
  initialLinks?: LinkRow[];
  onDocumentChange?: (documents: DocumentRow[]) => void;
  onLinksChange?: (links: LinkRow[]) => void;
  defaultOpen?: boolean;
}

export default function DocumentUpload({
  batchTitle = "Batch Requirements",
  batchId: propBatchId,
  initialDocuments = [],
  initialLinks = [],
  onDocumentChange,
  onLinksChange,
  defaultOpen = false,
}: DocumentUploadProps) {
  // Use batchId from props, or fallback to URL params
  const { id: urlBatchId } = useParams<{ id: string }>();
  const batchId = propBatchId || urlBatchId;

  // (defaultLinkTypes removed, not used)
  const [documentRows, setDocumentRows] =
    useState<DocumentRow[]>(initialDocuments);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{
    documentName: string;
    deadline: string;
  } | null>(null);

  const [linkRows, setLinkRows] = useState<LinkRow[]>(initialLinks);
  // Add Link Record State
  const [showAddLinkRecord, setShowAddLinkRecord] = useState(false);
  const [selectedLinkTypeId, setSelectedLinkTypeId] = useState<number | null>(
    null,
  );
  const [linkTypes, setLinkTypes] = useState<LinkType[]>([]);

  // Compose the data for the table, adding the add-row if needed
  const linkTableRows: (LinkRow | AddLinkRow)[] = showAddLinkRecord
    ? [...linkRows, { isAddRow: true }]
    : linkRows;

  // Fetch link types from backend on mount
  useEffect(() => {
    async function fetchLinkTypes() {
      try {
        const response = await axios.get(
          "https://localhost:7224/api/Links/types",
        );
        if (
          response.data &&
          response.data.succeeded &&
          Array.isArray(response.data.data)
        ) {
          setLinkTypes(response.data.data);
        }
      } catch (err) {
        // fallback to default types if needed
        setLinkTypes([
          { id: 1, name: "GitHub Repository" },
          { id: 2, name: "Deployment Link" },
          { id: 3, name: "Figma Design" },
          { id: 4, name: "Documentation" },
        ]);
      }
    }
    fetchLinkTypes();
  }, []);
  const [showAddLinkTypeModal, setShowAddLinkTypeModal] = useState(false);
  const [newLinkTypeName, setNewLinkTypeName] = useState("");

  // Document type management states
  const [showAddDocumentTypeModal, setShowAddDocumentTypeModal] =
    useState(false);
  const [showEditDocumentTypesModal, setShowEditDocumentTypesModal] =
    useState(false);
  const [newDocumentTypeName, setNewDocumentTypeName] = useState("");
  const [newDocumentTypeTemplate, setNewDocumentTypeTemplate] =
    useState<File | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [editingDocumentTypeId, setEditingDocumentTypeId] = useState<
    number | null
  >(null);

  // Add document modal states
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<
    number | null
  >(null);
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [isAddingDocumentType, setIsAddingDocumentType] = useState(false);

  // Helper function to construct proper file URL
  const getFileUrl = (link: string) => {
    if (!link) return "";

    // If link is already a full URL (http/https), use as-is
    // This handles Supabase URLs and other external URLs
    if (link.startsWith("http://") || link.startsWith("https://")) {
      return link;
    }

    // If link starts with '/', remove it to avoid double slashes
    const cleanLink = link.startsWith("/") ? link.substring(1) : link;

    // Construct full URL with base API URL for relative paths
    return `https://localhost:7224/${cleanLink}`;
  };

  // Helper function to fetch document types
  const fetchDocumentTypes = async () => {
    try {
      const types = await getDocumentTypes();
      console.log("Document types from API:", types);
      if (types && types.length > 0) {
        console.log("Sample document type links:");
        types.forEach((type, index) => {
          console.log(`  ${index + 1}. ${type.name}: ${type.link}`);
        });
      }
      setDocumentTypes(types || []);
    } catch (error) {
      console.error("Failed to fetch document types:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load document types",
        color: "red",
      });
    }
  };

  // Fetch document types on component mount
  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  // Link editing states
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [editLinkDraft, setEditLinkDraft] = useState<{
    linkName: string;
  } | null>(null);

  const [accordionOpen, setAccordionOpen] = useState(defaultOpen || false);
  const [activeTab, setActiveTab] = useState<"documents" | "links">(
    "documents",
  );

  // Mock data for fallback
  const mockDocuments: DocumentRow[] = [
    {
      id: 1,
      documentName: "BRD",
      deadline: "2025-11-15",
      templateFile: null,
      submissionType: SubmissionType.PDF,
      isMultiple: false,
      isBroadcast: false,
      documentTypeId: 1,
    },
    {
      id: 2,
      documentName: "UAT",
      deadline: "2025-11-20",
      templateFile: null,
      submissionType: SubmissionType.XLSX,
      isMultiple: true,
      isBroadcast: false,
      documentTypeId: 2,
    },
    {
      id: 3,
      documentName: "Sprint Tracker",
      deadline: "2025-11-25",
      templateFile: null,
      submissionType: SubmissionType.EXCEL,
      isMultiple: false,
      isBroadcast: true,
      documentTypeId: 3,
    },
  ];

  const mockLinks: LinkRow[] = [
    {
      id: 1,
      linkName: "GitHub Repository",
      totalProjects: 0,
      submittedProjects: 0,
      pendingProjects: 0,
      completionPercentage: 0,
    },
    {
      id: 2,
      linkName: "Deployment Link",
      totalProjects: 0,
      submittedProjects: 0,
      pendingProjects: 0,
      completionPercentage: 0,
    },
  ];

  // Map API data to component format
  const mapDocumentRequirementsToRows = (
    apiDocs: DocumentRequirementType[],
  ): DocumentRow[] => {
    return apiDocs.map((doc, index) => ({
      id: index + 1, // Use index since API doesn't provide unique ID
      documentName: doc.documentTypeName,
      deadline: doc.dueDate.split("T")[0], // Store in YYYY-MM-DD format internally, display as DD-MM-YYYY
      templateFile: null,
      submissionType: SubmissionType.PDF, // Default to PDF, can be enhanced later
      isMultiple: false, // Default values since not provided in API
      isBroadcast: false, // Default values since not provided in API
      documentTypeId: doc.documentTypeId,
    }));
  };

  const mapApiLinksToRows = (apiLinks: BatchLinkType[]): LinkRow[] => {
    if (!apiLinks || apiLinks.length === 0) return mockLinks;
    return apiLinks.map((link) => ({
      id: link.linkTypeId,
      linkName: link.linkTypeName,
      totalProjects: link.totalProjects,
      submittedProjects: link.submittedProjects,
      pendingProjects: link.pendingProjects,
      completionPercentage: link.completionPercentage,
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    // Fetch document requirements
    if (batchId) {
      getDocumentRequirements(batchId)
        .then((docs) => {
          if (docs && Array.isArray(docs)) {
            setDocumentRows(mapDocumentRequirementsToRows(docs));
          } else {
            setDocumentRows(mockDocuments);
          }
        })
        .catch(() => setDocumentRows(mockDocuments));
    } else {
      setDocumentRows(mockDocuments);
    }

    // Fetch batch links using the new API
    if (batchId) {
      getBatchLinks(batchId)
        .then((links) => {
          if (links) {
            setLinkRows(mapApiLinksToRows(links));
          } else {
            setLinkRows(mockLinks);
          }
        })
        .catch(() => setLinkRows(mockLinks));
    } else {
      setLinkRows(mockLinks);
    }
  }, [batchId]);

  const updateLinks = (newLinks: LinkRow[]) => {
    setLinkRows(newLinks);
    onLinksChange?.(newLinks);
  };

  const handleAddLinkRecord = () => {
    setShowAddLinkRecord(true);
    setSelectedLinkTypeId(null);
  };
  const handleSaveAddLinkRecord = async () => {
    console.log(
      "Save clicked - selectedLinkTypeId:",
      selectedLinkTypeId,
      "batchId:",
      batchId,
    );
    if (!selectedLinkTypeId || !batchId) {
      console.log("Save blocked - missing selectedLinkTypeId or batchId");
      notifications.show({
        title: "Error",
        message: "Please select a link type and ensure batch ID is available.",
        color: "red",
      });
      return;
    }
    try {
      const url = "https://localhost:7224/api/Links/assign-to-batch";
      const payload = {
        batchId: Number(batchId),
        linkTypeId: selectedLinkTypeId,
      };
      console.log("Making API call to:", url);
      console.log("With payload:", payload);
      console.log("Using method: PUT");

      const response = await axios.put(url, payload);
      console.log("Raw API Response:", response);
      console.log("API Response Data:", response.data);
      console.log("Response status:", response.status);
      console.log("Response succeeded:", response.data?.succeeded);

      if (response.data && response.data.succeeded) {
        const linkType = linkTypes.find((lt) => lt.id === selectedLinkTypeId);
        if (linkType) {
          const newLink: LinkRow = {
            id: Date.now(),
            linkName: linkType.name,
          };
          updateLinks([...linkRows, newLink]);
        }
        setShowAddLinkRecord(false);
        setSelectedLinkTypeId(null);
        notifications.show({
          title: "Success",
          message: `Link type assigned to batch successfully`,
          color: "green",
        });
      } else {
        console.log("API call succeeded but response.data.succeeded is false");
        notifications.show({
          title: "Error",
          message: response.data?.message || "Failed to assign link type.",
          color: "red",
        });
      }
    } catch (err) {
      console.error("API call failed with error:", err);
      if (axios.isAxiosError(err)) {
        console.log("Error response:", err.response?.data);
        console.log("Error status:", err.response?.status);
      }
      notifications.show({
        title: "Error",
        message: `Failed to assign link type. ${err instanceof Error ? err.message : "Unknown error"}`,
        color: "red",
      });
    }
  };

  const handleAddLinkType = async () => {
    if (newLinkTypeName.trim()) {
      try {
        const response = await axios.post(
          "https://localhost:7224/api/Links/types",
          {
            name: newLinkTypeName.trim(),
          },
        );
        if (response.data && response.data.succeeded && response.data.data) {
          const newLinkType: LinkType = {
            id: response.data.data.id,
            name: response.data.data.name,
          };
          setLinkTypes([...linkTypes, newLinkType]);
          setNewLinkTypeName("");
          setShowAddLinkTypeModal(false);
          notifications.show({
            title: "Success",
            message: `Link type "${newLinkTypeName}" added successfully`,
            color: "green",
          });
        } else {
          notifications.show({
            title: "Error",
            message: response.data?.message || "Failed to add link type.",
            color: "red",
          });
        }
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Failed to add link type.",
          color: "red",
        });
      }
    }
  };

  const handleDeleteLink = (id: number) => {
    const updatedLinks = linkRows.filter((link) => link.id !== id);
    updateLinks(updatedLinks);
    notifications.show({
      title: "Deleted",
      message: "Link deleted",
      color: "red",
    });
  };

  // Link editing functions
  const handleEditLink = (id: number) => {
    const link = linkRows.find((l) => l.id === id);
    if (link) {
      setEditingLinkId(id);
      setEditLinkDraft({ linkName: link.linkName });
    }
  };

  const handleSaveLinkEdit = () => {
    if (editingLinkId && editLinkDraft) {
      const updatedLinks = linkRows.map((link) =>
        link.id === editingLinkId
          ? { ...link, linkName: editLinkDraft.linkName }
          : link,
      );
      updateLinks(updatedLinks);
      setEditingLinkId(null);
      setEditLinkDraft(null);
      notifications.show({
        title: "Updated",
        message: "Link updated successfully",
        color: "green",
      });
    }
  };

  // Document type management functions
  const handleAddDocumentType = async () => {
    if (!newDocumentTypeName.trim()) {
      notifications.show({
        title: "Error",
        message: "Document type name is required",
        color: "red",
      });
      return;
    }

    setIsAddingDocumentType(true);
    try {
      const documentTypeData: CreateDocumentTypeRequest = {
        name: newDocumentTypeName.trim(),
        template: newDocumentTypeTemplate || undefined,
      };

      console.log("About to create document type with:", {
        name: documentTypeData.name,
        hasTemplate: !!documentTypeData.template,
        templateFile: documentTypeData.template,
        templateName: documentTypeData.template?.name,
        templateSize: documentTypeData.template?.size,
      });

      const newDocumentType = await createDocumentType(documentTypeData);

      if (newDocumentType) {
        // Refresh document types list from server to ensure consistency
        await fetchDocumentTypes();

        // Reset form
        setNewDocumentTypeName("");
        setNewDocumentTypeTemplate(null);
        setShowAddDocumentTypeModal(false);

        notifications.show({
          title: "Success",
          message: `Document type "${newDocumentType.name}" added successfully`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to create document type",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error creating document type:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create document type. Please try again.",
        color: "red",
      });
    } finally {
      setIsAddingDocumentType(false);
    }
  };

  const handleUpdateDocumentType = async (
    id: number,
    name: string,
    template: File | null,
  ) => {
    try {
      const updateData: UpdateDocumentTypeRequest = {
        name: name.trim(),
        template: template || undefined,
      };

      const updatedDocumentType = await updateDocumentType(id, updateData);

      if (updatedDocumentType) {
        // Refresh document types list from server to ensure consistency
        await fetchDocumentTypes();

        setEditingDocumentTypeId(null);

        notifications.show({
          title: "Updated",
          message: `Document type "${updatedDocumentType.name}" updated successfully`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to update document type",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error updating document type:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update document type. Please try again.",
        color: "red",
      });
    }
  };

  const handleDeleteDocumentType = (id: number) => {
    const updatedTypes = documentTypes.filter((type) => type.id !== id);
    setDocumentTypes(updatedTypes);
    notifications.show({
      title: "Deleted",
      message: "Document type deleted successfully",
      color: "red",
    });
  };

  const handleAddDocumentRequirement = () => {
    // This function will add a document requirement for the batch
    handleAddDocument(); // Reuse existing add document functionality
  };

  // Columns for Links
  const linkColumns: ColumnDef<LinkRow | AddLinkRow>[] = [
    {
      key: "linkName",
      header: "Link Type",
      width: "25%",
      render: (_v, row) => {
        if ((row as any).isAddRow) {
          return (
            <select
              value={selectedLinkTypeId ?? ""}
              onChange={(e) => setSelectedLinkTypeId(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
              style={{ minWidth: 100, maxWidth: 180 }}
            >
              <option value="" disabled>
                Select Link Type
              </option>
              {linkTypes
                .filter((lt) => !linkRows.some((lr) => lr.linkName === lt.name))
                .map((lt) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name}
                  </option>
                ))}
            </select>
          );
        }

        const linkRow = row as LinkRow;
        if (editingLinkId === linkRow.id) {
          return (
            <input
              type="text"
              value={editLinkDraft?.linkName ?? linkRow.linkName}
              onChange={(e) => setEditLinkDraft({ linkName: e.target.value })}
              className="px-2 py-1 border border-gray-300 rounded text-sm w-full"
              placeholder="Enter link type name"
            />
          );
        }

        return (
          <span
            className="font-medium truncate block max-w-[200px]"
            title={linkRow.linkName}
          >
            {linkRow.linkName}
          </span>
        );
      },
    },
    {
      key: "totalProjects",
      header: "Total",
      width: "12%",
      align: "center",
      render: (_v, row) => {
        if ((row as any).isAddRow) return null;
        return <span>{(row as LinkRow).totalProjects || 0}</span>;
      },
    },
    {
      key: "submittedProjects",
      header: "Submitted",
      width: "12%",
      align: "center",
      render: (_v, row) => {
        if ((row as any).isAddRow) return null;
        return (
          <span className="text-green-600 font-medium">
            {(row as LinkRow).submittedProjects || 0}
          </span>
        );
      },
    },
    {
      key: "pendingProjects",
      header: "Pending",
      width: "12%",
      align: "center",
      render: (_v, row) => {
        if ((row as any).isAddRow) return null;
        return (
          <span className="text-orange-600 font-medium">
            {(row as LinkRow).pendingProjects || 0}
          </span>
        );
      },
    },
    {
      key: "completionPercentage",
      header: "Completion",
      width: "15%",
      align: "center",
      render: (_v, row) => {
        if ((row as any).isAddRow) return null;
        const percentage = (row as LinkRow).completionPercentage || 0;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{percentage}%</span>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "24%",
      render: (_v, row) => {
        if ((row as any).isAddRow) {
          return (
            <div className="flex gap-2 justify-center">
              <Button
                variant="default"
                className="!bg-blue-600 hover:!bg-blue-700 !text-white font-medium px-3 py-1 rounded-md text-xs"
                onClick={handleSaveAddLinkRecord}
                disabled={!selectedLinkTypeId}
              >
                Save
              </Button>
              <Button
                variant="default"
                className="!bg-gray-400 hover:!bg-gray-500 !text-white font-medium px-3 py-1 rounded-md text-xs"
                onClick={() => {
                  setShowAddLinkRecord(false);
                  setSelectedLinkTypeId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          );
        }

        const linkRow = row as LinkRow;
        if (editingLinkId === linkRow.id) {
          return (
            <div className="flex gap-2 justify-center">
              <button
                className="px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium hover:bg-green-50 rounded transition-colors"
                onClick={handleSaveLinkEdit}
                type="button"
              >
                Save
              </button>
              <button
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded transition-colors"
                onClick={() => {
                  setEditingLinkId(null);
                  setEditLinkDraft(null);
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          );
        }

        return (
          <div className="flex gap-1 justify-center">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => handleEditLink(linkRow.id)}
              title="Edit"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => handleDeleteLink(linkRow.id)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        );
      },
    },
  ];

  const updateDocuments = (newDocuments: DocumentRow[]) => {
    setDocumentRows(newDocuments);
    onDocumentChange?.(newDocuments);
  };

  // State for new document type selection

  const handleAddDocument = () => {
    setShowAddDocumentModal(true);
  };

  const handleCreateDocument = async () => {
    if (selectedDocumentTypeId && selectedDeadline && batchId) {
      try {
        const requirementData: CreateDocumentRequirementRequest = {
          documentTypeId: selectedDocumentTypeId,
          batchId: parseInt(batchId),
          dueDate: new Date(selectedDeadline).toISOString(),
        };

        const result = await createDocumentRequirement(requirementData);

        if (result) {
          // Refresh the document list
          const docs = await getDocumentRequirements(batchId);
          if (docs && Array.isArray(docs)) {
            setDocumentRows(mapDocumentRequirementsToRows(docs));
          }

          setShowAddDocumentModal(false);
          setSelectedDocumentTypeId(null);
          setSelectedDeadline("");
          notifications.show({
            title: "Success",
            message: "Document requirement added successfully",
            color: "green",
          });
        }
      } catch (error) {
        console.error("Error creating document requirement:", error);
        notifications.show({
          title: "Error",
          message: "Failed to add document requirement",
          color: "red",
        });
      }
    }
  };

  const handleDocumentNameChange = (newName: string) => {
    setEditDraft((draft) =>
      draft ? { ...draft, documentName: newName } : draft,
    );
  };

  const handleDeadlineChange = (newDeadline: string) => {
    setEditDraft((draft) =>
      draft ? { ...draft, deadline: newDeadline } : draft,
    );
  };

  const handleDeleteRow = async (id: number) => {
    try {
      const documentToDelete = documentRows.find((doc) => doc.id === id);
      if (!documentToDelete || !batchId) {
        notifications.show({
          title: "Error",
          message: "Cannot delete document requirement",
          color: "red",
        });
        return;
      }

      const response = await deleteDocumentRequirement(
        documentToDelete.documentTypeId,
        parseInt(batchId),
      );

      if (response && response.succeeded) {
        // Refresh the document list
        const docs = await getDocumentRequirements(batchId);
        if (docs && Array.isArray(docs)) {
          setDocumentRows(mapDocumentRequirementsToRows(docs));
        }

        notifications.show({
          title: "Deleted",
          message:
            response.message || "Document requirement deleted successfully",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to delete document requirement",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error deleting document requirement:", error);
      notifications.show({
        title: "Error",
        message: "Failed to delete document requirement",
        color: "red",
      });
    }
  };

  const handleToggleMultiple = (id: number) => {
    const updatedDocs = documentRows.map((doc) =>
      doc.id === id ? { ...doc, isMultiple: !doc.isMultiple } : doc,
    );
    updateDocuments(updatedDocs);
  };

  const handleToggleBroadcast = (id: number) => {
    const updatedDocs = documentRows.map((doc) =>
      doc.id === id ? { ...doc, isBroadcast: !doc.isBroadcast } : doc,
    );
    updateDocuments(updatedDocs);
  };

  const handleSaveEdit = () => {
    if (editingRowId && editDraft) {
      const updatedDocs = documentRows.map((doc) =>
        doc.id === editingRowId
          ? {
              ...doc,
              documentName: editDraft.documentName,
              deadline: editDraft.deadline,
            }
          : doc,
      );
      updateDocuments(updatedDocs);
      setEditingRowId(null);
      setEditDraft(null);
      notifications.show({
        title: "Saved",
        message: "Document updated successfully",
        color: "green",
      });
    }
  };

  const documentColumns: ColumnDef<DocumentRow>[] = [
    {
      key: "documentName",
      header: "Name",
      sortable: true,
      width: "35%",
      render: (_, row) =>
        editingRowId === row.id ? (
          <select
            value={editDraft?.documentName ?? row.documentName}
            onChange={(e) => handleDocumentNameChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">Select document type...</option>
            {documentTypes.map((docType) => (
              <option key={docType.id} value={docType.name}>
                {docType.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2">
            <span
              className="truncate block max-w-[200px]"
              title={row.documentName}
            >
              {row.documentName}
            </span>
            {row.isMultiple && (
              <span title="Multiple upload enabled">
                <Layers className="w-4 h-4 text-blue-600" />
              </span>
            )}
            {row.isBroadcast && (
              <span title="Broadcast enabled">
                <Send className="w-4 h-4 text-teal-600" />
              </span>
            )}
          </div>
        ),
    },
    {
      key: "submissionType",
      header: "Type",
      sortable: true,
      width: "15%",
      render: (_, row) => (
        <select
          value={row.submissionType}
          onChange={(e) => {
            e.stopPropagation();
            const updatedDocs = documentRows.map((doc) =>
              doc.id === row.id
                ? { ...doc, submissionType: e.target.value as SubmissionType }
                : doc,
            );
            updateDocuments(updatedDocs);
          }}
          className="px-2 py-1 rounded-md border border-gray-300 text-xs font-medium bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {Object.values(SubmissionType).map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      sortable: true,
      width: "30%",
      render: (_, row) =>
        editingRowId === row.id ? (
          <input
            type="date"
            value={formatDateToInputValue(editDraft?.deadline ?? row.deadline)}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span>
            {row.deadline ? formatDateToDDMMYYYY(row.deadline) : "No deadline"}
          </span>
        ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "20%",
      render: (_value, row) =>
        editingRowId === row.id ? (
          <div className="flex gap-2 justify-center">
            <button
              className="px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium hover:bg-green-50 rounded transition-colors"
              onClick={handleSaveEdit}
              type="button"
            >
              Save
            </button>
            <button
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded transition-colors"
              onClick={() => {
                setEditingRowId(null);
                setEditDraft(null);
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <DropdownMenu
            row={row}
            setEditingRowId={setEditingRowId}
            setEditDraft={setEditDraft}
            handleDeleteRow={handleDeleteRow}
            handleToggleMultiple={handleToggleMultiple}
            handleToggleBroadcast={handleToggleBroadcast}
            notifications={notifications}
          />
        ),
    },
  ];

  return (
    <div className="p-0">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Accordion Header with Add Button */}
        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${
            accordionOpen ? "p-4 pb-0" : "p-4"
          }`}
          onClick={() => setAccordionOpen((v) => !v)}
        >
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 text-lg font-semibold text-[#565E6C] focus:outline-none select-none"
              onClick={(e) => {
                e.stopPropagation();
                setAccordionOpen((v) => !v);
              }}
              aria-expanded={accordionOpen}
              aria-controls="document-accordion-content"
              type="button"
            >
              {batchTitle}
            </button>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {documentRows.length + linkRows.length} item
              {documentRows.length + linkRows.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Add Buttons aligned to right */}
            {accordionOpen && (
              <div className="flex gap-2">
                {activeTab === "documents" ? (
                  <>
                    <Button
                      variant="default"
                      className="bg-blue-600! hover:bg-blue-700! text-white! font-medium px-3 py-2 rounded-md shadow-sm h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddDocumentTypeModal(true);
                      }}
                    >
                      + Add Document Type
                    </Button>
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-md shadow-sm h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditDocumentTypesModal(true);
                      }}
                    >
                      Edit Document Types
                    </Button>
                    <Button
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-md shadow-sm h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddDocumentRequirement();
                      }}
                    >
                      + Add Document Requirement
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="default"
                      className="!bg-blue-600 hover:!bg-blue-700 !text-white font-medium px-3 py-2 rounded-md shadow-sm h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddLinkTypeModal(true);
                      }}
                    >
                      + Add Link Type
                    </Button>
                    <Button
                      variant="default"
                      className="!bg-blue-600 hover:!bg-blue-700 !text-white font-medium px-3 py-2 rounded-md shadow-sm h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddLinkRecord();
                      }}
                    >
                      + Add Link Record
                    </Button>
                  </>
                )}
              </div>
            )}
            {accordionOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
        <div className={accordionOpen ? "px-4 pb-4" : ""}>
          {/* Tabs below header - with spacing */}
          {accordionOpen && (
            <div className="my-4 w-full">
              <div className="flex w-full gap-3 bg-gray-50 rounded-lg">
                {["documents", "links"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as "documents" | "links")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-blue-50 text-blue-600 my-1"
                        : "text-gray-600 hover:bg-gray-100 my-1"
                    }`}
                  >
                    {tab === "documents" ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Link className="w-4 h-4" />
                    )}
                    <span className="capitalize">{tab}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Accordion Content with Tabs */}
          {accordionOpen && (
            <div
              id="document-accordion-content"
              className="space-y-6 border-t border-gray-200 pt-4"
            >
              {activeTab === "documents" && (
                <>
                  <DataTable
                    columns={documentColumns}
                    data={documentRows}
                    showHeaderSection={true}
                    headerTitle="Documents"
                    enableSearch={true}
                    enablePagination={true}
                    pageSize={5}
                    pageSizeOptions={[5, 10, 25]}
                    highlightOnHover={true}
                    withBorder={true}
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
                </>
              )}
              {activeTab === "links" && (
                <>
                  <DataTable
                    columns={linkColumns}
                    data={linkTableRows}
                    showHeaderSection={true}
                    headerTitle="Links"
                    enableSearch={true}
                    enablePagination={true}
                    pageSize={5}
                    pageSizeOptions={[5, 10, 25]}
                    highlightOnHover={true}
                    withBorder={true}
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
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Link Type Modal */}
      {showAddLinkTypeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Link Type</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Link Type Name</label>
              <input
                type="text"
                value={newLinkTypeName}
                onChange={(e) => setNewLinkTypeName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                placeholder="Enter link type name (e.g., Documentation)"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddLinkType();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="default"
                className="!bg-gray-400 hover:!bg-gray-500 !text-white font-medium px-4 py-2 rounded-md"
                onClick={() => {
                  setShowAddLinkTypeModal(false);
                  setNewLinkTypeName("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="!bg-blue-600 hover:!bg-blue-700 !text-white font-medium px-4 py-2 rounded-md"
                onClick={handleAddLinkType}
                disabled={!newLinkTypeName.trim()}
              >
                Add Link Type
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Type Modal */}
      {showAddDocumentTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add New Document Type
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type Name
                </label>
                <input
                  type="text"
                  value={newDocumentTypeName}
                  onChange={(e) => setNewDocumentTypeName(e.target.value)}
                  placeholder="Enter document type name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newDocumentTypeName.trim()) {
                      handleAddDocumentType();
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewDocumentTypeTemplate(e.target.files?.[0] || null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                {newDocumentTypeTemplate && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected:{" "}
                    <span
                      className="truncate inline-block max-w-[200px]"
                      title={newDocumentTypeTemplate.name}
                    >
                      {newDocumentTypeTemplate.name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                className="bg-gray-400! hover:bg-gray-500! text-white! font-medium px-4 py-2 rounded-md"
                onClick={() => {
                  setShowAddDocumentTypeModal(false);
                  setNewDocumentTypeName("");
                  setNewDocumentTypeTemplate(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600! hover:bg-blue-700! text-white! font-medium px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddDocumentType}
                disabled={!newDocumentTypeName.trim() || isAddingDocumentType}
              >
                {isAddingDocumentType ? "Adding..." : "Add Document Type"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Types Modal */}
      {showEditDocumentTypesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[75vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Document Types</h3>
              <button
                className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => {
                  setShowEditDocumentTypesModal(false);
                  setEditingDocumentTypeId(null);
                }}
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[55vh] pr-2">
              <div className="space-y-3">
                {documentTypes.map((docType) => (
                  <div
                    key={docType.id}
                    className="p-3 border border-gray-200 rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {editingDocumentTypeId === docType.id ? (
                          <input
                            type="text"
                            defaultValue={docType.name}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateDocumentType(
                                  docType.id,
                                  (e.target as HTMLInputElement).value,
                                  docType.template || null,
                                );
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <div>
                            <div
                              className="font-medium text-gray-900 truncate block max-w-[200px]"
                              title={docType.name}
                            >
                              {docType.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Template:{" "}
                              {docType.link ? "Available" : "No template"}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 ml-4">
                        {editingDocumentTypeId === docType.id ? (
                          <>
                            <button
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => {
                                const input = document.querySelector(
                                  `input[defaultValue="${docType.name}"]`,
                                ) as HTMLInputElement;
                                handleUpdateDocumentType(
                                  docType.id,
                                  input?.value || docType.name,
                                  docType.template || null,
                                );
                              }}
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setEditingDocumentTypeId(null)}
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {docType.link && (
                              <button
                                className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                onClick={() => {
                                  const fullUrl = getFileUrl(docType.link);
                                  window.open(fullUrl, "_blank");
                                }}
                                title="Download Template"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() =>
                                setEditingDocumentTypeId(docType.id)
                              }
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() =>
                                handleDeleteDocumentType(docType.id)
                              }
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Template management section */}
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <input
                        type="file"
                        id={`template-${docType.id}`}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleUpdateDocumentType(
                            docType.id,
                            docType.name,
                            file,
                          );
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Template management:
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded"
                            onClick={() =>
                              document
                                .getElementById(`template-${docType.id}`)
                                ?.click()
                            }
                          >
                            Change Template
                          </button>
                          {(docType.link || docType.template) && (
                            <button
                              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded"
                              onClick={() =>
                                handleUpdateDocumentType(
                                  docType.id,
                                  docType.name,
                                  null,
                                )
                              }
                            >
                              Remove Template
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4 pt-3 border-t border-gray-200">
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md text-sm"
                  onClick={() => {
                    setShowEditDocumentTypesModal(false);
                    setEditingDocumentTypeId(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showAddDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add Document Requirement
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Document Type
              </label>
              <select
                value={selectedDocumentTypeId || ""}
                onChange={(e) =>
                  setSelectedDocumentTypeId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a document type...</option>
                {documentTypes
                  .filter(
                    (docType) =>
                      !documentRows.some(
                        (doc) => doc.documentTypeId === docType.id,
                      ),
                  )
                  .map((docType) => (
                    <option key={docType.id} value={docType.id}>
                      {docType.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={selectedDeadline}
                onChange={(e) => setSelectedDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split("T")[0]}
              />
              {selectedDeadline && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {formatDateToDDMMYYYY(selectedDeadline)}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-md"
                onClick={() => {
                  setShowAddDocumentModal(false);
                  setSelectedDocumentTypeId(null);
                  setSelectedDeadline("");
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
                onClick={handleCreateDocument}
                disabled={!selectedDocumentTypeId || !selectedDeadline}
              >
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
