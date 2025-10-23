import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  Download,
  SquarePen,
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import DataTable, { type ColumnDef } from "../../features/ui/Table";
import Button from "../../features/ui/Button";
import type { BatchDocument } from "../../features/trainee/types/Batch.types";

interface DocumentRow {
  id: number;
  documentName: string;
  deadline: string;
  templateFile: File | null;
}

export default function Results() {
  // State management
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedBatch, setSelectedBatch] = useState<BatchDocument | null>(
    null,
  );
  const [documentRows, setDocumentRows] = useState<DocumentRow[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{
    documentName: string;
    deadline: string;
  } | null>(null);

  // Mock data
  const batchesData: BatchDocument[] = [
    {
      id: 1,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
    },
    {
      id: 2,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
    },
    {
      id: 3,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
    },
    {
      id: 4,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
    },
    {
      id: 5,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
    },
    {
      id: 6,
      title: "ILP 2025-26 Batch 7",
      type: "Developer Trainee",
      totalTrainees: 36,
    },
    {
      id: 7,
      title: "ILP 2025-26 Batch 8",
      type: "Developer Trainee",
      totalTrainees: 40,
    },
    {
      id: 8,
      title: "ILP 2025-26 Batch 9",
      type: "Developer Trainee",
      totalTrainees: 35,
    },
  ];

  const handleRowClick = (row: BatchDocument) => {
    setSelectedBatch(row);
    setStep(2);
    // Initialize with 3 default documents
    setDocumentRows([
      { id: 1, documentName: "BRD", deadline: "", templateFile: null },
      { id: 2, documentName: "UAT", deadline: "", templateFile: null },
      {
        id: 3,
        documentName: "Sprint Tracker",
        deadline: "",
        templateFile: null,
      },
    ]);
  };

  const handleBackToBatches = () => {
    setStep(1);
    setSelectedBatch(null);
    setDocumentRows([]);
  };

  const columns: ColumnDef<BatchDocument>[] = [
    {
      key: "title",
      header: "Name",
      sortable: true,
      width: "40%",
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      width: "30%",
    },
    {
      key: "totalTrainees",
      header: "Total Trainees",
      sortable: true,
      align: "center",
      width: "30%",
    },
  ];

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

  // STEP 2: Document Upload

  const handleAddDocument = () => {
    const newDoc: DocumentRow = {
      id: Date.now(),
      documentName: `Document ${documentRows.length + 1}`,
      deadline: new Date().toISOString().split("T")[0],
      templateFile: null,
    };
    setDocumentRows([...documentRows, newDoc]);
  };

  const handleTemplateUpload = (id: number, file: File) => {
    setDocumentRows(
      documentRows.map((doc) =>
        doc.id === id ? { ...doc, templateFile: file } : doc,
      ),
    );
    notifications.show({
      title: "Template Uploaded",
      message: `Template uploaded for ${documentRows.find((d) => d.id === id)?.documentName}`,
      color: "green",
    });
  };

  const handleDeleteTemplate = (id: number) => {
    const doc = documentRows.find((d) => d.id === id);
    setDocumentRows(
      documentRows.map((d) => (d.id === id ? { ...d, templateFile: null } : d)),
    );
    notifications.show({
      title: "Template Removed",
      message: `Template removed for ${doc?.documentName}`,
      color: "orange",
    });
  };

  const handleDocumentNameChange = (newName: string) => {
    setEditDraft((draft) =>
      draft ? { ...draft, documentName: newName } : draft,
    );
  };

  const handleDeadlineChange = (newDeadline: string) => {
    setEditDraft((draft) =>
      draft ? { ...draft, deadline: newDeadline } : draft,
    );
  };

  const handleDeleteRow = (id: number) => {
    setDocumentRows(documentRows.filter((doc) => doc.id !== id));
    notifications.show({
      title: "Deleted",
      message: "Document record deleted",
      color: "red",
    });
  };

  const documentColumns: ColumnDef<DocumentRow>[] = [
    {
      key: "documentName",
      header: "Document Name",
      sortable: true,
      width: "25%",
      render: (_, row) =>
        editingRowId === row.id ? (
          <input
            type="text"
            value={editDraft?.documentName ?? row.documentName}
            onChange={(e) => handleDocumentNameChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            placeholder="Enter document name"
          />
        ) : (
          <span>{row.documentName}</span>
        ),
    },
    {
      key: "deadline",
      header: "Deadline",
      sortable: true,
      width: "25%",
      render: (_, row) =>
        editingRowId === row.id ? (
          <input
            type="date"
            value={editDraft?.deadline ?? row.deadline}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span>{row.deadline || "No deadline"}</span>
        ),
    },
    {
      key: "templateFile",
      header: "Template Upload",
      align: "center",
      width: "30%",
      render: (value, row) => (
        <div className="flex items-center justify-center gap-2">
          {value ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <Download className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  {(value as File).name}
                </span>
              </div>
              <Button
                variant="default"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleDeleteTemplate(row.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <input
                type="file"
                id={`template-upload-${row.id}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleTemplateUpload(row.id, file);
                }}
              />
              <label htmlFor={`template-upload-${row.id}`}>
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    document
                      .getElementById(`template-upload-${row.id}`)
                      ?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Template
                </Button>
              </label>
            </>
          )}
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      width: "15%",
      render: (_value, row) =>
        editingRowId === row.id ? (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setDocumentRows(
                  documentRows.map((doc) =>
                    doc.id === row.id ? { ...doc, ...editDraft! } : doc,
                  ),
                );
                setEditingRowId(null);
                setEditDraft(null);
                notifications.show({
                  title: "Saved",
                  message: `Document updated`,
                  color: "green",
                });
              }}
            >
              Save
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-gray-400 hover:bg-gray-500"
              onClick={() => {
                setEditingRowId(null);
                setEditDraft(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              title="Delete"
              onClick={() => handleDeleteRow(row.id)}
            >
              <Trash2 className="h-5 w-5 text-white" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="default"
              size="default"
              className="bg-brand rounded-lg px-4 py-2 flex items-center justify-center text-white border border-brand/30 hover:bg-brand/90 transition-colors"
              title="Edit"
              onClick={() => {
                setEditingRowId(row.id);
                setEditDraft({
                  documentName: row.documentName,
                  deadline: row.deadline,
                });
              }}
            >
              <SquarePen className="h-6 w-6 text-white mr-2" />
              Edit
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              title="Delete"
              onClick={() => handleDeleteRow(row.id)}
            >
              <Trash2 className="h-5 w-5 text-white" />
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* Back button and title */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToBatches}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to batches</span>
          </button>
        </div>

        <Button
          onClick={handleAddDocument}
          size="sm"
          className="rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add Document
        </Button>
      </div>

      <h1 className="text-[#565E6C] text-2xl font-bold pb-4 px-4 font-primary">
        {selectedBatch?.title}
      </h1>

      <div className="p-2 sm:p-0 rounded-lg">
        <DataTable
          columns={documentColumns}
          data={documentRows}
          showHeaderSection={true}
          headerTitle="Documents"
          headerTitleStyle={{ fontSize: "16px", fontWeight: 500 }}
          enableSearch={true}
          searchPlaceholder="Search documents..."
          enablePagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50]}
          striped={false}
          highlightOnHover={true}
          withBorder={false}
          tableStyle={{
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
          rowStyle={{
            fontSize: "16px",
            height: "64px",
            lineHeight: "1",
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
