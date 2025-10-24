// src/ui/calendar-utils.ts

export const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

export const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

export const monthNames = [
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

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const colorClasses = {
  blue: "bg-blue-100 border-blue-500 text-blue-700",
  emerald: "bg-emerald-100 border-emerald-500 text-emerald-700",
  indigo: "bg-indigo-100 border-indigo-500 text-indigo-700",
  pink: "bg-pink-100 border-pink-500 text-pink-700",
  amber: "bg-amber-100 border-amber-500 text-amber-700",
  red: "bg-red-100 border-red-500 text-red-700",
  orange: "bg-orange-100 border-orange-500 text-orange-700",
};

export type CurriculumEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: keyof typeof colorClasses;
  instructor: string;
  description: string;
};

export type SelectedDay = {
  day: number;
  events: CurriculumEvent[];
};
