import { http } from '../http';
import type { LoginRequest, LoginResponse, SignUpRequest, User } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  async signUp(data: SignUpRequest): Promise<User> {
    const response = await http.post<User>('/auth/signUp', data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await http.post('/auth/refresh', {
      refreshToken,
      agent: navigator.userAgent,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await http.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await http.post('/auth/forgot-password', { email });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await http.get<User>('/users/me');
    return response.data;
  },
};
