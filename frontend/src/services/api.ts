import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// Base API client configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7224/api";

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          `[API ${config.method?.toUpperCase()}] ${config.url}`,
          config.data,
        );
        return config;
      },
      (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      },
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Successful response
        return response;
      },
      (error: AxiosError) => {
        // Error response
        console.error("[API Error Response]", error.response?.data);

        let errorMessage = "";

        // Handle network errors (connection refused, SSL issues, etc.)
        if (!error.response) {
          if (error.message === "Network Error") {
            errorMessage =
              "Cannot connect to backend server. Please ensure:\n" +
              "1. Backend is running on http://localhost:5103\n" +
              "2. CORS is enabled in backend\n" +
              "3. Check browser console for details";
          } else if (error.code === "ERR_NETWORK") {
            errorMessage = "Network error - backend server may be offline";
          } else {
            errorMessage = error.message || "Network error occurred";
          }
          return Promise.reject(new Error(errorMessage));
        }

        // Handle HTTP error responses
        errorMessage = `HTTP ${error.response.status}: `;

        if (error.response.data) {
          const responseData = error.response.data as any;

          if (typeof responseData === "object") {
            // Log full error details for debugging
            console.error("[API Detailed Error]", responseData);

            // Check for common error formats
            if (responseData.errors) {
              // ASP.NET validation errors format
              const validationErrors = Object.entries(responseData.errors)
                .map(
                  ([key, value]) =>
                    `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
                )
                .join("; ");
              errorMessage +=
                validationErrors || JSON.stringify(responseData.errors);
            } else if (responseData.message) {
              errorMessage += responseData.message;
            } else if (responseData.title) {
              errorMessage += responseData.title;
            } else {
              errorMessage += JSON.stringify(responseData);
            }
          } else {
            errorMessage += responseData;
          }
        } else {
          errorMessage += error.message || "Unknown error";
        }

        return Promise.reject(new Error(errorMessage));
      },
    );
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error) {
      console.error(`[API GET Error] ${endpoint}:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`[API POST Error] ${endpoint}:`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`[API PUT Error] ${endpoint}:`, error);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint);
      // Handle 204 No Content
      return (response.status === 204 ? {} : response.data) as T;
    } catch (error) {
      console.error(`[API DELETE Error] ${endpoint}:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
