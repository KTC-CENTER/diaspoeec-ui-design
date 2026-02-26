import type { Evenement, EventType } from '@/types';
import { mockEvenements } from '@/lib/mock/evenements.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Evenements API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

export interface EvenementFilters {
  type?: EventType;
  dateDebut?: string;
  dateFin?: string;
  recherche?: string;
  page?: number;
  limit?: number;
}

export interface RsvpPayload {
  participe: boolean;
  nombrePersonnes: number;
}

/**
 * Recupere la liste des evenements avec filtres optionnels.
 */
export async function getEvenements(filters?: EvenementFilters): Promise<Evenement[]> {
  await delay(300);

  let result = [...mockEvenements];

  if (filters?.type) {
    result = result.filter((e) => e.type === filters.type);
  }

  if (filters?.dateDebut) {
    const debut = new Date(filters.dateDebut).getTime();
    result = result.filter((e) => new Date(e.date).getTime() >= debut);
  }

  if (filters?.dateFin) {
    const fin = new Date(filters.dateFin).getTime();
    result = result.filter((e) => new Date(e.date).getTime() <= fin);
  }

  if (filters?.recherche) {
    const search = filters.recherche.toLowerCase();
    result = result.filter(
      (e) =>
        e.titre.toLowerCase().includes(search) ||
        e.lieu.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search),
    );
  }

  // Tri par date croissante (prochains evenements en premier)
  result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Ne retourner que les evenements actifs
  result = result.filter((e) => e.actif);

  // Pagination
  if (filters?.page !== undefined && filters?.limit !== undefined) {
    const start = filters.page * filters.limit;
    result = result.slice(start, start + filters.limit);
  }

  return result;

  // --- Production ---
  // const params: Record<string, string> = {};
  // if (filters?.type) params.type = filters.type;
  // if (filters?.dateDebut) params.dateDebut = filters.dateDebut;
  // if (filters?.dateFin) params.dateFin = filters.dateFin;
  // if (filters?.recherche) params.recherche = filters.recherche;
  // if (filters?.page !== undefined) params.page = String(filters.page);
  // if (filters?.limit !== undefined) params.limit = String(filters.limit);
  // return apiClient.get<Evenement[]>(ENDPOINTS.EVENEMENTS, { params });
}

/**
 * Recupere un evenement par son identifiant.
 */
export async function getEvenementById(id: string): Promise<Evenement | null> {
  await delay(200);

  const evenement = mockEvenements.find((e) => e.id === id);
  return evenement ?? null;

  // --- Production ---
  // return apiClient.get<Evenement>(ENDPOINTS.EVENEMENT_BY_ID(id));
}

/**
 * Inscription ou desinscription a un evenement.
 */
export async function rsvpEvenement(
  id: string,
  data: RsvpPayload,
): Promise<{ participantsInscrits: number; inscrit: boolean }> {
  await delay(300);

  const evenement = mockEvenements.find((e) => e.id === id);
  if (!evenement) {
    throw new Error('Evenement introuvable');
  }

  if (data.participe) {
    evenement.participantsInscrits += data.nombrePersonnes;
  } else {
    evenement.participantsInscrits = Math.max(
      0,
      evenement.participantsInscrits - data.nombrePersonnes,
    );
  }

  return {
    participantsInscrits: evenement.participantsInscrits,
    inscrit: data.participe,
  };

  // --- Production ---
  // return apiClient.post<{ participantsInscrits: number; inscrit: boolean }>(
  //   ENDPOINTS.EVENEMENT_RSVP(id),
  //   data,
  // );
}
