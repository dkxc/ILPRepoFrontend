import { useMemo, useState } from "react";
import Card from "../../../features/ui/card/Card";
import CardContent from "../../../features/ui/card/CardContent";
import CardHeader from "../../../features/ui/card/CardHeader";

const sampleRows = Array.from({ length: 5 }).map(() => ({
  name: `ILP 2025 - 26 Batch 1`,
  type: `Full Stack`,
  hrs: `240 hrs`,
  days: `120 Days`,
}));

import { useRef } from "react";
import BatchSelect, {
  sampleBatches,
} from "../../../features/admin/dashboard/BatchSelect";

function CalendarGrid({
  year,
  month,
  holidays = [],
  onDayClick,
  selectedDay,
  setPopupDay,
  trainingHours,
  onUpdateHours,
}: {
  year: number;
  month: number;
  holidays?: number[];
  onDayClick?: (d: number) => void;
  selectedDay: number | null;
  setPopupDay: (d: number | null) => void;
  trainingHours: Record<number, number>;
  onUpdateHours: (day: number, hours: number) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  // month: 1-12
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
      {["S", "M", "T", "W", "T", "F", "S"].map((h, _) => (
        <div
          key={h}
          className={
            "text-xs text-center h-8 flex items-center justify-center bg-white text-gray-400"
          }
        >
          {h}
        </div>
      ))}
      {cells.map((d, i) => {
        const col = i % 7;
        const isSunday = col === 0;
        const isHoliday = d !== null && holidays.includes(d);
        return (
          <div key={i} className="relative">
            <button
              onClick={() => {
                if (d) {
                  onDayClick?.(d);
                  setPopupDay(d);
                }
              }}
              type="button"
              className={`h-10 w-10 rounded-md flex items-center justify-center ${
                d === null
                  ? "invisible"
                  : isSunday
                    ? "bg-white text-gray-400"
                    : isHoliday
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {d}
            </button>
            {selectedDay === d && d !== null && (
              <div
                className="absolute z-10 bg-white border rounded shadow-md p-4 text-xs"
                style={{ left: 32, top: 0, minWidth: "200px" }}
              >
                <div className="mb-2">Day {d}</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Training Hours:
                    </div>
                    <input
                      type="number"
                      className="w-20 border rounded px-2 py-1"
                      value={trainingHours[d] || 8}
                      onChange={(e) => onUpdateHours(d, Number(e.target.value))}
                      min="0"
                      max="24"
                    />
                  </div>
                  <div className="flex justify-between gap-2">
                    <button
                      className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                      onClick={() => {
                        onUpdateHours(d, 8);
                        setPopupDay(null);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      onClick={() => {
                        if (!holidays.includes(d)) {
                          holidays.push(d);
                          onUpdateHours(d, 0);
                        }
                        setPopupDay(null);
                      }}
                    >
                      Mark as Holiday
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TotalTrainingHours() {
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState("2025-12-31");
  const [batchType, setBatchType] = useState("All Batch Types");
  const [selectedBatch, setSelectedBatch] = useState<string>(
    sampleBatches[0].id,
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [month, setMonth] = useState(9);
  const [holidays, setHolidays] = useState<number[]>([]);
  const [trainingHours, setTrainingHours] = useState<Record<number, number>>(
    {},
  );

  const handleUpdateHours = (day: number, hours: number) => {
    setTrainingHours((prev) => ({
      ...prev,
      [day]: hours,
    }));
  };

  return (
    // <div className="p-3">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 flex flex-col h-full">
        <Card className="bg-white flex flex-col h-full">
          <CardHeader className="text-xl font-bold text-gray-600 px-6 py-4">
            View Training Hours
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between gap-4">
                    <div className="flex flex-col w-full gap-1">
                      <label className="text-sm text-gray-600">
                        Select Start Date
                      </label>
                      <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label className="text-sm text-gray-600">
                        Select End Date
                      </label>
                      <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1">
                      <label className="text-sm text-gray-600">
                        Select Batch Type
                      </label>
                      <select
                        value={batchType}
                        onChange={(e) => setBatchType(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2"
                      >
                        <option>All Batch Types</option>
                        <option>Full Stack</option>
                        <option>Frontend</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="bg-blue-50 px-6 py-3 rounded-md text-center w-[200px]">
                    <div className="text-sm text-gray-600 mb-1">
                      Total Training Hours
                    </div>
                    <div className="text-xl font-semibold text-blue-600">
                      48
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-[var(--color-brand-600)] rounded overflow-hidden">
                <div className="grid grid-cols-4 gap-4 bg-gray-50 px-4 py-3 text-sm text-gray-600 font-medium">
                  <div>Name</div>
                  <div className="text-center">Batch Type</div>
                  <div>Total Training hrs</div>
                  <div>Training Days</div>
                </div>
                <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
                  <div className="divide-y divide-gray-200">
                    {sampleRows.map((r, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-4 items-center text-sm px-4 py-3"
                      >
                        <div className="text-gray-700">{r.name}</div>
                        <div className="text-muted-foreground text-center">
                          {r.type}
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {r.hrs}
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {r.days}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col h-full">
        <Card className="bg-white flex flex-col h-full">
          <CardHeader className="text-xl font-bold text-gray-600 px-6 py-4">
            Edit Training Hours
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <BatchSelect
                  value={selectedBatch}
                  onChange={(id) => setSelectedBatch(id)}
                  className="w-full border border-gray-200 rounded px-3 py-2"
                />
              </div>

              <div>
                {/* <label className="text-sm text-gray-600">
                    Click a Date to Edit
                  </label> */}
                <div className="mt-3 border-[var(--color-brand-600)] rounded">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      className="border border-gray-200 rounded px-2 py-1"
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {new Date(2025, m - 1).toLocaleString("default", {
                            month: "long",
                          })}{" "}
                          2025
                        </option>
                      ))}
                    </select>
                  </div>
                  <CalendarGrid
                    year={2025}
                    month={month}
                    holidays={holidays}
                    onDayClick={(d) => setSelectedDay(d)}
                    selectedDay={selectedDay}
                    setPopupDay={setSelectedDay}
                    trainingHours={trainingHours}
                    onUpdateHours={handleUpdateHours}
                  />
                </div>
              </div>

              {/* Removed Training Hours/Mark as Holiday card from default view. Now only shown in popup. */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    // </div>
  );
}
