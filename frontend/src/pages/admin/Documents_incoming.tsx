import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Upload,
  Trash2,
  Download,
  SquarePen,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Layers,
  Send,
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import Button from "../../features/ui/Button";

// DropdownMenu for action column
function DropdownMenu({
  row,
  setEditingRowId,
  setEditDraft,
  handleDeleteRow,
  notifications,
}: {
  row: DocumentRow;
  setEditingRowId: (id: number) => void;
  setEditDraft: (draft: { documentName: string; deadline: string }) => void;
  handleDeleteRow: (id: number) => void;
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
              <SquarePen className="w-4 h-4" /> Edit
            </button>
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
                notifications.show({
                  title: "Multiple Upload",
                  message: "Multiple files upload triggered",
                  color: "blue",
                });
                setOpen(false);
              }}
              type="button"
            >
              <Layers className="w-4 h-4" /> Multiple
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm"
              onClick={() => {
                notifications.show({
                  title: "Broadcast",
                  message: "File broadcasted to all batchmates",
                  color: "teal",
                });
                setOpen(false);
              }}
              type="button"
            >
              <Send className="w-4 h-4" /> Broadcast
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

// Types
interface DocumentRow {
  id: number;
  documentName: string;
  deadline: string;
  templateFile: File | null;
}

interface LinkRow {
  id: number;
  linkName: string;
}

interface DocumentUploadProps {
  batchTitle?: string;
  initialDocuments?: DocumentRow[];
  initialLinks?: LinkRow[];
  onDocumentChange?: (documents: DocumentRow[]) => void;
  onLinksChange?: (links: LinkRow[]) => void;
  defaultOpen?: boolean;
}

export default function DocumentUpload({
  batchTitle = "Document and Link Requirements",
  initialDocuments = [
    { id: 1, documentName: "BRD", deadline: "", templateFile: null },
    { id: 2, documentName: "UAT", deadline: "", templateFile: null },
    { id: 3, documentName: "Sprint Tracker", deadline: "", templateFile: null },
  ],
  initialLinks = [
    { id: 1, linkName: "GitHub Repo" },
    { id: 2, linkName: "Deployment Link" },
  ],
  onDocumentChange,
  onLinksChange,
  defaultOpen = false,
}: DocumentUploadProps) {
  const [documentRows, setDocumentRows] =
    useState<DocumentRow[]>(initialDocuments);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{
    documentName: string;
    deadline: string;
  } | null>(null);

  const [linkRows, setLinkRows] = useState<LinkRow[]>(initialLinks);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [linkEditDraft, setLinkEditDraft] = useState<{
    linkName: string;
  } | null>(null);

  const updateLinks = (newLinks: LinkRow[]) => {
    setLinkRows(newLinks);
    onLinksChange?.(newLinks);
  };

  const handleAddLink = () => {
    const newLink: LinkRow = {
      id: Date.now(),
      linkName: `Link ${linkRows.length + 1}`,
    };
    updateLinks([...linkRows, newLink]);
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

  const handleLinkNameChange = (newName: string) => {
    setLinkEditDraft((draft) =>
      draft ? { ...draft, linkName: newName } : draft,
    );
  };

  // Columns
  const linkColumns: ColumnDef<LinkRow>[] = [
    {
      key: "linkName",
      header: "Link Name",
      width: "85%",
      render: (_v, row) =>
        editingLinkId === row.id ? (
          <input
            type="text"
            value={linkEditDraft?.linkName ?? row.linkName}
            onChange={(e) => handleLinkNameChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Enter link name"
          />
        ) : (
          <span>{row.linkName}</span>
        ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "15%",
      render: (_v, row) => (
        <div className="flex gap-2 justify-center">
          <>
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => {
                setEditingLinkId(row.id);
                setLinkEditDraft({ linkName: row.linkName });
              }}
              title="Edit"
            >
              <SquarePen className="w-5 h-5 text-gray-700" />
            </button>

            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => handleDeleteLink(row.id)}
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </>
        </div>
      ),
    },
  ];

  const [accordionOpen, setAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"documents" | "links">(
    "documents",
  );

  const updateDocuments = (newDocuments: DocumentRow[]) => {
    setDocumentRows(newDocuments);
    onDocumentChange?.(newDocuments);
  };

  const handleAddDocument = () => {
    const newDoc: DocumentRow = {
      id: Date.now(),
      documentName: `Document ${documentRows.length + 1}`,
      deadline: new Date().toISOString().split("T")[0],
      templateFile: null,
    };
    updateDocuments([...documentRows, newDoc]);
  };

  const handleTemplateUpload = (id: number, file: File) => {
    const updatedDocs = documentRows.map((doc) =>
      doc.id === id ? { ...doc, templateFile: file } : doc,
    );
    updateDocuments(updatedDocs);

    notifications.show({
      title: "Template Uploaded",
      message: `Template uploaded for ${documentRows.find((d) => d.id === id)?.documentName}`,
      color: "green",
    });
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

  const documentColumns: ColumnDef<DocumentRow>[] = [
    {
      key: "documentName",
      header: "Document Name",
      sortable: true,
      width: "25%",
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
          <span>{row.documentName}</span>
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
      header: "Template Upload",
      align: "center",
      width: "30%",
      render: (value, row) => (
        <div className="flex items-center justify-center gap-2">
          {value ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <Download className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  {(value as File).name}
                </span>
              </div>
              <button
                className="p-2 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm border border-gray-300 rounded"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleDeleteTemplate(row.id);
                }}
              >
                <Trash2 size={16} />
                Delete Template
              </button>
            </>
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
                  Upload Template
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
      render: (_value, row) => (
        <DropdownMenu
          row={row}
          setEditingRowId={setEditingRowId}
          setEditDraft={setEditDraft}
          handleDeleteRow={handleDeleteRow}
          notifications={notifications}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
        {/* Accordion Header */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-xl font-semibold focus:outline-none select-none"
            onClick={() => setAccordionOpen((v) => !v)}
            aria-expanded={accordionOpen}
            aria-controls="document-accordion-content"
            type="button"
          >
            {accordionOpen ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronUp className="w-6 h-6" />
            )}
            {batchTitle}
          </button>
        </div>

        {/* Tabs below header - Updated styling */}
        {accordionOpen && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex gap-2 bg-gray-50 rounded-lg p-1">
              <button
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 ${
                  activeTab === "documents"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("documents")}
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Documents
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none flex items-center gap-2 ${
                  activeTab === "links"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("links")}
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Links
              </button>
            </div>
          </div>
        )}

        {/* Accordion Content with Tabs */}
        <div
          id="document-accordion-content"
          className={`${accordionOpen ? "block" : "hidden"} space-y-6`}
        >
          {activeTab === "documents" && (
            <>
              <div className="flex justify-end mb-2">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddDocument}
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Document
                </Button>
              </div>
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
                rowStyle={{ fontSize: "16px", height: "56px", lineHeight: "1" }}
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
              <div className="flex justify-end mb-2">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddLink}
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Link
                </Button>
              </div>
              <DataTable
                columns={linkColumns}
                data={linkRows}
                showHeaderSection={true}
                headerTitle="Links"
                enableSearch={true}
                enablePagination={true}
                pageSize={5}
                pageSizeOptions={[5, 10, 25]}
                highlightOnHover={true}
                withBorder={true}
                rowStyle={{ fontSize: "16px", height: "56px", lineHeight: "1" }}
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
      </div>
    </div>
  );
}
