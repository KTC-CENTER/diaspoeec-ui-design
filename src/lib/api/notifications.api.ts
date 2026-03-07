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

export interface NotificationPreferences {
  pushEnabled: boolean;
  nouvelleMeditation: boolean;
  rappelEvenement: boolean;
  anniversaire: boolean;
  confirmationDon: boolean;
  reponseCommentaire: boolean;
  likesEnabled: boolean;
  rappelLecture: boolean;
  culteEnDirect: boolean;
  nouvelEvenementZone: boolean;
  nouveauMessage: boolean;
}

export async function getNotifications(filter?: 'all' | 'unread'): Promise<Notification[]> {
  const params: Record<string, string> = {};
  if (filter === 'unread') params.filter = 'unread';
  return apiClient.get<Notification[]>(ENDPOINTS.NOTIFICATIONS, { params });
}

export async function markAsRead(id: string): Promise<Notification> {
  return apiClient.put<Notification>(ENDPOINTS.NOTIFICATION_READ(id));
}

export async function markAllAsRead(): Promise<void> {
  return apiClient.put<void>(ENDPOINTS.NOTIFICATIONS_READ_ALL);
}

export async function getUnreadCount(): Promise<number> {
  const result = await apiClient.get<{ count: number }>(ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
  return result.count;
}

// Preferences
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiClient.get<NotificationPreferences>(ENDPOINTS.NOTIFICATIONS_PREFERENCES);
}

export async function updateNotificationPreferences(
  data: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  return apiClient.put<NotificationPreferences>(ENDPOINTS.NOTIFICATIONS_PREFERENCES, data);
}

// Device tokens (FCM)
export async function registerDeviceToken(token: string, platform: string): Promise<void> {
  return apiClient.post<void>(ENDPOINTS.NOTIFICATIONS_DEVICE_TOKEN, { token, platform });
}

export async function removeDeviceToken(token: string): Promise<void> {
  return apiClient.delete<void>(`${ENDPOINTS.NOTIFICATIONS_DEVICE_TOKEN}/${token}`);
}
