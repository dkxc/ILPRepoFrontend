// API response types
interface ApiResponse<T> {
  status: number;
  data: T;
}

interface ApiBatch {
  id: number;
  batchName: string;
  batchType: string;
  status: string;
  startDate: string;
  endDate: string;
}

// Transform API batch to our app's Batch type
import type { Batch } from "../features/admin/batches/BatchTable";

const API_BASE_URL = "https://localhost:7028/api";

// Test function for debugging
export const testApiConnection = async () => {
  try {
    console.log("Testing API connection to:", `${API_BASE_URL}/Batch`);
    const response = await fetch(`${API_BASE_URL}/Batch`);
    console.log("Test response status:", response.status);
    const text = await response.text();
    console.log("Test response text:", text);
    return { status: response.status, text };
  } catch (error) {
    console.error("Test connection failed:", error);
    return { error };
  }
};

// Transform API status to our app status
const transformStatus = (apiStatus: string): Batch["status"] => {
  switch (apiStatus.toLowerCase()) {
    case "notstarted":
      return "Not Started";
    case "ongoing":
      return "Ongoing";
    case "completed":
      return "Completed";
    default:
      return "Not Started";
  }
};

// Transform API batch to app batch
const transformBatch = (apiBatch: ApiBatch): Batch => ({
  id: apiBatch.id,
  name: apiBatch.batchName,
  type: apiBatch.batchType,
  totalTrainees: 0, // API doesn't provide this, default to 0
  status: transformStatus(apiBatch.status),
  startDate: apiBatch.startDate,
  endDate: apiBatch.endDate,
});

// Transform app batch to API batch for POST/PUT
const transformToApiBatch = (batch: Partial<Batch>) => ({
  batchName: batch.name,
  batchType: batch.type,
  status: batch.status?.toLowerCase().replace(" ", "") || "notstarted",
  startDate: batch.startDate,
  endDate: batch.endDate,
});

export const batchService = {
  // Get all batches
  async getAllBatches(): Promise<Batch[]> {
    try {
      console.log("Fetching batches from:", `${API_BASE_URL}/Batch`);

      const response = await fetch(`${API_BASE_URL}/Batch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Add these for HTTPS localhost
        mode: "cors",
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const apiResponse: ApiResponse<ApiBatch[]> = await response.json();
      console.log("API Response:", apiResponse);

      return apiResponse.data.map(transformBatch);
    } catch (error) {
      console.error("Failed to fetch batches - Full error:", error);
      throw error;
    }
  },

  // Create new batch
  async createBatch(batchData: {
    batchName: string;
    batchType: string;
    startDate: string;
    endDate: string;
  }): Promise<Batch> {
    try {
      const response = await fetch(`${API_BASE_URL}/Batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...batchData,
          status: "notstarted",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<ApiBatch> = await response.json();
      return transformBatch(apiResponse.data);
    } catch (error) {
      console.error("Failed to create batch:", error);
      throw error;
    }
  },

  // Update batch (if needed in the future)
  async updateBatch(id: number, batchData: Partial<Batch>): Promise<Batch> {
    try {
      const response = await fetch(`${API_BASE_URL}/Batch/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformToApiBatch(batchData)),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse<ApiBatch> = await response.json();
      return transformBatch(apiResponse.data);
    } catch (error) {
      console.error("Failed to update batch:", error);
      throw error;
    }
  },

  // Delete batch (if needed in the future)
  async deleteBatch(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/Batch/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete batch:", error);
      throw error;
    }
  },
};
