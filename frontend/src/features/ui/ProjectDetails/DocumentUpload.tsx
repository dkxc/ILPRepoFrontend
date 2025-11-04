import { useState, useRef, useEffect } from "react";
import Button from "../../ui/Button";
import { FileText, Upload, Bell, Download, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import DocumentSubmissionModal from "../../ui/DocumentUpload";
import DataTable from "../Table";
import type { ColumnDef } from "../Table";
import type { TeamMember } from "./TeamList";
import SendNotificationModal from "./SendNotification";
import {
  getSubmittedDocuments,
  getDocumentRequirements,
  getDocumentRequirementsByProject,
  type DocumentRequirementType,
} from "./api";

interface Document {
  id: string;
  name: string;
  filename: string;
  status: "Submitted" | "Not Submitted";
  fileUrl?: string;
  uploadDate?: string;
  submissionLink?: string;
  type?: string;
  isLateSubmission?: boolean;
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
    fileUrl: "https://example.com/files/project-plan.pdf",
    uploadDate: "2024-10-15",
    submissionLink: "https://example.com/files/project-plan.pdf",
    type: "Project Plan",
  },
  {
    id: "2",
    name: "Design Mockup",
    filename: "design-mockup.png",
    status: "Submitted",
    fileUrl: "https://example.com/files/design-mockup.png",
    uploadDate: "2024-10-18",
    submissionLink: "https://example.com/files/design-mockup.png",
    type: "Design Mockup",
  },
  {
    id: "3",
    name: "Requirements Document",
    filename: "",
    status: "Not Submitted",
    fileUrl: "",
    uploadDate: "",
    submissionLink: "",
    type: "Requirements Document",
  },
  {
    id: "4",
    name: "Sprint Report",
    filename: "sprint-report.xlsx",
    status: "Submitted",
    fileUrl: "https://example.com/files/sprint-report.xlsx",
    uploadDate: "2024-10-22",
    submissionLink: "https://example.com/files/sprint-report.xlsx",
    type: "Sprint Report",
  },
  {
    id: "5",
    name: "Final Presentation",
    filename: "",
    status: "Not Submitted",
    fileUrl: "",
    uploadDate: "",
    submissionLink: "",
    type: "Final Presentation",
  },
  {
    id: "6",
    name: "Testing Report",
    filename: "",
    status: "Not Submitted",
    fileUrl: "",
    uploadDate: "",
    submissionLink: "",
    type: "Testing Report",
  },
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
      try {
        console.log("Fetching documents for project:", projectId);

        // Use the same logic as the modal - fetch both requirements and submitted documents
        const idToUse =
          projectId && projectId !== "default" ? projectId : undefined;

        let submittedDocs: any[] = [];
        let requirements: DocumentRequirementType[] = [];

        // Fetch submitted documents
        if (idToUse) {
          try {
            const submittedData = await getSubmittedDocuments(
              idToUse.toString(),
            );
            submittedDocs = Array.isArray(submittedData) ? submittedData : [];
            console.log("Submitted documents:", submittedDocs);
          } catch (error) {
            console.error("Error fetching submitted documents:", error);
          }

          // Fetch document requirements for project
          try {
            const requirementsData = await getDocumentRequirementsByProject(
              idToUse.toString(),
            );
            requirements = Array.isArray(requirementsData)
              ? requirementsData
              : [];
            console.log("Document requirements:", requirements);
          } catch (error) {
            console.error("Error fetching requirements:", error);
          }
        }

        // If we have data, process it like the completion rate component does
        if (submittedDocs.length > 0 || requirements.length > 0) {
          let allDocuments: Document[] = [];

          // First, map submitted documents
          const submittedMapped = submittedDocs.map(
            (doc: any): Document => ({
              id:
                doc.id?.toString() ||
                doc.submissionId?.toString() ||
                Math.random().toString(),
              name:
                doc.documentType ||
                doc.type ||
                doc.documentTypeName ||
                "Unknown Document",
              filename:
                doc.filename ||
                doc.fileName ||
                doc.originalName ||
                "document.pdf",
              status: "Submitted", // These are submitted documents
              fileUrl: doc.submissionLink || doc.fileUrl || "",
              uploadDate:
                doc.submissionDate || doc.uploadDate || doc.createdAt || "",
              submissionLink: doc.submissionLink || doc.fileUrl || "",
              type: doc.documentType || doc.type || doc.documentTypeName || "",
              isLateSubmission: doc.isLateSubmission || false,
            }),
          );

          allDocuments.push(...submittedMapped);

          // For admin users, also show not submitted documents by comparing requirements with submissions
          if (isAdmin && requirements.length > 0) {
            const submittedTypeNames = submittedDocs.map(
              (doc: any) =>
                doc.documentType || doc.type || doc.documentTypeName || "",
            );

            const notSubmittedDocs = requirements
              .filter(
                (req: any) =>
                  !submittedTypeNames.includes(req.documentTypeName),
              )
              .map(
                (req: any): Document => ({
                  id: `req-${req.documentRequestId || req.id || Math.random()}`,
                  name: req.documentTypeName || "Unknown Document",
                  filename: "",
                  status: "Not Submitted",
                  fileUrl: "",
                  uploadDate: "",
                  submissionLink: "",
                  type: req.documentTypeName || "",
                  isLateSubmission: false,
                }),
              );

            allDocuments.push(...notSubmittedDocs);
          }

          setDocuments(allDocuments);
        } else {
          // Use fallback dummy data when API returns no data
          setDocuments(initialDocuments);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        // Use fallback dummy data when API fails
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

  const handleDownload = async (doc: Document) => {
    try {
      console.log("Downloading:", doc.filename);

      // Use submissionLink first, then fallback to fileUrl
      const downloadUrl = doc.submissionLink || doc.fileUrl;

      if (
        !downloadUrl ||
        downloadUrl === "" ||
        doc.status === "Not Submitted"
      ) {
        toast.error("Download link not available for this document.");
        return;
      }

      // For demo URLs (example.com), show a toast message
      if (downloadUrl.includes("example.com")) {
        toast.success(`Download started: ${doc.filename}`);
        console.log("Demo download - actual file URL:", downloadUrl);
        return;
      }

      // For real URLs, attempt to download
      if (downloadUrl.startsWith("http")) {
        try {
          const response = await fetch(downloadUrl, {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = doc.filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success(`Downloaded: ${doc.filename}`);
        } catch (fetchError) {
          console.error("Fetch failed, trying direct window.open:", fetchError);
          // Fallback to opening in new tab
          window.open(downloadUrl, "_blank", "noopener,noreferrer");
          toast.success(`Download started: ${doc.filename}`);
        }
      } else {
        toast.error("Invalid download URL for this document.");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document. Please try again.");
    }
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
          <FileText className="h-4 w-4 text-gray-500 shrink-0" />
          <span className="font-medium text-gray-900 text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "filename",
      header: "Filename",
      width: "35%",
      render: (value, row) =>
        row.status === "Submitted" && value ? (
          <span
            className="text-gray-600 text-sm truncate block max-w-[250px]"
            title={value}
          >
            {value}
          </span>
        ) : (
          <span className="text-gray-400 italic text-sm">
            {row.status === "Not Submitted" ? "Not submitted yet" : "—"}
          </span>
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
      render: (_value, row) =>
        row.status === "Submitted" ? (
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={() => handleDownload(row)}
            title="Download"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        ) : (
          <span className="text-gray-400 text-xs italic">No file</span>
        ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] h-full flex flex-col shadow-sm">
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
    <div className="bg-white px-4 py-4 rounded-lg border border-[#F8F9FA] h-full flex flex-col shadow-sm">
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
        projectId={projectId}
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
