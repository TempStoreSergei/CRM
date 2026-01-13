import { http } from '../http';
import type { Notification, PaginatedResponse, PaginationParams } from '../types';

export interface NotificationsFilters extends PaginationParams {
  read?: boolean;
}

export const notificationsService = {
  async getNotifications(params: NotificationsFilters = {}): Promise<PaginatedResponse<Notification> & { unreadCount: number }> {
    const response = await http.get('/notifications', { params });
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await http.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await http.patch('/notifications/read-all');
  },

  async deleteNotification(id: string): Promise<void> {
    await http.delete(`/notifications/${id}`);
  },

  async registerDevice(token: string, platform: 'web' | 'ios' | 'android'): Promise<void> {
    await http.post('/notifications/devices', { token, platform });
  },
};
