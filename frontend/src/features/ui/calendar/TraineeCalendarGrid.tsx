// components/TraineeCalendarGrid.tsx

import { CheckCircle, XCircle } from "lucide-react";
import type { CurriculumEvent } from "./types";
import {
  dayNames,
  getDaysInMonth,
  getFirstDayOfMonth,
  colorClasses,
} from "./CalendarUtils";

type TraineeCalendarGridProps = {
  currentMonth: number;
  currentYear: number;
  selectedDay: number | null;
  onDayClick: (day: number) => void;
  getDayEvents: (day: number) => CurriculumEvent[];
  getDayAttendance: (
    day: number,
  ) => { fn: "P" | "A"; an: "P" | "A" } | undefined;
  isHolidayDay: (day: number, month: number, year: number) => boolean;
};

const TraineeCalendarGrid = ({
  currentMonth,
  currentYear,
  selectedDay,
  onDayClick,
  getDayEvents,
  getDayAttendance,
  isHolidayDay,
}: TraineeCalendarGridProps) => {
  const today = new Date();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const calendarDays: (number | null)[] = [];
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const day = i - firstDayOfMonth + 1;
    if (day > 0 && day <= daysInMonth) {
      calendarDays.push(day);
    } else {
      calendarDays.push(null);
    }
  }

  const renderAttendanceIcon = (attendance: {
    fn: "P" | "A";
    an: "P" | "A";
  }) => {
    // Full Absent
    if (attendance.fn === "A" && attendance.an === "A") {
      return (
        <div title="Absent" className="absolute top-2 right-2">
          <XCircle className="w-4 h-4 text-red-500" />
        </div>
      );
    }
    // Full Present
    if (attendance.fn === "P" && attendance.an === "P") {
      return (
        <div title="Present" className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      );
    }
    // Partial Present
    return (
      <div
        title={attendance.fn === "A" ? "Present Afternoon" : "Present Forenoon"}
        className="absolute top-2 right-2"
      >
        <CheckCircle className="w-4 h-4 text-yellow-500" />
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 h-[75vh] overflow-hidden flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2 bg-card py-3 border-b-2 border-brand-200">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-text-base"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-4 overflow-y-auto">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} className="min-h-[140px]"></div>;
          }

          const dayEvents = getDayEvents(day);
          const attendance = getDayAttendance(day);
          const isTodayDay = isToday(day);
          const hasEvents = dayEvents.length > 0;
          const isHoliday = isHolidayDay(day, currentMonth, currentYear);

          // Determine border and background styling
          let cellClasses =
            "relative min-h-[140px] p-3 rounded-xl transition-all cursor-pointer ";

          if (isHoliday) {
            cellClasses += "border-2 border-red-500 bg-red-50 ";
          } else if (isTodayDay) {
            cellClasses += "border-2 border-brand bg-brand-50 ";
          } else if (selectedDay === day) {
            cellClasses += "border-2 border-green-500 bg-green-50 ";
          } else {
            cellClasses += "border border-gray-200 bg-white ";
          }

          if (hasEvents && !isHoliday) {
            cellClasses += "hover:shadow-lg hover:scale-105 ";
          } else if (!isHoliday) {
            cellClasses += "hover:bg-brand-50 ";
          }

          return (
            <div
              key={index}
              onClick={() => onDayClick(day)}
              className={cellClasses}
            >
              <div
                className={`
                text-sm font-semibold mb-2 w-9 h-9 rounded-full flex items-center justify-center
                ${isTodayDay ? "bg-brand text-brand-foreground" : "text-text-base"}
              `}
              >
                {day}
              </div>

              {/* Attendance Indicator */}
              {attendance && renderAttendanceIcon(attendance)}

              <div className="space-y-1.5 mt-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-2 rounded-lg border ${colorClasses[event.color]} truncate font-medium shadow-sm`}
                  >
                    {event.title || "Untitled"}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-600 font-medium px-1.5">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TraineeCalendarGrid;
