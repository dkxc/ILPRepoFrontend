// import { useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   BookOpen,
//   Clock,
//   User,
//   Edit,
//   PlusCircle,
//   CalendarX,
//   Trash2,
//   Save,
//   X,
// } from "lucide-react";

// // Types
// type ColorKey =
//   | "blue"
//   | "emerald"
//   | "indigo"
//   | "pink"
//   | "amber"
//   | "red"
//   | "orange";

// type CurriculumEvent = {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
//   color: ColorKey;
//   instructor: string;
//   description: string;
// };

// type SelectedDay = {
//   day: number;
//   events: CurriculumEvent[];
// };

// // Utility functions
// const [editingEventId, setEditingEventId] = useState<string | null>(null);

// const getDaysInMonth = (year: number, month: number) =>
//   new Date(year, month + 1, 0).getDate();

// const getFirstDayOfMonth = (year: number, month: number) =>
//   new Date(year, month, 1).getDay();

// const formatTime = (date: Date) => {
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   const ampm = hours >= 12 ? "PM" : "AM";
//   const displayHours = hours % 12 || 12;
//   return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
// };

// const monthNames = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const colorClasses: Record<ColorKey, string> = {
//   blue: "bg-blue-100 border-blue-500 text-blue-700",
//   emerald: "bg-emerald-100 border-emerald-500 text-emerald-700",
//   indigo: "bg-indigo-100 border-indigo-500 text-indigo-700",
//   pink: "bg-pink-100 border-pink-500 text-pink-700",
//   amber: "bg-amber-100 border-amber-500 text-amber-700",
//   red: "bg-red-100 border-red-500 text-red-700",
//   orange: "bg-orange-100 border-orange-500 text-orange-700",
// };

// // Initial mock data
// const initialEvents: CurriculumEvent[] = [
//   {
//     id: "1",
//     title: "Scrum Agile",
//     start: new Date(2025, 9, 15, 9, 0),
//     end: new Date(2025, 9, 15, 18, 0),
//     color: "blue",
//     instructor: "Suneesh Thampi",
//     description: "Introduction to Agile methodologies and Scrum framework",
//   },
//   {
//     id: "2",
//     title: "JavaScript Advanced",
//     start: new Date(2025, 9, 16, 10, 0),
//     end: new Date(2025, 9, 16, 13, 0),
//     color: "emerald",
//     instructor: "Suneesh Thampi",
//     description: "Advanced JavaScript features",
//   },
//   {
//     id: "3",
//     title: "HTML-CSS",
//     start: new Date(2025, 9, 17, 9, 0),
//     end: new Date(2025, 9, 17, 11, 0),
//     color: "indigo",
//     instructor: "Hari Krishnan",
//     description: "Basics of HTML and CSS",
//   },
//   {
//     id: "4",
//     title: "TypeScript Basics",
//     start: new Date(2025, 9, 20, 9, 0),
//     end: new Date(2025, 9, 20, 12, 0),
//     color: "amber",
//     instructor: "Mike Wilson",
//     description: "Introduction to TypeScript",
//   },
// ];
//   const [editForm, setEditForm] = useState<Partial<CurriculumEvent>>({});

// // EventSidebar Component
// const EventSidebar = ({
//   events,
//   dateLabel,
//   editable,
//   isHoliday,
//   editingId,
//   setEditingId,
//   onEdit,
//   onAdd,
//   onDelete,
//   onToggleHoliday,
// }: {
//   events: CurriculumEvent[];
//   dateLabel: string;
//   editable?: boolean;
//   isHoliday?: boolean;
//    editingId?: string | null;
//   setEditingId?: (id: string | null) => void;
//   onEdit?: (event: CurriculumEvent) => void;
//   onAdd?: () => void;
//   onDelete?: (eventId: string) => void;
//   onToggleHoliday?: () => void;
// }) => {

//   const startEdit = (event: CurriculumEvent) => {
//     setEditingId?.(event.id);
//     setEditForm({
//       title: event.title,
//       instructor: event.instructor,
//       description: event.description,
//       color: event.color,
//       start: event.start,
//       end: event.end,
//     });
//   };

//   const saveEdit = (event: CurriculumEvent) => {
//     if (onEdit && editForm) {
//       onEdit({
//         ...event,
//         title: editForm.title || event.title,
//         instructor: editForm.instructor || event.instructor,
//         description: editForm.description || event.description,
//         color: editForm.color || event.color,
//         start: editForm.start || event.start,
//         end: editForm.end || event.end,
//       });
//     }
//     setEditingId?.(null);
//     setEditForm({});
//   };

