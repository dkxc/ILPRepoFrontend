import type { DateValue } from "react-aria";
import { Dropdown } from "@ui/dropdown/Dropdown";
import { Download, UploadCloud } from "lucide-react";
import DateRangePicker from "../DateRangePicker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Select } from "@ui/select/Select";
import type { Batch } from "../../hooks/useBatchQuery";
import { useMemo } from "react";

interface AttendanceHeaderProps {
  /** The current date range value. */
  dateValue: { start: DateValue; end: DateValue } | null;
  /** Callback to handle changes to the date range. */
  onDateChange: (value: { start: DateValue; end: DateValue } | null) => void;

  // Batch
  batches: Batch[];
  /** The ID of the currently selected batch. */
  selectedBatchId: number | null;
  /** Callback to handle changes to the selected batch. */
  onBatchChange: (id: number | null) => void;

  /** Callback to trigger the import slideout. */
  onImport: () => void;
  /** Callback to trigger the export action. */
  onExport: () => void;
}

function AttendanceHeader({
  dateValue,
  onDateChange,
  batches,
  selectedBatchId,
  onBatchChange,
  onImport,
  onExport,
}: AttendanceHeaderProps) {
  const batchItems = useMemo(() => {
    return batches.map((batch) => ({
      id: batch.id.toString(),
      label: batch.batchName,
    }));
  }, [batches]);

  return (
    <div className="flex items-center justify-between mb-4 px-4">
      <h1 className="text-xl font-semibold text-primary">Attendance Records</h1>
      <div className="flex items-center-safe gap-4">
        <Select.ComboBox
          isRequired
          items={batchItems}
          selectedKey={selectedBatchId?.toString() ?? ""}
          onSelectionChange={(key) => {
            onBatchChange(key ? parseInt(key as string, 10) : null);
          }}
        >
          {(item) => (
            <Select.Item
              id={item.id}
              supportingText={item.supportingText}
              isDisabled={item.isDisabled}
              icon={item.icon}
              avatarUrl={item.avatarUrl}
            >
              {item.label}
            </Select.Item>
          )}
        </Select.ComboBox>
        <DateRangePicker
          shouldCloseOnSelect
          value={dateValue}
          onChange={onDateChange}
          maxValue={today(getLocalTimeZone())}
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
