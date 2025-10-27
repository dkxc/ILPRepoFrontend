import { useState, useRef, useEffect } from "react";
import Button from "../../ui/Button";
import { X, FileText, Upload, Bell, Download, ChevronDown } from "lucide-react";
import DocumentSubmissionModal from "../../ui/DocumentUpload";
import DataTable from "../Table";
import type { ColumnDef } from "../Table";

interface Document {
  id: string;
  name: string;
  filename: string;
  status: "Submitted" | "Not Submitted";
}

interface ProjectDocumentsProps {
  initialDocuments?: Document[];
  canUpload?: boolean;
  canNotify?: boolean;
}

const dummyDocuments: Document[] = [
  {
    id: "1",
    name: "Project Plan",
    filename: "project-plan.pdf",
    status: "Submitted",
  },
  {
    id: "2",
    name: "Design Mockup",
    filename: "design-mockup.png",
    status: "Submitted",
  },
  { id: "3", name: "Requirements", filename: "", status: "Not Submitted" },
  {
    id: "4",
    name: "Sprint Report",
    filename: "sprint-report.xlsx",
    status: "Submitted",
  },
  { id: "5", name: "Presentation", filename: "", status: "Not Submitted" },
];

function ProjectDocuments({
  initialDocuments = dummyDocuments,
  canUpload = true,
  canNotify = false,
}: ProjectDocumentsProps) {
  const [documents] = useState<Document[]>(
    initialDocuments.length > 0 ? initialDocuments : [],
  );
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifySubject, setNotifySubject] = useState("");
  const [showStepper, setShowStepper] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique document types
  const documentTypes = [
    "All Types",
    ...Array.from(new Set(documents.map((doc) => doc.name))),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter documents based on search query and selected type
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All Types" || doc.name === selectedType;
    return matchesSearch && matchesType;
  });

  // Filter types based on search query
  const filteredTypes = documentTypes.filter((type) =>
    type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = (doc: Document) => {
    // Handle download logic here
    console.log("Downloading:", doc.filename);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const columns: ColumnDef<Document>[] = [
    {
      key: "name",
      header: "Document Type",
      width: "35%",
      render: (value, _row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-gray-900 text-xs">{value}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "20%",
      render: (value) => (
        <span
          className={
            value === "Submitted"
              ? "text-green-600 font-semibold text-xs"
              : "text-red-500 font-semibold text-xs"
          }
        >
          {value}
        </span>
      ),
    },
    {
      key: "filename",
      header: "Filename",
      width: "35%",
      render: (value, row) =>
        row.status === "Submitted" ? (
          <span className="text-gray-600 text-xs truncate">{value}</span>
        ) : (
          <span className="text-gray-400 italic text-xs">—</span>
        ),
    },
    {
      key: "id",
      header: "",
      width: "10%",
      align: "right",
      render: (_value, row) =>
        row.status === "Submitted" ? (
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={() => handleDownload(row)}
            title="Download"
          >
            <Download className="h-3.5 w-3.5 text-gray-600" />
          </button>
        ) : null,
    },
  ];

  return (
    <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold flex items-center gap-2 text-gray-700 text-sm">
          <FileText className="h-4 w-4" style={{ color: "#7B7575" }} />
          Project Files
        </h2>
        {canUpload && (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="link"
              className="rounded-full p-2 text-brand hover:bg-brand/10 focus:ring-2 focus:ring-brand/30 transition-colors shadow-none border-none"
              onClick={() => setShowStepper(true)}
              title="Upload Documents"
            >
              <Upload className="h-5 w-5" />
            </Button>
            {canNotify && (
              <Button
                size="icon"
                variant="link"
                className="rounded-full p-2 text-brand hover:bg-brand/10 focus:ring-2 focus:ring-brand/30 transition-colors shadow-none border-none"
                onClick={() => setIsNotifyOpen(true)}
                title="Send Notification"
              >
                <Bell className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Searchable Dropdown Filter */}
      <div className="mb-3 relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder={
              selectedType === "All Types" ? "Search by type..." : selectedType
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full pl-3 pr-9 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
          />
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredTypes.length > 0 ? (
              filteredTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                    selectedType === type
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-400 italic">
                No types found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-[200px]">
        <DataTable
          columns={columns}
          data={filteredDocuments}
          enablePagination={true}
          pageSize={5}
          pageSizeOptions={[5, 10]}
          highlightOnHover={true}
          hideHeader={false}
          onRowClick={(row) => handleDownload(row)}
          emptyState={
            <div className="text-gray-400 italic text-xs py-4 text-center">
              {selectedType !== "All Types" || searchQuery
                ? "No documents match your filter"
                : "No documents uploaded"}
            </div>
          }
          tableStyle={{ fontSize: "0.75rem" }}
        />
      </div>

      {/* Stepper Modal Integration */}
      <DocumentSubmissionModal
        isOpen={showStepper}
        onClose={() => setShowStepper(false)}
        onSubmit={() => {
          setShowStepper(false);
        }}
      />

      {isNotifyOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Message</h3>
              <Button
                variant="link"
                size="icon"
                onClick={() => {
                  setIsNotifyOpen(false);
                  setNotifySubject("");
                  setNotifyMessage("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                value={notifySubject}
                onChange={(e) => setNotifySubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Enter message"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  className="px-4 py-2"
                  onClick={() => {
                    setIsNotifyOpen(false);
                    setNotifySubject("");
                    setNotifyMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="px-4 py-2"
                  onClick={() => {
                    // handle send notification logic here
                    setIsNotifyOpen(false);
                    setNotifySubject("");
                    setNotifyMessage("");
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDocuments;
