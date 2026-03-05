import { useQuery } from '@tanstack/react-query';
import { getParoissesPublic } from '@/lib/api/admin.api';

export function useParoisses() {
  return useQuery({
    queryKey: ['paroisses'],
    queryFn: getParoissesPublic,
    staleTime: 5 * 60 * 1000, // 5 minutes — paroisses change rarely
  });
}
