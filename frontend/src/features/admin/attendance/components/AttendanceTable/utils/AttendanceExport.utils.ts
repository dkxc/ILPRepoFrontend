import type { ProcessedTraineeData } from "../../../types/AttendanceRecord.types";
import { format } from "date-fns";
import {
  utils as XLSXUtils,
  writeFile,
  type Range,
} from "xlsx/dist/xlsx.mini.min";
import type { DateValue } from "react-aria";

/**
 * Generates and downloads an XLSX file from attendance data.
 * @param data - The sorted attendance records to export.
 * @param dateColumns - An array of Date objects representing the columns.
 * @param dateValue - The selected date range for the file name.
 * @param isMultiDateView - prints total column if this is true.
 */
export function exportToXLSX(
  data: ProcessedTraineeData[],
  dateColumns: Date[],
  dateValue: { start: DateValue; end: DateValue } | null,
  isMultiDateView: boolean,
) {
  // multisheet xlsx
  const wb = XLSXUtils.book_new();

  // Sheet 1: Merged Sheet
  const reportHeaderRow1: (string | Date)[] = ["Trainee Name"];
  const reportHeaderRow2: string[] = [""];
  dateColumns.forEach((date) => {
    reportHeaderRow1.push(date, "");
    reportHeaderRow2.push("FN", "AN");
  });
  if (isMultiDateView) {
    reportHeaderRow1.push("Total", "", "");
    reportHeaderRow2.push("FN", "AN", "Total");
  }

  const dataRows = data.map((trainee) => {
    const row: (string | number)[] = [trainee.traineeName];
    dateColumns.forEach((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const record = trainee.dates[dateKey];
      row.push(record?.forenoon ?? "N/A", record?.afternoon ?? "N/A");
    });
    if (isMultiDateView) {
      row.push(trainee.presentFN, trainee.presentAN, trainee.totalPresentDays);
    }
    return row;
  });

  const reportFinalData = [reportHeaderRow1, reportHeaderRow2, ...dataRows];
  const ws_report = XLSXUtils.aoa_to_sheet(reportFinalData, {
    cellDates: true,
  });

  // merges
  const merges: Range[] = [];
  merges.push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }); // Trainee Name
  for (let i = 0; i < dateColumns.length; i++) {
    merges.push({ s: { r: 0, c: i * 2 + 1 }, e: { r: 0, c: i * 2 + 2 } }); // Dates
  }
  if (isMultiDateView) {
    const totalStartIndex = 1 + dateColumns.length * 2;
    merges.push({
      s: { r: 0, c: totalStartIndex },
      e: { r: 0, c: totalStartIndex + 2 },
    }); // Total
  }
  ws_report["!merges"] = merges;

  // append to book
  XLSXUtils.book_append_sheet(wb, ws_report, "Formatted Report");

  // Sheet 2: Filterable Sheet
  const flatHeader: string[] = ["Trainee Name"];
  dateColumns.forEach((date) => {
    const dateString = format(date, "MMM d");
    flatHeader.push(`${dateString} (FN)`, `${dateString} (AN)`);
  });
  if (isMultiDateView) {
    flatHeader.push("Total (FN)", "Total (AN)", "Total");
  }

  // reusing data
  const dataFinalData = [flatHeader, ...dataRows];
  const ws_data = XLSXUtils.aoa_to_sheet(dataFinalData);

  // add filter
  ws_data["!autofilter"] = {
    ref: XLSXUtils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: 0, c: flatHeader.length - 1 },
    }),
  };

  // append to book
  XLSXUtils.book_append_sheet(wb, ws_data, "Sortable Data");

  // Download
  const startDate = dateValue?.start.toString() ?? "start";
  const endDate = dateValue?.end.toString() ?? "end";
  const fileName = `Attendance_Records_${startDate}_to_${endDate}.xlsx`;
  writeFile(wb, fileName);
}
