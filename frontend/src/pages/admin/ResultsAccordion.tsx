import { useState } from "react";
import {
  Edit2,
  Trash2,
  Download,
  Eye,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Assessment {
  id: number;
  batchId: string;
  documentType:
    | "Tech Fundamentals"
    | "Specialisation"
    | "Overall Assessment"
    | "Others";
  documentName?: string;
  fileName: string;
  uploadedDate: Date;
}

interface ResultsAccordionProps {
  batchId: string;
  batchTitle?: string;
  onUploadClick?: () => void;
  defaultOpen?: boolean;
}

export default function ResultsAccordion({
  batchId,
  batchTitle = "ILP Batch 1 - 2025-26",
  onUploadClick,
  defaultOpen = false,
}: ResultsAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  // Sample data - replace with actual data from props or API
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: 1,
      batchId: batchId,
      documentType: "Tech Fundamentals",
      fileName: "tech_fundamentals_assessment.xlsx",
      uploadedDate: new Date("2025-01-15"),
    },
    {
      id: 2,
      batchId: batchId,
      documentType: "Specialisation",
      fileName: "specialisation_assessment.xlsx",
      uploadedDate: new Date("2025-02-20"),
    },
    {
      id: 3,
      batchId: batchId,
      documentType: "Overall Assessment",
      fileName: "overall_assessment_results.xlsx",
      uploadedDate: new Date("2025-03-10"),
    },
    {
      id: 4,
      batchId: batchId,
      documentType: "Others",
      documentName: "Mid-Term Evaluation",
      fileName: "mid_term_evaluation.xlsx",
      uploadedDate: new Date("2025-02-05"),
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState<Assessment | null>(
    null,
  );
  const [showPreviewModal, setShowPreviewModal] = useState<Assessment | null>(
    null,
  );
  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteAssessment = (assessment: Assessment) => {
    setAssessments(assessments.filter((a) => a.id !== assessment.id));
    setShowDeleteModal(null);
    showNotification(
      `${assessment.fileName} was deleted successfully`,
      "success",
    );
  };

  const handleDownloadDocument = (assessment: Assessment) => {
    showNotification(`Downloading ${assessment.fileName}...`, "info");
    // Implement actual download logic here
  };

  const handlePreviewDocument = (assessment: Assessment) => {
    setShowPreviewModal(assessment);
  };

  const handleEditDocumentName = (id: number, currentName: string) => {
    setEditingDocId(id);
    setEditingName(currentName);
  };

  const handleSaveEditedName = (id: number) => {
    if (!editingName.trim()) {
      showNotification("Document name cannot be empty", "error");
      return;
    }
    setAssessments(
      assessments.map((doc) =>
        doc.id === id ? { ...doc, documentName: editingName } : doc,
      ),
    );
    setEditingDocId(null);
    setEditingName("");
    showNotification("Document name updated successfully", "success");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  const getDisplayName = (assessment: Assessment) => {
    if (assessment.documentType === "Others" && assessment.documentName) {
      return assessment.documentName;
    }
    return assessment.documentType;
  };

  const navigate = useNavigate();

  return (
    <div>
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Assessment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <b>{showDeleteModal.fileName}</b>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAssessment(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Preview: {getDisplayName(showPreviewModal)}
              </h3>
              <button
                onClick={() => setShowPreviewModal(null)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-4">
                File: {showPreviewModal.fileName}
              </p>
              <div className="bg-gray-50 p-8 rounded-md text-center">
                <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Excel preview will be displayed here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Upload Date: {formatDate(showPreviewModal.uploadedDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mt-0 sm:mt-2 md:mt-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Accordion Header */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-[#565E6C]">
                Assessments - {batchTitle}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {assessments.length} assessment
                {assessments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUploadClick?.();
                  navigate("/upload-results");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                <Upload size={16} />
                Upload Assessment
              </button>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* Accordion Content */}
          {isOpen && (
            <div className="border-t border-gray-200">
              {/* Assessments List */}
              {assessments.length > 0 ? (
                <div>
                  <div className="bg-[#F8F9FA] px-6 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Uploaded Documents
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {assessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                Document Type
                              </p>
                              <p className="text-sm text-gray-900">
                                {assessment.documentType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                Document Name
                              </p>
                              {editingDocId === assessment.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) =>
                                      setEditingName(e.target.value)
                                    }
                                    className="text-sm px-2 py-1 border border-gray-300 rounded w-full"
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        handleSaveEditedName(assessment.id);
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <p className="text-sm text-gray-900">
                                  {getDisplayName(assessment)}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                Uploaded Date
                              </p>
                              <p className="text-sm text-gray-900">
                                {formatDate(assessment.uploadedDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">
                                File Name
                              </p>
                              <p className="text-sm text-gray-900 truncate">
                                {assessment.fileName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {editingDocId === assessment.id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleSaveEditedName(assessment.id)
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                  title="Save"
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
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingDocId(null);
                                    setEditingName("");
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                                  title="Cancel"
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
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handlePreviewDocument(assessment)
                                  }
                                  className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                                  title="Preview"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleEditDocumentName(
                                      assessment.id,
                                      getDisplayName(assessment),
                                    )
                                  }
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit Name"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadDocument(assessment)
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                  title="Download"
                                >
                                  <Download size={18} />
                                </button>
                                <button
                                  onClick={() => setShowDeleteModal(assessment)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No assessments uploaded yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by uploading your first assessment document
                  </p>
                  <button
                    onClick={onUploadClick}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload size={18} />
                    Upload Assessment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
