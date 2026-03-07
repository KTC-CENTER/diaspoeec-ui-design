import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ── Types ──

export interface MessageRecipient {
  id: string;
  nomComplet: string;
  avatarUrl?: string;
  online: boolean;
}

export interface ConversationSummary {
  id: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
  recipient: MessageRecipient | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  mediaUrl?: string;
  createdAt: string;
}

export interface MessagesPage {
  messages: ChatMessage[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ── API functions ──

export async function getConversations(): Promise<ConversationSummary[]> {
  return apiClient.get<ConversationSummary[]>(ENDPOINTS.MESSAGES.CONVERSATIONS);
}

export async function createConversation(recipientId: string): Promise<ConversationSummary> {
  return apiClient.post<ConversationSummary>(ENDPOINTS.MESSAGES.CONVERSATIONS, { recipientId });
}

export async function getMessages(conversationId: string, page = 1): Promise<MessagesPage> {
  return apiClient.get<MessagesPage>(ENDPOINTS.MESSAGES.CONVERSATION_BY_ID(conversationId), {
    params: { page: String(page) },
  });
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
  mediaUrl?: string,
): Promise<ChatMessage> {
  return apiClient.post<ChatMessage>(ENDPOINTS.MESSAGES.SEND_MESSAGE(conversationId), {
    content,
    type,
    mediaUrl,
  });
}

export async function markAsRead(conversationId: string): Promise<{ success: boolean }> {
  return apiClient.put<{ success: boolean }>(ENDPOINTS.MESSAGES.MARK_READ(conversationId));
}

export async function deleteMessage(messageId: string): Promise<{ success: boolean; messageId: string; conversationId: string }> {
  return apiClient.delete<{ success: boolean; messageId: string; conversationId: string }>(ENDPOINTS.MESSAGES.DELETE_MESSAGE(messageId));
}

export async function getUnreadMessageCount(): Promise<number> {
  return apiClient.get<number>(ENDPOINTS.MESSAGES.UNREAD_COUNT);
}
