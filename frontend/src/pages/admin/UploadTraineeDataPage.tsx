import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type DragEvent,
} from "react";
import * as XLSX from "xlsx";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import { Download, Upload } from "lucide-react";

type UploadType = "Trainee Details" | "BO Details" | "DU Details";

interface TraineeData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  traineeName?: string;
  buddy?: string;
  buddyDU?: string;
  duAllocated?: string;
  location?: string;
  ojtMentor?: string;
}

export default function UploadDetails() {
  const [selectedType, setSelectedType] = useState<UploadType | "">("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState<TraineeData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const types: UploadType[] = ["Trainee Details", "BO Details", "DU Details"];

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
        fullName: row["Full Name"] || "",
        email: row["Email"] || "",
        phoneNumber: row["Phone Number"] || "",
      }));
    } else if (selectedType === "BO Details") {
      parsedData = jsonData.map((row) => ({
        traineeName: row["Trainee Name"] || "",
        buddy: row["Buddy"] || "",
        buddyDU: row["Buddy's DU"] || "",
      }));
    } else if (selectedType === "DU Details") {
      parsedData = jsonData.map((row) => ({
        traineeName: row["Trainee Name"] || "",
        duAllocated: row["DU allocated"] || "",
        location: row["Location"] || "",
        ojtMentor: row["OJT mentor"] || "",
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
          Buddy: "Jane Smith",
          "Buddy's DU": "DU-1",
        },
      ];
    } else if (selectedType === "DU Details") {
      sampleData = [
        {
          "Trainee Name": "John Doe",
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
    if (!uploadedFile || data.length === 0) return;
    console.log("Saving data:", data);
    alert(`${data.length} entries saved successfully!`);
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
            className="px-4 py-1 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveData}
            disabled={!uploadedFile || data.length === 0}
            className={`px-5 py-1 rounded-md font-medium transition-colors ${
              uploadedFile && data.length > 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save
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
    </div>
  );
}
