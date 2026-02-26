import type { Meditation, MeditationCategorie } from '@/types';
import { mockMeditations } from '@/lib/mock/meditations.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Meditations API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

export interface MeditationFilters {
  categorie?: MeditationCategorie;
  recherche?: string;
  auteurId?: string;
  page?: number;
  limit?: number;
}

/**
 * Recupere la liste des meditations avec filtres optionnels.
 */
export async function getMeditations(filters?: MeditationFilters): Promise<Meditation[]> {
  await delay(300);

  let result = [...mockMeditations];

  if (filters?.categorie) {
    result = result.filter((m) => m.categorie === filters.categorie);
  }

  if (filters?.recherche) {
    const search = filters.recherche.toLowerCase();
    result = result.filter(
      (m) =>
        m.titre.toLowerCase().includes(search) ||
        m.extrait.toLowerCase().includes(search) ||
        m.auteurNom.toLowerCase().includes(search),
    );
  }

  if (filters?.auteurId) {
    result = result.filter((m) => m.auteurId === filters.auteurId);
  }

  // Tri par date de publication decroissante
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Pagination
  if (filters?.page !== undefined && filters?.limit !== undefined) {
    const start = filters.page * filters.limit;
    result = result.slice(start, start + filters.limit);
  }

  return result;

  // --- Production ---
  // const params: Record<string, string> = {};
  // if (filters?.categorie) params.categorie = filters.categorie;
  // if (filters?.recherche) params.recherche = filters.recherche;
  // if (filters?.auteurId) params.auteurId = filters.auteurId;
  // if (filters?.page !== undefined) params.page = String(filters.page);
  // if (filters?.limit !== undefined) params.limit = String(filters.limit);
  // return apiClient.get<Meditation[]>(ENDPOINTS.MEDITATIONS, { params });
}

/**
 * Recupere une meditation par son identifiant.
 */
export async function getMeditationById(id: string): Promise<Meditation | null> {
  await delay(200);

  const meditation = mockMeditations.find((m) => m.id === id);
  return meditation ?? null;

  // --- Production ---
  // return apiClient.get<Meditation>(ENDPOINTS.MEDITATION_BY_ID(id));
}

/**
 * Ajoute ou retire un like sur une meditation.
 * Retourne le nouveau nombre de likes.
 */
export async function likeMeditation(id: string): Promise<{ likes: number; liked: boolean }> {
  await delay(200);

  const meditation = mockMeditations.find((m) => m.id === id);
  if (!meditation) {
    throw new Error('Meditation introuvable');
  }

  // Simule un toggle de like
  meditation.likes += 1;
  return { likes: meditation.likes, liked: true };

  // --- Production ---
  // return apiClient.post<{ likes: number; liked: boolean }>(ENDPOINTS.MEDITATION_LIKE(id));
}

/**
 * Cree une nouvelle meditation (reservee aux pasteurs et admins).
 */
export async function createMeditation(data: {
  titre: string;
  extrait: string;
  contenu: string;
  categorie: MeditationCategorie;
}): Promise<Meditation> {
  await delay(500);

  const newMeditation: Meditation = {
    id: `med_${Date.now()}`,
    titre: data.titre,
    extrait: data.extrait,
    contenu: data.contenu,
    categorie: data.categorie,
    auteurId: 'usr_001',
    auteurNom: 'Jean-Paul Mbarga',
    auteurRole: 'Responsable groupe de priere',
    thumbnailGradient: 'from-forest-700 to-forest-500',
    tempsLecture: Math.ceil(data.contenu.split(' ').length / 200),
    likes: 0,
    commentCount: 0,
    publishedAt: new Date().toISOString(),
  };

  mockMeditations.unshift(newMeditation);
  return newMeditation;

  // --- Production ---
  // return apiClient.post<Meditation>(ENDPOINTS.MEDITATIONS, data);
}
