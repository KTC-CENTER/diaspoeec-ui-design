import type { Notification, NotificationType } from '@/types';
import { mockNotifications } from '@/lib/mock/notifications.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Notifications API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

export interface NotificationFilter {
  lu?: boolean;
  type?: NotificationType;
}

/**
 * Recupere la liste des notifications de l'utilisateur courant.
 * Peut etre filtree par statut de lecture et par type.
 */
export async function getNotifications(filter?: NotificationFilter): Promise<Notification[]> {
  await delay(300);

  let result = [...mockNotifications];

  if (filter?.lu !== undefined) {
    result = result.filter((n) => n.lu === filter.lu);
  }

  if (filter?.type) {
    result = result.filter((n) => n.type === filter.type);
  }

  // Tri par date decroissante (plus recentes en premier)
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return result;

  // --- Production ---
  // const params: Record<string, string> = {};
  // if (filter?.lu !== undefined) params.lu = String(filter.lu);
  // if (filter?.type) params.type = filter.type;
  // return apiClient.get<Notification[]>(ENDPOINTS.NOTIFICATIONS, { params });
}

/**
 * Marque une notification comme lue.
 */
export async function markAsRead(id: string): Promise<Notification> {
  await delay(200);

  const notification = mockNotifications.find((n) => n.id === id);
  if (!notification) {
    throw new Error('Notification introuvable');
  }

  notification.lu = true;
  return { ...notification };

  // --- Production ---
  // return apiClient.put<Notification>(ENDPOINTS.NOTIFICATION_READ(id));
}

/**
 * Marque toutes les notifications comme lues.
 */
export async function markAllAsRead(): Promise<{ count: number }> {
  await delay(300);

  let count = 0;
  mockNotifications.forEach((n) => {
    if (!n.lu) {
      n.lu = true;
      count++;
    }
  });

  return { count };

  // --- Production ---
  // return apiClient.put<{ count: number }>(ENDPOINTS.NOTIFICATIONS_READ_ALL);
}

/**
 * Recupere le nombre de notifications non lues.
 */
export async function getUnreadCount(): Promise<number> {
  await delay(100);

  return mockNotifications.filter((n) => !n.lu).length;

  // --- Production ---
  // const result = await apiClient.get<{ count: number }>(ENDPOINTS.NOTIFICATIONS, {
  //   params: { lu: 'false', countOnly: 'true' },
  // });
  // return result.count;
}
