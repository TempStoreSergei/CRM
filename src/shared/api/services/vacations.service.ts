import { http } from '../http';
import type { Vacation, CreateVacationRequest, PaginatedResponse, PaginationParams } from '../types';

export interface VacationsFilters extends PaginationParams {
  status?: Vacation['status'];
  userId?: string;
  year?: number;
}

export const vacationsService = {
  async getVacations(params: VacationsFilters = {}): Promise<PaginatedResponse<Vacation>> {
    const response = await http.get<PaginatedResponse<Vacation>>('/vacations', { params });
    return response.data;
  },

  async getVacationById(id: string): Promise<Vacation> {
    const response = await http.get<Vacation>(`/vacations/${id}`);
    return response.data;
  },

  async createVacation(data: CreateVacationRequest): Promise<Vacation> {
    const response = await http.post<Vacation>('/vacations', data);
    return response.data;
  },

  async approveVacation(id: string): Promise<Vacation> {
    const response = await http.patch<Vacation>(`/vacations/${id}/approve`);
    return response.data;
  },

  async rejectVacation(id: string, reason: string): Promise<Vacation> {
    const response = await http.patch<Vacation>(`/vacations/${id}/reject`, { reason });
    return response.data;
  },

  async cancelVacation(id: string): Promise<void> {
    await http.delete(`/vacations/${id}`);
  },

  async getBalance(): Promise<{
    annualTotal: number;
    annualUsed: number;
    annualRemaining: number;
    sickTotal: number;
    sickUsed: number;
    sickRemaining: number;
  }> {
    const response = await http.get('/vacations/balance');
    return response.data;
  },
};
