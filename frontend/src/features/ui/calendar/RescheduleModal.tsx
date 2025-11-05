// components/RescheduleModal.tsx

import { useState } from "react";
// components/RescheduleModal.tsx (Updated with better UI)

import { Calendar, AlertCircle } from "lucide-react";

// components/RescheduleModal.tsx (Updated with brand colors)

type RescheduleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: Date) => void;
  currentYear: number;
  currentMonth: number;
  isHolidayDay: (day: number, month: number, year: number) => boolean;
};

const RescheduleModal = ({
  isOpen,
  onClose,
  onConfirm,
  isHolidayDay,
}: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);

      if (
        isHolidayDay(
          newDate.getDate(),
          newDate.getMonth(),
          newDate.getFullYear(),
        )
      ) {
        setError("Cannot reschedule to a holiday. Please choose another date.");
        return;
      }

      onConfirm(newDate);
      setSelectedDate("");
      setError("");
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm font-secondary">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand to-brand-hover px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Reschedule Session
              </h3>
              <p className="text-sm text-brand-100">
                Select a new date for this session
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-sm font-medium text-text-base mb-2">
            New Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"
          />

          {error && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="mt-3 p-3 bg-brand-50 border border-brand-200 rounded-lg">
            <p className="text-xs text-brand-700">
              <strong>Note:</strong> If the new date already has events, you'll
              be asked whether to keep both or push events to the next available
              days.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleConfirm}
            disabled={!selectedDate}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-brand to-brand-hover text-brand-foreground rounded-xl hover:from-brand-700 hover:to-brand-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-md disabled:shadow-none"
          >
            Confirm Reschedule
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-5 py-3 bg-inactive-badge text-text-base rounded-xl hover:bg-inactive-badge-hover transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
