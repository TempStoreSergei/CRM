import { http } from '../http';
import type { Conversation, Message, PaginationParams } from '../types';

export interface MessagesFilters extends PaginationParams {
  before?: string;
}

export const messengerService = {
  async getConversations(): Promise<{
    groups: Conversation[];
    directMessages: Conversation[];
  }> {
    const response = await http.get('/conversations');
    return response.data;
  },

  async createConversation(data: {
    type: 'group' | 'direct';
    name?: string;
    participantIds: string[];
  }): Promise<Conversation> {
    const response = await http.post<Conversation>('/conversations', data);
    return response.data;
  },

  async getMessages(conversationId: string, params: MessagesFilters = {}): Promise<{
    data: Message[];
    meta: { hasMore: boolean };
  }> {
    const response = await http.get(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  async sendMessage(conversationId: string, data: {
    content: string;
    type?: 'text' | 'file' | 'image';
    attachmentIds?: string[];
  }): Promise<Message> {
    const response = await http.post<Message>(`/conversations/${conversationId}/messages`, data);
    return response.data;
  },
};
