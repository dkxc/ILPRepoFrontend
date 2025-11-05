// components/EventSidebar.tsx

import { useState } from "react";
import {
  BookOpen,
  Edit,
  PlusCircle,
  CalendarX,
  Trash2,
  Save,
  X,
  Calendar,
} from "lucide-react";
import type { CurriculumEvent } from "./types";
import { colorClasses } from "./CalendarUtils";
import DeleteConfirmModal from "./DeleteConfirmModal";
// components/EventSidebar.tsx (Updated with reschedule option and empty placeholders)

// components/EventSidebar.tsx (Updated with brand colors)

type EventSidebarProps = {
  dateLabel: string;
  events: CurriculumEvent[];
  isHoliday?: boolean;
  onEdit?: (event: CurriculumEvent) => void;
  onAdd?: () => void;
  onDelete?: (eventId: string) => void;
  onToggleHoliday?: () => void;
  onReschedule?: (event: CurriculumEvent) => void;
};

const EventSidebar = ({
  dateLabel,
  events,
  isHoliday,
  onEdit,
  onAdd,
  onDelete,
  onToggleHoliday,
  onReschedule,
}: EventSidebarProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CurriculumEvent>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const startEdit = (event: CurriculumEvent) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      instructor: event.instructor,
      description: event.description,
    });
  };

  const saveEdit = (event: CurriculumEvent) => {
    if (onEdit && editForm) {
      onEdit({
        ...event,
        title: editForm.title || event.title,
        instructor: editForm.instructor || event.instructor,
        description: editForm.description || event.description,
      });
    }
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 font-secondary">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-base">
            {dateLabel || "Select a Day"}
          </h3>
          {dateLabel && (
            <div className="flex gap-2">
              <button
                onClick={onAdd}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                title="Add Event"
              >
                <PlusCircle size={18} />
              </button>
              <button
                onClick={onToggleHoliday}
                className={`p-2 rounded-lg transition-colors ${
                  isHoliday
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-inactive-badge text-gray-500 hover:bg-inactive-badge-hover"
                }`}
                title={isHoliday ? "Remove Holiday" : "Mark as Holiday"}
              >
                <CalendarX size={18} />
              </button>
            </div>
          )}
        </div>

        {!dateLabel ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a day to view or manage events</p>
          </div>
        ) : isHoliday ? (
          <div className="text-center py-12">
            <CalendarX className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <p className="font-medium text-red-500">
              This day is marked as a Holiday
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Click the holiday icon above to remove
            </p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-l-4 ${colorClasses[event.color]} relative shadow-sm`}
              >
                {editingId === event.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.title || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
                      placeholder="Session Title"
                    />
                    <input
                      type="text"
                      value={editForm.instructor || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, instructor: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
                      placeholder="Trainer Name"
                    />
                    <textarea
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand"
                      rows={3}
                      placeholder="Session Description"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(event)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                      >
                        <Save size={14} /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm font-medium transition-colors"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-semibold text-text-base mb-3 flex justify-between items-start">
                      <span className="flex-1">
                        {event.title || "Untitled Session"}
                      </span>
                      <div className="flex gap-1.5 ml-2">
                        <button
                          onClick={() => startEdit(event)}
                          className="p-1.5 rounded-lg bg-brand-50 text-brand hover:bg-brand-100 transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onReschedule && onReschedule(event)}
                          className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                          title="Reschedule"
                        >
                          <Calendar size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              id: event.id,
                              title: event.title,
                            })
                          }
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </h4>
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
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No events yet</p>
            <p className="text-xs mt-1">Click the + icon above to add one</p>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm && onDelete) {
            onDelete(deleteConfirm.id);
            setDeleteConfirm(null);
          }
        }}
        eventTitle={deleteConfirm?.title || ""}
      />
    </div>
  );
};

export default EventSidebar;
