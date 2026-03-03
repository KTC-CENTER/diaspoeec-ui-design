import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { FeedItem } from '@/types';

export function useFeed() {
  return useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      return apiClient.get<FeedItem[]>('/api/v1/feed');
    },
  });
}
