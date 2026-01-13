import { http } from '../http';
import type { Event, CreateEventRequest, PaginationParams } from '../types';

export interface EventsFilters extends PaginationParams {
  startDate?: string;
  endDate?: string;
  type?: Event['type'];
}

export const eventsService = {
  async getEvents(params: EventsFilters = {}): Promise<{ data: Event[] }> {
    const response = await http.get<{ data: Event[] }>('/events', { params });
    return response.data;
  },

  async getEventById(id: string): Promise<Event> {
    const response = await http.get<Event>(`/events/${id}`);
    return response.data;
  },

  async createEvent(data: CreateEventRequest): Promise<Event> {
    const response = await http.post<Event>('/events', data);
    return response.data;
  },

  async updateEvent(id: string, data: Partial<CreateEventRequest>): Promise<Event> {
    const response = await http.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await http.delete(`/events/${id}`);
  },

  async respondToEvent(id: string, status: 'accepted' | 'declined'): Promise<void> {
    await http.patch(`/events/${id}/respond`, { status });
  },
};
