import React, { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  filename: string;
}

interface ProjectDocumentsProps {
  initialDocuments?: Document[];
}

function ProjectDocuments({ initialDocuments = [] }: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>(
    initialDocuments.length > 0
      ? initialDocuments
      : [
          { id: '1', name: 'BRD file', filename: 'brd_PROJECT.pdf' },
          { id: '2', name: 'UAT file', filename: 'repo_uat.docx' },
          { id: '3', name: 'Sprint Tracker file', filename: 'tracker.docx' },
          { id: '4', name: 'UAT file', filename: 'repo_uat.docx' },
        ]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocFilename, setNewDocFilename] = useState('');
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifSubject, setNotifSubject] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleAdd = () => {
    if (newDocName.trim() && newDocFilename.trim()) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: newDocName.trim(),
        filename: newDocFilename.trim(),
      };
      setDocuments([...documents, newDoc]);
      setNewDocName('');
      setNewDocFilename('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white p-[10px]" style={{ marginLeft: 20, marginTop: 40, marginRight: 20 }}>
      <div className="pl-4 pr-5">
  <div className="flex items-center justify-between mb-12">
          <h2 className="text-base font-semibold text-gray-900">Project Document</h2>
          <div className="flex gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ fontSize: '0.85rem' }}
              onClick={() => setShowNotifModal(true)}
            >
              Send Notification
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ fontSize: '0.85rem' }}
              onClick={() => setIsAdding(true)}
            >
              Upload Documents
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {doc.name}
                </div>
                <div className="text-xs text-gray-500 truncate">{doc.filename}</div>
              </div>
              <button
                className="ml-3 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                onClick={() => handleDelete(doc.id)}
                title="Delete document"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Send Notification Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-bold mb-2">Send Message</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Subject</label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={notifSubject}
                onChange={e => setNotifSubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">Message</label>
              <textarea
                className="border border-gray-300 rounded px-3 py-2 w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={notifMessage}
                onChange={e => setNotifMessage(e.target.value)}
                placeholder="Enter message"
              />
            </div>
            <div className="flex justify-center gap-3 mt-2">
              <button
                className="bg-white border border-blue-600 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ fontSize: '0.85rem' }}
                onClick={() => setShowNotifModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{ fontSize: '0.85rem' }}
                onClick={() => setShowNotifModal(false)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Document</h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewDocName('');
                  setNewDocFilename('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Document Name
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDocName}
                onChange={e => setNewDocName(e.target.value)}
                placeholder="e.g., BRD file"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Filename
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDocFilename}
                onChange={e => setNewDocFilename(e.target.value)}
                placeholder="e.g., document.pdf"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => {
                  setIsAdding(false);
                  setNewDocName('');
                  setNewDocFilename('');
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAdd}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDocuments;