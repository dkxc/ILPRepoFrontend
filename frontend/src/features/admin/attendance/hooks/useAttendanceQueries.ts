import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GetQueryType,
  GetResponseType,
  UpdateQueryType,
  UpdateSuccessResponseType,
  ApiErrorResponse,
} from "../types/AttendanceQuery.types";

const fetchAttendance = async (
  batchId: number,
  filters?: GetQueryType,
): Promise<GetResponseType[]> => {
  const queryParams = new URLSearchParams();
  if (filters) {
    if (filters.start_date)
      queryParams.append("start_date", filters.start_date);
    if (filters.end_date) queryParams.append("end_date", filters.end_date);
  }

  const res = await fetch(
    `/api/attendance/batch/${batchId}?${queryParams.toString()}`,
  );
  if (!res.ok) {
    const errorData: ApiErrorResponse = await res.json();
    throw new Error(
      errorData.message || "Network response was not ok for attendance",
    );
  }
  return res.json();
};

const updateAttendance = async ({
  batchId,
  data,
}: {
  batchId: number;
  data: UpdateQueryType;
}): Promise<UpdateSuccessResponseType> => {
  const res = await fetch(`/api/attendance/batch/${batchId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData: ApiErrorResponse = await res.json();
    throw new Error(
      errorData.message ||
        "Network response was not ok while updating attendance",
    );
  }
  return res.json();
};

// Custom Hooks
/**
 * Custom hook to query attendance records for a specific batch.
 * @param batchId The ID of the batch to fetch attendance for.
 * @param filters Optional filters for start date, end date, and status.
 */
export function useAttendanceQuery(batchId: number, filters?: GetQueryType) {
  return useQuery({
    queryKey: ["attendance", batchId, filters],
    queryFn: () => fetchAttendance(batchId, filters),
    enabled: !!batchId,
  });
}

/**
 * Custom hook to create a mutation for updating attendance records.
 * @param batchId The ID of the batch whose cache needs to be invalidated on success.
 */
export function useUpdateAttendanceMutation(batchId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", batchId] });
    },
  });
}
