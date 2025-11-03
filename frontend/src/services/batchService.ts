import { apiClient } from "./api";

// Type definitions based on API documentation
export interface BatchType {
  id: number;
  name: string;
}

export interface PhaseType {
  id: number;
  name: string;
}

export interface Batch {
  id: number;
  batchName: string;
  batchType?: BatchType | string; // Can be either BatchType object or string
  batchTypeId?: number; // Backend returns this
  batchTypeName?: string; // Backend returns this
  status: "NotStarted" | "Active" | "Completed";
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PhaseDto {
  phaseType: string;
  phaseTypeId: number | null;
  startDate: string;
  endDate: string;
}

export interface CreateBatchDto {
  batchName: string;
  batchTypeId: number | null; // BatchType ID (not name)
  // Status is auto-calculated by backend based on startDate and endDate
  startDate: string;
  endDate: string;
  phases?: PhaseDto[];
}

export interface UpdateBatchDto {
  batchName: string;
  batchTypeId?: number | null; // BatchType ID (not name)
  // Status is auto-calculated by backend based on startDate and endDate
  startDate: string;
  endDate: string;
  phases?: PhaseDto[]; // Optional - if provided, replaces all existing phases
}

export interface SpecializationPhaseDto {
  id: number;
  traineeId: number;
  traineeName: string;
  techStack: string;
  project: string;
  specializationPhaseId: number;
}

class BatchService {
  /**
   * Get all batches
   * GET /api/Batch
   */
  async getAllBatches(): Promise<Batch[]> {
    return apiClient.get<Batch[]>("/Batch");
  }

  /**
   * Get batch by ID
   * GET /api/Batch/{id}
   */
  async getBatchById(id: number): Promise<Batch> {
    return apiClient.get<Batch>(`/Batch/${id}`);
  }

  /**
   * Create new batch
   * POST /api/Batch
   */
  async createBatch(data: CreateBatchDto): Promise<Batch> {
    return apiClient.post<Batch>("/Batch", data);
  }

  /**
   * Update batch
   * PUT /api/Batch/{id}
   */
  async updateBatch(id: number, data: UpdateBatchDto): Promise<Batch> {
    return apiClient.put<Batch>(`/Batch/${id}`, data);
  }

  /**
   * Delete batch
   * DELETE /api/Batch/{id}
   */
  async deleteBatch(id: number): Promise<void> {
    return apiClient.delete<void>(`/Batch/${id}`);
  }

  /**
   * Get all batch types
   * GET /api/BatchTypes
   */
  async getAllBatchTypes(): Promise<BatchType[]> {
    return apiClient.get<BatchType[]>("/BatchTypes");
  }

  /**
   * Create new batch type
   * POST /api/BatchTypes
   */
  async createBatchType(
    name: string,
  ): Promise<{ succeeded: boolean; message: string; data: BatchType }> {
    return apiClient.post("/BatchTypes", { name });
  }

  /**
   * Update batch type
   * PUT /api/BatchTypes/{id}
   */
  async updateBatchType(
    id: number,
    name: string,
  ): Promise<{ succeeded: boolean; message: string; data: BatchType }> {
    return apiClient.put(`/BatchTypes/${id}`, { name });
  }

  /**
   * Get all phase types
   * GET /api/PhaseTypes
   */
  async getAllPhaseTypes(): Promise<PhaseType[]> {
    return apiClient.get<PhaseType[]>("/PhaseTypes");
  }

  /**
   * Create new phase type
   * POST /api/PhaseTypes
   */
  async createPhaseType(
    name: string,
  ): Promise<{ succeeded: boolean; message: string; data: PhaseType }> {
    return apiClient.post("/PhaseTypes", { name });
  }

  /**
   * Update phase type
   * PUT /api/PhaseTypes/{id}
   */
  async updatePhaseType(
    id: number,
    name: string,
  ): Promise<{ succeeded: boolean; message: string; data: PhaseType }> {
    return apiClient.put(`/PhaseTypes/${id}`, { name });
  }

  /**
   * Get specialization phase data by batch
   * GET /api/Batch/{batchId}/specialization
   */
  async getSpecializationPhaseByBatch(
    batchId: number,
  ): Promise<SpecializationPhaseDto[]> {
    return apiClient.get<SpecializationPhaseDto[]>(
      `/Batch/${batchId}/specialization`,
    );
  }
}

export const batchService = new BatchService();