//   const cancelEdit = () => {
//     setEditingId?.(null);
//     setEditForm({});
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-slate-800">
//           {dateLabel || "Select a Day"}
//         </h3>
//         {editable && dateLabel && (
//           <div className="flex gap-2">
//             <button
//               onClick={onAdd}
//               className="text-green-600 hover:text-green-800"
//               title="Add Event"
//             >
//               <PlusCircle size={18} />
//             </button>
//             <button
//               onClick={onToggleHoliday}
//               className={`${isHoliday ? "text-red-600" : "text-slate-500"} hover:text-red-800`}
//               title="Mark as Holiday"
//             >
//               <CalendarX size={18} />
//             </button>
//           </div>
//         )}
//       </div>
//       {!dateLabel ? (
//         <div className="text-center py-12 text-slate-500">
//           <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
//           <p>Select a day to view or manage events</p>
//         </div>
//       ) : isHoliday ? (
//         <div className="text-center py-12 text-rose-500 font-medium">
//           🏖️ This day is marked as a Holiday
//         </div>
//       ) : events.length > 0 ? (
//         <div className="space-y-4">
//           {events.map((event) => (
//             <div
//               key={event.id}
//               className={`p-4 rounded-lg border-l-4 ${colorClasses[event.color]} relative`}
//             >
//               {editingId === event.id ? (
//                 <div className="space-y-3">
//                   <input
//                     type="text"
//                     value={editForm.title || ""}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, title: e.target.value })
//                     }
//                     className="w-full px-2 py-1 border rounded text-sm"
//                     placeholder="Title"
//                   />
//                   <input
//                     type="text"
//                     value={editForm.instructor || ""}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, instructor: e.target.value })
//                     }
//                     className="w-full px-2 py-1 border rounded text-sm"
//                     placeholder="Instructor"
//                   />
//                   <textarea
//                     value={editForm.description || ""}
//                     onChange={(e) =>
//                       setEditForm({ ...editForm, description: e.target.value })
//                     }
//                     className="w-full px-2 py-1 border rounded text-sm"
//                     rows={2}
//                     placeholder="Description"
//                   />
//                   <select
//                     value={editForm.color || event.color}
//                     onChange={(e) =>
//                       setEditForm({
//                         ...editForm,
//                         color: e.target.value as ColorKey,
//                       })
//                     }
//                     className="w-full px-2 py-1 border rounded text-sm"
//                   >
//                     {Object.keys(colorClasses).map((color) => (
//                       <option key={color} value={color}>
//                         {color}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => saveEdit(event)}
//                       className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
//                     >
//                       <Save size={14} /> Save
//                     </button>
//                     <button
//                       onClick={cancelEdit}
//                       className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
//                     >
//                       <X size={14} /> Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <h4 className="font-semibold text-slate-800 mb-3 flex justify-between">
//                     {event.title}
//                     {editable && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => startEdit(event)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="Edit"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           onClick={() => onDelete?.(event.id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </h4>
//                   <div className="space-y-2 text-sm text-slate-600">
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4" />
//                       <span>
//                         {formatTime(event.start)} - {formatTime(event.end)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4" />
//                       <span>{event.instructor}</span>
//                     </div>
//                     <p className="pt-2 border-t border-slate-200">
//                       {event.description}
//                     </p>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12 text-slate-500">
//           <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
//           <p>No events yet — click "+" to add one</p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Calendar Component
// function TraineeCurriculumCalendar() {
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
//   const [isHoliday, setIsHoliday] = useState(false);
//   const [events, setEvents] = useState<CurriculumEvent[]>(initialEvents);

//   const today = new Date();
//   const daysInMonth = getDaysInMonth(currentYear, currentMonth);
//   const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

//   const getDayEvents = (day: number) => {
//     return events.filter((event) => {
//       const eventDate = event.start;
//       return (
//         eventDate.getDate() === day &&
//         eventDate.getMonth() === currentMonth &&
//         eventDate.getFullYear() === currentYear
//       );
//     });
//   };

//   const handlePreviousMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear(currentYear - 1);
//     } else {
//       setCurrentMonth(currentMonth - 1);
//     }
//     setSelectedDay(null);
//   };

