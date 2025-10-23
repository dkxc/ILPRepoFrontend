import { useState } from "react";
import Button from "../../ui/Button";
import { Trash2, X, CircleCheckBig } from "lucide-react";
import DocumentSubmissionModal from "../../ui/DocumentUpload";

interface Document {
  id: string;
  name: string;
  filename: string;
}

interface ProjectDocumentsProps {
  initialDocuments?: Document[];
  canUpload?: boolean;
  canDelete?: boolean;
  canNotify?: boolean;
}

function ProjectDocuments({
  initialDocuments = [],
  canUpload = true,
  canDelete = true,
  canNotify = false,
}: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>(
    initialDocuments.length > 0
      ? initialDocuments
      : [
          { id: "1", name: "BRD file", filename: "brd_PROJECT.pdf" },
          { id: "2", name: "UAT file", filename: "repo_uat.docx" },
          { id: "3", name: "Sprint Tracker file", filename: "tracker.docx" },
          { id: "4", name: "UAT file", filename: "repo_uat.docx" },
        ],
  );
  const [showStepper, setShowStepper] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifySubject, setNotifySubject] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <div className="bg-white px-4 md:px-8 py-6 mt-10">
      <div className="pl-4 pr-5">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-lg font-bold text-gray-900">Project Files</h2>
          {canUpload && (
            <div className="flex gap-3">
              <Button
                size="default"
                variant="default"
                className="h-10 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150"
                onClick={() => setShowStepper(true)}
              >
                Upload Documents
              </Button>
              {canNotify && (
                <Button
                  size="default"
                  variant="default"
                  className="h-10 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150"
                  onClick={() => setIsNotifyOpen(true)}
                >
                  Send Notification
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {documents.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {doc.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {doc.filename}
                </div>
              </div>
              {(canDelete || canNotify) && (
                <div className="flex items-center gap-2">
                  {canNotify && idx < 3 && (
                    <CircleCheckBig className="h-5 w-5 text-green-500" />
                  )}
                  {canDelete && (
                    <Button
                      size="icon"
                      className="h-4 w-4 p-1 transition-colors flex-shrink-0 bg-transparent hover:bg-transparent [&_svg]:size-5 hover:[&_svg]:text-red-500"
                      onClick={() => handleDelete(doc.id)}
                      title="Delete document"
                    >
                      <Trash2 className="text-gray-400 hover:text-red-500 transition-colors" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Send Notification Modal removed for trainee side */}
      {/* Stepper Modal Integration */}
      <DocumentSubmissionModal
        isOpen={showStepper}
        onClose={() => setShowStepper(false)}
        onSubmit={() => {
          setShowStepper(false);
        }}
      />

      {isNotifyOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Message</h3>
              <Button
                onClick={() => {
                  setIsNotifyOpen(false);
                  setNotifySubject("");
                  setNotifyMessage("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={notifySubject}
                onChange={(e) => setNotifySubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                placeholder="Enter message"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <div className="flex justify-center gap-4 w-full">
                <Button
                  variant="default"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={() => {
                    setIsNotifyOpen(false);
                    setNotifySubject("");
                    setNotifyMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-150"
                  onClick={() => {
                    // handle send notification logic here
                    setIsNotifyOpen(false);
                    setNotifySubject("");
                    setNotifyMessage("");
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDocuments;
