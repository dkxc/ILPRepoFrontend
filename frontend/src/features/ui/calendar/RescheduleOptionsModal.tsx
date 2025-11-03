// components/RescheduleOptionsModal.tsx (New component for handling reschedule conflicts)

import { Calendar, ArrowRight, X } from "lucide-react";

// components/RescheduleOptionsModal.tsx (Fixed - proper event handling with brand colors)

type RescheduleOptionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onKeep: () => void;
  onPush: () => void;
  onPull?: () => void;
  isPreponed?: boolean;
  onRescheduleAll?: (newDate: Date) => void;
};

const RescheduleOptionsModal = ({
  isOpen,
  onClose,
  onKeep,
  onPush,
  onPull,
  isPreponed,
}: RescheduleOptionsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm font-secondary">
      <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-yellow-500 to-yellow-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Schedule Conflict Detected
              </h3>
              <p className="text-sm text-yellow-100">
                The selected date already has events scheduled
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-text-base mb-6">
            How would you like to handle the scheduling conflict?
          </p>

          <div className="space-y-3">
            {/* Keep Both Option */}
            <button
              onClick={onKeep}
              className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand hover:bg-brand-50 transition-all group"
            >
              <div className="p-2 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors">
                <Calendar className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-text-base mb-1">
                  Keep Both Events
                </h4>
                <p className="text-sm text-gray-600">
                  Schedule both events on the same day. The new event will be
                  added alongside existing events.
                </p>
              </div>
            </button>

            {/* Pull Events Option (move existing events one day earlier) - shown only for pre-poning */}
            {isPreponed && (
              <button
                onClick={onPull}
                className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand hover:bg-brand-50 transition-all group"
              >
                <div className="p-2 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors">
                  <ArrowRight className="w-5 h-5 text-brand rotate-180" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-text-base mb-1">
                    Pull Events One Day Before
                  </h4>
                  <p className="text-sm text-gray-600">
                    Move existing events on the selected date one day earlier
                    (skipping holidays). Use this to make room when pre-poning
                    an event.
                  </p>
                </div>
              </button>
            )}

            {/* Push Events Option */}
            <button
              onClick={onPush}
              className="w-full flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-brand hover:bg-brand-50 transition-all group"
            >
              <div className="p-2 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors">
                <ArrowRight className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-text-base mb-1">
                  Push All Events Forward
                </h4>
                <p className="text-sm text-gray-600">
                  Move all events (including this one and existing ones) to
                  consecutive available days, skipping holidays.
                </p>
              </div>
            </button>

            {/* Cancel Option */}
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:bg-inactive-badge transition-all"
            >
              <X className="w-5 h-5 text-text-base" />
              <span className="font-medium text-text-base">Go Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleOptionsModal;
