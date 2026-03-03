import type { Video, ServiceAVenir } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Cultes API
// ============================================================================

export async function getVideos(): Promise<Video[]> {
  return apiClient.get<Video[]>(ENDPOINTS.CULTES.VIDEOS);
}

export async function getServicesAVenir(): Promise<ServiceAVenir[]> {
  return apiClient.get<ServiceAVenir[]>(ENDPOINTS.CULTES.SERVICES);
}

export async function toggleRappel(
  id: string,
): Promise<{ rappelActif: boolean }> {
  return apiClient.post<{ rappelActif: boolean }>(ENDPOINTS.CULTES.RAPPEL(id));
}

export async function getVideoById(id: string): Promise<Video | null> {
  return apiClient.get<Video>(ENDPOINTS.CULTES.VIDEO_BY_ID(id));
}

export async function toggleVideoLike(id: string): Promise<{ liked: boolean; likes: number }> {
  return apiClient.post<{ liked: boolean; likes: number }>(ENDPOINTS.CULTES.VIDEO_LIKE(id));
}

export interface CreateVideoPayload {
  titre: string;
  auteur: string;
  youtubeId: string;
  type: 'planifie' | 'enregistre' | 'live';
  scheduledAt?: string;
  thumbnailGradient?: string;
  badge?: string;
  dureeSeconds?: number;
}

export async function createVideo(data: CreateVideoPayload): Promise<Video> {
  return apiClient.post<Video>(ENDPOINTS.CULTES.VIDEOS, data);
}

export async function updateVideo(id: string, data: Partial<CreateVideoPayload>): Promise<Video> {
  return apiClient.put<Video>(ENDPOINTS.CULTES.VIDEO_BY_ID(id), data);
}

export async function deleteVideo(id: string): Promise<void> {
  return apiClient.delete(ENDPOINTS.CULTES.VIDEO_BY_ID(id));
}
