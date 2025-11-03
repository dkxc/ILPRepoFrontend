// components/MonthPicker.tsx

import { useState, useRef } from "react";
import { monthNames } from "./CalendarUtils";

// components/MonthPicker.tsx (Updated with Go to Today button)

import { Calendar } from "lucide-react";

// components/MonthPicker.tsx (Updated with brand colors)

type MonthPickerProps = {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: number;
  currentYear: number;
  onSelect: (month: number, year: number) => void;
  onGoToToday: () => void;
};

const MonthPicker = ({
  isOpen,
  onClose,
  currentMonth,
  currentYear,
  onSelect,
  onGoToToday,
}: MonthPickerProps) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const startYear = 1990;
  const endYear = 2100;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const monthRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const yearRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelect(selectedMonth, selectedYear);
    onClose();
  };

  const handleGoToToday = () => {
    onGoToToday();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm font-secondary"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 bg-gradient-to-r from-brand-50 to-brand-100">
          <button
            onClick={onClose}
            className="text-brand font-medium hover:text-brand-hover transition-colors"
          >
            Cancel
          </button>
          <h3 className="text-base font-semibold text-text-base">
            Select Month & Year
          </h3>
          <button
            onClick={handleConfirm}
            className="text-brand font-medium hover:text-brand-hover transition-colors"
          >
            Done
          </button>
        </div>

        {/* Go to Today Button */}
        <div className="px-6 py-3 border-b border-gray-200 bg-inactive-badge">
          <button
            onClick={handleGoToToday}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand to-brand-hover text-brand-foreground rounded-lg hover:from-brand-700 hover:to-brand-800 transition-colors font-medium shadow-sm"
          >
            <Calendar size={18} />
            Go to Today
          </button>
        </div>

        {/* iOS-style Picker */}
        <div className="flex h-64 overflow-hidden relative bg-card">
          {/* Selection indicator */}
          <div className="absolute inset-0 flex items-center pointer-events-none z-10">
            <div className="w-full h-12 border-y-2 border-brand-200 bg-brand-50/30"></div>
          </div>

          {/* Month Picker */}
          <div className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory">
            <div className="py-24">
              {monthNames.map((month, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    monthRefs.current[index] = el;
                  }}
                  onClick={() => setSelectedMonth(index)}
                  className={`h-12 flex items-center justify-center cursor-pointer snap-center transition-all ${
                    selectedMonth === index
                      ? "text-text-base font-bold text-lg scale-110"
                      : "text-gray-400 text-base hover:text-gray-600"
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Year Picker */}
          <div className="flex-1 overflow-y-auto scrollbar-hide snap-y snap-mandatory border-l border-gray-200">
            <div className="py-24">
              {years.map((year) => (
                <div
                  key={year}
                  ref={(el) => {
                    yearRefs.current[year] = el;
                  }}
                  onClick={() => setSelectedYear(year)}
                  className={`h-12 flex items-center justify-center cursor-pointer snap-center transition-all ${
                    selectedYear === year
                      ? "text-text-base font-bold text-lg scale-110"
                      : "text-gray-400 text-base hover:text-gray-600"
                  }`}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MonthPicker;
