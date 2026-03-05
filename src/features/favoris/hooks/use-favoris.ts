import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '@/lib/api/favorites.api';

export function useFavoris() {
  return useQuery({
    queryKey: ['favoris'],
    queryFn: getFavorites,
  });
}
