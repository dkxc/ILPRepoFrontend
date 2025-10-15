import { useState } from "react";
import { Upload, X, Plus, FileText } from "lucide-react";

// Document Selector Component
const DocumentSelector = ({
  documents,
  selectedDocs,
  onDocumentToggle,
  onAddDocument,
}) => {
  const [newDocName, setNewDocName] = useState("");
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  const handleAddClick = () => {
    if (newDocName.trim()) {
      onAddDocument(newDocName.trim());
      setNewDocName("");
      setIsAddingDoc(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddClick();
    }
  };

  return (
    <div className="w-64 bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Select Document
        </h3>

        {/* Add document input */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsAddingDoc(true)}
            placeholder="Add new document..."
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddClick}
            disabled={!newDocName.trim()}
            className={`p-1.5 rounded transition-colors ${
              newDocName.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Add document"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
              selectedDocs.includes(doc.id)
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onDocumentToggle(doc.id)}
          >
            <span className="text-sm">{doc.name}</span>
            {selectedDocs.includes(doc.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDocumentToggle(doc.id);
                }}
                className="hover:bg-white/50 rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {documents.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No documents yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
};

// File Upload Component
const FileUpload = ({
  onFileSelect,
  onCancel,
  acceptedFormats = [".xlsx", ".pdf"],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();

    if (acceptedFormats.includes(fileExtension)) {
      setSelectedFile(file);
    } else {
      alert(
        `Please select a valid file format (${acceptedFormats.join(", ")})`,
      );
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <Upload className="w-6 h-6 text-blue-500" />
          </div>

          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click or drag file to this area to upload
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={acceptedFormats.join(",")}
                onChange={handleFileInput}
              />
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Format accepted is {acceptedFormats.join(", ")}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          If you do not have a file you can use this sample:
        </p>
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm">
          <FileText className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`px-4 py-2 rounded transition-colors ${
            selectedFile
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

// Example usage - simple demo
export default function App() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "BRD file" },
    { id: 2, name: "Sprint Tracker" },
    { id: 3, name: "UAT file" },
    { id: 4, name: "MOM documentation" },
  ]);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDocumentToggle = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  const handleAddDocument = (docName) => {
    const newId = Math.max(...documents.map((d) => d.id), 0) + 1;
    const newDoc = { id: newId, name: docName };
    setDocuments([...documents, newDoc]);
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    alert(`File uploaded: ${file.name}`);
  };

  const handleCancel = () => {
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Document Management System
        </h1>

        <div className="flex gap-6">
          <DocumentSelector
            documents={documents}
            selectedDocs={selectedDocs}
            onDocumentToggle={handleDocumentToggle}
            onAddDocument={handleAddDocument}
          />

          <FileUpload
            onFileSelect={handleFileSelect}
            onCancel={handleCancel}
            acceptedFormats={[".xlsx", ".pdf"]}
          />
        </div>

        {selectedDocs.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected documents:</strong> {selectedDocs.length}{" "}
              document(s) selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
