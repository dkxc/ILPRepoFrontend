import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { useParams } from "react-router";
import {
  Upload,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Layers,
  Send,
  FileText,
  Link,
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import type { ColumnDef } from "../../ui/Table";
import Button from "../../ui/Button";
import DataTable from "../../ui/Table";
import {
  getDocuments,
  getProjectLinks,
  uploadDocument,
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
  handleDeleteRow: (id: number) => void;
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
            ></button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
              onClick={() => {
                handleDeleteRow(row.id);
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
  isMultiple?: boolean;
  isBroadcast?: boolean;
}

interface LinkRow {
  id: number;
  linkName: string;
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
    },
    {
      id: 2,
      documentName: "UAT",
      deadline: "2025-11-20",
      templateFile: null,
      submissionType: SubmissionType.XLSX,
    },
    {
      id: 3,
      documentName: "Sprint Tracker",
      deadline: "2025-11-25",
      templateFile: null,
      submissionType: SubmissionType.EXCEL,
    },
  ];

  const mockLinks: LinkRow[] = [
    { id: 1, linkName: "GitHub Repository" },
    { id: 2, linkName: "Deployment Link" },
  ];

  // Map API data to component format
  const mapApiDocumentsToRows = (apiDocs: any[]): DocumentRow[] => {
    return apiDocs.map((doc, index) => ({
      id: parseInt(doc.id) || index + 1,
      documentName: doc.name || doc.filename || `Document ${index + 1}`,
      deadline: doc.deadline || new Date().toISOString().split("T")[0],
      templateFile: null,
      submissionType: doc.submissionType || SubmissionType.PDF,
      isMultiple: doc.isMultiple || false,
      isBroadcast: doc.isBroadcast || false,
    }));
  };

  const mapApiLinksToRows = (apiLinks: any): LinkRow[] => {
    if (!apiLinks) return mockLinks;
    return [
      { id: 1, linkName: "GitHub Repository" },
      { id: 2, linkName: "Figma Design" },
    ];
  };

  // Fetch data on component mount
  useEffect(() => {
    // Fetch documents
    getDocuments(batchId)
      .then((docs) => {
        if (docs && Array.isArray(docs)) {
          setDocumentRows(mapApiDocumentsToRows(docs));
        } else {
          setDocumentRows(mockDocuments);
        }
      })
      .catch(() => setDocumentRows(mockDocuments));

    // Fetch project links
    getProjectLinks(batchId)
      .then((links) => {
        if (links) {
          setLinkRows(mapApiLinksToRows(links));
        } else {
          setLinkRows(mockLinks);
        }
      })
      .catch(() => setLinkRows(mockLinks));
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

  // Columns for Links
  const linkColumns: ColumnDef<LinkRow | AddLinkRow>[] = [
    {
      key: "linkName",
      header: "Link Type",
      width: "70%",
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
        return <span>{(row as LinkRow).linkName}</span>;
      },
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "30%",
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
        return (
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => handleDeleteLink((row as LinkRow).id)}
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
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
  const [newDocType] = useState<SubmissionType>(SubmissionType.PDF);

  const handleAddDocument = () => {
    const newDoc: DocumentRow = {
      id: Date.now(),
      documentName: `Document ${documentRows.length + 1}`,
      deadline: new Date().toISOString().split("T")[0],
      templateFile: null,
      submissionType: newDocType,
    };
    updateDocuments([...documentRows, newDoc]);
  };

  const handleTemplateUpload = async (id: number, file: File) => {
    const doc = documentRows.find((d) => d.id === id);
    if (!doc) return;

    try {
      const success = await uploadDocument({
        projectId: batchId || "",
        file,
        type: doc.documentName,
      });

      if (success) {
        const updatedDocs = documentRows.map((d) =>
          d.id === id ? { ...d, templateFile: file } : d,
        );
        updateDocuments(updatedDocs);
        notifications.show({
          title: "Template Uploaded",
          message: `Template uploaded for ${doc.documentName}`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "Upload Failed",
          message: `Failed to upload template for ${doc.documentName}`,
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Upload Error",
        message: `Error uploading template for ${doc.documentName}`,
        color: "red",
      });
    }
  };

  const handleDeleteTemplate = (id: number) => {
    const doc = documentRows.find((d) => d.id === id);
    const updatedDocs = documentRows.map((d) =>
      d.id === id ? { ...d, templateFile: null } : d,
    );
    updateDocuments(updatedDocs);
    notifications.show({
      title: "Template Removed",
      message: `Template removed for ${doc?.documentName}`,
      color: "orange",
    });
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

  const handleDeleteRow = (id: number) => {
    const updatedDocs = documentRows.filter((doc) => doc.id !== id);
    updateDocuments(updatedDocs);
    notifications.show({
      title: "Deleted",
      message: "Document record deleted",
      color: "red",
    });
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
      width: "20%",
      render: (_, row) =>
        editingRowId === row.id ? (
          <input
            type="text"
            value={editDraft?.documentName ?? row.documentName}
            onChange={(e) => handleDocumentNameChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Enter document name"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span>{row.documentName}</span>
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
      width: "25%",
      render: (_, row) =>
        editingRowId === row.id ? (
          <input
            type="date"
            value={editDraft?.deadline ?? row.deadline}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span>{row.deadline || "No deadline"}</span>
        ),
    },
    {
      key: "templateFile",
      header: "Template",
      align: "center",
      width: "30%",
      render: (value, row) => (
        <div className="flex items-center justify-center gap-2">
          {value ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <Download className="w-4 h-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm text-green-700 font-medium">
                    Uploaded
                  </span>
                  <span className="text-xs text-green-600">
                    {(value as File).name}
                  </span>
                </div>
              </div>
              <button
                className="px-3 py-1 inline-flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium text-xs border border-red-300 rounded transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteTemplate(row.id);
                }}
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                id={`template-upload-${row.id}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleTemplateUpload(row.id, file);
                }}
              />
              <label htmlFor={`template-upload-${row.id}`}>
                <button
                  className="px-2 py-1 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-300 rounded"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    document
                      .getElementById(`template-upload-${row.id}`)
                      ?.click();
                  }}
                >
                  <Upload size={16} />
                  Upload
                </button>
              </label>
            </>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "15%",
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
                  <Button
                    variant="default"
                    className="!bg-blue-600 hover:!bg-blue-700 !text-white font-medium px-4 py-2 rounded-md shadow-sm h-auto text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddDocument();
                    }}
                  >
                    + Add Document
                  </Button>
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
    </div>
  );
}
