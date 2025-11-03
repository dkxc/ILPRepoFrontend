import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import * as XLSX from "xlsx";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { Download, Upload } from "lucide-react";
import { traineeService } from "../../services/traineeService";
import type {
  CreateTraineeDto,
  CreateBoPhaseDto,
  CreateTraineeDuDto,
} from "../../services/traineeService";

type UploadType = "Trainee Details" | "BO Details" | "DU Details";

interface TraineeData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  traineeName?: string;
  traineeEmail?: string; // Email for BO/DU details
  buddy?: string;
  buddyDU?: string;
  duAllocated?: string;
  location?: string;
  ojtMentor?: string;
}

export default function UploadDetails() {
  const { id } = useParams<{ id: string }>();
  const batchId = id ? parseInt(id) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<UploadType | "">("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState<TraineeData[]>([]);
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const types: UploadType[] = ["Trainee Details", "BO Details", "DU Details"];

  // Fetch existing trainees for email lookup
  const { data: traineesData } = useQuery({
    queryKey: ["trainees", batchId],
    queryFn: () => traineeService.getTraineesByBatch(batchId!),
    enabled: !!batchId,
  });

  // Mutations for bulk uploads
  const bulkCreateTraineesMutation = useMutation({
    mutationFn: (trainees: CreateTraineeDto[]) =>
      traineeService.bulkCreateTrainees(batchId!, trainees),
    onSuccess: (response: { data: string | any[] }) => {
      notifications.show({
        title: "Success",
        message: `${response.data?.length || 0} trainees created successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["trainees", batchId] });
      handleCancel();
      if (batchId) navigate(`/batches/${batchId}`);
    },
    onError: (error: any) => {
      console.error("Bulk create trainees error:", error);
      notifications.show({
        title: "Error Creating Trainees",
        message: error.message || "Failed to create trainees",
        color: "red",
        autoClose: 5000,
      });
    },
  });

  const bulkCreateBoPhasesMutation = useMutation({
    mutationFn: (boPhases: CreateBoPhaseDto[]) =>
      traineeService.bulkCreateBoPhases(batchId!, boPhases),
    onSuccess: (response: { data: string | any[] }) => {
      notifications.show({
        title: "Success",
        message: `${response.data?.length || 0} BO phase assignments created successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["boPhases", batchId] });
      handleCancel();
      if (batchId) navigate(`/batches/${batchId}`);
    },
    onError: (error: any) => {
      console.error("Bulk create BO phases error:", error);
      notifications.show({
        title: "Error Creating BO Phases",
        message: error.message || "Failed to create BO phase assignments",
        color: "red",
        autoClose: 5000,
      });
    },
  });

  const bulkCreateTraineeDusMutation = useMutation({
    mutationFn: (traineeDus: CreateTraineeDuDto[]) =>
      traineeService.bulkCreateTraineeDus(batchId!, traineeDus),
    onSuccess: (response: { data: string | any[] }) => {
      notifications.show({
        title: "Success",
        message: `${response.data?.length || 0} DU assignments created successfully`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["traineeDus", batchId] });
      handleCancel();
      if (batchId) navigate(`/batches/${batchId}`);
    },
    onError: (error: any) => {
      console.error("Bulk create trainee DUs error:", error);
      notifications.show({
        title: "Error Creating DU Assignments",
        message: error.message || "Failed to create DU assignments",
        color: "red",
        autoClose: 5000,
      });
    },
  });

  useEffect(() => {
    if (data.length > 0 && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [data]);

  // --- Logic (unchanged) ---
  const parseExcelFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    let parsedData: TraineeData[] = [];
    if (selectedType === "Trainee Details") {
      parsedData = jsonData.map((row) => ({
        fullName: String(row["Full Name"] || "").trim(),
        email: String(row["Email"] || "")
          .trim()
          .toLowerCase(),
        phoneNumber: String(row["Phone Number"] || "").trim(), // Convert to string to handle Excel number format
      }));
    } else if (selectedType === "BO Details") {
      parsedData = jsonData.map((row) => ({
        traineeName: String(row["Trainee Name"] || "").trim(),
        traineeEmail: String(row["Trainee Email"] || "").trim(),
        buddy: String(row["Buddy"] || "").trim(),
        buddyDU: String(row["Buddy's DU"] || "").trim(),
      }));
    } else if (selectedType === "DU Details") {
      parsedData = jsonData.map((row) => ({
        traineeName: String(row["Trainee Name"] || "").trim(),
        traineeEmail: String(row["Trainee Email"] || "").trim(),
        duAllocated: String(row["DU allocated"] || "").trim(),
        location: String(row["Location"] || "").trim(),
        ojtMentor: String(row["OJT mentor"] || "").trim(),
      }));
    }

    setData(parsedData);
  };

  const handleFileSelect = (file: File | null) => {
    if (!selectedType || !file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    setUploadedFile(file);
    parseExcelFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selectedType) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] || null);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleDownloadTemplate = () => {
    if (!selectedType) return;
    let sampleData: any[] = [];
    if (selectedType === "Trainee Details") {
      sampleData = [
        {
          "Full Name": "John Doe",
          Email: "john@example.com",
          "Phone Number": "9876543210",
        },
      ];
    } else if (selectedType === "BO Details") {
      sampleData = [
        {
          "Trainee Name": "John Doe",
          "Trainee Email": "john@example.com",
          Buddy: "Jane Smith",
          "Buddy's DU": "DU-1",
        },
      ];
    } else if (selectedType === "DU Details") {
      sampleData = [
        {
          "Trainee Name": "John Doe",
          "Trainee Email": "john@example.com",
          "DU allocated": "DU-2",
          Location: "Bangalore",
          "OJT mentor": "Mentor A",
        },
      ];
    }
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedType);
    XLSX.writeFile(
      workbook,
      `${selectedType.replace(/\s/g, "_").toLowerCase()}_template.xlsx`,
    );
  };

  const handleCancel = () => {
    setSelectedType("");
    setUploadedFile(null);
    setData([]);
  };

  const handleSaveData = () => {
    if (!uploadedFile || data.length === 0 || !batchId) {
      notifications.show({
        title: "Error",
        message: "Batch ID is required for upload",
        color: "red",
      });
      return;
    }

    if (selectedType === "Trainee Details") {
      // Transform data to CreateTraineeDto format
      const trainees: CreateTraineeDto[] = data.map((item) => ({
        username: (item.fullName || "").trim(),
        email: (item.email || "").trim().toLowerCase(),
        password: "DefaultPassword123!", // TODO: Allow customization
        batchId: batchId,
        phoneNo: String(item.phoneNumber || "").trim(), // Convert to string to handle Excel number format
        status: "Active",
      }));

      // Validation
      const errors: string[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;

      trainees.forEach((trainee, index) => {
        const rowNum = index + 1;

        // Validate email format
        if (!trainee.email || !emailRegex.test(trainee.email)) {
          errors.push(
            `Row ${rowNum}: Invalid email format - "${trainee.email || ""}"`,
          );
        }

        // Validate phone number (must be exactly 10 digits)
        if (!trainee.phoneNo || !phoneRegex.test(trainee.phoneNo)) {
          errors.push(
            `Row ${rowNum}: Phone number must be exactly 10 digits - "${trainee.phoneNo || ""}"`,
          );
        }

        // Check for empty username
        if (!trainee.username) {
          errors.push(`Row ${rowNum}: Full name is required`);
        }
      });

      // If validation errors, show modal and cancel upload
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidationModal(true);
        return;
      }

      // Check for duplicate emails in existing trainees
      const existingEmails = new Set<string>();
      if (traineesData?.data) {
        traineesData.data.forEach((trainee: any) => {
          if (trainee.email) {
            existingEmails.add(trainee.email.toLowerCase().trim());
          }
        });
      }

      // Find duplicates
      const duplicates: string[] = [];
      trainees.forEach((trainee) => {
        if (existingEmails.has(trainee.email.toLowerCase())) {
          duplicates.push(trainee.email);
        }
      });

      if (duplicates.length > 0) {
        setDuplicateEmails(duplicates);
        setShowDuplicateModal(true);
        return;
      }

      bulkCreateTraineesMutation.mutate(trainees);
    } else if (selectedType === "BO Details") {
      // Transform data to CreateBoPhaseDto format
      const boPhases: CreateBoPhaseDto[] = data.map((item) => {
        const traineeName = (item.traineeName || "").trim();
        // ONLY use email from Excel - do NOT fallback to name lookup
        // (trainee names are NOT unique, so name-based lookup is unreliable)
        const email = (item.traineeEmail || "").trim().toLowerCase();

        return {
          traineeName,
          email,
          buddyName: (item.buddy || "").trim(),
          duName: (item.buddyDU || "").trim(),
        };
      });

      // Validate all trainees have valid names and emails
      const errors: string[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      boPhases.forEach((bp, index) => {
        const rowNum = index + 1;

        // Check if trainee name is empty
        if (!bp.traineeName) {
          errors.push(`Row ${rowNum}: Trainee name is required`);
        }

        // Check if email is missing
        if (!bp.email) {
          errors.push(
            `Row ${rowNum}: Email is required for trainee "${bp.traineeName || "Unknown"}". Please include "Trainee Email" column.`,
          );
        }
        // Check if email format is valid
        else if (!emailRegex.test(bp.email)) {
          errors.push(
            `Row ${rowNum}: Invalid email format for trainee "${bp.traineeName}" - "${bp.email}"`,
          );
        }
      });

      // Check if all trainee emails exist in the batch
      const existingEmails = new Set<string>();
      if (traineesData?.data) {
        traineesData.data.forEach((trainee: any) => {
          if (trainee.email) {
            existingEmails.add(trainee.email.toLowerCase().trim());
          }
        });
      }

      boPhases.forEach((bp, index) => {
        const rowNum = index + 1;
        if (bp.email && !existingEmails.has(bp.email.toLowerCase())) {
          errors.push(
            `Row ${rowNum}: Trainee with email "${bp.email}" does not exist in this batch. Please add the trainee first.`,
          );
        }
      });

      // If validation errors, show modal and cancel upload
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidationModal(true);
        return;
      }

      console.log("BO Phases payload for batch", batchId, ":", boPhases);
      bulkCreateBoPhasesMutation.mutate(boPhases);
    } else if (selectedType === "DU Details") {
      // Transform data to CreateTraineeDuDto format
      const traineeDus: CreateTraineeDuDto[] = data.map((item) => {
        const traineeName = (item.traineeName || "").trim();
        // ONLY use email from Excel - do NOT fallback to name lookup
        // (trainee names are NOT unique, so name-based lookup is unreliable)
        const email = (item.traineeEmail || "").trim().toLowerCase();

        return {
          traineeName,
          email, // Required field
          duName: (item.duAllocated || "").trim(),
          location: (item.location || "").trim(),
          ojtMenter: (item.ojtMentor || "").trim(), // Note: backend has typo 'ojtMenter'
        };
      });

      // Validate all trainees have valid names and emails
      const errors: string[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      traineeDus.forEach((td, index) => {
        const rowNum = index + 1;

        // Check if trainee name is empty
        if (!td.traineeName) {
          errors.push(`Row ${rowNum}: Trainee name is required`);
        }

        // Check if email is missing
        if (!td.email) {
          errors.push(
            `Row ${rowNum}: Email is required for trainee "${td.traineeName || "Unknown"}". Please include "Trainee Email" column.`,
          );
        }
        // Check if email format is valid
        else if (!emailRegex.test(td.email)) {
          errors.push(
            `Row ${rowNum}: Invalid email format for trainee "${td.traineeName}" - "${td.email}"`,
          );
        }
      });

      // Check if all trainee emails exist in the batch
      const existingEmails = new Set<string>();
      if (traineesData?.data) {
        traineesData.data.forEach((trainee: any) => {
          if (trainee.email) {
            existingEmails.add(trainee.email.toLowerCase().trim());
          }
        });
      }

      traineeDus.forEach((td, index) => {
        const rowNum = index + 1;
        if (td.email && !existingEmails.has(td.email.toLowerCase())) {
          errors.push(
            `Row ${rowNum}: Trainee with email "${td.email}" does not exist in this batch. Please add the trainee first.`,
          );
        }
      });

      // If validation errors, show modal and cancel upload
      if (errors.length > 0) {
        setValidationErrors(errors);
        setShowValidationModal(true);
        return;
      }

      bulkCreateTraineeDusMutation.mutate(traineeDus);
    }
  };

  const getColumns = (): ColumnDef<TraineeData>[] => {
    if (selectedType === "Trainee Details") {
      return [
        { key: "fullName", header: "Full Name", sortable: true, align: "left" },
        { key: "email", header: "Email", sortable: true, align: "left" },
        {
          key: "phoneNumber",
          header: "Phone Number",
          sortable: true,
          align: "left",
        },
      ];
    } else if (selectedType === "BO Details") {
      return [
        {
          key: "traineeName",
          header: "Trainee Name",
          sortable: true,
          align: "left",
        },
        {
          key: "traineeEmail",
          header: "Trainee Email",
          sortable: true,
          align: "left",
        },
        { key: "buddy", header: "Buddy", sortable: true, align: "left" },
        { key: "buddyDU", header: "Buddy's DU", sortable: true, align: "left" },
      ];
    } else if (selectedType === "DU Details") {
      return [
        {
          key: "traineeName",
          header: "Trainee Name",
          sortable: true,
          align: "left",
        },
        {
          key: "traineeEmail",
          header: "Trainee Email",
          sortable: true,
          align: "left",
        },
        {
          key: "duAllocated",
          header: "DU Allocated",
          sortable: true,
          align: "left",
        },
        { key: "location", header: "Location", sortable: true, align: "left" },
        {
          key: "ojtMentor",
          header: "OJT Mentor",
          sortable: true,
          align: "left",
        },
      ];
    }
    return [];
  };

  return (
    <div className="mt-5 mx-5 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h1 className="text-[#565E6C] text-2xl font-bold pb-6 font-primary">
        Upload Batch Data
      </h1>

      {/* Warning if no batchId */}
      {!batchId && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md mb-4">
          <p className="font-medium">⚠️ Warning: No batch selected</p>
          <p className="text-sm">
            Please navigate to this page from a batch details page to upload
            data.
          </p>
        </div>
      )}

      {/* Upload Card */}
      <div className="bg-white p-6 rounded-md shadow-md w-full">
        {/* Header + Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#565E6C] ">
            {selectedType ? `Upload ${selectedType}` : "Select Type of Details"}
          </h2>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as UploadType);
              setUploadedFile(null);
              setData([]);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={selectedType ? handleUploadClick : undefined}
          className={`border-2 border-dashed rounded-md p-12 text-center transition-colors cursor-pointer w-full ${
            !selectedType
              ? "bg-gray-50 cursor-not-allowed border-gray-300"
              : isDragging
                ? "bg-blue-50 border-blue-500"
                : uploadedFile
                  ? "bg-blue-50 border-blue-500"
                  : "bg-white border-blue-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={!selectedType}
          />
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className={`w-12 h-12 mb-3 ${
                !selectedType ? "text-gray-300" : "text-blue-500"
              }`}
            >
              <Upload size={32} />
            </div>
            {uploadedFile ? (
              <>
                <p className="text-blue-600 font-medium mb-1">
                  File uploaded successfully!
                </p>
                <p className="text-sm text-gray-600">{uploadedFile.name}</p>
              </>
            ) : (
              <p className="text-lg font-medium text-blue-500">
                Click or drag file to this area to upload
              </p>
            )}
          </div>
        </div>

        {/* Accepted Formats */}
        <p className="text-sm text-gray-500 mt-3 text-left">
          Accepted formats: <span className="font-medium">.xlsx, .xls</span>
        </p>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Template Download */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            If you do not have a file you can use this sample:
          </p>
          <button
            onClick={handleDownloadTemplate}
            className="p-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-300 rounded"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={
              bulkCreateTraineesMutation.isPending ||
              bulkCreateBoPhasesMutation.isPending ||
              bulkCreateTraineeDusMutation.isPending
            }
            className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveData}
            disabled={
              !uploadedFile ||
              data.length === 0 ||
              !batchId ||
              bulkCreateTraineesMutation.isPending ||
              bulkCreateBoPhasesMutation.isPending ||
              bulkCreateTraineeDusMutation.isPending
            }
            className={`px-5 py-1 rounded-md font-medium transition-colors ${
              uploadedFile &&
              data.length > 0 &&
              batchId &&
              !bulkCreateTraineesMutation.isPending &&
              !bulkCreateBoPhasesMutation.isPending &&
              !bulkCreateTraineeDusMutation.isPending
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {bulkCreateTraineesMutation.isPending ||
            bulkCreateBoPhasesMutation.isPending ||
            bulkCreateTraineeDusMutation.isPending
              ? "Uploading..."
              : "Save"}
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {uploadedFile && data.length > 0 && (
        <div
          ref={previewRef}
          className="mt-8 mb-6 bg-white pb-6 pt-2  rounded-md shadow-md w-full"
        >
          <DataTable
            showHeaderSection={true}
            headerTitle={`${selectedType} - Preview`}
            columns={getColumns()}
            data={data}
            enableSearch={false}
            enablePagination={false}
            enableSort={false}
            striped={true}
            highlightOnHover={true}
            withBorder={true}
            rowStyle={{
              fontSize: "16px",
              height: "56px",
              lineHeight: "1",
            }}
            headerStyle={{
              fontWeight: 500,
              fontSize: "16px",
              height: "40px",
              background: "#F8F9FA",
            }}
          />
        </div>
      )}

      {/* Validation Error Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Validation Errors Found
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Please fix the following validation errors in your data. Upload
                has been cancelled.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-96 overflow-y-auto">
                <ul className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-red-700 text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowValidationModal(false);
                  setValidationErrors([]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Email Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Duplicate Emails Found
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                The following email(s) already exist in the database. Upload has
                been cancelled.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-60 overflow-y-auto">
                <ul className="list-disc list-inside space-y-1">
                  {duplicateEmails.map((email, index) => (
                    <li key={index} className="text-red-700 text-sm">
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicateEmails([]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
