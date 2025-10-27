import React from "react";
import {
  BookOpen,
  Clock,
  User,
  Edit,
  PlusCircle,
  CalendarX,
  Trash2,
} from "lucide-react";
import { formatTime, colorClasses } from "../Calendar-utils";
import type { CurriculumEvent } from "../Calendar-utils";

type Props = {
  events: CurriculumEvent[];
  dateLabel: string;
  editable?: boolean;
  isHoliday?: boolean;
  onEdit?: (event: CurriculumEvent) => void;
  onAdd?: () => void;
  onDelete?: (eventId: string) => void;
  onToggleHoliday?: () => void;
};

export const EventSidebar: React.FC<Props> = ({
  events,
  dateLabel,
  editable = false,
  isHoliday = false,
  onEdit,
  onAdd,
  onDelete,
  onToggleHoliday,
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-slate-800">
        {dateLabel || "Select a Day"}
      </h3>

      {editable && (
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="text-green-600 hover:text-green-800"
            title="Add Event"
          >
            <PlusCircle size={18} />
          </button>
          <button
            onClick={onToggleHoliday}
            className={`${isHoliday ? "text-red-600" : "text-slate-500"} hover:text-red-800`}
            title="Mark as Holiday"
          >
            <CalendarX size={18} />
          </button>
        </div>
      )}
    </div>

    {isHoliday ? (
      <div className="text-center py-12 text-rose-500 font-medium">
        🏖️ This day is marked as a Holiday
      </div>
    ) : events.length > 0 ? (
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`p-4 rounded-lg border-l-4 ${colorClasses[event.color]} relative`}
          >
            <h4 className="font-semibold text-slate-800 mb-3 flex justify-between">
              {event.title}
              {editable && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit?.(event)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(event.start)} - {formatTime(event.end)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{event.instructor}</span>
              </div>
              <p className="pt-2 border-t border-slate-200">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-slate-500">
        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No events yet — click “+” to add one</p>
      </div>
    )}
  </div>
);
