import { http } from '../http';
import type { Task, CreateTaskRequest, PaginatedResponse, PaginationParams } from '../types';

export interface TasksFilters extends PaginationParams {
  projectId?: string;
  assigneeId?: string;
  status?: Task['status'];
  priority?: Task['priority'];
}

export const tasksService = {
  async getTasks(params: TasksFilters = {}): Promise<PaginatedResponse<Task>> {
    const response = await http.get<PaginatedResponse<Task>>('/tasks', { params });
    return response.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await http.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await http.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: string, data: Partial<CreateTaskRequest>): Promise<Task> {
    const response = await http.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  async updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
    const response = await http.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await http.delete(`/tasks/${id}`);
  },

  async addComment(taskId: string, content: string): Promise<void> {
    await http.post(`/tasks/${taskId}/comments`, { content });
  },

  async getComments(taskId: string): Promise<{ data: unknown[] }> {
    const response = await http.get(`/tasks/${taskId}/comments`);
    return response.data;
  },
};
