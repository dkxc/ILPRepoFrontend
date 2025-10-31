import type { DateValue } from "react-aria";
import { Dropdown } from "@ui/dropdown/Dropdown";
import { Download, UploadCloud } from "lucide-react";
import DateRangePicker from "../DateRangePicker";

interface AttendanceHeaderProps {
  /** The current date range value. */
  dateValue: { start: DateValue; end: DateValue } | null;
  /** Callback to handle changes to the date range. */
  onDateChange: (value: { start: DateValue; end: DateValue } | null) => void;
  /** Callback to trigger the import slideout. */
  onImport: () => void;
  /** Callback to trigger the export action. */
  onExport: () => void;
}

function AttendanceHeader({
  dateValue,
  onDateChange,
  onImport,
  onExport,
}: AttendanceHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <h1 className="text-xl font-semibold text-primary">Attendance Records</h1>
      <div className="flex items-center-safe gap-4">
        <DateRangePicker
          shouldCloseOnSelect
          value={dateValue}
          onChange={onDateChange}
        />
        <Dropdown.Root>
          <Dropdown.DotsButton />
          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item icon={UploadCloud} onAction={onImport}>
                Import
              </Dropdown.Item>
              <Dropdown.Item icon={Download} onAction={onExport}>
                Export
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown.Root>
      </div>
    </div>
  );
}

export default AttendanceHeader;
