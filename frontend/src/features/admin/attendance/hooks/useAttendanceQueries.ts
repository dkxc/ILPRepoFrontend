import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GetQueryType,
  GetResponseType,
  ImportSuccessResponseType,
  UpdateQueryType,
  UpdateSuccessResponseType,
  UploadJsonQueryType,
} from "../types/AttendanceQuery.types";
import ApiService from "../../../../services/apiService";

function buildAttendanceUrl(batchId: number, filters?: GetQueryType): string {
  const queryParams = new URLSearchParams();
  if (filters) {
    if (filters.start_date) queryParams.set("start_date", filters.start_date);
    if (filters.end_date) queryParams.set("end_date", filters.end_date);
  }

  const queryString = queryParams.toString();
  return `/Attendance/batch/${batchId}${queryString ? `?${queryString}` : ""}`;
}

// Custom Hooks
/**
 * Custom hook to query attendance records for a specific batch.
 * @param batchId The ID of the batch to fetch attendance for.
 * @param filters Optional filters for start date, end date, and status.
 */
export function useAttendanceQuery(
  batchId: number | null,
  filters?: GetQueryType,
) {
  return useQuery<GetResponseType[], Error>({
    queryKey: ["attendance", batchId, filters],
    queryFn: () => {
      if (!batchId) {
        // Should not happen due to 'enabled' flag, but serves as a safeguard
        return Promise.resolve([]);
      }
      const endpoint = buildAttendanceUrl(batchId, filters);
      return ApiService.get(endpoint);
    },
    enabled: !!batchId,
  });
}

/**
 * Custom hook to create a mutation for updating attendance records.
 */
export function useUpdateAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSuccessResponseType,
    Error,
    { batchId: number | null; data: UpdateQueryType }
  >({
    mutationFn: ({ batchId, data }) => {
      return ApiService.put(`/Attendance/batch/${batchId}`, data);
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.batchId],
      });
    },
  });
}

/**
 * Custom hook to create a mutation for uploading parsed attendance data.
 */
export function useUploadAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ImportSuccessResponseType,
    Error,
    { batchId: number | null; data: UploadJsonQueryType }
  >({
    mutationFn: ({ batchId, data }) => {
      return ApiService.post(`/Attendance/batch/${batchId}/upload`, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.batchId],
      });
    },
  });
}
