import type { Video, ServiceAVenir } from '@/types';
import { mockVideos, mockServicesAVenir } from '@/lib/mock/cultes.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Cultes API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

/**
 * Recupere la liste des videos de cultes (en direct et enregistrees).
 * Les videos en direct apparaissent en premier.
 */
export async function getVideos(): Promise<Video[]> {
  await delay(300);

  const result = [...mockVideos];

  // Les lives en premier, puis par date decroissante
  result.sort((a, b) => {
    if (a.type === 'live' && b.type !== 'live') return -1;
    if (a.type !== 'live' && b.type === 'live') return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return result;

  // --- Production ---
  // return apiClient.get<Video[]>(ENDPOINTS.CULTES.VIDEOS);
}

/**
 * Recupere la liste des services a venir.
 * Tries par date croissante (prochain service en premier).
 */
export async function getServicesAVenir(): Promise<ServiceAVenir[]> {
  await delay(300);

  return [...mockServicesAVenir].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // --- Production ---
  // return apiClient.get<ServiceAVenir[]>(ENDPOINTS.CULTES.SERVICES);
}

/**
 * Active ou desactive le rappel pour un service a venir.
 */
export async function toggleRappel(
  id: string,
): Promise<{ rappelActif: boolean }> {
  await delay(200);

  const service = mockServicesAVenir.find((s) => s.id === id);
  if (!service) {
    throw new Error('Service introuvable');
  }

  service.rappelActif = !service.rappelActif;
  return { rappelActif: service.rappelActif };

  // --- Production ---
  // return apiClient.post<{ rappelActif: boolean }>(ENDPOINTS.CULTES.RAPPEL(id));
}

/**
 * Recupere une video specifique par son identifiant.
 */
export async function getVideoById(id: string): Promise<Video | null> {
  await delay(200);

  const video = mockVideos.find((v) => v.id === id);
  return video ?? null;

  // --- Production ---
  // return apiClient.get<Video>(`${ENDPOINTS.CULTES.VIDEOS}/${id}`);
}
