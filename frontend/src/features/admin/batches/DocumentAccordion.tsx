import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Upload,
  Trash2,
  Download,
  SquarePen,
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

// Types
interface DocumentRow {
  id: number;
  documentName: string;
  deadline: string;
  templateFile: File | null;
  isMultiple?: boolean;
  isBroadcast?: boolean;
}

interface LinkRow {
  id: number;
  linkName: string;
  urlPrefix?: string | undefined;
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
    { id: 1, linkName: "GitHub Repo", urlPrefix: "https://github.com/" },
    { id: 2, linkName: "Deployment Link", urlPrefix: "https://" },
  ],
  onDocumentChange,
  onLinksChange,
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
    urlPrefix: string;
  } | null>(null);

  const [accordionOpen, setAccordionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"documents" | "links">(
    "documents",
  );

  const updateLinks = (newLinks: LinkRow[]) => {
    setLinkRows(newLinks);
    onLinksChange?.(newLinks);
  };

  const handleAddLink = () => {
    const newLink: LinkRow = {
      id: Date.now(),
      linkName: `Link ${linkRows.length + 1}`,
      urlPrefix: "https://",
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

  const handleUrlPrefixChange = (newPrefix: string) => {
    setLinkEditDraft((draft) =>
      draft ? { ...draft, urlPrefix: newPrefix } : draft,
    );
  };

  const handleSaveLinkEdit = () => {
    if (editingLinkId && linkEditDraft) {
      const updatedLinks = linkRows.map((link) => {
        if (link.id === editingLinkId) {
          return {
            ...link,
            linkName: linkEditDraft.linkName,
            urlPrefix: linkEditDraft.urlPrefix ?? link.urlPrefix,
          };
        }
        return link;
      });
      updateLinks(updatedLinks);
      setEditingLinkId(null);
      setLinkEditDraft(null);
      notifications.show({
        title: "Saved",
        message: "Link updated successfully",
        color: "green",
      });
    }
  };

  // Columns for Links
  const linkColumns: ColumnDef<LinkRow>[] = [
    {
      key: "linkName",
      header: "Name",
      width: "40%",
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
      key: "urlPrefix",
      header: "URL Prefix",
      width: "45%",
      render: (_v, row) => {
        console.log(
          "Rendering urlPrefix for row:",
          row,
          "value:",
          row.urlPrefix,
        );
        return editingLinkId === row.id ? (
          <input
            type="text"
            value={linkEditDraft?.urlPrefix ?? row.urlPrefix}
            onChange={(e) => handleUrlPrefixChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="e.g., https://github.com/"
          />
        ) : (
          <span className="text-gray-600 font-mono text-sm">
            {row.urlPrefix}
          </span>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "15%",
      render: (_v, row) =>
        editingLinkId === row.id ? (
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
                setLinkEditDraft(null);
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200"
              onClick={() => {
                setEditingLinkId(row.id);
                setLinkEditDraft({
                  linkName: row.linkName,
                  urlPrefix: row.urlPrefix,
                });
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
          </div>
        ),
    },
  ];

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
                Delete
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
            {/* Add Button aligned to right */}
            {accordionOpen && (
              <Button
                variant="default"
                className="!bg-blue-600 hover:!bg-blue-700 !text-white font-medium px-4 py-2 rounded-md shadow-sm h-auto text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  activeTab === "documents"
                    ? handleAddDocument()
                    : handleAddLink();
                }}
              >
                + Add {activeTab === "documents" ? "Document" : "Link"}
              </Button>
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
                  {/* Debug: Log link data */}
                  {console.log("LinkRows data:", linkRows)}
                  {console.log("LinkColumns:", linkColumns)}
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
    </div>
  );
}
