import { useMemo, useState, useEffect } from "react";
import {
  useAttendanceQuery,
  useUpdateAttendanceMutation,
} from "./useAttendanceQueries";
import type { ProcessedTraineeData } from "../types/AttendanceRecord.types";
import type { BulkUpdateStatus } from "../types/AttendanceQuery.types";
import type {
  DateValue,
  Key,
  Selection,
  SortDescriptor,
} from "react-aria-components";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  differenceInDays,
  eachDayOfInterval,
  format,
  parseISO,
} from "date-fns";
import { toast } from "sonner";
import { exportToXLSX } from "../components/AttendanceTable/utils/AttendanceExport.utils";
import { exportTemplateXLSX } from "../components/AttendanceImportSlideout/utils/AttendanceImportSlideout.utils";

const now = today(getLocalTimeZone());
const MAX_DATE_RANGE_DAYS = 90;

export function useAttendance(batchId: number) {
  // state is managed inside this hook
  const [dateValue, setDateValue] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>({ start: now, end: now });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "traineeName",
    direction: "ascending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [isImportOpen, setImportOpen] = useState(false);
  const [isRangeTooLarge, setIsRangeTooLarge] = useState(false);

  // API Mutation
  const filters = useMemo(() => {
    if (!dateValue?.start || !dateValue?.end) return undefined;
    return {
      start_date: dateValue.start.toString(),
      end_date: dateValue.end.toString(),
    };
  }, [dateValue]);

  const {
    data: attendanceData,
    status: queryStatus,
    error: queryError,
  } = useAttendanceQuery(batchId, filters);
  const updateMutation = useUpdateAttendanceMutation();

  useEffect(() => {
    if (updateMutation.isSuccess)
      toast.success(`${updateMutation.data.updateRecordCount} entries updated`);
    if (updateMutation.isError)
      toast.error(`Failed due to ${updateMutation.error.message}`);
  }, [
    updateMutation.isSuccess,
    updateMutation.isError,
    updateMutation.data,
    updateMutation.error,
  ]);

  // Derived State and Data Processing
  const dateColumns = useMemo(() => {
    if (!dateValue?.start || !dateValue?.end) return [];
    return eachDayOfInterval({
      start: dateValue.start.toDate(getLocalTimeZone()),
      end: dateValue.end.toDate(getLocalTimeZone()),
    });
  }, [dateValue]);

  const processedData = useMemo<ProcessedTraineeData[]>(() => {
    if (!attendanceData) return [];
    return attendanceData.map((trainee) => {
      let presentFN = 0;
      let presentAN = 0;
      let totalPresentDays = 0;
      dateColumns.forEach((date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        const record = trainee.dates[dateKey];
        const isFnPresent = record?.forenoon === "P";
        const isAnPresent = record?.afternoon === "P";
        if (isFnPresent) presentFN++;
        if (isAnPresent) presentAN++;
        if (isFnPresent || isAnPresent) totalPresentDays++;
      });
      return {
        ...trainee,
        presentFN,
        presentAN,
        totalPresentDays,
        totalPossibleDays: dateColumns.length,
      };
    });
  }, [attendanceData, dateColumns]);

  const sortedData = useMemo(() => {
    if (!processedData) return [];

    const { column, direction } = sortDescriptor;
    const dataToSort = [...processedData];

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
  }, [processedData, sortDescriptor]);

  const isMultiDateRange = useMemo(() => {
    if (!dateValue?.start || !dateValue?.end) return false;
    return dateValue.start.toString() !== dateValue.end.toString();
  }, [dateValue]);

  // Handlers
  const onDateChange = (value: { start: DateValue; end: DateValue } | null) => {
    if (value?.start && value?.end) {
      const days = differenceInDays(
        value.end.toDate(getLocalTimeZone()),
        value.start.toDate(getLocalTimeZone()),
      );
      setIsRangeTooLarge(days > MAX_DATE_RANGE_DAYS);
    } else {
      setIsRangeTooLarge(false);
    }
    setDateValue(value);
  };

  const onRenderAnyway = () => setIsRangeTooLarge(false);

  const onBulkUpdate = (partialStatus: BulkUpdateStatus) => {
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

  const onExport = () => {
    let dataToExport: ProcessedTraineeData[] = [];
    const selectionSize =
      selectedKeys === "all" ? sortedData.length : selectedKeys.size;

    if (selectionSize > 0 && selectedKeys !== "all") {
      const selectedIds = new Set(selectedKeys);
      dataToExport = sortedData.filter((trainee) =>
        selectedIds.has(trainee.traineeId),
      );
    } else {
      dataToExport = sortedData;
    }

    if (dataToExport.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    exportToXLSX(dataToExport, dateColumns, dateValue, isMultiDateRange);
  };

  const onDownloadTemplate = () => {
    if (!sortedData || sortedData.length === 0) {
      toast.error("No trainee data available to generate a template.");
      return;
    }
    exportTemplateXLSX(sortedData);
  };

  const onImportFile = (file: File) => {
    console.log("Importing file:", file);
    toast.success(`File "${file.name}" selected. (Feature coming soon)`);
    setImportOpen(false);
  };

  return {
    state: {
      dateValue,
      sortDescriptor,
      selectedKeys,
      isImportOpen,
      isRangeTooLarge,
      isMultiDateRange,
      isUpdating: updateMutation.isPending,
      queryStatus,
      queryError,
    },
    handlers: {
      onDateChange,
      onSortChange: setSortDescriptor,
      onSelectionChange: setSelectedKeys,
      onBulkUpdate,
      onRenderAnyway,
      onExport,
      onDownloadTemplate,
      onImportFile,
      openImport: () => setImportOpen(true),
      closeImport: () => setImportOpen(false),
    },
    data: {
      sortedData,
      dateColumns,
      MAX_DATE_RANGE_DAYS,
    },
  };
}
