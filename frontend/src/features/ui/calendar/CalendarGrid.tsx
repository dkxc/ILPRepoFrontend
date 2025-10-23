import React from "react";
import { dayNames, colorClasses } from "../Calendar-utils";

import type { CurriculumEvent } from "../Calendar-utils";

type CalendarGridProps = {
  days: (number | null)[];
  getDayEvents: (day: number) => CurriculumEvent[];
  isToday: (day: number) => boolean;
  onDayClick: (day: number) => void;
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  getDayEvents,
  isToday,
  onDayClick,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="grid grid-cols-7 mb-2">
      {dayNames.map((day) => (
        <div
          key={day}
          className="text-center text-sm font-semibold text-slate-600 py-2"
        >
          {day}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        if (!day) return <div key={index} className="min-h-[100px]"></div>;

        const events = getDayEvents(day);
        const isTodayDay = isToday(day);
        const hasEvents = events.length > 0;

        return (
          <div
            key={index}
            onClick={() => onDayClick(day)}
            className={`min-h-[100px] p-2 border rounded-lg transition-all
              ${hasEvents ? "cursor-pointer hover:shadow-md hover:scale-105 bg-white" : "bg-white"}
              ${isTodayDay ? "ring-2 ring-blue-500" : "border-slate-200"}`}
          >
            <div
              className={`text-sm font-medium mb-1 w-7 h-7 rounded-full flex items-center justify-center
              ${isTodayDay ? "bg-blue-600 text-white" : "text-slate-700"}`}
            >
              {day}
            </div>
            <div className="space-y-1">
              {events.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  className={`text-xs p-1 rounded border ${colorClasses[ev.color]} truncate`}
                >
                  {ev.title}
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-slate-600 font-medium">
                  +{events.length - 2} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
