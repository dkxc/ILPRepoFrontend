import { FileText } from "lucide-react";

export interface Document {
  id: number;
  name: string;
  format: string[];
}

interface DocumentSelectorProps {
  selectedDoc: Document | null;
  onSelect: (doc: Document) => void;
}

const DocumentSelector = ({ selectedDoc, onSelect }: DocumentSelectorProps) => {
  // Sample documents - in a real app, this would come from props or an API
  const documents: Document[] = [
    { id: 1, name: "Resume", format: [".pdf", ".docx"] },
    { id: 2, name: "Certificate", format: [".pdf"] },
    { id: 3, name: "Progress Report", format: [".xlsx"] },
  ];

  return (
    <div className="w-80 bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold">Select Document Type</h3>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
              selectedDoc?.id === doc.id
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50 border border-transparent"
            }`}
            onClick={() => onSelect(doc)}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <span className="text-gray-700 font-medium">{doc.name}</span>
                <p className="text-xs text-gray-500">
                  Formats: {doc.format.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentSelector;
