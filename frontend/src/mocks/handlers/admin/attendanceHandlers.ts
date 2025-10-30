import { delay, http, HttpResponse } from "msw";
import { mockAttendanceRecords, MOCK_BATCH_ID } from "./attendanceData";
import type { UpdateQueryType } from "features/admin/attendance/types/AttendanceRecord.types";

export const attendanceHandlers = [
  http.get("/api/attendance/batch/:batchId", async ({ params, request }) => {
    const { batchId } = params;
    const url = new URL(request.url);

    if (Number(batchId) !== MOCK_BATCH_ID) {
      return HttpResponse.json({ message: "Batch not found" }, { status: 404 });
    }

    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    const filteredData = mockAttendanceRecords.filter((trainee) => {
      const filteredDates: typeof trainee.dates = {};

      for (const date in trainee.dates) {
        if (
          (!startDate || date >= startDate) &&
          (!endDate || date <= endDate)
        ) {
          filteredDates[date] = trainee.dates[date];
        }
      }
      return {
        ...trainee,
        dates: filteredDates,
      };
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

    mockAttendanceRecords.forEach((trainee, index) => {
      if (updateData.traineeIds.includes(trainee.traineeId)) {
        for (const date in trainee.dates) {
          if (date >= updateData.startDate && date <= updateData.endDate) {
            const existingStatus = mockAttendanceRecords[index].dates[date];
            const newStatus = {
              ...existingStatus,
              ...updateData.status,
            };
            mockAttendanceRecords[index].dates[date] = newStatus;
            updatedRecordCount++;
          }
        }
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
