import { getAuthToken } from "../utils/auth";

const API_BASE_URL = "https://localhost:7224/api";

class ApiService {
  static async getHeaders() {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async handleResponse(response: Response) {
    console.log("📥 API Response Status:", response.status);
    console.log("📥 API Response OK:", response.ok);

    // Always parse the JSON body first
    const data = await response.json().catch(() => null);
    console.log("📥 API Response Body:", data);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.warn("⚠️ 401 Unauthorized - Redirecting to login");
      localStorage.removeItem("auth_data");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    // Check if the API response has the custom format with status field
    if (data && typeof data === "object" && "status" in data) {
      console.log("✅ Custom API Response Format Detected");
      console.log("   - Internal Status:", data.status);
      console.log("   - Succeeded:", data.succeeded);
      console.log("   - Message:", data.message);
      console.log("   - Data:", data.data ? "✓ Present" : "✗ Missing");

      // Return the data as-is, let the caller handle it
      return data;
    }

    // Fallback for standard HTTP error handling
    if (!response.ok) {
      const errorMessage =
        data?.message || `HTTP error! status: ${response.status}`;
      console.error("❌ API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  }

  static async get(endpoint: string) {
    console.log("🔵 GET Request:", `${API_BASE_URL}${endpoint}`);
    console.log("🔑 Auth Token:", getAuthToken() ? "✓ Present" : "✗ Missing");

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: await this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("❌ GET Request Failed:", error);
      throw error;
    }
  }

  static async post(endpoint: string, data: any) {
    console.log("🟢 POST Request:", `${API_BASE_URL}${endpoint}`);
    console.log("📤 Request Data:", data);
    console.log("🔑 Auth Token:", getAuthToken() ? "✓ Present" : "✗ Missing");

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("❌ POST Request Failed:", error);
      throw error;
    }
  }

  static async put(endpoint: string, data: any) {
    console.log("🟡 PUT Request:", `${API_BASE_URL}${endpoint}`);
    console.log("📤 Request Data:", data);
    console.log("🔑 Auth Token:", getAuthToken() ? "✓ Present" : "✗ Missing");

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: await this.getHeaders(),
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("❌ PUT Request Failed:", error);
      throw error;
    }
  }

  static async delete(endpoint: string) {
    console.log("🔴 DELETE Request:", `${API_BASE_URL}${endpoint}`);
    console.log("🔑 Auth Token:", getAuthToken() ? "✓ Present" : "✗ Missing");

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: await this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("❌ DELETE Request Failed:", error);
      throw error;
    }
  }
}

export default ApiService;
