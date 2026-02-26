import { useQuery } from '@tanstack/react-query';
import { mockFeedItems } from '@/lib/mock/feed.mock';
import { delay } from '@/lib/utils/format';

export function useFeed() {
  return useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      await delay(300);
      return mockFeedItems;
    },
  });
}
