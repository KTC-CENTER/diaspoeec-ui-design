import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/api/notifications.api';

export function useNotifications(filter?: 'all' | 'unread') {
  return useQuery({
    queryKey: ['notifications', filter],
    queryFn: async () => {
      if (filter === 'unread') {
        return getNotifications({ lu: false });
      }
      return getNotifications();
    },
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
    },
  });
}

export function useUnreadCount() {
  const { data: notifications } = useNotifications('all');
  const count = notifications?.filter((n) => !n.lu).length || 0;
  return count;
}
