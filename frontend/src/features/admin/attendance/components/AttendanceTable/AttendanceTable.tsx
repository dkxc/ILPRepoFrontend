import type { DateValue } from "react-aria";
import type {
  BulkUpdateStatus,
  GetResponseType,
} from "../../types/AttendanceRecord.types";
import type { Selection, SortDescriptor } from "react-aria-components";
import { Table, TableCard } from "@ui/table/Table";
import { Fragment } from "react";
import DateRangePicker from "../DateRangePicker";
import { format } from "date-fns";
import { Badge } from "@ui/badges/Badges";
import {
  attendanceStatuses,
  getSelectionSize,
  getStatusColor,
  getStatusExpanded,
  sessionOptions,
  StatusIcon,
} from "./utils/Attendance.utils";
import { Dropdown as NestedDropdown } from "@ui/dropdown/NestedDropdown";
import { Button } from "@ui/button/Button";
import { ChevronDown, Download, UploadCloud } from "lucide-react";
import { Dropdown } from "@ui/dropdown/Dropdown";

interface AttendanceTableProps {
  data: GetResponseType[];
  dateColumns: Date[];
  dateValue: {
    start: DateValue;
    end: DateValue;
  } | null;
  onDateChange: (
    value: {
      start: DateValue;
      end: DateValue;
    } | null,
  ) => void;
  sortDescriptor: SortDescriptor;
  onSortChange: (descriptor: SortDescriptor) => void;
  selectedKeys: Selection;
  onSelectionChange: (keys: Selection) => void;
  onBulkUpdate: (newStatus: BulkUpdateStatus) => void;
  onImport: () => void;
  onExport: () => void;
  isButtonUpdating?: boolean;
  className?: string;
}

function AttendanceTable({
  data,
  dateColumns,
  dateValue,
  onDateChange,
  sortDescriptor,
  onSortChange,
  selectedKeys,
  onSelectionChange,
  onBulkUpdate,
  onImport,
  onExport,
  isButtonUpdating,
  className,
}: AttendanceTableProps) {
  const getTotalSelections = getSelectionSize(selectedKeys, data.length);
  return (
    <TableCard.Root size="sm" className={className}>
      <TableCard.Header
        title="Attendance Records"
        badge={
          getTotalSelections
            ? `${getTotalSelections} trainees selected`
            : `${data.length} trainees`
        }
        contentTrailing={
          <div className="flex items-center-safe gap-4">
            <NestedDropdown.Root>
              <Button
                color="primary"
                size="md"
                iconLeading={ChevronDown}
                isLoading={isButtonUpdating}
                showTextWhileLoading={true}
                isDisabled={getTotalSelections <= 0}
              >
                {isButtonUpdating ? "Updating" : "Mark As"}
              </Button>
              <NestedDropdown.Popover>
                <NestedDropdown.Menu>
                  {attendanceStatuses.map((status) => (
                    <NestedDropdown.Submenu
                      key={status.id}
                      label={status.label}
                      icon={<StatusIcon dotClassName={status.dotClassName} />}
                    >
                      {sessionOptions.map((session) => (
                        <NestedDropdown.Item
                          key={session.label}
                          label={session.label}
                          icon={session.icon}
                          onAction={() =>
                            onBulkUpdate(session.getPayload(status.id))
                          }
                        />
                      ))}
                    </NestedDropdown.Submenu>
                  ))}
                </NestedDropdown.Menu>
              </NestedDropdown.Popover>
            </NestedDropdown.Root>
          </div>
        }
      />

      <Table
        aria-label="Attendance Records"
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      >
        <Table.Header>
          <Table.Head
            id="traineeName"
            label="Trainee Name"
            allowsSorting
            isRowHeader
          />
          {dateColumns.map((date) => (
            <Fragment key={date.toISOString()}>
              <Table.Head
                id={`fn_${date.toISOString()}`}
                allowsSorting
                isRowHeader
              >
                <div className="text-xs font-semibold whitespace-nowrap text-quaternary">
                  <div>{format(date, "MMM d")}</div>
                  <div>FN</div>
                </div>
              </Table.Head>
              <Table.Head
                id={`an_${date.toISOString()}`}
                allowsSorting
                isRowHeader
              >
                <div className="text-xs font-semibold whitespace-nowrap text-quaternary">
                  <div>{format(date, "MMM d")}</div>
                  <div>AN</div>
                </div>
              </Table.Head>
            </Fragment>
          ))}
        </Table.Header>

        <Table.Body items={data}>
          {(item) => (
            <Table.Row id={item.traineeId}>
              <Table.Cell>{item.traineeName}</Table.Cell>

              {dateColumns.map((date) => {
                const dateKey = format(date, "yyyy-MM-dd");
                const record = item.dates[dateKey];
                const forenoonStatus = record?.forenoon ?? "N/A";
                const afternoonStatus = record?.afternoon ?? "N/A";

                return (
                  <Fragment key={date.toISOString()}>
                    <Table.Cell>
                      <Badge size="sm" color={getStatusColor(forenoonStatus)}>
                        {getStatusExpanded(forenoonStatus)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="border-r border-slate-200 dark:border-slate-700">
                      <Badge size="sm" color={getStatusColor(afternoonStatus)}>
                        {getStatusExpanded(afternoonStatus)}
                      </Badge>
                    </Table.Cell>
                  </Fragment>
                );
              })}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableCard.Root>
  );
}

export default AttendanceTable;
