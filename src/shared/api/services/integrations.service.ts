import { http } from '../http';

export interface TelegramContact {
  id: string;
  name: string;
  phone: string;
  telegramId?: string;
  telegramUsername?: string;
  avatar?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    isIncoming: boolean;
  };
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  whatsappId?: string;
  avatar?: string;
  lastMessage?: {
    text: string;
    timestamp: string;
    isIncoming: boolean;
  };
}

export interface IntegrationMessage {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
  platform: 'telegram' | 'whatsapp';
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface SendMessageRequest {
  contactId: string;
  text: string;
  platform: 'telegram' | 'whatsapp';
}

export const integrationsService = {
  // Telegram integration
  async getTelegramContacts(): Promise<TelegramContact[]> {
    const response = await http.get<TelegramContact[]>('/integrations/telegram/contacts');
    return response.data;
  },

  async addTelegramContact(data: { name: string; phone: string; telegramUsername?: string }): Promise<TelegramContact> {
    const response = await http.post<TelegramContact>('/integrations/telegram/contacts', data);
    return response.data;
  },

  async getTelegramMessages(contactId: string): Promise<IntegrationMessage[]> {
    const response = await http.get<IntegrationMessage[]>(`/integrations/telegram/contacts/${contactId}/messages`);
    return response.data;
  },

  async sendTelegramMessage(contactId: string, text: string): Promise<IntegrationMessage> {
    const response = await http.post<IntegrationMessage>(`/integrations/telegram/contacts/${contactId}/messages`, { text });
    return response.data;
  },

  async connectTelegram(): Promise<{ botLink: string; verificationCode: string }> {
    const response = await http.post('/integrations/telegram/connect');
    return response.data;
  },

  async getTelegramStatus(): Promise<{ connected: boolean; username?: string }> {
    const response = await http.get('/integrations/telegram/status');
    return response.data;
  },

  // WhatsApp integration
  async getWhatsAppContacts(): Promise<WhatsAppContact[]> {
    const response = await http.get<WhatsAppContact[]>('/integrations/whatsapp/contacts');
    return response.data;
  },

  async addWhatsAppContact(data: { name: string; phone: string }): Promise<WhatsAppContact> {
    const response = await http.post<WhatsAppContact>('/integrations/whatsapp/contacts', data);
    return response.data;
  },

  async getWhatsAppMessages(contactId: string): Promise<IntegrationMessage[]> {
    const response = await http.get<IntegrationMessage[]>(`/integrations/whatsapp/contacts/${contactId}/messages`);
    return response.data;
  },

  async sendWhatsAppMessage(contactId: string, text: string): Promise<IntegrationMessage> {
    const response = await http.post<IntegrationMessage>(`/integrations/whatsapp/contacts/${contactId}/messages`, { text });
    return response.data;
  },

  async connectWhatsApp(): Promise<{ qrCode: string }> {
    const response = await http.post('/integrations/whatsapp/connect');
    return response.data;
  },

  async getWhatsAppStatus(): Promise<{ connected: boolean; phone?: string }> {
    const response = await http.get('/integrations/whatsapp/status');
    return response.data;
  },

  // Generic send message
  async sendMessage(request: SendMessageRequest): Promise<IntegrationMessage> {
    if (request.platform === 'telegram') {
      return this.sendTelegramMessage(request.contactId, request.text);
    } else {
      return this.sendWhatsAppMessage(request.contactId, request.text);
    }
  },
};
