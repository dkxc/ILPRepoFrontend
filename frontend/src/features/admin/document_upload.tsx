import { useState } from "react";
import { X, Upload, Download, Filter, ChevronRight, Check } from "lucide-react";

interface UploadedDocument {
  id: number;
  filename: string;
  type: string;
  uploadDate: string;
  fileUrl: string;
}

interface DocumentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (file: File, type: string) => void;
}

export const DocumentSubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: DocumentSubmissionModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isDragging, setIsDragging] = useState(false);

  // Mock uploaded documents
  const [uploadedDocuments] = useState<UploadedDocument[]>([
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
  ]);

  const documentTypes = ["BRD", "UAT", "Sprint Tracker", "MOM", "Requirements"];

  const filteredDocuments =
    filterType === "all"
      ? uploadedDocuments
      : uploadedDocuments.filter((doc) => doc.type === filterType);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
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

  const handleNext = () => {
    if (currentStep === 2 && selectedFile && selectedType) {
      setCurrentStep(3);
    }
  };

  const handleFinish = () => {
    if (selectedFile && selectedType) {
      onSubmit?.(selectedFile, selectedType);
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedType("");
    setFilterType("all");
    onClose();
  };

  const getFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type;
    if (fileType.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="max-w-full max-h-96 mx-auto"
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-lg font-medium text-gray-700">{selectedFile.name}</p>
        <p className="text-sm text-gray-500 mt-2">
          {(selectedFile.size / 1024).toFixed(2)} KB
        </p>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Document Submission
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: "View Documents" },
              { num: 2, label: "Upload File" },
              { num: 3, label: "Preview & Confirm" },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.num
                        ? "bg-green-600 text-white"
                        : currentStep === step.num
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > step.num ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.num
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      currentStep >= step.num
                        ? "text-gray-800 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <ChevronRight
                    className={`w-5 h-5 mx-2 ${
                      currentStep > step.num
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: View Documents */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Filename
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {doc.filename}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {doc.uploadDate}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 2: Upload File */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Document Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose type...</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-blue-100 rounded-full mb-4">
                    <Upload className="w-12 h-12 text-blue-600" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Drop your file here, or browse
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Supports: PDF, XLSX, DOCX, PNG, JPG
                  </p>

                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>

                  {selectedFile && (
                    <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">
                        Selected: {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Document Preview
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <strong>Type:</strong> {selectedType}
                  </span>
                  <span>
                    <strong>Filename:</strong> {selectedFile?.name}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                {getFilePreview()}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else handleClose();
            }}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {currentStep === 1 ? "Close" : "Back"}
          </button>

          {currentStep === 2 && (
            <button
              onClick={handleNext}
              disabled={!selectedFile || !selectedType}
              className={`px-6 py-2 rounded-lg transition-colors ${
                selectedFile && selectedType
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo App
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (file: File, type: string) => {
    console.log("Submitted:", { file: file.name, type });
    alert(`Document "${file.name}" of type "${type}" uploaded successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Document Submission System
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Manage Your Documents
          </h2>
          <p className="text-gray-600 mb-6">
            View, upload, and manage your documents with our easy-to-use
            submission system.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open Document Submission
          </button>
        </div>

        <DocumentSubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
