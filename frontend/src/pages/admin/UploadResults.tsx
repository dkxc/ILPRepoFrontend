import { useState, useRef, type ChangeEvent, type DragEvent } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import type {
  BatchAssessment,
  Assessment,
} from "../../features/trainee/types/Batch.types";

export default function UploadResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const batch = location.state?.batch as BatchAssessment;

  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [customDocName, setCustomDocName] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const documentTypes = [
    "Tech Fundamentals",
    "Specialisation",
    "Overall Assessment",
    "Others",
  ];

  if (!batch) {
    navigate("/trainee-assessment");
    return null;
  }

  const handleDocTypeSelect = (type: string): void => {
    setSelectedDocType(type);
    setIsDropdownOpen(false);
    if (type !== "Others") {
      setCustomDocName("");
    }
  };

  const handleFileSelect = (file: File | null): void => {
    if (!file) return;

    // Check if file is .xlsx format
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setUploadedFile(file);
    } else {
      alert("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUploadClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = (): void => {
    if (!selectedDocType || !uploadedFile) {
      alert("Please select document type and upload a file");
      return;
    }

    if (selectedDocType === "Others" && !customDocName.trim()) {
      alert("Please enter a document name");
      return;
    }

    const newAssessment: Assessment = {
      id: Date.now().toString(),
      batchId: batch.id.toString(),
      documentType: selectedDocType as Assessment["documentType"],
      documentName: selectedDocType === "Others" ? customDocName : undefined,
      fileName: uploadedFile.name,
      uploadedDate: new Date().toLocaleDateString(),
    };

    setAssessments([...assessments, newAssessment]);

    // Reset form
    setSelectedDocType("");
    setCustomDocName("");
    setUploadedFile(null);

    alert("Assessment uploaded successfully!");
  };

  const handleCancel = (): void => {
    navigate("/trainee-assessment");
  };

  const handleDownloadTemplate = (): void => {
    // Implement template download logic
    alert("Downloading template...");
  };

  return (
    <div>
      <div className="mt-10 ml-10 bg">
        <h1 className="text-[#565E6C] text-2xl font-bold pb-4 font-primary">
          {batch.title}
        </h1>

        <div className="flex mr-10 bg-white">
          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
              {/* Document Type Dropdown */}
              <div className="mb-6 relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={
                      selectedDocType ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {selectedDocType || "Select a document..."}
                  </span>
                  {isDropdownOpen ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {documentTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDocTypeSelect(type)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Document Name Input (for "Others") */}
              {selectedDocType === "Others" && (
                <div className="mb-6">
                  <input
                    type="text"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    placeholder="Enter document name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 rounded-md border-dashed p-12 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? "bg-blue-50 border-blue-600"
                    : uploadedFile
                      ? "bg-blue-50 border-blue-600"
                      : "bg-white border-blue-600"
                }`}
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 text-blue-600 mb-4">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 23 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.49947 15.0002C5.25174 15.0002 4.05512 14.5261 3.17285 13.6822C2.29058 12.8383 1.79492 11.6937 1.79492 10.5002C1.79492 9.30672 2.29058 8.16213 3.17285 7.31822C4.05512 6.4743 5.25174 6.0002 6.49947 6.0002C6.79415 4.68737 7.65623 3.53368 8.89605 2.79291C9.50995 2.42612 10.1981 2.17174 10.9212 2.04431C11.6444 1.91687 12.3883 1.91887 13.1106 2.0502C13.8328 2.18152 14.5193 2.43959 15.1308 2.80968C15.7422 3.17976 16.2667 3.65461 16.6742 4.20712C17.0818 4.75963 17.3644 5.37898 17.506 6.02979C17.6476 6.68061 17.6454 7.35015 17.4995 8.0002H18.4995C19.4277 8.0002 20.318 8.36894 20.9743 9.02532C21.6307 9.6817 21.9995 10.5719 21.9995 11.5002C21.9995 12.4285 21.6307 13.3187 20.9743 13.9751C20.318 14.6314 19.4277 15.0002 18.4995 15.0002H17.4995"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12L11.5 9L14.5 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.5 9V18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {uploadedFile ? (
                    <>
                      <p className="text-blue-600 font-medium mb-2">
                        File uploaded successfully!
                      </p>
                      <p className="text-sm text-gray-600">
                        {uploadedFile.name}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-medium mb-2 text-blue-600">
                      Click or drag file to this area to upload
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4 mt-4">
                Format accepted is .xlsx
              </p>
              <div className="w-full bg-gray-300 h-px"></div>

              <div className="mt-4 flex flex-row items-center gap-4">
                <p className="text-sm text-gray-500 mb-0">
                  If you do not have a file you can use this sample:
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-3 py-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-300 rounded"
                >
                  <Download size={16} />
                  Download Template
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!uploadedFile || !selectedDocType}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    uploadedFile && selectedDocType
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Preview Section (Collapsible) */}
        {assessments.length > 0 && (
          <div className="mt-8 mr-10">
            <div className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  Assessment - Preview
                </h2>
                {isPreviewOpen ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>

              {isPreviewOpen && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    {assessments.length} assessment(s) uploaded
                  </p>
                  <div className="space-y-2">
                    {assessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {assessment.documentType === "Others"
                              ? assessment.documentName
                              : assessment.documentType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {assessment.fileName}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {assessment.uploadedDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
