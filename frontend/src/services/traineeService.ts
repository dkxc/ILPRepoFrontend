import { apiClient } from "./api";

// Type definitions based on API documentation
export interface CreateTraineeDto {
  username: string;
  email: string;
  password: string;
  batchId: number;
  phoneNo?: string;
  status: "Active" | "Inactive" | "OnLeave";
  bloodGroup?: string;
  aadhaarId?: string;
  healthCondition?: string;
  personalInterest?: string;
  address?: string;
  currentAddress?: string;
  contactNumber?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactNo?: string;
}

export interface CreateBoPhaseDto {
  traineeName: string;
  email: string; // Required for validation - trainee must exist with this email
  buddyName: string;
  duName?: string;
}

export interface CreateTraineeDuDto {
  traineeName: string;
  email: string; // Required for validation - trainee must exist with this email
  duName: string; // Backend expects 'duName', not 'duAllocated'
  location?: string;
  ojtMenter?: string; // Backend has typo: 'OjtMenter' instead of 'OjtMentor'
}

export interface UpdateTraineeDto {
  id: number;
  email: string;
  phoneNo?: string;
  status: "Active" | "Inactive" | "OnLeave";
  bloodGroup?: string;
  aadhaarId?: string;
  healthCondition?: string;
  personalInterest?: string;
  address?: string;
  currentAddress?: string;
  contactNumber?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactNo?: string;
}

export interface UpdateBoPhaseDto {
  boPhaseId: number;
  traineeName?: string;
  buddyName: string;
  duName?: string;
}

export interface UpdateTraineeDuDto {
  traineeDuId: number;
  traineeName?: string;
  duAllocated: string; // API uses 'duAllocated' in PUT
  location: string;
  ojtMentor: string; // API uses 'ojtMentor' in PUT
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

class TraineeService {
  /**
   * Create new trainee
   * POST /api/Trainees
   */
  async createTrainee(data: CreateTraineeDto): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>("/Trainees", data);
  }

  /**
   * Create BO Phase assignment
   * POST /api/BoPhases
   */
  async createBoPhase(data: CreateBoPhaseDto): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>("/BoPhases", data);
  }

  /**
   * Create Trainee DU assignment
   * POST /api/TraineeDus
   */
  async createTraineeDu(data: CreateTraineeDuDto): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>("/TraineeDus", data);
  }

  /**
   * Get all trainees
   * GET /api/Trainees
   */
  async getAllTrainees(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>("/Trainees");
  }

  /**
   * Get trainees by batch ID
   * GET /api/Trainees/batch/{batchId}
   */
  async getTraineesByBatch(batchId: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/Trainees/batch/${batchId}`);
  }

  /**
   * Get BO Phases by batch ID
   * GET /api/BoPhases/batch/{batchId}
   */
  async getBoPhasesByBatch(batchId: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/BoPhases/batch/${batchId}`);
  }

  /**
   * Get Trainee DUs by batch ID
   * GET /api/TraineeDus/batch/{batchId}
   */
  async getTraineeDusByBatch(batchId: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/TraineeDus/batch/${batchId}`);
  }

  /**
   * Bulk create trainees for a batch
   * POST /api/Trainees/batch/{batchId}
   */
  async bulkCreateTrainees(
    batchId: number,
    data: CreateTraineeDto[],
  ): Promise<ApiResponse<any[]>> {
    return apiClient.post<ApiResponse<any[]>>(
      `/Trainees/batch/${batchId}`,
      data,
    );
  }

  /**
   * Bulk create BO Phase assignments for a batch
   * POST /api/BoPhases/batch/{batchId}
   */
  async bulkCreateBoPhases(
    batchId: number,
    data: CreateBoPhaseDto[],
  ): Promise<ApiResponse<any[]>> {
    console.log(
      `[traineeService] Bulk create BO phases for batch ${batchId}:`,
      data,
    );
    console.log(
      `[traineeService] Trainee names:`,
      data.map((d) => `"${d.traineeName}"`),
    );
    return apiClient.post<ApiResponse<any[]>>(
      `/BoPhases/batch/${batchId}`,
      data,
    );
  }

  /**
   * Bulk create Trainee DU assignments for a batch
   * POST /api/TraineeDus/batch/{batchId}
   */
  async bulkCreateTraineeDus(
    batchId: number,
    data: CreateTraineeDuDto[],
  ): Promise<ApiResponse<any[]>> {
    return apiClient.post<ApiResponse<any[]>>(
      `/TraineeDus/batch/${batchId}`,
      data,
    );
  }

  /**
   * Update trainee
   * PUT /api/Trainees/{id}
   */
  async updateTrainee(
    id: number,
    data: UpdateTraineeDto,
  ): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/Trainees/${id}`, data);
  }

  /**
   * Update BO Phase assignment
   * PUT /api/BoPhases/{id}
   */
  async updateBoPhase(
    id: number,
    data: UpdateBoPhaseDto,
  ): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/BoPhases/${id}`, data);
  }

  /**
   * Update Trainee DU assignment
   * PUT /api/TraineeDus/{id}
   */
  async updateTraineeDu(
    id: number,
    data: UpdateTraineeDuDto,
  ): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/TraineeDus/${id}`, data);
  }

  /**
   * Get trainee training details
   * GET /api/Trainees/{traineeId}/training-details
   */
  async getTraineeTrainingDetails(
    traineeId: number,
  ): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(
      `/Trainees/${traineeId}/training-details`,
    );
  }

  /**
   * Update trainee training details
   * PUT /api/Trainees/{traineeId}/training-details
   */
  async updateTraineeTrainingDetails(
    traineeId: number,
    data: {
      buddyName?: string;
      duName?: string;
      ojtMentor?: string;
      location?: string;
    },
  ): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(
      `/Trainees/${traineeId}/training-details`,
      data,
    );
  }
}

export const traineeService = new TraineeService();
