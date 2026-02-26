import { useQuery } from '@tanstack/react-query';
import { mockVideos, mockServicesAVenir } from '@/lib/mock/cultes.mock';
import { delay } from '@/lib/utils/format';

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      await delay(300);
      return mockVideos;
    },
  });
}

export function useServicesAVenir() {
  return useQuery({
    queryKey: ['services-a-venir'],
    queryFn: async () => {
      await delay(200);
      return mockServicesAVenir;
    },
  });
}
