import { useState, useMemo, useRef } from "react";

type RecentBatchesProps = {
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
};

import { sampleBatches } from "../../../features/admin/dashboard/BatchSelect";

// CalendarGrid component (adapted from TotalTrainingHours) — shows popup on hover
function CalendarGrid({
  year,
  month,
  hoverDate,
  setHoverDate,
}: {
  year: number;
  month: number; // 1-12
  hoverDate: Date | null;
  setHoverDate: (d: Date | null) => void;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  return (
    <div className="grid grid-cols-7 gap-2 text-sm relative" ref={gridRef}>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-xs text-center h-8 flex items-center justify-center bg-white text-gray-400">
          {day[0]}
        </div>
      ))}

      {cells.map((d, i) => {
        const col = i % 7;
        const isSunday = col === 0;
        if (d === null) return <div key={i} className="h-8" />;

        const date = new Date(year, month - 1, d);
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div key={i} className="relative">
            <button
              type="button"
              onMouseEnter={() => setHoverDate(date)}
              onMouseLeave={() => setHoverDate(null)}
              className={`h-10 w-10 rounded-md flex items-center justify-center hover:bg-green-100 transition-colors ${
                isSunday
                  ? "text-gray-400"
                  : isToday
                  ? "bg-green-600 text-white hover:bg-green-500"
                  : "hover:text-green-800"
              }`}
            >
              {d}
            </button>

            {hoverDate && hoverDate.toDateString() === date.toDateString() && (
              <div className="absolute z-10 bg-white border rounded shadow-md p-3 text-xs w-64 left-1/2 transform -translate-x-1/2 bottom-full mb-2">
                <div className="text-xs font-medium mb-2">Schedule for {date.toLocaleDateString()}</div>
                <ul className="text-xs space-y-1.5">
                  {[
                    { time: "09:00", topic: "JavaScript Fundamentals" },
                    { time: "14:30", topic: "State Management" },
                    { time: "16:00", topic: "Hands-on Workshop" }
                  ].map((session) => (
                    <li key={session.time} className="flex items-center gap-2">
                      <span className="text-gray-500 w-12">{session.time}</span>
                      <span>{session.topic}</span>
                    </li>
                  ))}
                </ul>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r shadow"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RecentBatches({ selectedBatchId, setSelectedBatchId }: RecentBatchesProps) {
  const selected = sampleBatches.find((b) => b.id === selectedBatchId) || sampleBatches[0];

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // month navigation is handled by currentMonth; CalendarGrid computes layout for the month
  const goToPreviousMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const goToNextMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Batch details (md:col-span-2) */}
        <div className="md:col-span-2 rounded-md p-4 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-600">{selected.title}</h2>
              {selected.subtitle && <div className="text-sm text-gray-500">{selected.subtitle}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Batch Status</div>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${(selected.status || "ongoing").toLowerCase() === "ongoing"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-purple-100 text-purple-700"
                    }`}
                >
                  {selected.status || "Ongoing"}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">No. of Trainees</div>
              <div className="text-base font-medium text-gray-900">{selected.trainees || 36}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Day</div>
              <div className="text-base font-medium text-gray-900">47</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">Start Date</div>
              <div className="text-base font-medium text-gray-900">{selected.startDate || "23/08/2025"}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-1">End Date</div>
              <div className="text-base font-medium text-gray-900">{selected.endDate || "23/08/2025"}</div>
            </div>

            {/* <div>
              <div className="text-sm text-gray-600 mb-1">Tech Stacks</div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">React</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Angular</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">.Net</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">Python</span>
              </div>
            </div> */}
          </div>

          <div className=" overflow-hidden bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">Phases</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">Start Date</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">End Date</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  // Using actual sequential dates for phases
                  { phase: "E-Learning", start: "23/08/2025", end: "03/09/2025", days: 12 },
                  { phase: "Tech - Fundamentals", start: "04/09/2025", end: "16/09/2025", days: 13 },
                  { phase: "Business Orientation", start: "17/09/2025", end: "01/10/2025", days: 15 },
                  { phase: "Specialization", start: "02/10/2025", end: "26/11/2025", days: 25 },
                ].map((phaseData) => {
                  // Convert dates to compare
                  const startDate = new Date(phaseData.start.split('/').reverse().join('-'));
                  const endDate = new Date(phaseData.end.split('/').reverse().join('-'));
                  const currentDate = currentMonth; // Using the selected month date
                  
                  // Check if this phase is current
                  const isCurrentPhase = currentDate >= startDate && currentDate <= endDate;

                  return (
                    <tr key={phaseData.phase} className={`hover:bg-gray-50 ${isCurrentPhase ? 'bg-green-100/40' : ''}`}>
                      <td className="py-3 px-6 text-sm text-gray-900">{phaseData.phase}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{phaseData.start}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{phaseData.end}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{phaseData.days}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: dropdown above calendar (md:col-span-1) */}
        <div className="md:col-span-1 rounded-xl bg-white  p-4">
          <div className="flex justify-end mb-4">
            <select
              value={selected.id}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-gray-50 rounded px-3 py-1.5 text-sm border border-gray-200 min-w-[200px]"
            >
              {sampleBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">&lt;</button>
              <span className="text-sm font-medium text-gray-600">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </span>
              <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">&gt;</button>
            </div>

            {/* <div className="grid grid-cols-7 text-center mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-xs text-gray-500 font-medium">{day}</div>
              ))}
            </div> */}

            {/* Use CalendarGrid component for the month days and hover popups */}
            <CalendarGrid
              year={currentMonth.getFullYear()}
              month={currentMonth.getMonth() + 1}
              hoverDate={hoveredDate}
              setHoverDate={setHoveredDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}