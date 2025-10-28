import React, { useMemo, useState } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type {
  DateValue,
  Selection,
  SortDescriptor,
} from "react-aria-components";
import { useDateFormatter } from "react-aria";

import {
  AttendanceStatus,
  type GetResponseType,
} from "../../../features/admin/attendance/types/AttendanceRecord.types";
import {
  useAttendanceQuery,
  useUpdateAttendanceMutation,
} from "../../../features/admin/attendance/hooks/useAttendanceQueries";
import DateRangePicker from "../../../features/admin/attendance/components/DateRangePicker";

import { Button } from "@ui/button/Button";
import { Table, TableCard } from "@ui/table/Table";
import { PaginationCardMinimal } from "@ui/pagination/Pagination";
import { Badge, type BadgeColor } from "@ui/badges/Badges";
import type { BadgeTypes } from "@ui/badges/components/BadgeTypes";

const now = today(getLocalTimeZone());
const ROWS_PER_PAGE = 10;

const statusTextMap: Record<string, string> = {
  P: "Present",
  A: "Absent",
  PP: "Partially",
  "N/A": "N/A",
};
const getStatusColor = (status: string): BadgeColor<BadgeTypes> => {
  switch (status) {
    case "P":
      return "success";
    case "A":
      return "error";
    case "PP":
      return "warning";
    default:
      return "gray";
  }
};

