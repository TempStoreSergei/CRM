import { http } from '../http';
import type { Project, CreateProjectRequest, PaginatedResponse, PaginationParams } from '../types';

export interface ProjectsFilters extends PaginationParams {
  status?: 'active' | 'completed' | 'archived';
  search?: string;
}

export const projectsService = {
  async getProjects(params: ProjectsFilters = {}): Promise<PaginatedResponse<Project>> {
    const response = await http.get<PaginatedResponse<Project>>('/projects', { params });
    return response.data;
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await http.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await http.post<Project>('/projects', data);
    return response.data;
  },

  async updateProject(id: string, data: Partial<CreateProjectRequest>): Promise<Project> {
    const response = await http.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await http.delete(`/projects/${id}`);
  },

  async addMember(projectId: string, userId: string, role: string): Promise<void> {
    await http.post(`/projects/${projectId}/members`, { userId, role });
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    await http.delete(`/projects/${projectId}/members/${userId}`);
  },
};
