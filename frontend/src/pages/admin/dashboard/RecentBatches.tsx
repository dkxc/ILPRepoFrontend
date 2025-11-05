import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

type RecentBatchesProps = {
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
};

interface Phase {
  phaseType: string;
  startDate: string;
  endDate: string;
  days: number;
}

interface BatchDetail {
  batchId: number;
  batchName: string;
  batchStatus: string;
  batchType: string;
  startDate: string;
  endDate: string;
  noOfTrainees: number;
  dayOfBatch: number;
  phases: Phase[];
}

// Dummy batch list (for now; replace with API call later)
// Fetch all batches for dropdown
// const {
//   data: batches,
//   isLoading: isBatchesLoading,
//   isError: isBatchesError,
// } = useQuery({
//   queryKey: ["batches"],
//   queryFn: async () => {
//     const res = await fetch("https://localhost:7224/api/AdminDashboard/batches");
//     if (!res.ok) throw new Error("Failed to fetch batch list");
//     return res.json();
//   },
// });

// Fetch batch details from backend API
const fetchBatchDetails = async (batchId: string): Promise<BatchDetail> => {
  const res = await fetch(
    `https://localhost:7224/api/AdminDashboard/batch-details/${batchId}`,
  );
  if (!res.ok) throw new Error("Failed to load batch details");
  return res.json();
};

const fetchAllBatches = async () => {
  const res = await fetch("https://localhost:7224/api/AdminDashboard/batches");
  if (!res.ok) throw new Error("Failed to fetch batch list");
  return res.json();
};

// CalendarGrid component (used for the right-side calendar)
function CalendarGrid({
  year,
  month,
  hoverDate,
  setHoverDate,
}: {
  year: number;
  month: number;
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
        <div
          key={day}
          className="text-xs text-center h-8 flex items-center justify-center bg-white text-gray-400"
        >
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
              className={`h-10 w-10 rounded-md flex items-center justify-center hover:bg-green-100 transition-colors ${isSunday
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
                <div className="text-xs font-medium mb-2">
                  Schedule for {date.toLocaleDateString()}
                </div>
                <ul className="text-xs space-y-1.5">
                  {[
                    // Example schedule (static)
                    { time: "09:00", topic: "JavaScript Fundamentals" },
                    { time: "14:30", topic: "State Management" },
                    { time: "16:00", topic: "Hands-on Workshop" },
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

// Main component
export default function RecentBatches({
  selectedBatchId,
  setSelectedBatchId,
}: RecentBatchesProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const {
    data: batches,
    isLoading: isBatchesLoading,
    isError: isBatchesError,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: fetchAllBatches,
  });

  // ✅ When batches are fetched, set first batch as default
  useEffect(() => {
    if (batches && batches.length > 0 && !selectedBatchId) {
      setSelectedBatchId(batches[0].id.toString());
    }
  }, [batches, selectedBatchId, setSelectedBatchId]);

  // Fetch selected batch details
  const {
    data: batchDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["batchDetails", selectedBatchId],
    queryFn: () => fetchBatchDetails(selectedBatchId),
    enabled: !!selectedBatchId,
  });

  // Fetch all batches for dropdown

  const goToPreviousMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1),
    );
  const goToNextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1),
    );

  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Batch details */}
        <div className="md:col-span-2 rounded-md p-4 bg-white">
          {isLoading && (
            <p className="text-gray-500 text-sm">Loading batch details...</p>
          )}
          {isError && (
            <p className="text-red-600 text-sm">Error loading batch data.</p>
          )}

          {batchDetails && (
            <>
              <h2 className="text-xl font-bold text-gray-600 mb-4">
                {batchDetails.batchName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Batch Status</div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${batchDetails.batchStatus.toLowerCase() === "ongoing"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-purple-100 text-purple-700"
                      }`}
                  >
                    {batchDetails.batchStatus}
                  </span>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    No. of Trainees
                  </div>
                  <div className="text-base font-medium text-gray-900">
                    {batchDetails.noOfTrainees}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Day of Batch</div>
                  <div className="text-base font-medium text-gray-900">
                    {batchDetails.dayOfBatch}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Start Date</div>
                  <div className="text-base font-medium text-gray-900">
                    {new Date(batchDetails.startDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">End Date</div>
                  <div className="text-base font-medium text-gray-900">
                    {new Date(batchDetails.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Phase Table */}
              {batchDetails.phases && batchDetails.phases.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                        Phase
                      </th>
                      <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                        Start Date
                      </th>
                      <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                        End Date
                      </th>
                      <th className="py-3 px-6 text-sm font-medium text-gray-600 text-left">
                        Days
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {batchDetails.phases.map((p) => (
                      <tr key={p.phaseType}>
                        <td className="py-3 px-6 text-sm text-gray-900">
                          {p.phaseType}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-600">
                          {new Date(p.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-600">
                          {new Date(p.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-600">
                          {(() => {
                            const start = new Date(p.startDate);
                            const end = new Date(p.endDate);

                            let count = 0;
                            const current = new Date(start);

                            while (current <= end) {
                              if (current.getDay() !== 0) count++; // exclude only Sundays
                              current.setDate(current.getDate() + 1);
                            }

                            return count;
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Dropdown and Calendar */}
        <div className="md:col-span-1 rounded-xl bg-white p-4">
          <div className="flex justify-end mb-4">
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-gray-50 rounded px-3 py-1.5 text-sm border border-gray-200 min-w-[200px]"
            >
              {/* Show loading, error, or fetched batches */}
              {isBatchesLoading ? (
                <option>Loading batches...</option>
              ) : isBatchesError ? (
                <option>Error loading batches</option>
              ) : (
                batches?.map((b: { id: number; name: string }) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                &lt;
              </button>
              <span className="text-sm font-medium text-gray-600">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                &gt;
              </button>
            </div>

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
