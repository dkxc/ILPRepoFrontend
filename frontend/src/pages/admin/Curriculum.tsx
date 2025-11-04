import { useState } from "react";
import CalendarGrid from "../../features/ui/calendar/CalendarGrid";
import EventSidebar from "../../features/ui/calendar/EventSideBar";
import MonthPicker from "../../features/ui/calendar/MonthPicker";
import HolidayConflictModal from "../../features/ui/calendar/HolidayConflictModal";
import RescheduleModal from "../../features/ui/calendar/RescheduleModal";
import Toast from "../../features/ui/calendar/Toast.tsx";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type {
  CurriculumEvent,
  Holiday,
} from "../../features/ui/calendar/types.ts";
import { monthNames } from "../../features/ui/calendar/CalendarUtils.ts";
import RescheduleOptionsModal from "../../features/ui/calendar/RescheduleOptionsModal";
// Curriculum.tsx (Updated)

// Curriculum.tsx (Fixed)

const initialEvents: CurriculumEvent[] = [
  {
    id: "4",
    title: "HTML-CSS",
    start: new Date(2025, 10, 3, 8, 0),
    end: new Date(2025, 10, 3, 17, 0),
    color: "indigo",
    instructor: "Hari Kishnan",
    description:
      "An introduction to HTML and CSS, covering layouts with floats, Flexbox, and CSS Grid.",
  },
  {
    id: "5",
    title: "HTML-CSS-SASS",
    start: new Date(2025, 10, 4, 8, 0),
    end: new Date(2025, 10, 4, 17, 0),
    color: "indigo",
    instructor: "Hari Kishnan",
    description:
      "Exploring the fundamentals of SASS, including functions and module management.",
  },
  {
    id: "6",
    title: "Figma",
    start: new Date(2025, 10, 5, 8, 0),
    end: new Date(2025, 10, 5, 17, 0),
    color: "blue",
    instructor: "Hari Kishnan",
    description:
      "Learning to wireframe, design, and prototype responsive applications using Figma.",
  },
  {
    id: "7",
    title: "HTML-CSS-Bootstrap",
    start: new Date(2025, 10, 6, 8, 0),
    end: new Date(2025, 10, 6, 17, 0),
    color: "indigo",
    instructor: "Hari Kishnan",
    description:
      "Covering Bootstrap utilities, semantic HTML, and an introduction to Firebase.",
  },
  {
    id: "8",
    title: "JS",
    start: new Date(2025, 10, 7, 8, 0),
    end: new Date(2025, 10, 7, 17, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description:
      "An introduction to core JavaScript data structures like Objects, Arrays, and JSON.",
  },
  {
    id: "9",
    title: "JS-ES6",
    start: new Date(2025, 10, 10, 8, 0),
    end: new Date(2025, 10, 10, 17, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description:
      "Exploring modern JavaScript (ES6) features like arrow functions and destructuring.",
  },
  {
    id: "10",
    title: "JS-ES6",
    start: new Date(2025, 10, 11, 8, 0),
    end: new Date(2025, 10, 11, 17, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description:
      "Understanding asynchronous JavaScript through Callbacks and Promises.",
  },
  {
    id: "11",
    title: "JS-ES6",
    start: new Date(2025, 10, 12, 8, 0),
    end: new Date(2025, 10, 12, 17, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description:
      "Working with REST APIs and building a JavaScript project with a Firebase backend.",
  },
  {
    id: "12",
    title: "JS-ES6",
    start: new Date(2025, 10, 14, 8, 0),
    end: new Date(2025, 10, 14, 17, 0),
    color: "emerald",
    instructor: "Suneesh Thampi",
    description: "Final evaluation of the JavaScript project.",
  },
  {
    id: "13",
    title: "JIRA",
    start: new Date(2025, 10, 17, 8, 0),
    end: new Date(2025, 10, 17, 17, 0),
    color: "red",
    instructor: "Lekshmi A",
    description:
      "An introduction to Jira fundamentals for agile project management.",
  },
  {
    id: "14",
    title: "GIT",
    start: new Date(2025, 10, 18, 8, 0),
    end: new Date(2025, 10, 18, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "Learning the fundamental concepts of version control with Git and GitHub.",
  },
  {
    id: "15",
    title: "GIT",
    start: new Date(2025, 10, 19, 8, 0),
    end: new Date(2025, 10, 19, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "Discussing Git collaboration workflows and migrating a project to GitHub.",
  },
  {
    id: "16",
    title: "OOAD",
    start: new Date(2025, 10, 20, 8, 0),
    end: new Date(2025, 10, 20, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "An introduction to core Object-Oriented Programming (OOP) concepts.",
  },
  {
    id: "17",
    title: "OOAD",
    start: new Date(2025, 10, 21, 8, 0),
    end: new Date(2025, 10, 21, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "A deep dive into the 'IS-A' relationship with inheritance in OOP.",
  },
  {
    id: "18",
    title: "OOAD",
    start: new Date(2025, 10, 24, 8, 0),
    end: new Date(2025, 10, 24, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "Exploring the 'HAS-A' relationship (composition) and Polymorphism in OOP.",
  },
  {
    id: "19",
    title: "DBMS & OOAD",
    start: new Date(2025, 10, 25, 8, 0),
    end: new Date(2025, 10, 25, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "Introduction to DBMS, database design, and connecting to Java with the DAO pattern.",
  },
  {
    id: "20",
    title: "DBMS & OOAD",
    start: new Date(2025, 10, 26, 8, 0),
    end: new Date(2025, 10, 26, 17, 0),
    color: "blue",
    instructor: "Lekshmi A",
    description:
      "Covering database relationships, advanced querying, and string manipulation functions.",
  },
  {
    id: "21",
    title: "DBMS",
    start: new Date(2025, 10, 27, 8, 0),
    end: new Date(2025, 10, 27, 17, 0),
    color: "orange",
    instructor: "Lekshmi A",
    description:
      "Learning about aggregate functions, subqueries, and various types of SQL joins.",
  },
  {
    id: "22",
    title: "DBMS",
    start: new Date(2025, 10, 28, 8, 0),
    end: new Date(2025, 10, 28, 17, 0),
    color: "blue",
    instructor: "Lekshmi A",
    description:
      "Understanding database normalization and creating ER diagrams for a case study.",
  },
  {
    id: "23",
    title: "DBMS",
    start: new Date(2025, 11, 1, 8, 0),
    end: new Date(2025, 11, 1, 17, 0),
    color: "blue",
    instructor: "Lekshmi A",
    description:
      "Exploring advanced database objects like stored functions and triggers.",
  },
  {
    id: "24",
    title: "DBMS",
    start: new Date(2025, 11, 2, 8, 0),
    end: new Date(2025, 11, 2, 17, 0),
    color: "blue",
    instructor: "Lekshmi A",
    description:
      "Focusing on query optimization through indexing and bulk data insertion.",
  },
  {
    id: "25",
    title: "DBMS-OOAD case study",
    start: new Date(2025, 11, 3, 8, 0),
    end: new Date(2025, 11, 3, 17, 0),
    color: "blue",
    instructor: "Lekshmi A",
    description: "Evaluation of the comprehensive DBMS and OOAD case study.",
  },
  {
    id: "26",
    title: "DBMS-OOAD case study",
    start: new Date(2025, 11, 4, 8, 0),
    end: new Date(2025, 11, 4, 17, 0),
    color: "blue",
    instructor: "Lekshmi A",
    description: "Continued evaluation of the DBMS and OOAD case study.",
  },
  {
    id: "27",
    title: "Project BRD- Figma Evaluation",
    start: new Date(2025, 11, 8, 8, 0),
    end: new Date(2025, 11, 8, 17, 0),
    color: "blue",
    instructor: "Suneesh Thampi",
    description:
      "Final evaluation of the project's Business Requirements Document (BRD) and Figma designs.",
  },
];

function Curriculum() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<CurriculumEvent[]>(initialEvents);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRescheduleOptionsModal, setShowRescheduleOptionsModal] =
    useState(false);
  const [conflictingEvents, setConflictingEvents] = useState<CurriculumEvent[]>(
    [],
  );
  const [eventToReschedule, setEventToReschedule] =
    useState<CurriculumEvent | null>(null);
  const [pendingRescheduleDate, setPendingRescheduleDate] =
    useState<Date | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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

  const handleAddEvent = () => {
    if (selectedDay === null) return;
    const newEvent: CurriculumEvent = {
      id: String(Date.now()),
      title: "",
      start: new Date(currentYear, currentMonth, selectedDay, 9, 0),
      end: new Date(currentYear, currentMonth, selectedDay, 12, 0),
      color: "blue",
      instructor: "",
      description: "",
    };
    setEvents((prev) => [...prev, newEvent]);
    showToast("Event added successfully!", "success");
  };

  const handleEditEvent = (updatedEvent: CurriculumEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
    showToast("Event updated successfully!", "info");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast("Event deleted successfully!", "error");
  };

  const handleToggleHoliday = () => {
    if (selectedDay === null) return;
    const dayEvents = getDayEvents(selectedDay);
    const isCurrentlyHoliday = isHolidayDay(
      selectedDay,
      currentMonth,
      currentYear,
    );

    if (isCurrentlyHoliday) {
      setHolidays((prev) =>
        prev.filter(
          (h) =>
            !(
              h.day === selectedDay &&
              h.month === currentMonth &&
              h.year === currentYear
            ),
        ),
      );
      showToast("Holiday removed!", "info");
      return;
    }

    if (dayEvents.length > 0) {
      setConflictingEvents(dayEvents);
      setPendingRescheduleDate(
        new Date(currentYear, currentMonth, selectedDay),
      );
      setShowConflictModal(true);
    } else {
      setHolidays((prev) => [
        ...prev,
        { day: selectedDay, month: currentMonth, year: currentYear },
      ]);
      showToast("Day marked as holiday!", "info");
    }
  };

  const isHolidayDay = (day: number, month: number, year: number): boolean => {
    const date = new Date(year, month, day);
    if (date.getDay() === 0) return true;
    return holidays.some(
      (h) => h.day === day && h.month === month && h.year === year,
    );
  };

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

  const handleDeleteConflictingEvents = () => {
    if (selectedDay === null) return;
    setEvents((prev) =>
      prev.filter(
        (e) =>
          !(
            e.start.getDate() === selectedDay &&
            e.start.getMonth() === currentMonth &&
            e.start.getFullYear() === currentYear
          ),
      ),
    );
    setHolidays((prev) => [
      ...prev,
      { day: selectedDay, month: currentMonth, year: currentYear },
    ]);
    setShowConflictModal(false);
    setConflictingEvents([]);
    showToast("Events deleted and day marked as holiday!", "error");
  };

  const handleRescheduleEvent = (event: CurriculumEvent) => {
    setEventToReschedule(event);
    setShowRescheduleModal(true);
  };

  const handleRescheduleEventConfirm = (
    newDate: Date,
    pushMode: "keep" | "push",
  ) => {
    if (!eventToReschedule) return;

    const targetDateEvents = events.filter(
      (e) =>
        e.start.getDate() === newDate.getDate() &&
        e.start.getMonth() === newDate.getMonth() &&
        e.start.getFullYear() === newDate.getFullYear() &&
        e.id !== eventToReschedule.id,
    );

    if (pushMode === "push" && targetDateEvents.length > 0) {
      const eventsToMove = [...targetDateEvents, eventToReschedule];
      const sortedEvents = eventsToMove.sort(
        (a, b) => a.start.getTime() - b.start.getTime(),
      );

      let currentDate = new Date(newDate);
      const updatedEvents = events.map((event) => {
        const matchingIndex = sortedEvents.findIndex((e) => e.id === event.id);
        if (matchingIndex !== -1) {
          while (
            isHolidayDay(
              currentDate.getDate(),
              currentDate.getMonth(),
              currentDate.getFullYear(),
            )
          ) {
            currentDate.setDate(currentDate.getDate() + 1);
          }

          const updatedEvent = {
            ...event,
            start: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              event.start.getHours(),
              event.start.getMinutes(),
            ),
            end: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              event.end.getHours(),
              event.end.getMinutes(),
            ),
          };

          currentDate.setDate(currentDate.getDate() + 1);
          return updatedEvent;
        }
        return event;
      });

      setEvents(updatedEvents);
    } else {
      const updatedEvents = events.map((event) => {
        if (event.id === eventToReschedule.id) {
          return {
            ...event,
            start: new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              newDate.getDate(),
              event.start.getHours(),
              event.start.getMinutes(),
            ),
            end: new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              newDate.getDate(),
              event.end.getHours(),
              event.end.getMinutes(),
            ),
          };
        }
        return event;
      });
      setEvents(updatedEvents);
    }

    setShowRescheduleModal(false);
    setShowRescheduleOptionsModal(false);
    setEventToReschedule(null);
    setPendingRescheduleDate(null);
    showToast("Event rescheduled successfully!", "success");
  };

  // When pre-poning (rescheduling an event to an earlier date) and that date has existing events,
  // offer to pull existing events one day earlier (skipping holidays and avoiding occupied dates).
  const handlePullExistingEventsBackward = (newDate: Date) => {
    if (!eventToReschedule) return;

    const targetDay = newDate.getDate();
    const targetMonth = newDate.getMonth();
    const targetYear = newDate.getFullYear();

    const targetDateEvents = events
      .filter(
        (e) =>
          e.start.getDate() === targetDay &&
          e.start.getMonth() === targetMonth &&
          e.start.getFullYear() === targetYear &&
          e.id !== eventToReschedule.id,
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    if (targetDateEvents.length === 0) {
      // Nothing to pull; just move the event
      handleRescheduleEventConfirm(newDate, "keep");
      return;
    }

    // Other events remaining (excluding the ones we will move)
    const existingOtherEvents = events.filter(
      (e) => !targetDateEvents.some((r) => r.id === e.id),
    );

    const dateKey = (d: Date) =>
      `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    // Occupied dates are from existingOtherEvents
    const occupied = new Set<string>();
    existingOtherEvents.forEach((e) => occupied.add(dateKey(e.start)));

    // Start scheduling backwards from the day before the target date
    let currentDate = new Date(newDate);
    currentDate.setDate(currentDate.getDate() - 1);

    const movedEvents: CurriculumEvent[] = [];

    // Process events in reverse order (latest events first) so the right-most events are pulled
    // into the nearest previous dates and earlier events are pushed further back. This keeps
    // the relative ordering and ensures the event to the right is also moved.
    for (const ev of [...targetDateEvents].reverse()) {
      // find previous date that's not a holiday and not occupied
      while (
        isHolidayDay(
          currentDate.getDate(),
          currentDate.getMonth(),
          currentDate.getFullYear(),
        ) ||
        occupied.has(dateKey(currentDate))
      ) {
        currentDate.setDate(currentDate.getDate() - 1);
      }

      const newStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        ev.start.getHours(),
        ev.start.getMinutes(),
      );
      const newEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        ev.end.getHours(),
        ev.end.getMinutes(),
      );

      // We collect moved events; later we'll map them back by id
      movedEvents.push({ ...ev, start: newStart, end: newEnd });

      // mark this date occupied so the next moved event doesn't land here
      occupied.add(dateKey(currentDate));

      // move further back for the next event (which will be an earlier event)
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Now update the rescheduled event to the target date
    const updatedEvents = events.map((e) => {
      const moved = movedEvents.find((m) => m.id === e.id);
      if (moved) return moved;
      if (e.id === eventToReschedule.id) {
        return {
          ...e,
          start: new Date(
            targetYear,
            targetMonth,
            targetDay,
            e.start.getHours(),
            e.start.getMinutes(),
          ),
          end: new Date(
            targetYear,
            targetMonth,
            targetDay,
            e.end.getHours(),
            e.end.getMinutes(),
          ),
        };
      }
      return e;
    });

    setEvents(updatedEvents);

    setShowRescheduleModal(false);
    setShowRescheduleOptionsModal(false);
    setEventToReschedule(null);
    setPendingRescheduleDate(null);
    showToast(
      "Conflicting events pulled earlier and event rescheduled.",
      "success",
    );
  };

  const handleRescheduleAllEvents = (newDate: Date) => {
    if (!newDate) return;

    // determine the source day/month/year from the provided date (useful when selectedDay may have changed)
    const sourceDay = newDate.getDate();
    const sourceMonth = newDate.getMonth();
    const sourceYear = newDate.getFullYear();

    const eventsToReschedule = events
      .filter(
        (e) =>
          e.start.getDate() === sourceDay &&
          e.start.getMonth() === sourceMonth &&
          e.start.getFullYear() === sourceYear,
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    // Other events that should remain in place
    const existingOtherEvents = events.filter(
      (e) => !eventsToReschedule.some((r) => r.id === e.id),
    );

    // Helper to create date key
    const dateKey = (d: Date) =>
      `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    // Set of occupied dates (from existingOtherEvents)
    const occupied = new Set<string>();
    existingOtherEvents.forEach((e) => occupied.add(dateKey(e.start)));

    // Start scheduling from the day after the provided date so we don't reschedule onto the holiday itself;
    let currentDate = new Date(newDate);
    currentDate.setDate(currentDate.getDate() + 1);

    const movedEvents: CurriculumEvent[] = [];

    for (const ev of eventsToReschedule) {
      // find next date that's not a holiday and not occupied
      while (
        isHolidayDay(
          currentDate.getDate(),
          currentDate.getMonth(),
          currentDate.getFullYear(),
        ) ||
        occupied.has(dateKey(currentDate))
      ) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const newStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        ev.start.getHours(),
        ev.start.getMinutes(),
      );
      const newEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        ev.end.getHours(),
        ev.end.getMinutes(),
      );

      movedEvents.push({ ...ev, start: newStart, end: newEnd });

      // mark this date occupied so the next moved event doesn't land here
      occupied.add(dateKey(currentDate));

      // advance to next day for next event
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const updatedEvents = [...existingOtherEvents, ...movedEvents];

    setEvents(updatedEvents);

    // mark the source day as holiday
    setHolidays((prev) => [
      ...prev,
      { day: sourceDay, month: sourceMonth, year: sourceYear },
    ]);

    setShowConflictModal(false);
    setConflictingEvents([]);
    showToast("Events rescheduled successfully!", "success");
  };

  const selectedDayEvents =
    selectedDay !== null ? getDayEvents(selectedDay) : [];
  const currentIsHoliday =
    selectedDay !== null
      ? isHolidayDay(selectedDay, currentMonth, currentYear)
      : false;
  const isPreponedOperation = Boolean(
    eventToReschedule &&
      pendingRescheduleDate &&
      pendingRescheduleDate.getTime() < eventToReschedule.start.getTime(),
  );

  return (
    <div className="min-h-screen bg-background p-4 font-secondary">
      <div className="max-w-[1800px] mx-auto">
        <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-6 text-brand" />
              <h1 className="text-xl font-bold text-text-base">
                Training Curriculum - Admin
              </h1>
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
            <CalendarGrid
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              getDayEvents={getDayEvents}
              isHolidayDay={isHolidayDay}
            />
          </div>
          <div className="lg:sticky lg:top-6 self-start h-fit">
            <EventSidebar
              dateLabel={
                selectedDay !== null
                  ? `${monthNames[currentMonth]} ${selectedDay}, ${currentYear}`
                  : ""
              }
              events={selectedDayEvents}
              isHoliday={currentIsHoliday}
              onAdd={handleAddEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
              onToggleHoliday={handleToggleHoliday}
              onReschedule={handleRescheduleEvent}
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

      <HolidayConflictModal
        isOpen={showConflictModal}
        onClose={() => {
          setShowConflictModal(false);
          setConflictingEvents([]);
        }}
        onDelete={handleDeleteConflictingEvents}
        onReschedule={() => {
          setShowConflictModal(false);
          setShowRescheduleOptionsModal(true);
        }}
        eventCount={conflictingEvents.length}
      />

      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setEventToReschedule(null);
          setPendingRescheduleDate(null);
        }}
        onConfirm={(newDate) => {
          const targetDateEvents = events.filter(
            (e) =>
              e.start.getDate() === newDate.getDate() &&
              e.start.getMonth() === newDate.getMonth() &&
              e.start.getFullYear() === newDate.getFullYear(),
          );

          setPendingRescheduleDate(newDate);

          if (targetDateEvents.length > 0) {
            setShowRescheduleModal(false);
            setShowRescheduleOptionsModal(true);
          } else {
            handleRescheduleEventConfirm(newDate, "keep");
          }
        }}
        currentYear={currentYear}
        currentMonth={currentMonth}
        isHolidayDay={isHolidayDay}
      />

      <RescheduleOptionsModal
        isOpen={showRescheduleOptionsModal}
        onClose={() => {
          setShowRescheduleOptionsModal(false);
          setShowRescheduleModal(true);
        }}
        onKeep={() => {
          // If we're rescheduling a single event, delegate to the reschedule handler
          if (eventToReschedule && pendingRescheduleDate) {
            handleRescheduleEventConfirm(pendingRescheduleDate, "keep");
            return;
          }

          // If no single eventToReschedule, this flow is from marking a holiday with existing events.
          // "Keep Both" => mark the day as holiday but keep existing events intact.
          if (pendingRescheduleDate) {
            setHolidays((prev) => [
              ...prev,
              {
                day: pendingRescheduleDate.getDate(),
                month: pendingRescheduleDate.getMonth(),
                year: pendingRescheduleDate.getFullYear(),
              },
            ]);
            setShowRescheduleOptionsModal(false);
            setConflictingEvents([]);
            setShowConflictModal(false);
            setPendingRescheduleDate(null);
            showToast("Day marked as holiday (events kept).", "success");
          }
        }}
        onPush={() => {
          // If rescheduling a single event, push that event
          if (eventToReschedule && pendingRescheduleDate) {
            handleRescheduleEventConfirm(pendingRescheduleDate, "push");
            return;
          }

          // If no single event, push all events of that day forward and mark day as holiday
          if (pendingRescheduleDate) {
            handleRescheduleAllEvents(pendingRescheduleDate);
            // handleRescheduleAllEvents will mark the day as holiday and move events
            setShowRescheduleOptionsModal(false);
            setConflictingEvents([]);
            setShowConflictModal(false);
            setPendingRescheduleDate(null);
          }
        }}
        isPreponed={isPreponedOperation}
        onPull={() => {
          if (eventToReschedule && pendingRescheduleDate) {
            handlePullExistingEventsBackward(pendingRescheduleDate);
            return;
          }

          if (pendingRescheduleDate) {
            // Pull for the whole day isn't supported in this flow; revert to reschedule modal
            setShowRescheduleOptionsModal(false);
            setShowRescheduleModal(true);
            showToast(
              "Pull operation is available only when rescheduling a single event.",
              "info",
            );
          }
        }}
        onRescheduleAll={handleRescheduleAllEvents}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Curriculum;
