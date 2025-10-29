import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Clock, User, CheckCircle, XCircle } from "lucide-react";
import type {
  CurriculumEvent,
  SelectedDay,
} from "../../features/ui/Calendar-utils";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatTime,
  monthNames,
  dayNames,
  colorClasses,
} from "../../features/ui/Calendar-utils";
import { CalendarGrid } from "../../features/ui/calendar/CalendarGrid";

import { EventSidebar } from "../../features/ui/calendar/EventSideBar";

// Mock curriculum events data
const curriculumEvents: CurriculumEvent[] = [
  {
    id: "1",
    title: "Scrum Agile, Scrum Agile",
    start: new Date(2025, 9, 15, 9, 0),
    end: new Date(2025, 9, 15, 18, 0),
    color: "blue",
    instructor: "Suneesh Thampi",
    description: "Introduction to Agile methodologies and Scrum framework",
  },
  {
    id: "2",
    title: "Scrum Agile",
    start: new Date(2025, 9, 16, 10, 0),
    end: new Date(2025, 9, 16, 13, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description: "Advanced JavaScript features",
  },
  {
    id: "3",
    title: "HTML-CSS",
    start: new Date(2025, 9, 17, 9, 0), //new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds),
    end: new Date(2025, 9, 17, 11, 0),
    color: "indigo",
    instructor: "Hari Krishnan",
    description: "Basics of HTML and CSS",
  },
  {
    id: "4",
    title: "HTML-CSS-SASS",
    start: new Date(2025, 9, 18, 14, 0),
    end: new Date(2025, 9, 18, 17, 0),
    color: "pink",
    instructor: "Hari Krishnan",
    description: "Working with SASS",
  },
  {
    id: "5",
    title: "TypeScript Basics",
    start: new Date(2025, 9, 20, 9, 0),
    end: new Date(2025, 9, 20, 12, 0),
    color: "amber",
    instructor: "Mike Wilson",
    description: "Introduction to TypeScript",
  },

  {
    id: "6",
    title: "TypeScript Basics",
    start: new Date(2025, 9, 21, 9, 0),
    end: new Date(2025, 9, 21, 12, 0),
    color: "amber",
    instructor: "Mike Wilson",
    description: "Introduction to TypeScript",
  },
  {
    id: "7",
    title: "Database Design",
    start: new Date(2025, 9, 22, 10, 0),
    end: new Date(2025, 9, 22, 13, 0),
    color: "red",
    instructor: "Jane Smith",
    description: "SQL and NoSQL databases",
  },
  {
    id: "8",
    title: "System Design",
    start: new Date(2025, 9, 22, 10, 0),
    end: new Date(2025, 9, 22, 13, 0),
    color: "blue",
    instructor: "Jane Smith",
    description: "SQL and NoSQL databases",
  },
  {
    id: "9",
    title: "React Hooks Deep Dive",
    start: new Date(2025, 9, 23, 9, 0),
    end: new Date(2025, 9, 23, 12, 0),
    color: "blue",
    instructor: "John Doe",
    description: "Advanced hooks patterns",
  },
  {
    id: "10",
    title: "Testing with Jest",
    start: new Date(2025, 9, 24, 14, 0),
    end: new Date(2025, 9, 24, 16, 0),
    color: "orange",
    instructor: "Sarah Johnson",
    description: "Unit and integration testing",
  },
];
// Mock attendance data
const attendanceData: Record<number, { fn: "P" | "A"; an: "P" | "A" }> = {
  1: { fn: "P", an: "A" },
  2: { fn: "P", an: "P" },
  3: { fn: "A", an: "P" },
  4: { fn: "A", an: "A" },
  5: { fn: "P", an: "A" },
};



// Helper functions to replace date-fns

function TraineeCurriculumCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  const getDayEvents = (day: number) => {
    return curriculumEvents.filter((event) => {
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
    const events = getDayEvents(day);
    if (events.length > 0) {
      setSelectedDay({ day, events });
    }
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Generate calendar days
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Training Curriculum
                </h1>
                <p className="text-slate-600 text-sm">
                  View your upcoming sessions
                </p>
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
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 h-[75vh] overflow-hidden flex flex-col">
            {/* Weekday Headers */}
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

            {/* Calendar Days */}
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
                     relative min-h-[100px] p-2 border rounded-lg transition-all
                      ${hasEvents ? "cursor-pointer hover:shadow-md hover:scale-105 bg-white" : "bg-white"}
                      ${isTodayDay ? "ring-2 ring-blue-500" : "border-slate-200"}
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
                    {/* Attendance Dots */}

                          {/* Attendance Indicator (top-right corner beside date number) */}
{attendanceData[day] && (
  <div className="absolute top-3 right-3">
    {/* FULL ABSENT */}
    {attendanceData[day].fn === "A" && attendanceData[day].an === "A" ? (
      <div title="Absent">
        <XCircle className="w-4 h-4 text-red-500" />
      </div>
    ) : /* FULL PRESENT */ attendanceData[day].fn === "P" && attendanceData[day].an === "P" ? (
      <div title="Present">
        <CheckCircle className="w-4 h-4 text-green-500" />
      </div>
    ) : (
      /* PARTIAL */
      <div
        title={
          attendanceData[day].fn === "A"
            ? "Present Afternoon"
            : "Present Forenoon"
        }
      >
        <CheckCircle className="w-4 h-4 text-yellow-500" />
      </div>
    )}
  </div>
)}

                          

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

          {/* Event Details Sidebar */}
          <EventSidebar
            dateLabel={
              selectedDay
                ? `${monthNames[currentMonth]} ${selectedDay.day}, ${currentYear}`
                : ""
            }
            events={selectedDay?.events || []}
          />
        </div>

        {/* Legend */}
        {/* <div className="bg-white rounded-xl shadow-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Course Categories</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(colorClasses).map(([color, className]) => (
              <div key={color} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border ${className}`}></div>
                <span className="text-sm text-slate-600 capitalize">{color}</span>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default TraineeCurriculumCalendar;
