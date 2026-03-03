import type { Campagne } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export interface CreateCampagnePayload {
  titre: string;
  description: string;
  objectifMontant: number;
  affectationFonds: string[];
  dateDebut: string;
  dateFin?: string;
  statut?: 'active' | 'terminee' | 'pausee';
}

export async function createCampagne(data: CreateCampagnePayload): Promise<Campagne> {
  return apiClient.post<Campagne>(ENDPOINTS.CAMPAGNES, data);
}

export async function updateCampagne(
  id: string,
  data: Partial<CreateCampagnePayload>,
): Promise<Campagne> {
  return apiClient.patch<Campagne>(ENDPOINTS.CAMPAGNE_BY_ID(id), data);
}
