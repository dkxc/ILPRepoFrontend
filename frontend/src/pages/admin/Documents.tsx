import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Badge, ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import type {
  BatchAssessment,
  Assessment,
} from "../../features/trainee/types/Batch.types";
import * as XLSX from "xlsx";

export default function Results() {
  // State management
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedBatch, setSelectedBatch] = useState<BatchAssessment | null>(
    null,
  );
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [customDocName, setCustomDocName] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);

  const documentTypes = [
    "Tech Fundamentals",
    "Specialisation",
    "Overall Assessment",
    "Others",
  ];

  // Mock data
  const batchesData: BatchAssessment[] = [
    {
      id: 1,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Pending",
    },
    {
      id: 2,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Pending",
    },
    {
      id: 3,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 4,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 5,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 6,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
      status: "Completed",
    },
    {
      id: 7,
      title: "ILP 2025-26 Batch 8",
      type: "Developer Trainee",
      totalTrainees: 40,
      status: "Pending",
    },
    {
      id: 8,
      title: "ILP 2025-26 Batch 9",
      type: "Developer Trainee",
      totalTrainees: 35,
      status: "Completed",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Completed" ? "green" : "yellow";
  };

  const handleDelete = (batch: BatchAssessment) => {
    modals.openConfirmModal({
      title: "Delete Batch",
      centered: true,
      children: (
        <p>
          Are you sure you want to delete <b>{batch.title}</b>?
        </p>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        notifications.show({
          title: "Deleted",
          message: `${batch.title} was removed.`,
          color: "red",
        });
      },
    });
  };

  const handleRowClick = (row: BatchAssessment) => {
    setSelectedBatch(row);
    setStep(2);
  };

  const handleBackToBatches = () => {
    setStep(1);
    setSelectedBatch(null);
    setSelectedDocType("");
    setCustomDocName("");
    setUploadedFile(null);
    setAssessments([]);
  };

  // Upload handlers
  const handleDocTypeSelect = (type: string): void => {
    setSelectedDocType(type);
    setIsDropdownOpen(false);
    if (type !== "Others") {
      setCustomDocName("");
    }
  };

  const handleFileSelect = async (file: File | null): Promise<void> => {
    if (!file) return;

    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setUploadedFile(file);

      // Parse Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      if (jsonData.length > 0) {
        setExcelHeaders(Object.keys(jsonData[0]));
        setExcelData(jsonData);
        console.log("Excel parsed successfully:", {
          // ADD THIS
          headers: Object.keys(jsonData[0]),
          rowCount: jsonData.length,
          data: jsonData,
        });
      }
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
    if (!selectedDocType || !uploadedFile || excelData.length === 0) {
      alert("Please select document type and upload a file");
      return;
    }

    if (selectedDocType === "Others" && !customDocName.trim()) {
      alert("Please enter a document name");
      return;
    }

    // TODO: Replace with actual API call to save to database
    const newAssessment: Assessment = {
      id: Date.now(),
      batchId: selectedBatch!.id.toString(),
      documentType: selectedDocType as Assessment["documentType"],
      documentName: selectedDocType === "Others" ? customDocName : undefined,
      fileName: uploadedFile.name,
      uploadedDate: new Date(),
    };

    setAssessments([...assessments, newAssessment]);

    // Reset form but keep the batch selected (stay on step 2)
    setSelectedDocType("");
    setCustomDocName("");
    setUploadedFile(null);
    setExcelData([]);
    setExcelHeaders([]);

    notifications.show({
      title: "Success",
      message: "Assessment uploaded successfully to database!",
      color: "green",
    });
  };

  const handleCancel = (): void => {
    handleBackToBatches();
  };

  const handleDownloadTemplate = (): void => {
    alert("Downloading template...");
  };

  const columns: ColumnDef<BatchAssessment>[] = [
    {
      key: "title",
      header: "Name",
      sortable: true,
      width: "35%",
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      width: "25%",
    },
    {
      key: "totalTrainees",
      header: "Total Trainees",
      sortable: true,
      align: "center",
      width: "20%",
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      width: "15%",
      render: (value) => {
        const isCompleted = value === "Completed";
        return (
          <span
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              isCompleted
                ? "bg-[#EBFFE6] text-green-700"
                : "bg-[#E6E6E6] text-gray-700"
            }`}
            style={{
              display: "inline-block",
              minWidth: "90px",
              textAlign: "center",
            }}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "10%",
      render: (_, row) => (
        <ActionIcon
          variant="Subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(row);
          }}
          style={{
            transition: "0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "#F0F4FE")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent")
          }
        >
          <Trash2 size={18} />
        </ActionIcon>
      ),
    },
  ];

  const handleDeleteAssessment = (assessment: Assessment) => {
    modals.openConfirmModal({
      title: "Delete Assessment",
      centered: true,
      children: (
        <p>
          Are you sure you want to delete <b>{assessment.fileName}</b>?
        </p>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        setAssessments((prev) =>
          prev.filter((a) => a.fileName !== assessment.fileName),
        );

        notifications.show({
          title: "Deleted",
          message: `${assessment.fileName} was removed.`,
          color: "red",
        });
      },
    });
  };

  // STEP 1: Batch Listing
  if (step === 1) {
    return (
      <div className="p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:px-4 px-2 py-3">
          <h1
            className="text-2xl font-bold ml-10 text-[#565E6C] font-primary"
            style={{ color: "#565E6C" }}
          >
            Document Upload
          </h1>
        </div>
        <div className="p-2 sm:p-0 mb-4 rounded-lg overflow-x-auto">
          <DataTable
            columns={columns}
            data={batchesData}
            showHeaderSection={true}
            headerTitle="Select Batch"
            headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
            enableSearch={true}
            searchPlaceholder="Search batches..."
            enablePagination={true}
            enableFilter={true}
            filterColumn="status"
            filterOptions={["Pending", "Completed"]}
            filterPlaceholder="Filter"
            pageSize={5}
            pageSizeOptions={[5, 10, 25, 50]}
            striped={false}
            highlightOnHover={true}
            withBorder={false}
            onRowClick={handleRowClick}
            tableStyle={{
              width: "100%",
              borderRadius: "8px",
              backgroundColor: "white",
              paddingLeft: "0",
              paddingRight: "0",
            }}
            rowStyle={{
              fontSize: "16px",
              height: "56px",
              lineHeight: "1",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            headerStyle={{
              fontWeight: 500,
              fontSize: "16px",
              height: "40px",
              background: "#F8F9FA",
              textAlign: "left",
            }}
          />
        </div>
      </div>
    );
  }

  // STEP 2: Upload Assessment
  return (
    <div>
      <div className="mt-10 ml-10 bg">
        {/* Back button and title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBackToBatches}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to batches</span>
          </button>
        </div>

        <h1 className="text-[#565E6C] text-2xl font-bold pb-4 font-primary">
          {selectedBatch?.title}
        </h1>

        <div className="flex mr-10 bg-white">
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

              {/* Custom Document Name Input */}
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
                      Click or drag file to upload
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
                  disabled={
                    !uploadedFile || !selectedDocType || excelData.length === 0
                  }
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    uploadedFile && selectedDocType && excelData.length
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

        {/* Assessment Preview Section */}

        {/* Excel Preview Table */}

        {uploadedFile &&
          excelData.length > 0 &&
          !assessments.some((a) => a.fileName === uploadedFile.name) && (
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
                  <div className="p-4 border-t border-gray-200 overflow-x-auto">
                    <p className="text-sm text-gray-600 mb-4">
                      File: {uploadedFile.name} ({excelData.length} rows)
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            {excelHeaders.map((header, index) => (
                              <th
                                key={index}
                                className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {excelData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {excelHeaders.map((header, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="border border-gray-300 px-4 py-2 text-sm text-gray-600"
                                >
                                  {row[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Uploaded Assessments List */}
        {assessments.length > 0 && (
          <div className="mt-8 mr-10">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Uploaded Assessments
              </h2>
              <div className="space-y-2">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
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
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                        Saved !
                      </span>
                      <span className="text-sm text-gray-500">
                        {assessment.uploadedDate?.toLocaleDateString()}
                      </span>

                      {/* not working */}

                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAssessment(assessment);
                        }}
                        style={{
                          transition: "0.2s",
                        }}
                        onMouseEnter={(e) =>
                          ((
                            e.currentTarget as HTMLElement
                          ).style.backgroundColor = "#F0F4FE")
                        }
                        onMouseLeave={(e) =>
                          ((
                            e.currentTarget as HTMLElement
                          ).style.backgroundColor = "transparent")
                        }
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
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

//make the entire card collapsible
/* To make donwload button work, create a sample file in public folder
if template is fixed
else
store in backend and fetch it here and trigger download
in.Net
[HttpGet("download-template")]
public IActionResult DownloadTemplate()
{
    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "assessment_template.xlsx");
    var fileBytes = System.IO.File.ReadAllBytes(filePath);
    return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Assessment_Template.xlsx");
}
 
 
in this page
const handleDownloadTemplate = async () => {
  const response = await fetch("https://yourapi.com/api/results/download-template");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Assessment_Template.xlsx";
  link.click();
  window.URL.revokeObjectURL(url);
};
 
 
*/
