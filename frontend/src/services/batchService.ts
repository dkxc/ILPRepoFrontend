// src/services/batchService.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5225/api';

export interface BatchDto {
  id: number;
  name: string;
  type: string;
  totalTrainees: number;
  totalTrainingHours: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateBatchDto {
  name: string;
  type: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateBatchDto extends CreateBatchDto {
  id: number;
}

export interface TraineeDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  batchId: number;
  batchName?: string;
}

export interface CreateTraineeDto {
  name: string;
  email: string;
  phoneNumber: string;
  batchId: number;
}

export interface UpdateTraineeDto extends CreateTraineeDto {
  id: number;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const batchService = {
  // Batch endpoints
  getAllBatches: async (): Promise<BatchDto[]> => {
    const response = await api.get<ApiResponse<BatchDto[]>>('/Batch');
    return response.data.data;
  },

  getBatchById: async (id: number): Promise<BatchDto> => {
    const response = await api.get<ApiResponse<BatchDto>>(`/Batch/${id}`);
    return response.data.data;
  },

  createBatch: async (batch: CreateBatchDto): Promise<BatchDto> => {
    const response = await api.post<ApiResponse<BatchDto>>('/Batch', batch);
    return response.data.data;
  },

  updateBatch: async (id: number, batch: UpdateBatchDto): Promise<BatchDto> => {
    const response = await api.put<ApiResponse<BatchDto>>(`/Batch/${id}`, {
      ...batch,
      id,
    });
    return response.data.data;
  },

  deleteBatch: async (id: number): Promise<void> => {
    await api.delete(`/Batch/${id}`);
  },
};

export const traineeService = {
  // Trainee endpoints
  getAllTrainees: async (): Promise<TraineeDto[]> => {
    const response = await api.get<ApiResponse<TraineeDto[]>>('/Trainee');
    return response.data.data;
  },

  getTraineesByBatchId: async (batchId: number): Promise<TraineeDto[]> => {
    const response = await api.get<ApiResponse<TraineeDto[]>>(`/Trainee/batch/${batchId}`);
    return response.data.data;
  },

  getTraineeById: async (id: number): Promise<TraineeDto> => {
    const response = await api.get<ApiResponse<TraineeDto>>(`/Trainee/${id}`);
    return response.data.data;
  },

  createTrainee: async (trainee: CreateTraineeDto): Promise<TraineeDto> => {
    const response = await api.post<ApiResponse<TraineeDto>>('/Trainee', trainee);
    return response.data.data;
  },

  updateTrainee: async (id: number, trainee: UpdateTraineeDto): Promise<TraineeDto> => {
    const response = await api.put<ApiResponse<TraineeDto>>(`/Trainee/${id}`, {
      ...trainee,
      id,
    });
    return response.data.data;
  },

  deleteTrainee: async (id: number): Promise<void> => {
    await api.delete(`/Trainee/${id}`);
  },
};