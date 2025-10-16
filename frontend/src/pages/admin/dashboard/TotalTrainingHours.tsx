import { useMemo, useState } from "react";
import AdminDashboardCard from "../../../features/admin/dashboard/AdminDashboardCard";
import { useNavigate } from "react-router";
const topCards = [
  { id: "batches", title: "All Batches", subtitle: "1", value: <span className="text-2xl">1</span> },
  { id: "projects", title: "Projects", subtitle: "8", value: <span className="text-2xl">8</span> },
  { id: "hours", title: "Total Training Hours", subtitle: "hr/week", value: <span className="text-2xl">48</span> },
];
import Card from "../../../features/ui/card/Card";
import CardContent from "../../../features/ui/card/CardContent";
import CardHeader from "../../../features/ui/card/CardHeader";

const sampleRows = Array.from({ length: 5 }).map(() => ({
  name: `ILP 2025 - 26 Batch 1`,
  type: `Full Stack`,
  hrs: `240 hrs`,
  days: `120 Days`,
}));

import { useRef, useState as useLocalState } from "react";

function CalendarGrid({ year, month, highlighted = [], onDayClick, selectedDay, setPopupDay }: {
  year: number;
  month: number;
  highlighted?: number[];
  onDayClick?: (d: number) => void;
  selectedDay: number | null;
  setPopupDay: (d: number | null) => void;
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
      {["S", "M", "T", "W", "T", "F", "S"].map((h, idx) => (
        <div
          key={h}
          className={"text-xs text-center h-8 flex items-center justify-center bg-white text-gray-400"}
        >
          {h}
        </div>
      ))}
      {cells.map((d, i) => {
        const col = i % 7;
        const isSunday = col === 0;
        const isHighlighted = d !== null && highlighted.includes(d);
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
                  : isHighlighted
                  ? "bg-green-100 text-green-800"
                  : "text-green-800 hover:bg-green-100"
              }`}
            >
              {d}
            </button>
            {selectedDay === d && d !== null && (
              <div
                className="absolute z-10 bg-white border rounded shadow-md p-2 text-xs"
                style={{ left: 32, top: 0 }}
              >
                <div className="mb-2">Day {d}</div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-gray-500">Training Hours:</div>
                    <div className="text-lg font-semibold">8</div>
                  </div>
                  <button className="bg-gray-100 text-gray-700 px-2 py-1 rounded" onClick={() => { setPopupDay(null); alert(`Marked day ${d} as holiday!`); }}>Mark as Holiday</button>
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
  const [from, setFrom] = useState('2025-01-01');
  const [to, setTo] = useState('2025-12-31');
  const [batchType, setBatchType] = useState('All Batch Types');
  const [selectedBatch, setSelectedBatch] = useState('ILP 2024 - 25 Batch 4');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const highlighted = [9,10,11,12,13,14,16,17,18,19,20,21,23,24,25,26,27,28,30,31];
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-2 flex flex-col h-full">
          <Card className="border bg-white flex flex-col h-full">
            <CardHeader className="px-6 py-4">View Training Hours</CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-sm text-gray-600">Select Start Date</label>
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Select End Date</label>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">&nbsp;</label>
                    <button className="w-full bg-blue-600 text-white rounded px-4 py-2">Apply Filter</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="text-sm text-gray-600">Select Batch Type</label>
                    <select value={batchType} onChange={(e) => setBatchType(e.target.value)} className="w-full border rounded px-3 py-2">
                      <option>All Batch Types</option>
                      <option>Full Stack</option>
                      <option>Frontend</option>
                    </select>
                  </div>
                  <div />
                  <div className="text-right">
                    <label className="text-sm text-gray-600">&nbsp;</label>
                    <div className="inline-block bg-gray-100 px-3 py-2 rounded">Total Training Hours: <span className="font-semibold text-blue-600">48 hr/week</span></div>
                  </div>
                </div>

                <div className="border rounded overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    <div>Name</div>
                    <div>Batch Type</div>
                    <div>Total Training hrs</div>
                    <div>Total Training Days</div>
                  </div>
                  <div className="p-4 space-y-3">
                    {sampleRows.map((r, i) => (
                      <div key={i} className="grid grid-cols-4 items-center text-sm">
                        <div className="text-gray-700">{r.name}</div>
                        <div className="text-muted-foreground">{r.type}</div>
                        <div className="text-blue-600 font-semibold">{r.hrs}</div>
                        <div className="text-blue-600 font-semibold">{r.days}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col h-full">
          <Card className="border bg-white flex flex-col h-full">
            <CardHeader className="px-6 py-4">Edit Training Hours</CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Select Batch</label>
                  <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="w-full border rounded px-3 py-2">
                    <option>ILP 2024 - 25 Batch 4</option>
                    <option>ILP 2025 - 26 Batch 1</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Click a Date to Edit</label>
                  <div className="mt-3 p-4 border rounded">
                    <div className="text-center mb-3 font-medium">September 2025</div>
                    <CalendarGrid
                      year={2025}
                      month={9}
                      highlighted={highlighted}
                      onDayClick={(d) => setSelectedDay(d)}
                      selectedDay={selectedDay}
                      setPopupDay={setSelectedDay}
                    />
                  </div>
                </div>

                {/* Removed Training Hours/Mark as Holiday card from default view. Now only shown in popup. */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
