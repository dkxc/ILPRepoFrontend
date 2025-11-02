import { AttendanceStatus } from "@features/admin/attendance/types/AttendanceRecord.types";
import type {
  GetResponseType,
  UploadJsonItem,
  UploadJsonQueryType,
} from "../../../types/AttendanceQuery.types";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parse,
  startOfMonth,
} from "date-fns";
import {
  utils as XLSXUtils,
  read,
  utils,
  writeFile,
  type WorkBook,
} from "xlsx/dist/xlsx.mini.min";

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

/**
 * Parses an XLSX file based on the provided template structure.
 * @param file The XLSX file to parse.
 * @returns A promise that resolves with the structured JSON data.
 * @throws An error if the file format or structure is invalid.
 */
const VALID_STATUSES = new Set(Object.values(AttendanceStatus));

function isValidStatus(status: any): status is AttendanceStatus {
  return VALID_STATUSES.has(status);
}

export async function parseAttendanceFile(
  file: File,
): Promise<UploadJsonQueryType> {
  const data = await file.arrayBuffer();
  const workbook: WorkBook = read(data);

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("No sheets found in the workbook.");
  }
  const ws = workbook.Sheets[sheetName];
  const json = utils.sheet_to_json<any[]>(ws, { header: 1, defval: null });

  if (json.length < 3) {
    throw new Error("Invalid template: Not enough rows for headers and data.");
  }

  const headerRow1 = json[0] as (string | number | null)[];
  const headerRow2 = json[1] as (string | null)[];
  const dataRows = json.slice(2);

  if (String(headerRow1[0]).toLowerCase() !== "trainee name") {
    throw new Error("Invalid template: Missing 'Trainee Name' in cell A1.");
  }

  const parsedData: UploadJsonItem[] = [];
  const dateColumns: { index: number; date: string }[] = [];

  for (let i = 1; i < headerRow1.length; i += 2) {
    const dateVal = headerRow1[i];
    let dateObj: Date;
    if (typeof dateVal === "number") {
      dateObj = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
    } else if (typeof dateVal === "string") {
      dateObj = parse(dateVal, "yyyy-MM-dd", new Date());
    } else {
      continue;
    }

    if (isNaN(dateObj.getTime())) continue;
    const fnHeader = String(headerRow2[i]).trim().toLowerCase();
    const anHeader = String(headerRow2[i + 1])
      .trim()
      .toLowerCase();

    if (fnHeader === "fn" && anHeader === "an") {
      dateColumns.push({ index: i, date: format(dateObj, "yyyy-MM-dd") });
    }
  }

  if (dateColumns.length === 0) {
    throw new Error("Invalid template: No valid date columns found.");
  }

  for (const row of dataRows) {
    const traineeName = row[0]?.trim();
    if (!traineeName) continue;

    for (const { index, date } of dateColumns) {
      const fnStatus = row[index]?.toString().trim() || "N/A";
      const anStatus = row[index + 1]?.toString().trim() || "N/A";

      parsedData.push({
        traineeName,
        date,
        forenoon: isValidStatus(fnStatus) ? fnStatus : "N/A",
        afternoon: isValidStatus(anStatus) ? anStatus : "N/A",
      });
    }
  }

  return parsedData;
}
