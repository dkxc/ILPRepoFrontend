// import { useState } from "react";
// import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

// import {
//   getDaysInMonth,
//   getFirstDayOfMonth,

//   dayNames,
// } from "../../features/ui/calendar/CalendarUtils";
import CalendarGrid from "../../features/ui/calendar/CalendarGrid";

import EventSidebar from "../../features/ui/calendar/EventSideBar";
// TraineeCurriculumCalendar.tsx

import { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import TraineeCalendarGrid from "../../features/ui/calendar/TraineeCalendarGrid";
import TraineeEventSidebar from "../../features/ui/calendar/TraineeEventSidebar";
import MonthPicker from "../../features/ui/calendar//MonthPicker";
import type {
  CurriculumEvent,
  Holiday,
} from "../../features/ui/calendar/types.ts";
import { monthNames } from "../../features/ui/calendar/CalendarUtils.ts";

// Mock curriculum events data
const curriculumEvents: CurriculumEvent[] = [
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
];

// Mock attendance data
const attendanceData: Record<number, { fn: "P" | "A"; an: "P" | "A" }> = {
  15: { fn: "P", an: "P" },
  16: { fn: "P", an: "A" },
  17: { fn: "A", an: "P" },
  18: { fn: "A", an: "A" },
  20: { fn: "P", an: "P" },
};

// Mock holidays
const holidays: Holiday[] = [
  { day: 1, month: 9, year: 2025 },
  { day: 25, month: 9, year: 2025 },
];

function TraineeCurriculumCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const isHolidayDay = (day: number, month: number, year: number): boolean => {
    const date = new Date(year, month, day);
    if (date.getDay() === 0) return true; // Sunday
    return holidays.some(
      (h) => h.day === day && h.month === month && h.year === year,
    );
  };

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

  const getDayAttendance = (day: number) => {
    return attendanceData[day];
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

  const handleMonthSelect = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
    setSelectedDay(null);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const selectedDayEvents =
    selectedDay !== null ? getDayEvents(selectedDay) : [];
  const selectedDayAttendance =
    selectedDay !== null ? getDayAttendance(selectedDay) : undefined;
  const currentIsHoliday =
    selectedDay !== null
      ? isHolidayDay(selectedDay, currentMonth, currentYear)
      : false;

  return (
    <div className="min-h-screen bg-background p-4 font-secondary">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-6 text-brand" />
              <div>
                <h1 className="text-xl font-bold text-text-base">
                  Training Curriculum
                </h1>
                <p className="text-gray-600 text-sm">
                  View your upcoming sessions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg hover:bg-brand-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2
                onClick={() => setShowMonthPicker(true)}
                className="text-xl font-semibold text-text-base min-w-[200px] text-center cursor-pointer hover:bg-brand-50 px-4 py-2 rounded-lg transition-colors"
              >
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-brand-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TraineeCalendarGrid
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              getDayEvents={getDayEvents}
              getDayAttendance={getDayAttendance}
              isHolidayDay={isHolidayDay}
            />
          </div>
          <div className="lg:sticky lg:top-6 self-start h-fit">
            <TraineeEventSidebar
              dateLabel={
                selectedDay !== null
                  ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
                  : ""
              }
              events={selectedDayEvents}
              attendance={selectedDayAttendance}
              isHoliday={currentIsHoliday}
            />
          </div>
        </div>
      </div>

      <MonthPicker
        isOpen={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onSelect={handleMonthSelect}
        onGoToToday={handleGoToToday}
      />
    </div>
  );
}

export default TraineeCurriculumCalendar;
