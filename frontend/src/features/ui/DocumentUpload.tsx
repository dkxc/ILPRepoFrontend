import { useState } from "react";
import { X, Upload, Download, Filter, Check } from "lucide-react";
import { useEffect } from "react";

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

const DocumentSubmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: DocumentSubmissionModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<React.ReactNode>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Mock uploaded documents
  const [uploadedDocuments] = useState<UploadedDocument[]>([
    {
      id: 1,
      filename: "BRD_Document_v1.pdfhaha",
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
  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }
    const fileType = selectedFile.type;
    setPreviewLoading(true);
    let objectURL: string | null = null;
    if (fileType.startsWith("image/")) {
      objectURL = URL.createObjectURL(selectedFile);
      setFilePreview(
        <img
          src={objectURL}
          alt="Preview"
          className="max-w-full max-h-96 mx-auto rounded-lg border"
        />,
      );
      setPreviewLoading(false);
    } else if (fileType === "application/pdf") {
      objectURL = URL.createObjectURL(selectedFile);
      setFilePreview(
        <iframe
          src={objectURL}
          className="w-full h-[750px]"
          title="PDF Preview"
        />,
      );
      setPreviewLoading(false);
    } else if (fileType.startsWith("text/")) {
      // Read text file
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(
          <pre className="w-full min-h-[300px] max-h-[70vh] overflow-auto bg-gray-50 rounded-lg p-4 text-left text-xs whitespace-pre-wrap">
            {e.target?.result as string}
          </pre>,
        );
        setPreviewLoading(false);
      };
      reader.readAsText(selectedFile);
    } else {
      setFilePreview(
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-lg font-medium text-gray-700">
            {selectedFile.name}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>,
      );
      setPreviewLoading(false);
    }
    // Clean up object URLs
    return () => {
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
    // eslint-disable-next-line
  }, [selectedFile]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col border border-gray-200">
        {/* Modal Header - Minimalistic */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-brand-500) 10%, white)",
              }}
            >
              <Upload
                className="w-4 h-4"
                style={{ color: "var(--color-brand-500)" }}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Document Submission
              </h2>
              <p className="text-xs text-gray-500">
                Upload and manage project documents
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Stepper - Minimalistic */}
        <div className="px-8 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
            {[
              { num: 1, label: "View" },
              { num: 2, label: "Upload" },
              { num: 3, label: "Preview" },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep > step.num
                        ? "bg-green-500 text-white"
                        : currentStep === step.num
                          ? "text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                    style={
                      currentStep === step.num
                        ? { backgroundColor: "var(--color-brand-500)" }
                        : {}
                    }
                  >
                    {currentStep > step.num ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.num
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.num
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      currentStep > step.num ? "bg-green-500" : "bg-gray-200"
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
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                    style={
                      {
                        "--tw-ring-color": "var(--color-brand-500)",
                      } as React.CSSProperties
                    }
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
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: "var(--color-brand-500)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                  style={
                    {
                      "--tw-ring-color": "var(--color-brand-500)",
                    } as React.CSSProperties
                  }
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="border-2 border-dashed rounded-xl p-12 text-center transition-all"
                style={{
                  borderColor: isDragging
                    ? "var(--color-brand-500)"
                    : "#d1d5db",
                  backgroundColor: isDragging
                    ? "color-mix(in srgb, var(--color-brand-500) 5%, white)"
                    : "#f9fafb",
                }}
                onMouseEnter={(e) =>
                  !isDragging &&
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  !isDragging &&
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="p-4 rounded-full mb-4 transition-colors"
                    style={{
                      backgroundColor: isDragging
                        ? "color-mix(in srgb, var(--color-brand-500) 20%, white)"
                        : "color-mix(in srgb, var(--color-brand-500) 10%, white)",
                    }}
                  >
                    <Upload
                      className="w-10 h-10"
                      style={{
                        color: isDragging
                          ? "var(--color-brand-500)"
                          : "color-mix(in srgb, var(--color-brand-500) 80%, black)",
                      }}
                    />
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Drop your file here, or browse
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
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
                      className="inline-block px-6 py-2.5 text-white text-sm font-medium rounded-lg cursor-pointer transition-opacity"
                      style={{ backgroundColor: "var(--color-brand-500)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      Browse Files
                    </span>
                  </label>

                  {selectedFile && (
                    <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg w-full flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">
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
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Document Preview
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Type:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-xs">
                      {selectedType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Filename:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedFile?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Size:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedFile ? (selectedFile.size / 1024).toFixed(2) : 0}{" "}
                      KB
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                {previewLoading ? (
                  <div className="flex flex-col items-center justify-center h-96">
                    <div
                      className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
                      style={{ borderBottomColor: "var(--color-brand-500)" }}
                    ></div>
                    <span className="text-gray-500 text-sm">
                      Loading preview...
                    </span>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                    {filePreview}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
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
              className={`px-6 py-2 rounded-lg transition-opacity ${
                selectedFile && selectedType
                  ? "text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              style={
                selectedFile && selectedType
                  ? { backgroundColor: "var(--color-brand-500)" }
                  : {}
              }
              onMouseEnter={(e) =>
                selectedFile &&
                selectedType &&
                (e.currentTarget.style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                selectedFile &&
                selectedType &&
                (e.currentTarget.style.opacity = "1")
              }
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

export default DocumentSubmissionModal;
