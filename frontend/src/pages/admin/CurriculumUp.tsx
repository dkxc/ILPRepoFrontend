import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  useEffect,
} from "react";
import * as XLSX from "xlsx";

interface CurriculumData {
  day: string;
  sessionName: string;
  topicsCovered: string;
  trainer: string;
  sessionMode: string;
  duration: string;
}

interface Curriculum {
  id: number;
  documentType: "AngularJS" | "React" | "DotNet" | "Others";
  documentName?: string;
  fileName: string;
  uploadedDate: Date;
}

interface UploadedDocument {
  id: number;
  documentType: string;
  documentName?: string;
  fileName: string;
  uploadedDate: Date;
}

interface CurriculumUploadProps {
  batchId?: string;
  onUpload?: (curriculum: Curriculum) => void;
  showNotification?: (message: string, type: string) => void;
}

export default function CurriculumUpload({
  batchId = "BATCH001",
  onUpload,
  showNotification,
}: CurriculumUploadProps = {}) {
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [customDocName, setCustomDocName] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<CurriculumData[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const documentTypes = ["AngularJS", "React", "DotNet", "Others"];

  const batchName = "ILP Batch 1 - 2025-26";

  // Auto scroll to preview when data is loaded
  useEffect(() => {
    if (previewData.length > 0 && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [previewData]);

  const parseExcelFile = async (file: File): Promise<void> => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
      });

      // Map to curriculum structure
      const parsedCurriculum: CurriculumData[] = jsonData.map((row) => ({
        day: row["Day"] || row["Session Day"] || "",
        sessionName: row["Session Name"] || "",
        topicsCovered: row["Topics Covered"] || row["Topic Coverage"] || "",
        trainer: row["Trainer"] || "",
        sessionMode: row["Session Mode"] || row["Sessions Mode"] || "",
        duration: row["Duration (HH:MM)"] || row["Duration"] || "",
      }));

      setPreviewData(parsedCurriculum);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert("Error reading Excel file. Please check the file format.");
    }
  };

  const handleDocTypeSelect = (type: string) => {
    setSelectedDocType(type);
    setIsDropdownOpen(false);
    if (type !== "Others") setCustomDocName("");
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setUploadedFile(file);
      parseExcelFile(file);
    } else {
      alert("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleSave = () => {
    if (!selectedDocType || !uploadedFile) {
      alert("Please select document type and upload a file");
      return;
    }
    if (selectedDocType === "Others" && !customDocName.trim()) {
      alert("Please enter a document name");
      return;
    }

    const newCurriculum: Curriculum = {
      id: Date.now(),
      documentType: selectedDocType as Curriculum["documentType"],
      documentName: selectedDocType === "Others" ? customDocName : undefined,
      fileName: uploadedFile.name,
      uploadedDate: new Date(),
    };

    const newDocument: UploadedDocument = {
      id: newCurriculum.id,
      documentType: selectedDocType,
      documentName: selectedDocType === "Others" ? customDocName : undefined,
      fileName: uploadedFile.name,
      uploadedDate: new Date(),
    };

    setUploadedDocuments([...uploadedDocuments, newDocument]);

    if (onUpload) {
      onUpload(newCurriculum);
    }

    alert("Curriculum saved successfully!");
    if (showNotification) {
      showNotification("Curriculum saved successfully!", "success");
    }

    // Reset
    setSelectedDocType("");
    setCustomDocName("");
    setUploadedFile(null);
    setPreviewData([]);
  };

  const handleCancel = () => {
    setSelectedDocType("");
    setCustomDocName("");
    setUploadedFile(null);
    setPreviewData([]);
  };

  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        "Session Day": "Day 01",
        "Session Name": "JS:TS",
        "Topic Coverage": "JS Basics:TS Basics",
        Trainer: "Ashlin",
        "Sessions Mode": "Offline",
        "Duration (HH:MM)": "8:00",
      },
      {
        "Session Day": "Day 02",
        "Session Name": "Angular-Introduction",
        "Topic Coverage":
          "Introduction to Angular, Angular File & Folder Structure, Classes, Interfaces, Types and Decorators in TS, data binding - oneway, two way, control flow",
        Trainer: "Ashlin",
        "Sessions Mode": "Offline",
        "Duration (HH:MM)": "8:00",
      },
      {
        "Session Day": "Day 03",
        "Session Name": "Pipes",
        "Topic Coverage":
          "Component Communication/Directives in Angular/Pipes in Angular",
        Trainer: "Ashlin",
        "Sessions Mode": "Offline",
        "Duration (HH:MM)": "8:00",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum");
    XLSX.writeFile(workbook, "curriculum_template.xlsx");
  };

  const handleDeleteDocument = (id: number) => {
    setUploadedDocuments(uploadedDocuments.filter((doc) => doc.id !== id));
    alert("Document deleted successfully!");
    if (showNotification) {
      showNotification("Document deleted successfully", "success");
    }
  };

  const handleEditDocumentName = (id: number, currentName: string) => {
    setEditingDocId(id);
    setEditingName(currentName);
  };

  const handleSaveEditedName = (id: number) => {
    if (!editingName.trim()) {
      alert("Document name cannot be empty");
      return;
    }
    setUploadedDocuments(
      uploadedDocuments.map((doc) =>
        doc.id === id ? { ...doc, documentName: editingName } : doc,
      ),
    );
    setEditingDocId(null);
    setEditingName("");
    alert("Document name updated successfully!");
    if (showNotification) {
      showNotification("Document name updated successfully", "success");
    }
  };

  const handleDownloadDocument = (fileName: string) => {
    alert(`Downloading ${fileName}...`);
    if (showNotification) {
      showNotification(`Downloading ${fileName}...`, "info");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  return (
    <div>
      <div className="mt-4 sm:mt-6 md:mt-10 ml-4 sm:ml-6 md:ml-10 bg">
        <h1 className="text-[#565E6C] text-xl sm:text-2xl font-bold pb-4 font-primary">
          Upload Curriculum - {batchName}
        </h1>

        <div className="flex mr-4 md:mr-10 bg-white p-4 md:p-8">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full px-2 sm:px-4">
              {/* Document Type Dropdown */}
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technology/Course Type
                </label>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={
                      selectedDocType ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {selectedDocType || "Select a technology..."}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {documentTypes.map((type) => (
                      <button
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocTypeSelect(type);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Document Name Input */}
              {selectedDocType === "Others" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={customDocName}
                    onChange={(e) => setCustomDocName(e.target.value)}
                    placeholder="Enter course name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 rounded-md border-dashed p-6 sm:p-8 md:p-12 text-center transition-colors min-h-[200px] sm:min-h-[250px] md:h-46 w-full cursor-pointer border-brand-500 ${
                  isDragging
                    ? "bg-brand-50"
                    : uploadedFile
                      ? "bg-brand-50 "
                      : "bg-white "
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600">
                    <svg
                      width="23"
                      height="19"
                      viewBox="0 0 23 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.49947 15.0002C5.25174 15.0002 4.05512 14.5261 3.17285 13.6822C2.29058 12.8383 1.79492 11.6937 1.79492 10.5002C1.79492 9.30672 2.29058 8.16213 3.17285 7.31822C4.05512 6.4743 5.25174 6.0002 6.49947 6.0002C6.79415 4.68737 7.65623 3.53368 8.89605 2.79291C9.50995 2.42612 10.1981 2.17174 10.9212 2.04431C11.6444 1.91687 12.3883 1.91887 13.1106 2.0502C13.8328 2.18152 14.5193 2.43959 15.1308 2.80968C15.7422 3.17976 16.2667 3.65461 16.6742 4.20712C17.0818 4.75963 17.3644 5.37898 17.506 6.02979C17.6476 6.68061 17.6454 7.35015 17.4995 8.0002H18.4995C19.4277 8.0002 20.318 8.36894 20.9743 9.02532C21.6307 9.6817 21.9995 10.5719 21.9995 11.5002C21.9995 12.4285 21.6307 13.3187 20.9743 13.9751C20.318 14.6314 19.4277 15.0002 18.4995 15.0002H17.4995"
                        stroke="#2563EB"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.5 12L11.5 9L14.5 12"
                        stroke="#2563EB"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.5 9V18"
                        stroke="#2563EB"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {uploadedFile ? (
                    <>
                      <p className="text-blue-600 font-medium mb-2 text-sm sm:text-base">
                        File uploaded successfully!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 break-all px-2">
                        {uploadedFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-base sm:text-lg font-medium mb-2 text-blue-600 px-2">
                        Click or drag file to this area to upload
                      </p>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mb-4 mt-4">
                Format accepted is .xlsx
              </p>

              <div className="w-full bg-gray-300 h-0.25"></div>

              {/* Template Download */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-0">
                  If you do not have a file you can use this sample:
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="p-1 px-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm border border-gray-300 rounded whitespace-nowrap"
                >
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 1V5C10 5.26522 10.1054 5.51957 10.2929 5.70711C10.4804 5.89464 10.7348 6 11 6H15"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H10L15 6V17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19Z"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 9H12V16H4V9Z"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 13H12"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 9V16"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download Template
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!uploadedFile || !selectedDocType}
                  className={`w-full sm:w-auto px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                    uploadedFile && selectedDocType
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save Curriculum
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {uploadedFile && previewData.length > 0 && (
          <div
            ref={previewRef}
            className="mt-10 mr-4 md:mr-10 sm:mt-8 px-2 sm:px-0"
          >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#F8F9FA] px-6 py-4 border-b border-gray-200">
                <h2 className="text-[#565E6C] text-lg font-semibold">
                  Curriculum - Preview ({batchName})
                </h2>
              </div>
              <div className="p-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#F8F9FA]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Session Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Topics Covered
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Trainer
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Session Mode
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.day}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.sessionName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                          {row.topicsCovered}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.trainer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.sessionMode}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Showing 10 of {previewData.length} rows
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Documents List */}
        {uploadedDocuments.length > 0 && (
          <div className="mt-10 mr-4 md:mr-10">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#F8F9FA] px-6 py-4 border-b border-gray-200">
                <h2 className="text-[#565E6C] text-lg font-semibold">
                  Uploaded Curriculum Documents
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Technology
                        </p>
                        <p className="text-sm text-gray-900">
                          {doc.documentType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Course Name
                        </p>
                        {editingDocId === doc.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-sm px-2 py-1 border border-gray-300 rounded w-full"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSaveEditedName(doc.id);
                              }
                            }}
                          />
                        ) : (
                          <p className="text-sm text-gray-900">
                            {doc.documentName || doc.documentType}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          Uploaded Date
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatDate(doc.uploadedDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">
                          File Name
                        </p>
                        <p className="text-sm text-gray-900 truncate">
                          {doc.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {editingDocId === doc.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEditedName(doc.id)}
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
                              handleEditDocumentName(
                                doc.id,
                                doc.documentName || doc.documentType,
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Name"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc.fileName)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Download"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
