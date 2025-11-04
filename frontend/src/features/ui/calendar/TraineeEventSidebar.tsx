// components/TraineeEventSidebar.tsx

import { BookOpen, CalendarX, CheckCircle, XCircle } from "lucide-react";
import type { CurriculumEvent } from "./types";
import { colorClasses } from "./CalendarUtils";

type TraineeEventSidebarProps = {
  dateLabel: string;
  events: CurriculumEvent[];
  attendance?: { fn: "P" | "A"; an: "P" | "A" };
  isHoliday?: boolean;
};

const TraineeEventSidebar = ({
  dateLabel,
  events,
  attendance,
  isHoliday,
}: TraineeEventSidebarProps) => {
  const getAttendanceStatus = () => {
    if (!attendance) return null;

    // Full Absent
    if (attendance.fn === "A" && attendance.an === "A") {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-semibold text-red-700">Absent</p>
            <p className="text-xs text-red-600">Full day absent</p>
          </div>
        </div>
      );
    }

    // Full Present
    if (attendance.fn === "P" && attendance.an === "P") {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-semibold text-green-700">Present</p>
            <p className="text-xs text-green-600">Full day present</p>
          </div>
        </div>
      );
    }

    // Partial Present
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-yellow-600" />
        <div>
          <p className="font-semibold text-yellow-700">Partial Attendance</p>
          <p className="text-xs text-yellow-600">
            Present: {attendance.fn === "P" ? "Forenoon" : "Afternoon"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 font-secondary">
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-base">
            {dateLabel || "Select a Day"}
          </h3>
        </div>

        {!dateLabel ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a day to view sessions</p>
          </div>
        ) : isHoliday ? (
          <div className="text-center py-12">
            <CalendarX className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <p className="font-medium text-red-500">Holiday</p>
            <p className="text-sm text-gray-500 mt-2">No sessions scheduled</p>
          </div>
        ) : (
          <>
            {/* Attendance Status */}
            {attendance && <div className="mb-4">{getAttendanceStatus()}</div>}

            {/* Events List */}
            {events.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-text-base mb-2">
                  Sessions ({events.length})
                </h4>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 ${colorClasses[event.color]} shadow-sm`}
                  >
                    <h5 className="font-semibold text-text-base mb-3">
                      {event.title || "Untitled Session"}
                    </h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-text-base min-w-[80px]">
                          Trainer:
                        </span>
                        <span className="flex-1">
                          {event.instructor || "Not assigned"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-text-base min-w-[80px]">
                          Description:
                        </span>
                        <p className="flex-1">
                          {event.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No sessions scheduled</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Attendance Legend */}
      {dateLabel && !isHoliday && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-text-base mb-3">
            Attendance Legend
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Full Day Present</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Partial Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-gray-600">Full Day Absent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraineeEventSidebar;
