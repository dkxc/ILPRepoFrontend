import type { BulkUpdateStatus } from "../../types/AttendanceQuery.types";
import type { Selection, SortDescriptor } from "react-aria-components";
import { Table, TableCard } from "@ui/table/Table";
import { Fragment } from "react";
import { format } from "date-fns";
import { Badge } from "@ui/badges/Badges";
import {
  attendanceStatuses,
  getSelectionSize,
  getStatusColor,
  getStatusExpanded,
  sessionOptions,
  StatusIcon,
} from "./utils/AttendanceTable.utils";
import { Dropdown as NestedDropdown } from "@ui/dropdown/NestedDropdown";
import { Button } from "@ui/button/Button";
import { CheckCircle, ChevronDown } from "lucide-react";
import type { ProcessedTraineeData } from "../../types/AttendanceRecord.types";
import { getTotalBadgeColor } from "@features/admin/attendance/utils/Attendance.utils";

interface AttendanceTableProps {
  data: ProcessedTraineeData[];
  dateColumns: Date[];
  showTotalColumns: boolean;
  sortDescriptor: SortDescriptor;
  onSortChange: (descriptor: SortDescriptor) => void;
  selectedKeys: Selection;
  onSelectionChange: (keys: Selection) => void;
  onBulkUpdate: (newStatus: BulkUpdateStatus) => void;
  isButtonUpdating?: boolean;
  className?: string;
}

function AttendanceTable({
  data,
  dateColumns,
  showTotalColumns,
  sortDescriptor,
  onSortChange,
  selectedKeys,
  onSelectionChange,
  onBulkUpdate,
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
          {showTotalColumns && (
            <>
              <Table.Head id="total-fn" label="Total (FN)" />
              <Table.Head id="total-an" label="Total (AN)" />
              <Table.Head id="total" label="Total" />
            </>
          )}
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

              {showTotalColumns && (
                <>
                  <Table.Cell>
                    <Badge
                      color={getTotalBadgeColor(
                        item.presentFN,
                        item.totalPossibleDays,
                      )}
                    >
                      {`${item.presentFN} / ${item.totalPossibleDays}`}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={getTotalBadgeColor(
                        item.presentAN,
                        item.totalPossibleDays,
                      )}
                    >
                      {`${item.presentAN} / ${item.totalPossibleDays}`}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Badge
                        color={getTotalBadgeColor(
                          item.totalPresentDays,
                          item.totalPossibleDays,
                        )}
                      >
                        {`${item.totalPresentDays} / ${item.totalPossibleDays}`}
                      </Badge>
                      {item.totalPresentDays === item.totalPossibleDays &&
                        item.totalPossibleDays > 0 && (
                          <CheckCircle className="size-4 text-green-500" />
                        )}
                    </div>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableCard.Root>
  );
}

export default AttendanceTable;
