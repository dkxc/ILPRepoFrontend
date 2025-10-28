import { delay, http, HttpResponse } from "msw";
import { mockAttendanceRecords, MOCK_BATCH_ID } from "./attendanceData";
import type {
  AttendanceStatus,
  FullAttendanceStatus,
  UpdateQueryType,
} from "features/admin/attendance/types/AttendanceRecord.types";

const calculateTotal = (
  forenoon: AttendanceStatus,
  afternoon: AttendanceStatus,
): FullAttendanceStatus => {
  if (forenoon === afternoon) {
    return forenoon;
  }

  if (forenoon === "N/A") {
    return afternoon;
  }

  if (afternoon === "N/A") {
    return forenoon;
  }

  return "PP";
};

export const attendanceHandlers = [
  http.get("/api/attendance/batch/:batchId", async ({ params, request }) => {
    const { batchId } = params;
    const url = new URL(request.url);

    if (Number(batchId) !== MOCK_BATCH_ID) {
      return HttpResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const status = url.searchParams.get("status");

    const filteredData = mockAttendanceRecords.filter((record) => {
      if (startDate && record.date < startDate) return false;
      if (endDate && record.date > endDate) return false;
      if (status && record.total !== status) return false;
      return true;
    });

    await delay(800);
    return HttpResponse.json(filteredData);
  }),

  http.put("/api/attendance/batch/:batchId", async ({ params, request }) => {
    const { batchId } = params;

    if (Number(batchId) !== MOCK_BATCH_ID) {
      return HttpResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    const updateData = (await request.json()) as UpdateQueryType;
    let updatedRecordCount = 0;

    mockAttendanceRecords.forEach((record, index) => {
      const isTraineeMatch = updateData.traineeIds.includes(record.traineeId);
      const isDateMatch =
        record.date >= updateData.startDate &&
        record.date <= updateData.endDate;

      if (isTraineeMatch && isDateMatch) {
        const newForenoon = updateData.status.forenoon;
        const newAfternoon = updateData.status.afternoon;

        mockAttendanceRecords[index].forenoon = newForenoon;
        mockAttendanceRecords[index].afternoon = newAfternoon;
        mockAttendanceRecords[index].total = calculateTotal(
          newForenoon,
          newAfternoon,
        );
        updatedRecordCount++;
      }
    });

    console.log(`[MSW] Updated ${updatedRecordCount} attendance records.`);

    await delay(1000);
    return HttpResponse.json({
      status: "success",
      updateRecordCount: updatedRecordCount,
    });
  }),
];

export default attendanceHandlers;
