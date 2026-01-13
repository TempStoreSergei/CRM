import { http } from '../http';
import type { User, Employee, PaginatedResponse, PaginationParams } from '../types';

export interface EmployeesFilters extends PaginationParams {
  search?: string;
  department?: string;
  status?: string;
  role?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  level?: 'Junior' | 'Middle' | 'Senior' | 'Lead';
}

export const usersService = {
  async getUsers(params: EmployeesFilters = {}): Promise<PaginatedResponse<User>> {
    const response = await http.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await http.get<User>(`/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await http.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await http.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await http.delete(`/users/${id}`);
  },

  async uploadAvatar(id: string, file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await http.post<{ avatar: string }>(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const employeesService = {
  async getEmployees(params: EmployeesFilters = {}): Promise<PaginatedResponse<Employee>> {
    const response = await http.get<PaginatedResponse<Employee>>('/employees', { params });
    return response.data;
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const response = await http.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  async getEmployeeTasks(id: string): Promise<{ data: import('../types').Task[] }> {
    const response = await http.get(`/employees/${id}/tasks`);
    return response.data;
  },
};
