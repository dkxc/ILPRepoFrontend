import { useQuery } from "@tanstack/react-query";
import ApiService from "../../../../services/apiService";

export type Batch = {
  id: number;
  batchName: string;
};

export type BatchApiResponse = {
  data: Batch[];
  succeeded: boolean;
  message: string;
  status: number;
};

/**
 * Custom hook to query the list of all batches for the dropdown.
 */
export function useBatchesQuery() {
  return useQuery<Batch[], Error>({
    queryKey: ["batches"],
    queryFn: async () => {
      // ApiService will return the entire response object
      const response = await ApiService.get("/Batch");

      // handling it nicely
      if (response && response.succeeded && Array.isArray(response.data)) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch batches.");
    },
    select: (data) => data.map(({ id, batchName }) => ({ id, batchName })),
  });
}
