import ApiService from './apiService';

export class ProjectService {
  // Get all projects
  static async getAllProjects() {
    return ApiService.get('/Projects');
  }

  // Get single project by ID
  static async getProject(id: number) {
    return ApiService.get(`/Projects/${id}`);
  }
  
static async getBatchTrainees(id: number) {
  return ApiService.get(`/Trainees/batch/${id}`);
}

  // Create new project
  static async createBatchProjects(data: any) {
    return ApiService.post('/Projects/batch', data);
  }

  // Update project
  static async updateProject(id: number, data: any) {
    return ApiService.put(`/Projects/${id}`, data);
  }

  // Delete project
  static async deleteProject(id: number) {
    return ApiService.delete(`/Projects/${id}`);
  }
}