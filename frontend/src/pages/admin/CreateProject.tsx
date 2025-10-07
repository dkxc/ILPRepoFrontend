import {
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
  useEffect,
} from "react";
import { Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import DataTable, { type ColumnDef } from "../../features/ui/Table";

interface ProjectData {
  projectName: string;
  teamLead: string;
  scrumMaster: string;
  teamMembers: string;
}

export default function CreateProject() {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const batches: string[] = [
    "ILP Batch 1 - 2029-26",
    "ILP Batch 2 - 2029-26",
    "ILP Batch 3 - 2029-26",
    "ILP Batch 1 - 2025-26",
    "ILP Batch 2 - 2025-26",
    "ILP Batch 3 - 2025-26",
    "ILP Batch 4 - 2025-26",
  ];

  // Filter batches based on search query
  const filteredBatches = batches.filter((batch) =>
    batch.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns: ColumnDef<ProjectData>[] = [
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      align: "left",
    },
    {
      key: "teamLead",
      header: "Team Lead",
      sortable: true,
      align: "left",
    },
    {
      key: "scrumMaster",
      header: "Scrum Master",
      sortable: true,
      align: "left",
    },
    {
      key: "teamMembers",
      header: "Team Members",
      sortable: false,
      align: "left",
    },
  ];

  // Auto scroll to preview when data is loaded
  useEffect(() => {
    if (projectsData.length > 0 && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [projectsData]);

  const parseExcelFile = async (file: File): Promise<void> => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      // Map rows to ProjectData structure
      const parsedProjects: ProjectData[] = jsonData.map((row) => ({
        projectName: row["Project Name"] || "",
        teamLead: row["Team Lead"] || "",
        scrumMaster: row["Scrum Master"] || "",
        teamMembers: row["Team Members"] || "",
      }));

      setProjectsData(parsedProjects);
    } catch (error) {
      console.error("Error reading Excel file:", error);
      alert("Error reading Excel file. Please check the file format.");
    }
  };

  const handleBatchSelect = (batch: string): void => {
    setSelectedBatch(batch);
    // Reset file when changing batch
    setUploadedFile(null);
    setProjectsData([]);
  };

  const handleFileSelect = (file: File | null): void => {
    if (!selectedBatch || !file) return;

    // Check if file is .xlsx format
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      setUploadedFile(file);
      parseExcelFile(file);
    } else {
      alert("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (selectedBatch) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    if (!selectedBatch) return;

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleUploadClick = (): void => {
    if (selectedBatch && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveProjects = (): void => {
    if (!uploadedFile || !selectedBatch || projectsData.length === 0) return;

    // TODO: Implement actual save logic here
    console.log("Saving projects for batch:", selectedBatch);
    console.log("Projects data:", projectsData);
    alert(
      `${projectsData.length} projects saved successfully for ${selectedBatch}`,
    );
  };

  const handleCancel = (): void => {
    setSelectedBatch("");
    setUploadedFile(null);
    setProjectsData([]);
  };

  const handleDownloadTemplate = (): void => {
    const sampleData = [
      {
        "Project Name": "ILP Repo Project",
        "Team Lead": "Alex Jose Philip",
        "Scrum Master": "Nino Jagadish",
        "Team Members":
          "Carol George, Maria Mathew, Jacob Holmes, Garvin Haines",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

    XLSX.writeFile(workbook, "project_template.xlsx");
  };

  return (
    <div>
      <div className="mt-10 ml-10 bg ">
        <h1 className="text-[#565E6C] text-2xl font-bold pb-4 font-primary">
          Create Project
        </h1>
        <div className="flex  h-105 mr-10 bg-white">
          {/* Sidebar - Batch Selection */}
          <div className="w-64  border-r border-gray-200 p-4 overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Select Batch</h2>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch, index) => (
                  <button
                    key={index}
                    onClick={() => handleBatchSelect(batch)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedBatch === batch
                        ? "bg-blue-200 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {batch}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No batches found
                </p>
              )}
            </div>
          </div>

          {/* Main Content - Upload Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-140">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 rounded-md border-dashed rounded-me p-12 text-center transition-colors h-46 w-140  ${
                  !selectedBatch
                    ? " bg-gray-50 cursor-not-allowed border-gray-500"
                    : isDragging
                      ? "bg-primary-50 border-primary"
                      : uploadedFile
                        ? " bg-primary-50 border-primary"
                        : "bg-white border-primary"
                }`}
                onClick={handleUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={!selectedBatch}
                />

                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12  ${
                      !selectedBatch ? "text-gray-300" : "text-primary"
                    }`}
                  >
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
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.5 12L11.5 9L14.5 12"
                        stroke="#2563EB"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.5 9V18"
                        stroke="#2563EB"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>

                  {uploadedFile ? (
                    <>
                      <p className="text-primary font-medium mb-2">
                        File uploaded successfully!
                      </p>
                      <p className="text-sm text-gray-600">
                        {uploadedFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-lg font-medium mb-2 text-primary `}>
                        Click or drag file to this area to upload
                      </p>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 mt-4">
                Format accepted is .xlsx
              </p>
              <div className="w-140 bg-gray-300 h-0.25"></div>
              <div className="mt-4 flex flex-row items-center  gap-4">
                <p className="text-sm text-gray-500 mb-0">
                  If you do not have a file you can use this sample:
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="p-1 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm border border-gray-300 rounded"
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
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H10L15 6V17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19Z"
                      stroke="#2563EB"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4 9H12V16H4V9Z"
                      stroke="#2563EB"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4 13H12"
                      stroke="#2563EB"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 9V16"
                      stroke="#2563EB"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Download Template
                </button>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProjects}
                  disabled={
                    !uploadedFile || !selectedBatch || projectsData.length === 0
                  }
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    uploadedFile && selectedBatch && projectsData.length > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save Projects
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Preview Table */}
        {uploadedFile && projectsData.length > 0 && (
          <div className="-p-12 mt-8">
            {/* <div ref={previewRef} className="mt-8  px-8 text-left">
                            <h2 className="text-lg font-semibold mb-4 text-gray-700">
                                Projects - Preview ({selectedBatch})
                            </h2>

                        </div> */}
            <div className="justify-start -ml-10 bg">
              <DataTable
                showHeaderSection={true}
                headerTitle={`Projects - Preview (${selectedBatch})`}
                columns={columns}
                data={projectsData}
                enableSearch={false}
                enablePagination={false}
                enableSort={false}
                striped={true}
                highlightOnHover={true}
                withBorder={true}
                rowStyle={{
                  fontSize: "16px",
                  height: "56px",
                  // padding: "12px 0",
                  lineHeight: "1",
                  // borderBottom: "1px solid #E5E7EB",
                }}
                headerStyle={{
                  fontWeight: 500,
                  fontSize: "16px",
                  height: "40px",
                  background: "#F8F9FA",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
