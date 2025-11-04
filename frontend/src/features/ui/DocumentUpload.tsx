import { useState, useEffect } from "react";
import { X, Upload, Download, Filter, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getSubmittedDocuments,
  getDocumentRequirements,
  getDocumentRequirementsByProject,
  downloadDocumentTemplate,
  submitDocument,
  deleteSubmittedDocument,
  type DocumentRequirementType,
} from "./ProjectDetails/api";

interface UploadedDocument {
  id: number;
  filename: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
  isLateSubmission?: boolean;
  dueDate?: string;
}

interface DocumentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (file: File, type: string) => void;
  projectId?: number | string;
  batchId?: number | string;
}

const DocumentSubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectId = "default",
  batchId,
}: DocumentSubmissionModalProps) => {
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isDragging, setIsDragging] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Documents state
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);

  // Document requirements state
  const [documentRequirements, setDocumentRequirements] = useState<
    DocumentRequirementType[]
  >([]);
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState<
    string[]
  >([]);

  // Mock data fallback
  const mockDocuments: UploadedDocument[] = [
    {
      id: 1,
      filename: "BRD_Document_v1.pdf",
      type: "BRD",
      uploadDate: "2025-10-15",
      fileUrl: "#",
    },
    {
      id: 2,
      filename: "UAT_TestCases.xlsx",
      type: "UAT",
      uploadDate: "2025-10-18",
      fileUrl: "#",
    },
    {
      id: 3,
      filename: "Sprint_Tracker_Oct.xlsx",
      type: "Sprint Tracker",
      uploadDate: "2025-10-20",
      fileUrl: "#",
    },
    {
      id: 4,
      filename: "BRD_Document_v2.pdf",
      type: "BRD",
      uploadDate: "2025-10-21",
      fileUrl: "#",
    },
    {
      id: 5,
      filename: "MOM_Meeting_Notes.docx",
      type: "MOM",
      uploadDate: "2025-10-22",
      fileUrl: "#",
    },
    {
      id: 6,
      filename: "Requirements_Doc.pdf",
      type: "Requirements",
      uploadDate: "2025-10-23",
      fileUrl: "#",
    },
    {
      id: 7,
      filename: "Sprint_Tracker_Nov.xlsx",
      type: "Sprint Tracker",
      uploadDate: "2025-10-24",
      fileUrl: "#",
    },
    {
      id: 8,
      filename: "UAT_Report_Q4.xlsx",
      type: "UAT",
      uploadDate: "2025-10-25",
      fileUrl: "#",
    },
    {
      id: 9,
      filename: "Requirements_v2.docx",
      type: "Requirements",
      uploadDate: "2025-10-26",
      fileUrl: "#",
    },
  ];

  // Fetch documents on open
  useEffect(() => {
    console.log("DocumentUpload useEffect triggered:", {
      isOpen,
      projectId,
      batchId,
    });

    if (isOpen && (projectId || batchId)) {
      // Use the provided ID (prefer batchId if available)
      const idToUse =
        projectId && projectId !== "default" ? projectId : batchId;

      if (idToUse) {
        console.log("Fetching documents for ID:", idToUse);
        // Use the new submitted documents API for specific project IDs
        getSubmittedDocuments(idToUse.toString())
          .then((docs: UploadedDocument[] | null) => {
            console.log("Submitted documents response:", docs);
            if (docs && Array.isArray(docs)) {
              if (docs.length > 0) {
                setUploadedDocuments(docs);
              } else {
                // Empty array means no documents submitted yet - show empty state
                setUploadedDocuments([]);
              }
            } else {
              // API error or null response - show empty state
              setUploadedDocuments([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching submitted documents:", error);
            setUploadedDocuments([]);
          });

        // Fetch document requirements - use appropriate API based on available ID
        if (batchId) {
          console.log("Using batch API for batchId:", batchId);
          // Use batch-based API when batchId is available
          getDocumentRequirements(batchId.toString())
            .then((requirements: DocumentRequirementType[] | null) => {
              console.log(
                "Batch document requirements response:",
                requirements,
              );
              if (requirements && Array.isArray(requirements)) {
                setDocumentRequirements(requirements);
                // Extract unique document type names for dropdown, filter out invalid ones
                const types = requirements
                  .map((req) => req.documentTypeName)
                  .filter(
                    (typeName) =>
                      typeName && typeName !== "string" && typeName.length > 1,
                  );
                setAvailableDocumentTypes([...new Set(types)]);
                console.log("Available document types from batch:", types);
                console.log("Raw requirements:", requirements);
              } else {
                // Fallback to default document types
                setAvailableDocumentTypes([
                  "BRD",
                  "UAT",
                  "Sprint Tracker",
                  "MOM",
                  "Requirements",
                ]);
              }
            })
            .catch((error) => {
              console.error(
                "Error fetching batch document requirements:",
                error,
              );
              // Fallback to default document types
              setAvailableDocumentTypes([
                "BRD",
                "UAT",
                "Sprint Tracker",
                "MOM",
                "Requirements",
              ]);
            });
        } else if (projectId && projectId !== "default") {
          console.log("Using project API for projectId:", projectId);
          // Use project-based API when only projectId is available
          getDocumentRequirementsByProject(projectId.toString())
            .then((requirements: DocumentRequirementType[] | null) => {
              console.log(
                "Project document requirements response:",
                requirements,
              );
              if (requirements && Array.isArray(requirements)) {
                setDocumentRequirements(requirements);
                // Extract unique document type names for dropdown, filter out invalid ones
                const types = requirements
                  .map((req) => req.documentTypeName)
                  .filter(
                    (typeName) =>
                      typeName && typeName !== "string" && typeName.length > 1,
                  );
                setAvailableDocumentTypes([...new Set(types)]);
                console.log("Available document types from project:", types);
                console.log("Raw requirements:", requirements);
              } else {
                // Fallback to default document types
                console.log("No project requirements found, using defaults");
                setAvailableDocumentTypes([
                  "BRD",
                  "UAT",
                  "Sprint Tracker",
                  "MOM",
                  "Requirements",
                ]);
              }
            })
            .catch((error) => {
              console.error(
                "Error fetching project document requirements:",
                error,
              );
              // Fallback to default document types
              setAvailableDocumentTypes([
                "BRD",
                "UAT",
                "Sprint Tracker",
                "MOM",
                "Requirements",
              ]);
            });
        } else {
          console.log("No valid ID available, using default types");
          // No valid ID available, use default types
          setAvailableDocumentTypes([
            "BRD",
            "UAT",
            "Sprint Tracker",
            "MOM",
            "Requirements",
          ]);
        }
      } else {
        // No valid ID available, show empty state
        setUploadedDocuments([]);
        // Use default document types for fallback
        setAvailableDocumentTypes([
          "BRD",
          "UAT",
          "Sprint Tracker",
          "MOM",
          "Requirements",
        ]);
      }
    } else if (isOpen) {
      // Modal opened with no project/batch ID, show empty state
      setUploadedDocuments([]);
      // Use default document types for fallback
      setAvailableDocumentTypes([
        "BRD",
        "UAT",
        "Sprint Tracker",
        "MOM",
        "Requirements",
      ]);
    }
  }, [isOpen, projectId, batchId]);

  // Use dynamic document types from API, fallback to static list
  const documentTypes =
    availableDocumentTypes.length > 0
      ? availableDocumentTypes
      : ["BRD", "UAT", "Sprint Tracker", "MOM", "Requirements"];

  const filteredDocuments =
    filterType === "all"
      ? uploadedDocuments
      : uploadedDocuments.filter((doc) => doc.type === filterType);

  // Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setShowTypeError(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      console.log(`🗑️ Attempting to delete document with ID: ${docId}`);

      // Call the delete API
      const success = await deleteSubmittedDocument(docId);

      if (success) {
        console.log("✅ Document deleted successfully from server");
        // Remove from local state
        setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== docId));

        // Show success toast
        toast.success("Document deleted successfully!");
      } else {
        console.error("❌ Failed to delete document from server");

        // Show error toast
        toast.error("Failed to delete document. Please try again.");
      }
    } catch (error) {
      console.error("💥 Error during document deletion:", error);

      // Show error toast
      toast.error("An error occurred while deleting the document.");
    }
  };

  const handleDownloadDocument = async (doc: UploadedDocument) => {
    try {
      if (!doc.fileUrl || doc.fileUrl === "#") {
        console.error("No valid download URL for document:", doc.filename);
        alert("Download link not available for this document.");
        return;
      }

      // Check if it's a direct file URL (like Supabase storage)
      if (
        doc.fileUrl.includes("supabase.co") ||
        doc.fileUrl.includes("amazonaws.com") ||
        doc.fileUrl.startsWith("http")
      ) {
        // For external URLs, fetch and download as blob
        try {
          const response = await fetch(doc.fileUrl, {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = window.document.createElement("a");
            link.href = url;
            link.download = doc.filename;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(url);
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (fetchError) {
          console.error("Error fetching document:", fetchError);
          // Fallback: try opening in new tab
          window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
        }
      } else {
        // For relative URLs or other formats, try direct download
        const link = window.document.createElement("a");
        link.href = doc.fileUrl;
        link.download = doc.filename;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const handleUpload = async () => {
    setUploadError("");
    setUploadSuccess("");
    console.log("handleUpload called with selectedType:", selectedType);
    console.log("Available documentRequirements:", documentRequirements);

    if (!selectedType) {
      setShowTypeError(true);
      return;
    }

    if (selectedFile && selectedType) {
      // Find the document requirement for the selected type to get the requestId
      const requirement = documentRequirements.find(
        (req) => req.documentTypeName === selectedType,
      );
      console.log("Found requirement for upload:", requirement);

      if (!requirement || !requirement.documentRequestId) {
        setUploadError("Document requirement not found. Please try again.");
        return;
      }

      try {
        console.log(
          "Submitting document with requestId:",
          requirement.documentRequestId,
        );
        const result = await submitDocument(
          requirement.documentRequestId,
          selectedFile,
        );

        if (result) {
          console.log("Document submitted successfully:", result);

          // Show success toast
          toast.success(
            `Document uploaded successfully! Submission ID: ${result.submissionId}`,
          );

          // Refresh document list
          const idToUse =
            projectId && projectId !== "default" ? projectId : batchId;
          if (idToUse) {
            getSubmittedDocuments(idToUse.toString())
              .then((docs: UploadedDocument[] | null) => {
                if (docs && Array.isArray(docs)) {
                  setUploadedDocuments(docs);
                } else {
                  setUploadedDocuments(mockDocuments);
                }
              })
              .catch(() => setUploadedDocuments(mockDocuments));
          }

          onSubmit?.(selectedFile, selectedType);

          // Close modal immediately after successful upload
          handleClose();
        } else {
          // Show error toast
          toast.error("Document submission failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during document submission:", error);

        // Show error toast
        toast.error("Document submission failed. Please try again.");
      }
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedType("");
    setFilterType("all");
    setShowTypeError(false);
    setCurrentPage(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90%] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
              <Upload className="w-4 h-4 text-gray-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Document Submission
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error/Success Messages */}
          {uploadError && (
            <div className="text-red-500 text-sm mb-2 text-center bg-red-50 p-2 rounded">
              {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="text-green-600 text-sm mb-2 text-center bg-green-50 p-2 rounded">
              {uploadSuccess}
            </div>
          )}

          {/* Step 1: View Documents */}
          {currentStep === 1 && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  >
                    <option value="all">All Types</option>
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm text-white rounded-md transition-colors hover:opacity-90"
                  style={{ backgroundColor: "var(--color-brand-500)" }}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>

              <div className="flex-1 overflow-auto border border-gray-200 rounded-md">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                        Filename
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                        Upload Date
                      </th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDocuments.length > 0 ? (
                      paginatedDocuments.map((doc) => (
                        <tr
                          key={doc.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">
                            <span
                              className="truncate block max-w-[200px]"
                              title={doc.filename}
                            >
                              {doc.filename}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                {doc.type}
                              </span>
                              {doc.isLateSubmission && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                                  Late
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {doc.uploadDate}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-gray-700"
                                title="Delete document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          No documents found for the selected type
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 flex-shrink-0">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredDocuments.length)} of{" "}
                    {filteredDocuments.length} documents
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 text-sm rounded-md transition-colors ${
                              currentPage === page
                                ? "text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            style={
                              currentPage === page
                                ? { backgroundColor: "var(--color-brand-500)" }
                                : {}
                            }
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Upload File */}
          {currentStep === 2 && (
            <div className="flex flex-col h-full max-w-3xl mx-auto">
              <div className="flex items-end gap-4 mb-6 flex-shrink-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        setShowTypeError(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    >
                      <option value="">Select document type...</option>
                      {documentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={async () => {
                        console.log(
                          "Step 2 template download clicked with selectedType:",
                          selectedType,
                        );
                        console.log(
                          "Available documentRequirements:",
                          documentRequirements,
                        );

                        if (!selectedType) {
                          alert("Please select a document type first.");
                          return;
                        }

                        // Find the document requirement for the selected type
                        const requirement = documentRequirements.find(
                          (req) => req.documentTypeName === selectedType,
                        );
                        console.log(
                          "Found requirement for",
                          selectedType,
                          ":",
                          requirement,
                        );

                        if (!requirement) {
                          alert(
                            "Document requirement not found for this type.",
                          );
                          console.log(
                            "Available document types:",
                            documentRequirements.map(
                              (req) => req.documentTypeName,
                            ),
                          );
                          return;
                        }

                        // Check if documentTemplateUrl exists in the requirement
                        if (requirement.documentTemplateUrl) {
                          try {
                            console.log(
                              "Step 2: Using direct template URL:",
                              requirement.documentTemplateUrl,
                            );

                            // Create a download link directly from the URL
                            const link = window.document.createElement("a");
                            link.href = requirement.documentTemplateUrl;
                            link.download = `${selectedType}_template.pdf`;
                            link.target = "_blank"; // Open in new tab as fallback
                            window.document.body.appendChild(link);
                            link.click();
                            window.document.body.removeChild(link);
                            console.log(
                              "Step 2: Template download initiated successfully",
                            );
                          } catch (error) {
                            console.error(
                              "Step 2: Error downloading template from URL:",
                              error,
                            );
                            alert(
                              "Failed to download template. Please try again.",
                            );
                          }
                        } else {
                          console.log(
                            "Step 2: No documentTemplateUrl found, trying API endpoint",
                          );
                          try {
                            console.log(
                              "Step 2: Attempting to download template for documentTypeId:",
                              requirement.documentTypeId,
                            );
                            const templateBlob = await downloadDocumentTemplate(
                              requirement.documentTypeId,
                            );
                            console.log(
                              "Step 2 download response:",
                              templateBlob,
                            );

                            if (templateBlob) {
                              // Create a download link for the template
                              const url =
                                window.URL.createObjectURL(templateBlob);
                              const link = window.document.createElement("a");
                              link.href = url;
                              link.download = `${selectedType}_template.pdf`;
                              window.document.body.appendChild(link);
                              link.click();
                              window.document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                              console.log(
                                "Step 2 template download successful",
                              );
                            } else {
                              console.log("Step 2 template blob is null");
                              alert(
                                "Template not available for this document type.",
                              );
                            }
                          } catch (error) {
                            console.error(
                              "Step 2 error downloading template:",
                              error,
                            );
                            alert(
                              "Failed to download template. Please try again.",
                            );
                          }
                        }
                      }}
                      disabled={!selectedType}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors flex items-center gap-1.5 ${
                        selectedType
                          ? "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      title="Download Template"
                    >
                      <Download className="w-4 h-4" />
                      Template
                    </button>
                  </div>
                </div>
              </div>

              {showTypeError && (
                <div className="mb-3 text-sm text-red-600 flex-shrink-0">
                  Please select a document type before uploading
                </div>
              )}

              <div
                className="flex-1 border-2 border-dashed rounded-lg p-10 text-center transition-all flex flex-col items-center justify-center"
                style={{
                  borderColor: isDragging
                    ? "var(--color-brand-500)"
                    : "#d1d5db",
                  backgroundColor: isDragging ? "#f9fafb" : "#fafafa",
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="p-3 rounded-full mb-3 transition-colors"
                    style={{
                      backgroundColor: isDragging ? "#e5e7eb" : "#f3f4f6",
                    }}
                  >
                    <Upload
                      className="w-8 h-8"
                      style={{
                        color: isDragging
                          ? "var(--color-brand-500)"
                          : "#6b7280",
                      }}
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Drop your file here, or browse
                  </h3>
                  <p className="text-xs text-gray-500 mb-5">
                    Supports: PDF, XLSX, DOCX, PNG, JPG (Max 10MB)
                  </p>

                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg"
                  />
                  <label htmlFor="file-upload">
                    <span
                      className="inline-block px-5 py-2 text-white text-sm font-medium rounded-md cursor-pointer transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "var(--color-brand-500)" }}
                    >
                      Choose File
                    </span>
                  </label>

                  {selectedFile && (
                    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-md w-full max-w-md flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-md flex items-center justify-center flex-shrink-0">
                        <Upload className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className={`px-6 py-2 text-sm rounded-md transition-opacity flex items-center gap-2 ${
                    selectedFile
                      ? "text-white hover:opacity-90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  style={
                    selectedFile
                      ? { backgroundColor: "var(--color-brand-500)" }
                      : {}
                  }
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else handleClose();
            }}
            className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            {currentStep === 1 ? "Close" : "Back"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentSubmissionModal;
