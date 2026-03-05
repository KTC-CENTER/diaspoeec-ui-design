import type { FavoriteItem } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export async function getFavorites(): Promise<FavoriteItem[]> {
  return apiClient.get<FavoriteItem[]>(ENDPOINTS.FAVORITES);
}
