import type { GetResponseType } from "../../../types/AttendanceRecord.types";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import type { DateValue } from "react-aria";

/**
 * Generates and downloads an XLSX file from attendance data.
 * @param data - The sorted attendance records to export.
 * @param dateColumns - An array of Date objects representing the columns.
 * @param dateValue - The selected date range for the file name.
 */
export function exportToXLSX(
  data: GetResponseType[],
  dateColumns: Date[],
  dateValue: { start: DateValue; end: DateValue } | null,
) {
  const headerRow1 = ["Trainee Name"];
  const headerRow2 = [""]; // First cell is empty in the second row

  dateColumns.forEach((date) => {
    headerRow1.push(format(date, "MMM d, yyyy"));
    headerRow1.push(""); // an empty cell for the merge
    headerRow2.push("FN");
    headerRow2.push("AN");
  });

  const dataRows = data.map((trainee) => {
    const row = [trainee.traineeName];
    dateColumns.forEach((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      const record = trainee.dates[dateKey];
      row.push(record?.forenoon ?? "N/A");
      row.push(record?.afternoon ?? "N/A");
    });
    return row;
  });

  const finalData = [headerRow1, headerRow2, ...dataRows];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(finalData);

  // Define the merged cell ranges
  const merges = [];
  // Also, merge the "Trainee Name" cell across the first two rows
  merges.push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } });

  for (let i = 0; i < dateColumns.length; i++) {
    merges.push({
      s: { r: 0, c: i * 2 + 1 }, // Start cell (row 0, col 1, 3, 5...)
      e: { r: 0, c: i * 2 + 2 }, // End cell (row 0, col 2, 4, 6...)
    });
  }
  ws["!merges"] = merges;

  XLSX.utils.book_append_sheet(wb, ws, "Attendance Records");

  // generate and trigger the download
  const startDate = dateValue?.start.toString() ?? "start";
  const endDate = dateValue?.end.toString() ?? "end";
  const fileName = `attendance-records-${startDate}-to-${endDate}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
