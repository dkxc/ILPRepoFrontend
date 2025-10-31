import { useState, useRef, useEffect } from "react";
import Button from "../../ui/Button";
import { FileText, Upload, Bell, Download, ChevronDown } from "lucide-react";
import DocumentSubmissionModal from "../../ui/DocumentUpload";
import DataTable from "../Table";
import type { ColumnDef } from "../Table";
import type { TeamMember } from "./TeamList";
import SendNotificationModal from "./SendNotification";
import { getDocuments } from "./api";

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
  teamMembers?: TeamMember[];
  isAdmin?: boolean;
  projectId: string;
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
  teamMembers = [],
  isAdmin = false,
  projectId,
}: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const apiData = await getDocuments(projectId);

      if (apiData) {
        setDocuments(apiData);
      } else {
        // Use initialDocuments or dummyDocuments as fallback
        setDocuments(initialDocuments);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [projectId, initialDocuments]);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifySubject, setNotifySubject] = useState("");
  const [showStepper, setShowStepper] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [sendToOutlook, setSendToOutlook] = useState(false);
  const [selectedRecipients, setSelectedRecipients] =
    useState<TeamMember[]>(teamMembers);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedRecipients(teamMembers);
  }, [teamMembers]);

  const documentTypes = [
    "All Types",
    ...Array.from(new Set(documents.map((doc) => doc.name))),
  ];

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

  // ✅ Filter logic
  const visibleDocuments = isAdmin
    ? documents // Admin sees all
    : documents.filter((doc) => doc.status === "Submitted"); // Trainee sees only submitted

  const filteredDocuments = visibleDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "All Types" || doc.name === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredTypes = documentTypes.filter((type) =>
    type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDownload = (doc: Document) => {
    console.log("Downloading:", doc.filename);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleRemoveRecipient = (member: TeamMember) => {
    setSelectedRecipients((prev) => prev.filter((m) => m.mail !== member.mail));
  };

  const handleResetModal = () => {
    setIsNotifyOpen(false);
    setNotifySubject("");
    setNotifyMessage("");
    setSendToOutlook(false);
    setSelectedRecipients(teamMembers);
  };

  // ✅ Dynamic columns
  const columns: ColumnDef<Document>[] = [
    {
      key: "name",
      header: "Document Type",
      width: "30%",
      render: (value) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-gray-900 text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "filename",
      header: "Filename",
      width: "35%",
      render: (value, row) =>
        row.status === "Submitted" ? (
          <span className="text-gray-600 text-sm truncate">{value}</span>
        ) : (
          <span className="text-gray-400 italic text-sm">—</span>
        ),
    },
    // ✅ Only show status column for Admin
    ...(isAdmin
      ? [
          {
            key: "status",
            header: "Status",
            width: "20%",
            render: (value: string) => (
              <span
                className={`text-sm font-medium ${
                  value === "Submitted" ? "text-green-600" : "text-red-500"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]
      : []),
    {
      key: "id",
      header: "Action",
      width: "10%",
      align: "right",
      render: (_value, row) => (
        <button
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          onClick={() => handleDownload(row)}
          title="Download"
        >
          <Download className="h-4 w-4 text-gray-600" />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: "#7B7575" }} />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold flex items-center gap-2 text-[#565E6C]">
          <FileText className="h-5 w-5" style={{ color: "#7B7575" }} />
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
            className="w-full pl-3 pr-9 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
          />
          <ChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {filteredTypes.length > 0 ? (
              filteredTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    selectedType === type
                      ? "bg-brand/10 text-brand font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400 italic">
                No types found
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Table */}
      <div className="flex-1 min-h-[200px]">
        <DataTable
          columns={columns}
          data={filteredDocuments}
          enablePagination={true}
          pageSize={5}
          pageSizeOptions={[5, 10]}
          highlightOnHover={true}
          hideHeader={false}
          headerStyle={{ color: "#565E6C" }}
          onRowClick={(row) => handleDownload(row)}
          emptyState={
            <div className="text-gray-400 italic text-sm py-4 text-center">
              {selectedType !== "All Types" || searchQuery
                ? "No matching documents found"
                : "No documents available"}
            </div>
          }
          tableStyle={{ fontSize: "0.875rem" }}
        />
      </div>

      {/* Upload Stepper Modal */}
      <DocumentSubmissionModal
        isOpen={showStepper}
        onClose={() => setShowStepper(false)}
        onSubmit={() => setShowStepper(false)}
      />

      {/* Notification Modal */}
      <SendNotificationModal
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        selectedRecipients={selectedRecipients}
        notifySubject={notifySubject}
        setNotifySubject={setNotifySubject}
        notifyMessage={notifyMessage}
        setNotifyMessage={setNotifyMessage}
        sendToOutlook={sendToOutlook}
        setSendToOutlook={setSendToOutlook}
        handleRemoveRecipient={handleRemoveRecipient}
        handleResetModal={handleResetModal}
      />
    </div>
  );
}

export default ProjectDocuments;
