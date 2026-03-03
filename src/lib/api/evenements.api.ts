import type { Evenement, EventType } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Evenements API
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

export async function getEvenements(filters?: EvenementFilters): Promise<Evenement[]> {
  const params: Record<string, string> = {};
  if (filters?.type) params.type = filters.type;
  if (filters?.dateDebut) params.dateDebut = filters.dateDebut;
  if (filters?.dateFin) params.dateFin = filters.dateFin;
  if (filters?.recherche) params.recherche = filters.recherche;
  if (filters?.page !== undefined) params.page = String(filters.page);
  if (filters?.limit !== undefined) params.limit = String(filters.limit);
  return apiClient.get<Evenement[]>(ENDPOINTS.EVENEMENTS, { params });
}

export async function getEvenementById(id: string): Promise<Evenement | null> {
  return apiClient.get<Evenement>(ENDPOINTS.EVENEMENT_BY_ID(id));
}

export async function rsvpEvenement(
  id: string,
  data: RsvpPayload,
): Promise<{ participantsInscrits: number; inscrit: boolean }> {
  return apiClient.post<{ participantsInscrits: number; inscrit: boolean }>(
    ENDPOINTS.EVENEMENT_RSVP(id),
    data,
  );
}

export async function createEvenement(data: {
  titre: string;
  type: EventType;
  date: string;
  heureFin?: string;
  lieu: string;
  lienZoom?: string;
  description: string;
  programme?: { heure: string; description: string }[];
  maxParticipants?: number;
}): Promise<Evenement> {
  return apiClient.post<Evenement>(ENDPOINTS.EVENEMENTS, data);
}

export async function updateEvenement(id: string, data: {
  titre?: string;
  type?: EventType;
  date?: string;
  heureFin?: string;
  lieu?: string;
  lienZoom?: string;
  description?: string;
  programme?: { heure: string; description: string }[];
  maxParticipants?: number;
  actif?: boolean;
}): Promise<Evenement> {
  return apiClient.put<Evenement>(ENDPOINTS.EVENEMENT_BY_ID(id), data);
}

export async function deleteEvenement(id: string): Promise<void> {
  return apiClient.delete(ENDPOINTS.EVENEMENT_BY_ID(id));
}
