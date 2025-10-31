import type { GetResponseType } from "../../../types/AttendanceQuery.types";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { utils as XLSXUtils, writeFile } from "xlsx";

export const getFormattedStringFromFileTypes = (fileTypes: any) => {
  const extensions = Object.keys(fileTypes).map((ext) => ext.toUpperCase());
  if (extensions.length <= 1) {
    return extensions[0] || "";
  }
  const lastExtension = extensions.pop();
  return `${extensions.join(", ")} or ${lastExtension}`;
};

/**
 * Generates and downloads an XLSX attendance template for the current month.
 * @param trainees - A list of trainees to pre-fill in the template.
 */
export function exportTemplateXLSX(trainees: GetResponseType[]) {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);
  const dateColumns = eachDayOfInterval({ start: startDate, end: endDate });

  const headerRow1: (string | Date)[] = ["Trainee Name"];
  const headerRow2: string[] = [""];
  dateColumns.forEach((date) => {
    headerRow1.push(date);
    headerRow1.push(""); // merge placeholder
    headerRow2.push("FN");
    headerRow2.push("AN");
  });

  // data rows, but empty cells
  const dataRows = trainees.map((trainee) => {
    const row = [trainee.traineeName];
    dateColumns.forEach(() => {
      row.push(""); // Empty cell for FN
      row.push(""); // Empty cell for AN
    });
    return row;
  });

  const finalData = [headerRow1, headerRow2, ...dataRows];

  const wb = XLSXUtils.book_new();
  const ws = XLSXUtils.aoa_to_sheet(finalData, { cellDates: true });

  // merges
  const merges = [];
  merges.push({ s: { r: 0, c: 0 }, e: { r: 1, c: 0 } });
  for (let i = 0; i < dateColumns.length; i++) {
    merges.push({
      s: { r: 0, c: i * 2 + 1 },
      e: { r: 0, c: i * 2 + 2 },
    });
  }
  ws["!merges"] = merges;
  XLSXUtils.book_append_sheet(wb, ws, "Attendance Template");

  // download
  const fileName = `Attendance_Template_${format(now, "MMMM_yyyy")}.xlsx`;
  writeFile(wb, fileName);
}
