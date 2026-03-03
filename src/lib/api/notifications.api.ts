import type { Notification, NotificationType } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Notifications API
// ============================================================================

export interface NotificationFilter {
  lu?: boolean;
  type?: NotificationType;
}

export async function getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
  const params: Record<string, string> = {};
  if (filter?.lu !== undefined) params.lu = String(filter.lu);
  if (filter?.type) params.type = filter.type;
  return apiClient.get<Notification[]>(ENDPOINTS.NOTIFICATIONS, { params });
}

export async function markAsRead(id: string): Promise<Notification> {
  return apiClient.put<Notification>(ENDPOINTS.NOTIFICATION_READ(id));
}

export async function markAllAsRead(): Promise<{ count: number }> {
  return apiClient.put<{ count: number }>(ENDPOINTS.NOTIFICATIONS_READ_ALL);
}

export async function getUnreadCount(): Promise<number> {
  const result = await apiClient.get<{ count: number }>(ENDPOINTS.NOTIFICATIONS, {
    params: { lu: 'false', countOnly: 'true' },
  });
  return result.count;
}