//   const handleNextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear(currentYear + 1);
//     } else {
//       setCurrentMonth(currentMonth + 1);
//     }
//     setSelectedDay(null);
//   };

//   const handleDayClick = (day: number) => {
//     const dayEvents = getDayEvents(day);
//     setSelectedDay({ day, events: dayEvents });
//     setIsHoliday(false);
//   };

//   const handleAddEvent = () => {
//     if (!selectedDay) return;

//     const newEvent: CurriculumEvent = {
//       id: String(Date.now()),
//       title: "New Session",
//       start: new Date(currentYear, currentMonth, selectedDay.day, 9, 0),
//       end: new Date(currentYear, currentMonth, selectedDay.day, 12, 0),
//       color: "blue",
//       instructor: "TBD",
//       description: "Session details go here",
//     };

//     setEvents((prev) => [...prev, newEvent]);

//     setSelectedDay({
//       day: selectedDay.day,
//       events: [...selectedDay.events, newEvent],
//     });
//   };

//   const handleEditEvent = (updatedEvent: CurriculumEvent) => {
//     setEvents((prev) =>
//       prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
//     );

//     if (selectedDay) {
//       setSelectedDay({
//         day: selectedDay.day,
//         events: selectedDay.events.map((e) =>
//           e.id === updatedEvent.id ? updatedEvent : e,
//         ),
//       });
//     }
//   };

//   const handleDeleteEvent = (id: string) => {
//     setEvents((prev) => prev.filter((e) => e.id !== id));

//     if (selectedDay) {
//       setSelectedDay({
//         day: selectedDay.day,
//         events: selectedDay.events.filter((e) => e.id !== id),
//       });
//     }
//   };

//   const handleToggleHoliday = () => {
//     setIsHoliday((prev) => !prev);
//   };

//   const isToday = (day: number) => {
//     return (
//       day === today.getDate() &&
//       currentMonth === today.getMonth() &&
//       currentYear === today.getFullYear()
//     );
//   };

//   const calendarDays: (number | null)[] = [];
//   const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

//   for (let i = 0; i < totalCells; i++) {
//     const day = i - firstDayOfMonth + 1;
//     if (day > 0 && day <= daysInMonth) {
//       calendarDays.push(day);
//     } else {
//       calendarDays.push(null);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <BookOpen className="w-8 h-8 text-blue-600" />
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-800">
//                   Training Curriculum - Admin
//                 </h1>
//                 <p className="text-slate-600 text-sm">
//                   Manage training sessions and schedule
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handlePreviousMonth}
//                 className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
//                 aria-label="Previous month"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <h2 className="text-xl font-semibold text-slate-800 min-w-[200px] text-center">
//                 {monthNames[currentMonth]} {currentYear}
//               </h2>
//               <button
//                 onClick={handleNextMonth}
//                 className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
//                 aria-label="Next month"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
//             <div className="grid grid-cols-7 mb-2">
//               {dayNames.map((day) => (
//                 <div
//                   key={day}
//                   className="text-center text-sm font-semibold text-slate-600 py-2"
//                 >
//                   {day}
//                 </div>
//               ))}
//             </div>
//             <div className="grid grid-cols-7 gap-2">
//               {calendarDays.map((day, index) => {
//                 if (!day) {
//                   return <div key={index} className="min-h-[100px]"></div>;
//                 }
//                 const dayEvents = getDayEvents(day);
//                 const isTodayDay = isToday(day);
//                 const hasEvents = dayEvents.length > 0;
//                 return (
//                   <div
//                     key={index}
//                     onClick={() => handleDayClick(day)}
//                     className={`
//                       min-h-[100px] p-2 border rounded-lg transition-all cursor-pointer
//                       ${hasEvents ? "hover:shadow-md hover:scale-105 bg-white" : "bg-white hover:bg-slate-50"}
//                       ${isTodayDay ? "ring-2 ring-blue-500" : "border-slate-200"}
//                       ${selectedDay?.day === day ? "ring-2 ring-green-500" : ""}
//                     `}
//                   >
//                     <div
//                       className={`
//                       text-sm font-medium mb-1 w-7 h-7 rounded-full flex items-center justify-center
//                       ${isTodayDay ? "bg-blue-600 text-white" : "text-slate-700"}
//                     `}
//                     >
//                       {day}
//                     </div>
//                     <div className="space-y-1">
//                       {dayEvents.slice(0, 2).map((event) => (
//                         <div
//                           key={event.id}
//                           className={`text-xs p-1 rounded border ${colorClasses[event.color]} truncate`}
//                         >
//                           {event.title}
//                         </div>
//                       ))}
//                       {dayEvents.length > 2 && (
//                         <div className="text-xs text-slate-600 font-medium">
//                           +{dayEvents.length - 2} more
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//          <EventSidebar
//   dateLabel={
//     selectedDay
//       ? `${monthNames[currentMonth]} ${selectedDay.day}, ${currentYear}`
//       : ""
//   }
//   events={selectedDay?.events || []}
//   editable={true}
//   isHoliday={isHoliday}
//   editingId={editingEventId}          // pass current editing ID
//   setEditingId={setEditingEventId}    // allow sidebar to update it
//   onAdd={handleAddEvent}
//   onEdit={handleEditEvent}
//   onDelete={handleDeleteEvent}
//   onToggleHoliday={handleToggleHoliday}
// />

