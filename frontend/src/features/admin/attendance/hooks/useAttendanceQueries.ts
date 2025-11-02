import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  GetQueryType,
  GetResponseType,
  ImportSuccessResponseType,
  UpdateQueryType,
  UpdateSuccessResponseType,
  UploadJsonQueryType,
} from "../types/AttendanceQuery.types";
import apiClient from "@lib/api/apiClient";

function buildAttendanceUrl(batchId: number, filters?: GetQueryType): string {
  const queryParams = new URLSearchParams();
  if (filters) {
    if (filters.start_date) queryParams.set("start_date", filters.start_date);
    if (filters.end_date) queryParams.set("end_date", filters.end_date);
  }

  const queryString = queryParams.toString();
  return `/api/attendance/batch/${batchId}${queryString ? `?${queryString}` : ""}`;
}

// Custom Hooks
/**
 * Custom hook to query attendance records for a specific batch.
 * @param batchId The ID of the batch to fetch attendance for.
 * @param filters Optional filters for start date, end date, and status.
 */
export function useAttendanceQuery(batchId: number, filters?: GetQueryType) {
  return useQuery<GetResponseType[]>({
    queryKey: ["attendance", batchId, filters],
    queryFn: () => {
      const endpoint = buildAttendanceUrl(batchId, filters);
      return apiClient(endpoint);
    },
    enabled: !!batchId,
  });
}

/**
 * Custom hook to create a mutation for updating attendance records.
 * @param batchId The ID of the batch whose cache needs to be invalidated on success.
 */
export function useUpdateAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSuccessResponseType,
    Error,
    { batchId: number; data: UpdateQueryType }
  >({
    mutationFn: ({ batchId, data }) => {
      return apiClient(`/api/attendance/batch/${batchId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.batchId],
      });
    },
  });
}

/**
 * Custom hook to create a mutation for uploading an attendance file.
 */
/**
 * Custom hook to create a mutation for uploading parsed attendance data.
 */
export function useUploadAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ImportSuccessResponseType,
    Error,
    { batchId: number; data: UploadJsonQueryType }
  >({
    mutationFn: ({ batchId, data }) => {
      return apiClient(`/api/attendance/batch/${batchId}/upload-json`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.batchId],
      });
    },
  });
}
