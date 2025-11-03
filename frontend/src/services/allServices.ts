import { apiClient, type ApiResponse } from "./api";

// ============================================
// TRAINEE SERVICE
// ============================================

export type TraineeStatus = "Active" | "Inactive" | "OnLeave";
export type BloodGroup =
  | "APositive"
  | "ANegative"
  | "BPositive"
  | "BNegative"
  | "OPositive"
  | "ONegative"
  | "ABPositive"
  | "ABNegative";

export interface Trainee {
  id: number;
  username: string;
  email: string;
  phoneNo?: string;
  status: TraineeStatus;
  batchId: number;
  bloodGroup?: BloodGroup;
  aadhaarId?: string;
  healthCondition?: string;
  personalInterest?: string;
  address?: string;
  currentAddress?: string;
  contactNumber?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactNo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTraineeDto {
  username: string;
  email: string;
  password: string;
  batchId: number;
  phoneNo?: string;
  status: TraineeStatus;
  bloodGroup?: BloodGroup;
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

export interface UpdateTraineeDto {
  id: number;
  email: string;
  phoneNo?: string;
  status: TraineeStatus;
  bloodGroup?: BloodGroup;
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

class TraineeService {
  /**
   * Get all trainees
   * GET /api/Trainees
   */
  async getAllTrainees(): Promise<ApiResponse<Trainee[]>> {
    return apiClient.get<ApiResponse<Trainee[]>>("/Trainees");
  }

  /**
   * Get trainees by batch ID
   * GET /api/Trainees/batch/{batchId}
   */
  async getTraineesByBatch(batchId: number): Promise<ApiResponse<Trainee[]>> {
    return apiClient.get<ApiResponse<Trainee[]>>(`/Trainees/batch/${batchId}`);
  }

  /**
   * Create new trainee
   * POST /api/Trainees
   */
  async createTrainee(data: CreateTraineeDto): Promise<ApiResponse<Trainee>> {
    return apiClient.post<ApiResponse<Trainee>>("/Trainees", data);
  }

  /**
   * Update trainee
   * PUT /api/Trainees/{id}
   */
  async updateTrainee(
    id: number,
    data: UpdateTraineeDto,
  ): Promise<ApiResponse<Trainee>> {
    return apiClient.put<ApiResponse<Trainee>>(`/Trainees/${id}`, data);
  }

  /**
   * Bulk create trainees for a batch
   * POST /api/Trainees/batch/{batchId}
   */
  async bulkCreateTrainees(
    batchId: number,
    trainees: CreateTraineeDto[],
  ): Promise<ApiResponse<Trainee[]>> {
    return apiClient.post<ApiResponse<Trainee[]>>(
      `/Trainees/batch/${batchId}`,
      trainees,
    );
  }
}

export const traineeService = new TraineeService();

// ============================================
// USER SERVICE
// ============================================

export type UserRole = "Admin" | "Trainee" | "Mentor";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface UpdateUserDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

class UserService {
  /**
   * Get all users
   * GET /api/User
   */
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/User");
  }

  /**
   * Get user by ID
   * GET /api/User/{id}
   */
  async getUserById(id: number): Promise<User> {
    return apiClient.get<User>(`/User/${id}`);
  }

  /**
   * Get user by username
   * GET /api/User/username/{username}
   */
  async getUserByUsername(username: string): Promise<User> {
    return apiClient.get<User>(`/User/username/${username}`);
  }

  /**
   * Create new user
   * POST /api/User
   */
  async createUser(data: CreateUserDto): Promise<User> {
    return apiClient.post<User>("/User", data);
  }

  /**
   * Update user
   * PUT /api/User/{id}
   */
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return apiClient.put<User>(`/User/${id}`, data);
  }

  /**
   * Delete user
   * DELETE /api/User/{id}
   */
  async deleteUser(id: number): Promise<void> {
    return apiClient.delete<void>(`/User/${id}`);
  }
}

export const userService = new UserService();

// ============================================
// BO PHASE SERVICE
// ============================================

export interface BoPhaseDetails {
  traineeName: string;
  buddy: string;
  buddyDU: string;
}

export interface CreateBoPhaseDto {
  traineeName: string;
  buddyName: string;
  duName?: string;
}

export interface UpdateBoPhaseDto {
  boPhaseId: number;
  traineeName?: string;
  buddyName: string;
  duName?: string;
}

class BoPhaseService {
  /**
   * Get BO Phase assignments for a batch
   * GET /api/BoPhases/batch/{batchId}
   */
  async getBoPhasesByBatch(
    batchId: number,
  ): Promise<ApiResponse<BoPhaseDetails[]>> {
    return apiClient.get<ApiResponse<BoPhaseDetails[]>>(
      `/BoPhases/batch/${batchId}`,
    );
  }

