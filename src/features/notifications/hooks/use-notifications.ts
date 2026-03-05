import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '@/lib/api/notifications.api';
import type { NotificationPreferences } from '@/lib/api/notifications.api';

export function useNotifications(filter?: 'all' | 'unread') {
  return useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => getNotifications(filter),
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId?: string) => {
      if (notificationId) {
        await markAsRead(notificationId);
      } else {
        await markAllAsRead();
      }
      return { notificationId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useUnreadCount() {
  const { data: count = 0 } = useQuery({
    queryKey: ['unread-count'],
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
  });
  return count;
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: getNotificationPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<NotificationPreferences>) =>
      updateNotificationPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}
