// components/DeleteConfirmModal.tsx

import { AlertTriangle, Trash2, X } from "lucide-react";

// components/DeleteConfirmModal.tsx (Updated with brand colors)

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm font-secondary">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Delete Session</h3>
              <p className="text-sm text-red-100">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-text-base mb-2">
            Are you sure you want to delete this session?
          </p>
          <div className="p-4 bg-inactive-badge border border-gray-200 rounded-lg">
            <p className="font-semibold text-text-base">
              {eventTitle || "Untitled Session"}
            </p>
          </div>
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This will permanently remove the session from your schedule.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-inactive-badge text-text-base rounded-xl hover:bg-inactive-badge-hover transition-colors font-medium"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
