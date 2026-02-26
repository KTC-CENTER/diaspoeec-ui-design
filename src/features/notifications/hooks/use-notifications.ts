import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockNotifications } from '@/lib/mock/notifications.mock';
import { delay } from '@/lib/utils/format';

export function useNotifications(filter?: 'all' | 'unread') {
  return useQuery({
    queryKey: ['notifications', filter],
    queryFn: async () => {
      await delay(250);
      if (filter === 'unread') {
        return mockNotifications.filter((n) => !n.lu);
      }
      return mockNotifications;
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId?: string) => {
      await delay(150);
      // In production: PATCH /api/notifications/:id or /api/notifications/mark-all-read
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
