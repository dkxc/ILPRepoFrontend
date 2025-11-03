// components/HolidayConflictModal.tsx

import { AlertTriangle, CalendarX, Trash2, X } from "lucide-react";

type HolidayConflictModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onReschedule: () => void;
  eventCount: number;
};

const HolidayConflictModal = ({
  isOpen,
  onClose,
  onDelete,
  onReschedule,
  eventCount,
}: HolidayConflictModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm font-secondary">
      <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Sessions Conflict Detected
              </h3>
              <p className="text-sm text-yellow-100">
                {eventCount} session{eventCount > 1 ? "s" : ""} scheduled on
                this day
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-text-base mb-6">
            This day has <strong>{eventCount}</strong> session
            {eventCount > 1 ? "s" : ""} scheduled. What would you like to do
            with {eventCount > 1 ? "them" : "it"}?
          </p>

          <div className="space-y-3">
            {/* Reschedule Option */}
            <button
              onClick={onReschedule}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-brand to-brand-hover text-brand-foreground rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-md group"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <CalendarX className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold mb-1">
                  Reschedule to Another Date
                </h4>
                <p className="text-sm text-brand-100">
                  Move {eventCount > 1 ? "all sessions" : "the session"} to
                  consecutive available days
                </p>
              </div>
            </button>

            {/* Delete Option */}
            <button
              onClick={onDelete}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md group"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold mb-1">Delete Permanently</h4>
                <p className="text-sm text-red-100">
                  Remove {eventCount > 1 ? "all sessions" : "the session"} from
                  the schedule
                </p>
              </div>
            </button>

            {/* Cancel Option */}
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:bg-inactive-badge transition-all"
            >
              <X className="w-5 h-5 text-text-base" />
              <span className="font-medium text-text-base">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayConflictModal;