  /**
   * Create single BO Phase assignment
   * POST /api/BoPhases
   */
  async createBoPhase(
    data: CreateBoPhaseDto,
  ): Promise<ApiResponse<BoPhaseDetails>> {
    return apiClient.post<ApiResponse<BoPhaseDetails>>("/BoPhases", data);
  }

  /**
   * Bulk create BO Phase assignments for a batch
   * POST /api/BoPhases/batch/{batchId}
   */
  async bulkCreateBoPhases(
    batchId: number,
    phases: CreateBoPhaseDto[],
  ): Promise<ApiResponse<BoPhaseDetails[]>> {
    return apiClient.post<ApiResponse<BoPhaseDetails[]>>(
      `/BoPhases/batch/${batchId}`,
      phases,
    );
  }

  /**
   * Update BO Phase assignment
   * PUT /api/BoPhases/{id}
   */
  async updateBoPhase(
    id: number,
    data: UpdateBoPhaseDto,
  ): Promise<ApiResponse<BoPhaseDetails>> {
    return apiClient.put<ApiResponse<BoPhaseDetails>>(`/BoPhases/${id}`, data);
  }
}

export const boPhaseService = new BoPhaseService();

// ============================================
// TRAINEE DU SERVICE
// ============================================

export interface TraineeDuDetails {
  traineeDuId: number;
  traineeName: string;
  duAllocated: string;
  location: string;
  ojtMentor: string;
}

export interface CreateTraineeDuDto {
  traineeName: string;
  duAllocated: string;
  location?: string;
  ojtMentor?: string;
}

export interface UpdateTraineeDuDto {
  traineeDuId: number;
  traineeName?: string;
  duAllocated: string;
  location?: string;
  ojtMentor?: string;
}

class TraineeDuService {
  /**
   * Get TraineeDu assignments for a batch
   * GET /api/TraineeDus/batch/{batchId}
   */
  async getTraineeDusByBatch(
    batchId: number,
  ): Promise<ApiResponse<TraineeDuDetails[]>> {
    return apiClient.get<ApiResponse<TraineeDuDetails[]>>(
      `/TraineeDus/batch/${batchId}`,
    );
  }

  /**
   * Create single TraineeDu assignment
   * POST /api/TraineeDus
   */
  async createTraineeDu(
    data: CreateTraineeDuDto,
  ): Promise<ApiResponse<TraineeDuDetails>> {
    return apiClient.post<ApiResponse<TraineeDuDetails>>("/TraineeDus", data);
  }

  /**
   * Bulk create TraineeDu assignments for a batch
   * POST /api/TraineeDus/batch/{batchId}
   */
  async bulkCreateTraineeDus(
    batchId: number,
    assignments: CreateTraineeDuDto[],
  ): Promise<ApiResponse<TraineeDuDetails[]>> {
    return apiClient.post<ApiResponse<TraineeDuDetails[]>>(
      `/TraineeDus/batch/${batchId}`,
      assignments,
    );
  }

  /**
   * Update TraineeDu assignment
   * PUT /api/TraineeDus/{id}
   */
  async updateTraineeDu(
    id: number,
    data: UpdateTraineeDuDto,
  ): Promise<ApiResponse<TraineeDuDetails>> {
    return apiClient.put<ApiResponse<TraineeDuDetails>>(
      `/TraineeDus/${id}`,
      data,
    );
  }
}

export const traineeDuService = new TraineeDuService();