function Attendance() {
  const [value, setValue] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>({
    start: now,
    end: now,
  });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "traineeName",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const columnDateFormatter = useDateFormatter({
    weekday: "short",
    day: "2-digit",
  });

  const filters = useMemo(() => {
    if (!value) return {};
    return {
      start_date: value.start.toString(),
      end_date: value.end.toString(),
    };
  }, [value]);

  const {
    data: attendanceData,
    status: queryStatus,
    error: queryError,
  } = useAttendanceQuery(12345, filters);
  const updateMutation = useUpdateAttendanceMutation(12345);

  const { pivotedData, dateColumns } = useMemo(() => {
    if (!attendanceData || !value) return { pivotedData: [], dateColumns: [] };
    const columns: string[] = [];
    let currentDate = value.start;
    while (currentDate.compare(value.end) <= 0) {
      columns.push(currentDate.toString());
      currentDate = currentDate.add({ days: 1 });
    }
    const dateColumns = columns;
    const traineeMap = new Map<number, any>();
    attendanceData.forEach((record) => {
      if (!traineeMap.has(record.traineeId)) {
        traineeMap.set(record.traineeId, {
          traineeId: record.traineeId,
          traineeName: record.traineeName,
          dates: {},
        });
      }
      const traineeEntry = traineeMap.get(record.traineeId);
      traineeEntry.dates[record.date] = record;
    });
    let pivotedData = Array.from(traineeMap.values());
    pivotedData.sort((a, b) => {
      if (sortDescriptor.column === "traineeName") {
        let cmp = a.traineeName.localeCompare(b.traineeName);
        if (sortDescriptor.direction === "descending") cmp *= -1;
        return cmp;
      }
      return 0;
    });
    return { pivotedData, dateColumns };
  }, [attendanceData, value, sortDescriptor]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return pivotedData.slice(start, end);
  }, [currentPage, pivotedData]);

  const totalPages = Math.ceil(pivotedData.length / ROWS_PER_PAGE);

  const handleBulkUpdate = (newStatus: {
    forenoon: AttendanceStatus;
    afternoon: AttendanceStatus;
  }) => {
    if ((selectedKeys === "all" || selectedKeys.size > 0) && value) {
      const traineeIdsToUpdate =
        selectedKeys === "all"
          ? pivotedData.map((p) => p.traineeId)
          : Array.from(selectedKeys);
      updateMutation.mutate({
        batchId: 12345,
        data: {
          traineeIds: traineeIdsToUpdate as number[],
          startDate: value.start.toString(),
          endDate: value.end.toString(),
          status: newStatus,
        },
      });
      setSelectedKeys(new Set());
    }
  };

  if (queryStatus === "pending") return <div>Loading...</div>;
  if (queryStatus === "error") return <div>Error: {queryError.message}</div>;

  const numSelected =
    selectedKeys === "all" ? pivotedData.length : selectedKeys.size;
  const showBulkActions = numSelected > 0;

  return (
    <div className="pt-6 px-4">
      <TableCard.Root>
        <TableCard.Header
          title={
            showBulkActions
              ? `${numSelected} trainees selected`
              : "Attendance Records"
          }
          badge={!showBulkActions ? `${pivotedData.length} trainees` : ""}
          contentTrailing={
            <div className="flex items-center gap-4">
              {showBulkActions ? (
                <>
                  <Button
                    size="sm"
                    color="secondary"
                    onClick={() =>
                      handleBulkUpdate({
                        forenoon: AttendanceStatus.Absent,
                        afternoon: AttendanceStatus.Absent,
                      })
                    }
                  >
                    Mark as Absent
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() =>
                      handleBulkUpdate({
                        forenoon: AttendanceStatus.Present,
                        afternoon: AttendanceStatus.Present,
                      })
                    }
                  >
                    Mark as Present
                  </Button>
                </>
              ) : (
                <DateRangePicker value={value} onChange={setValue} />
              )}
            </div>
          }
        />
        <div className="w-full overflow-x-auto border-t border-secondary">
          <Table
            aria-label="Attendance Records"
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            className="min-w-max"
          >
            <Table.Header>
              <Table.Head
                id="traineeName"
                label="Trainee Name"
                allowsSorting
                isRowHeader
                className="sticky left-0 z-20 bg-secondary"
              />

              {dateColumns.map((dateStr) => {
                const dateObj = new Date(dateStr + "T00:00:00");
                const formattedDate = columnDateFormatter.format(dateObj);
                return (
                  <React.Fragment key={dateStr}>
                    <Table.Head
                      id={`${dateStr}-fn`}
                      className="text-center border-l border-border-secondary"
                    >
                      <div className="flex flex-col items-center -my-1">
                        <span className="text-xs font-semibold whitespace-nowrap text-quaternary">
                          FN
                        </span>
                        <span className="text-xs font-normal text-quaternary">
                          {formattedDate}
                        </span>
                      </div>
                    </Table.Head>
                    <Table.Head id={`${dateStr}-an`} className="text-center">
                      <div className="flex flex-col items-center -my-1">
                        <span className="text-xs font-semibold whitespace-nowrap text-quaternary">
                          AN
                        </span>
                        <span className="text-xs font-normal text-quaternary">
                          {formattedDate}
                        </span>
                      </div>
                    </Table.Head>
                    <Table.Head id={`${dateStr}-total`} className="text-center">
                      <div className="flex flex-col items-center -my-1">
                        <span className="text-xs font-semibold whitespace-nowrap text-quaternary">
                          Total
                        </span>
                        <span className="text-xs font-normal text-quaternary">
                          {formattedDate}
                        </span>
                      </div>
                    </Table.Head>
                  </React.Fragment>
                );
              })}
            </Table.Header>
            <Table.Body items={paginatedItems}>
              {(item) => (
                <Table.Row id={item.traineeId}>
                  <Table.Cell className="sticky left-0 z-10 bg-white whitespace-nowrap">
                    <p className="text-sm font-medium text-primary">
                      {item.traineeName}
                    </p>
                  </Table.Cell>

                  {dateColumns.map((dateStr) => {
                    const recordForDate = item.dates[dateStr] as
                      | GetResponseType
                      | undefined;
                    return (
                      <React.Fragment key={dateStr}>
                        <Table.Cell className="text-center border-l border-border-secondary">
                          {recordForDate ? (
                            <Badge
                              size="sm"
                              color={getStatusColor(recordForDate.forenoon)}
                            >
                              {statusTextMap[recordForDate.forenoon]}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {recordForDate ? (
                            <Badge
                              size="sm"
                              color={getStatusColor(recordForDate.afternoon)}
                            >
                              {statusTextMap[recordForDate.afternoon]}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          {recordForDate ? (
                            <Badge
                              size="sm"
                              color={getStatusColor(recordForDate.total)}
                            >
                              {statusTextMap[recordForDate.total]}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </Table.Cell>
                      </React.Fragment>
                    );
                  })}
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        <PaginationCardMinimal
          align="right"
          page={currentPage}
          total={totalPages}
          onPageChange={setCurrentPage}
        />
      </TableCard.Root>
    </div>
  );
}

export default Attendance;
