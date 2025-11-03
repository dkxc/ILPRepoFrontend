import { delay, http, HttpResponse } from "msw";
import { mockAttendanceRecords, MOCK_BATCH_ID } from "./attendanceData";
import type {
  UpdateQueryType,
  UploadJsonQueryType,
} from "features/admin/attendance/types/AttendanceQuery.types";

export const attendanceHandlers = [
  http.get(
    "/api/attendance/trainee/:traineeId",
    async ({ params, request }) => {
      const { traineeId } = params;
      const url = new URL(request.url);

      const date = url.searchParams.get("date");
      const traineeData = mockAttendanceRecords.find(
        (trainee) => trainee.traineeId === Number(traineeId),
      );

      if (!traineeData) {
        return HttpResponse.json(
          { message: "Trainee not found" },
          { status: 404 },
        );
      }

      if (date) {
        const attendanceForDate = traineeData.dates[date];
        if (attendanceForDate) {
          return HttpResponse.json({ date, attendance: attendanceForDate });
        } else {
          return HttpResponse.json(
            { message: "Attendance not found for the provided date" },
            { status: 404 },
          );
        }
      }
      return HttpResponse.json({ traineeId, attendance: traineeData.dates });
    },
  ),

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

  http.post(
    "/api/attendance/batch/:batchId/upload",
    async ({ params, request }) => {
      if (Number(params.batchId) !== MOCK_BATCH_ID) {
        return HttpResponse.json(
          { message: "Batch not found" },
          { status: 404 },
        );
      }

      const uploadData = (await request.json()) as UploadJsonQueryType;
      if (!Array.isArray(uploadData)) {
        return HttpResponse.json(
          { message: "Invalid payload" },
          { status: 400 },
        );
      }

      let updatedRecordCount = 0;
      let newTraineesCount = 0;
      let nextId =
        Math.max(...mockAttendanceRecords.map((t) => t.traineeId)) + 1;

      for (const item of uploadData) {
        let trainee = mockAttendanceRecords.find(
          (t) => t.traineeName === item.traineeName,
        );
        if (!trainee) {
          trainee = {
            traineeId: nextId++,
            traineeName: item.traineeName,
            dates: {},
          };
          mockAttendanceRecords.push(trainee);
          newTraineesCount++;
        }
        trainee.dates[item.date] = {
          forenoon: item.forenoon,
          afternoon: item.afternoon,
        };
        updatedRecordCount++;
      }

      console.log(
        `[MSW] Records updated: ${updatedRecordCount}, New trainees: ${newTraineesCount}`,
      );
      await delay(1500);
      return HttpResponse.json({
        status: "success",
        message: "File processed successfully.",
        updatedRecordCount,
        newTraineesCount,
      });
    },
  ),
];

export default attendanceHandlers;
