import AttendanceTable from "@features/admin/attendance/components/AttendanceTable/AttendanceTable";
import AttendanceTableLoading from "@features/admin/attendance/components/AttendanceTable/components/AttendanceTableLoading";
import {
  useAttendanceQuery,
  useUpdateAttendanceMutation,
} from "@features/admin/attendance/hooks/useAttendanceQueries";
import type { BulkUpdateStatus } from "@features/admin/attendance/types/AttendanceRecord.types";
import { getLocalTimeZone, today } from "@internationalized/date";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import type {
  DateValue,
  Selection,
  SortDescriptor,
  Key,
} from "react-aria-components";
import { toast } from "sonner";

const now = today(getLocalTimeZone());

function Attendance() {
  const [dateValue, setDateValue] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>({ start: now, end: now });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "traineeName",
    direction: "ascending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  const filters = useMemo(() => {
    if (!dateValue?.start || !dateValue?.end) return undefined;
    return {
      start_date: dateValue.start.toString(),
      end_date: dateValue.end.toString(),
    };
  }, [dateValue]);

  // API
  const {
    data: attendanceData,
    status: queryStatus,
    error: queryError,
  } = useAttendanceQuery(12345, filters);
  const updateMutation = useUpdateAttendanceMutation(12345);

  useEffect(() => {
    if (updateMutation.isSuccess) {
      toast.success(`${updateMutation.data.updateRecordCount} entries updated`);
    }
    if (updateMutation.isError) {
      toast.error(`Failed due to ${updateMutation.error.message}`);
    }
  }, [
    updateMutation.isSuccess,
    updateMutation.isError,
    updateMutation.data,
    updateMutation.error,
  ]);

  const sortedData = useMemo(() => {
    if (!attendanceData) return [];

    const { column, direction } = sortDescriptor;
    const dataToSort = [...attendanceData];

    if (column === undefined) return dataToSort;
    const columnKey: Key = column;
    dataToSort.sort((a, b) => {
      let cmp = 0;

      if (typeof columnKey === "string") {
        if (columnKey === "traineeName") {
          cmp = a.traineeName.localeCompare(b.traineeName);
        } else if (columnKey.startsWith("fn_") || columnKey.startsWith("an_")) {
          const [session, isoDate] = columnKey.split("_");
          if (!isoDate) return 0; // should not happen

          const dateKey = format(parseISO(isoDate), "yyyy-MM-dd");
          const sessionKey = session === "fn" ? "forenoon" : "afternoon";

          const statusA = a.dates[dateKey]?.[sessionKey] ?? "Z";
          const statusB = b.dates[dateKey]?.[sessionKey] ?? "Z";

          cmp = statusA.localeCompare(statusB);
        }
      }

      if (direction === "descending") {
        cmp *= -1;
      }

      return cmp;
    });

    return [...dataToSort].sort((a, b) => {
      if (sortDescriptor.column === "traineeName") {
        let cmp = a.traineeName.localeCompare(b.traineeName);
        if (sortDescriptor.direction === "descending") cmp *= -1;
        return cmp;
      }
      return 0;
    });
  }, [attendanceData, sortDescriptor]);

  const dateColumns = useMemo(() => {
    if (!dateValue?.start || !dateValue?.end) return [];
    return eachDayOfInterval({
      start: dateValue.start.toDate(getLocalTimeZone()),
      end: dateValue.end.toDate(getLocalTimeZone()),
    });
  }, [dateValue]);

  const handleBulkUpdate = (partialStatus: BulkUpdateStatus) => {
    if ((selectedKeys === "all" || selectedKeys.size > 0) && dateValue) {
      const traineeIdsToUpdate =
        selectedKeys === "all"
          ? (attendanceData?.map((p) => p.traineeId) ?? [])
          : Array.from(selectedKeys);
      updateMutation.mutate({
        batchId: 12345,
        data: {
          traineeIds: traineeIdsToUpdate as number[],
          startDate: dateValue.start.toString(),
          endDate: dateValue.end.toString(),
          status: partialStatus,
        },
      });
      setSelectedKeys(new Set());
    }
  };

  if (queryStatus === "error")
    return <div className="p-4 text-red-500">Error: {queryError.message}</div>;

  const numSelected =
    selectedKeys === "all" ? (attendanceData?.length ?? 0) : selectedKeys.size;

  return (
    <div className="pt-6 px-4">
      {queryStatus === "pending" ? (
        <AttendanceTableLoading
          dateColumns={dateColumns}
          className="px-4 pb-4"
        />
      ) : (
        <AttendanceTable
          data={sortedData}
          dateColumns={dateColumns}
          dateValue={dateValue}
          onDateChange={setDateValue}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onBulkUpdate={handleBulkUpdate}
          isButtonUpdating={updateMutation.isPending}
          className="px-4 pb-4"
        />
      )}
    </div>
  );
}

export default Attendance;
