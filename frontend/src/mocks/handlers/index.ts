import traineeDashboardHandlers from "./trainee/dashboardHandlers";

import adminAttendanceHandlers from "./admin/attendanceHandlers";

export const handlers = [
  ...traineeDashboardHandlers,
  ...adminAttendanceHandlers,
];
