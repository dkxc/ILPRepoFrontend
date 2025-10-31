import AttendanceHeader from "@features/admin/attendance/components/AttendanceHeader/AttendanceHeader";
import AttendanceImportSlideout from "@features/admin/attendance/components/AttendanceImportSlideout/AttendanceImportSlideout";
import AttendanceTable from "@features/admin/attendance/components/AttendanceTable/AttendanceTable";
import AttendanceTableLoading from "@features/admin/attendance/components/AttendanceTable/components/AttendanceTableLoading";
import LargeDateRangeWarning from "@features/admin/attendance/components/AttendanceTable/components/LargeDateRangeWarning";

import { useAttendance } from "@features/admin/attendance/hooks/useAttendance";

function Attendance() {
  const { state, handlers, data } = useAttendance(12345);

  if (state.queryStatus === "error") {
    return (
      <div className="p-4 text-red-500">
        Error: {state.queryError?.message || "Something went wrong!"}
      </div>
    );
  }

  return (
    <div className="pt-6 px-4">
      <AttendanceHeader
        dateValue={state.dateValue}
        onDateChange={handlers.onDateChange}
        onImport={handlers.openImport}
        onExport={handlers.onExport}
      />
      <div className="content-area">
        {state.isRangeTooLarge ? (
          <LargeDateRangeWarning
            maxDays={data.MAX_DATE_RANGE_DAYS}
            onRenderAnyway={handlers.onRenderAnyway}
            onExport={handlers.onExport}
          />
        ) : state.queryStatus === "pending" ? (
          <AttendanceTableLoading
            dateColumns={data.dateColumns}
            className="px-4 pb-4"
          />
        ) : (
          <AttendanceTable
            data={data.sortedData}
            dateColumns={data.dateColumns}
            showTotalColumns={state.isMultiDateRange}
            sortDescriptor={state.sortDescriptor}
            onSortChange={handlers.onSortChange}
            selectedKeys={state.selectedKeys}
            onSelectionChange={handlers.onSelectionChange}
            onBulkUpdate={handlers.onBulkUpdate}
            isButtonUpdating={state.isUpdating}
            className="px-4 pb-4"
          />
        )}
      </div>
      <AttendanceImportSlideout
        isOpen={state.isImportOpen}
        onClose={handlers.closeImport}
        onImport={handlers.onImportFile}
        onViewTemplate={handlers.onDownloadTemplate}
      />
    </div>
  );
}

export default Attendance;