//         </div>
//       </div>
//     </div>
//   );
// }

// export default TraineeCurriculumCalendar;

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  User,
  Edit,
  PlusCircle,
  CalendarX,
  Trash2,
  Save,
  X,
} from "lucide-react";

// Types
type ColorKey =
  | "blue"
  | "emerald"
  | "indigo"
  | "pink"
  | "amber"
  | "red"
  | "orange";

type CurriculumEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: ColorKey;
  instructor: string;
  description: string;
};

type SelectedDay = {
  day: number;
  events: CurriculumEvent[];
};

// Utility functions
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const colorClasses: Record<ColorKey, string> = {
  blue: "bg-blue-100 border-blue-500 text-blue-700",
  emerald: "bg-emerald-100 border-emerald-500 text-emerald-700",
  indigo: "bg-indigo-100 border-indigo-500 text-indigo-700",
  pink: "bg-pink-100 border-pink-500 text-pink-700",
  amber: "bg-amber-100 border-amber-500 text-amber-700",
  red: "bg-red-100 border-red-500 text-red-700",
  orange: "bg-orange-100 border-orange-500 text-orange-700",
};

// Initial mock data
const initialEvents: CurriculumEvent[] = [
  {
    id: "1",
    title: "Scrum Agile",
    start: new Date(2025, 9, 15, 9, 0),
    end: new Date(2025, 9, 15, 18, 0),
    color: "blue",
    instructor: "Suneesh Thampi",
    description: "Introduction to Agile methodologies and Scrum framework",
  },
  {
    id: "2",
    title: "JavaScript Advanced",
    start: new Date(2025, 9, 16, 10, 0),
    end: new Date(2025, 9, 16, 13, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description: "Advanced JavaScript features",
  },
  {
    id: "3",
    title: "HTML-CSS",
    start: new Date(2025, 9, 17, 9, 0),
    end: new Date(2025, 9, 17, 11, 0),
    color: "indigo",
    instructor: "Hari Krishnan",
    description: "Basics of HTML and CSS",
  },
  {
    id: "4",
    title: "TypeScript Basics",
    start: new Date(2025, 9, 20, 9, 0),
    end: new Date(2025, 9, 20, 12, 0),
    color: "amber",
    instructor: "Mike Wilson",
    description: "Introduction to TypeScript",
  },
];

// EventSidebar Component
const EventSidebar = ({
  events,
  dateLabel,
  editable,
  isHoliday,
  onEdit,
  onAdd,
  onDelete,
  onToggleHoliday,
}: {
  events: CurriculumEvent[];
  dateLabel: string;
  editable?: boolean;
  isHoliday?: boolean;
  onEdit?: (event: CurriculumEvent) => void;
  onAdd?: () => void;
  onDelete?: (eventId: string) => void;
  onToggleHoliday?: () => void;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CurriculumEvent>>({});

  const startEdit = (event: CurriculumEvent) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      instructor: event.instructor,
      description: event.description,
      color: event.color,
      start: event.start,
      end: event.end,
    });
  };

  const saveEdit = (event: CurriculumEvent) => {
    if (onEdit && editForm) {
      onEdit({
        ...event,
        title: editForm.title || event.title,
        instructor: editForm.instructor || event.instructor,
        description: editForm.description || event.description,
        color: editForm.color || event.color,
        start: editForm.start || event.start,
        end: editForm.end || event.end,
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          {dateLabel || "Select a Day"}
        </h3>
        {editable && dateLabel && (
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
      {!dateLabel ? (
        <div className="text-center py-12 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select a day to view or manage events</p>
        </div>
      ) : isHoliday ? (
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
              {editingId === event.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editForm.instructor || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, instructor: e.target.value })
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Instructor"
                  />
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                    rows={2}
                    placeholder="Description"
                  />
                  <select
                    value={editForm.color || event.color}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        color: e.target.value as ColorKey,
                      })
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    {Object.keys(colorClasses).map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(event)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-semibold text-slate-800 mb-3 flex justify-between">
                    {event.title}
                    {editable && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(event)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete?.(event.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
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
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No events yet — click "+" to add one</p>
        </div>
      )}
    </div>
  );
};

// Main Calendar Component
function TraineeCurriculumCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [isHoliday, setIsHoliday] = useState(false);
  const [events, setEvents] = useState<CurriculumEvent[]>(initialEvents);
  const [holidays, setHolidays] = useState<number[]>([]);

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const getDayEvents = (day: number) => {
    return events.filter((event) => {
      const eventDate = event.start;
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    const dayEvents = getDayEvents(day);
    setSelectedDay({ day, events: dayEvents });
    setIsHoliday(false);
  };

  const handleAddEvent = () => {
    if (!selectedDay) return;

    const newEvent: CurriculumEvent = {
      id: String(Date.now()),
      title: "New Session",
      start: new Date(currentYear, currentMonth, selectedDay.day, 9, 0),
      end: new Date(currentYear, currentMonth, selectedDay.day, 12, 0),
      color: "blue",
      instructor: "Trainer",
      description: "Session details go here",
    };

    setEvents((prev) => [...prev, newEvent]);

    setSelectedDay({
      day: selectedDay.day,
      events: [...selectedDay.events, newEvent],
    });
  };

  const handleEditEvent = (updatedEvent: CurriculumEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );

    if (selectedDay) {
      setSelectedDay({
        day: selectedDay.day,
        events: selectedDay.events.map((e) =>
          e.id === updatedEvent.id ? updatedEvent : e,
        ),
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));

    if (selectedDay) {
      setSelectedDay({
        day: selectedDay.day,
        events: selectedDay.events.filter((e) => e.id !== id),
      });
    }
  };

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

  const handleToggleHoliday = () => {
    if (!selectedDay) return;
    setHolidays((prev) =>
      prev.includes(selectedDay.day)
        ? prev.filter((d) => d !== selectedDay.day)
        : [...prev, selectedDay.day],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Training Curriculum - Admin
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-slate-800 min-w-[200px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 h-[75vh] overflow-hidden flex flex-col">
            <div className="grid grid-cols-7 mb-2 top-0 bg-white z-10 py-3 border-b border-slate-200">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-slate-600"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 overflow-y-auto">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="min-h-[100px]"></div>;
                }
                const dayEvents = getDayEvents(day);
                const isTodayDay = isToday(day);
                const hasEvents = dayEvents.length > 0;
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      min-h-[100px] p-2 border rounded-lg transition-all cursor-pointer
                      ${hasEvents ? "hover:shadow-md hover:scale-105 bg-white" : "bg-white hover:bg-slate-50"}
                      ${holidays.includes(day) ? "ring-2 ring-red-500 bg-red-50" : "border-slate-200"}
                      ${isTodayDay ? "ring-2 ring-blue-500" : ""}
                      ${selectedDay?.day === day ? "ring-2 ring-green-500" : ""}
                    `}
                  >
                    <div
                      className={`
                      text-sm font-medium mb-1 w-7 h-7 rounded-full flex items-center justify-center
                      ${isTodayDay ? "bg-blue-600 text-white" : "text-slate-700"}
                    `}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border ${colorClasses[event.color]} truncate`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-600 font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-6 self-start h-fit">
            <EventSidebar
              dateLabel={
                selectedDay
                  ? `${monthNames[currentMonth]} ${selectedDay.day}, ${currentYear}`
                  : ""
              }
              events={selectedDay?.events || []}
              editable={true}
              isHoliday={isHoliday}
              onAdd={handleAddEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onToggleHoliday={handleToggleHoliday}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraineeCurriculumCalendar;
