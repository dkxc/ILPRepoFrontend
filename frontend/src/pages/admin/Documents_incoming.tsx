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
      // Position the menu below or above the button depending on viewport
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight = 180; // estimate, adjust if needed
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const shouldDropUp = spaceBelow < menuHeight && spaceAbove > menuHeight;
        setDropUp(shouldDropUp);
        setMenuStyle({
          position: "absolute",
          top: shouldDropUp
            ? rect.top + window.scrollY - menuHeight - 4
            : rect.bottom + window.scrollY + 4,
          left: rect.right - 176 + window.scrollX, // 176px = menu width
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
            className={`w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 flex flex-col ${dropUp ? "animate-dropup" : ""}`}
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
import { notifications } from "@mantine/notifications";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import Button from "../../features/ui/Button";

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
  batchTitle = "Documents Requirements",
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

  // Links state
  const [linkRows, setLinkRows] = useState<LinkRow[]>(initialLinks);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [linkEditDraft, setLinkEditDraft] = useState<{
    linkName: string;
  } | null>(null);
  // Update parent on links change
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
          {editingLinkId === row.id ? (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // Save edit
                  const updatedLinks = linkRows.map((l) =>
                    l.id === row.id ? { ...l, ...linkEditDraft! } : l,
                  );
                  updateLinks(updatedLinks);
                  setEditingLinkId(null);
                  setLinkEditDraft(null);
                }}
              >
                Save
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-gray-400 hover:bg-gray-500 text-white"
                onClick={() => {
                  setEditingLinkId(null);
                  setLinkEditDraft(null);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => {
                  setEditingLinkId(row.id);
                  setLinkEditDraft({ linkName: row.linkName });
                }}
              >
                Edit
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDeleteLink(row.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Update parent component when documents change
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
              <Button
                variant="default"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleDeleteTemplate(row.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
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
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    document
                      .getElementById(`template-upload-${row.id}`)
                      ?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Template
                </Button>
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

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState(true);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
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
        <Button
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleAddDocument}
          type="button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Document
        </Button>
      </div>
      <div
        id="document-accordion-content"
        className={accordionOpen ? "block" : "hidden"}
      >
        <DataTable columns={documentColumns} data={documentRows} />
        {/* Links Table Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Required Links</h3>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddLink}
              type="button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>
          <DataTable columns={linkColumns} data={linkRows} />
        </div>
      </div>
    </div>
  );
}
