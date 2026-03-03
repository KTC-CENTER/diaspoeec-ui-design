import type { Meditation, MeditationCategorie } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Meditations API
// ============================================================================

export interface MeditationFilters {
  categorie?: MeditationCategorie;
  recherche?: string;
  auteurId?: string;
  page?: number;
  limit?: number;
}

export async function getMeditations(filters?: MeditationFilters): Promise<Meditation[]> {
  const params: Record<string, string> = {};
  if (filters?.categorie) params.categorie = filters.categorie;
  if (filters?.recherche) params.recherche = filters.recherche;
  if (filters?.auteurId) params.auteurId = filters.auteurId;
  if (filters?.page !== undefined) params.page = String(filters.page);
  if (filters?.limit !== undefined) params.limit = String(filters.limit);
  return apiClient.get<Meditation[]>(ENDPOINTS.MEDITATIONS, { params });
}

export async function getMeditationById(id: string): Promise<Meditation | null> {
  return apiClient.get<Meditation>(ENDPOINTS.MEDITATION_BY_ID(id));
}

export async function likeMeditation(id: string): Promise<{ likes: number; liked: boolean }> {
  return apiClient.post<{ likes: number; liked: boolean }>(ENDPOINTS.MEDITATION_LIKE(id));
}

export async function createMeditation(data: {
  titre: string;
  extrait: string;
  contenu: string;
  categorie: MeditationCategorie;
}): Promise<Meditation> {
  return apiClient.post<Meditation>(ENDPOINTS.MEDITATIONS, data);
}

export async function updateMeditation(id: string, data: {
  titre?: string;
  extrait?: string;
  contenu?: string;
  categorie?: MeditationCategorie;
}): Promise<Meditation> {
  return apiClient.put<Meditation>(ENDPOINTS.MEDITATION_BY_ID(id), data);
}

export async function deleteMeditation(id: string): Promise<void> {
  return apiClient.delete(ENDPOINTS.MEDITATION_BY_ID(id));
}

export async function bookmarkMeditation(id: string): Promise<{ bookmarked: boolean }> {
  return apiClient.post<{ bookmarked: boolean }>(ENDPOINTS.MEDITATION_BOOKMARK(id));
}
