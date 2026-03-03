import type { Don, Devise, Frequence, MethodePaiement } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Dons API
// ============================================================================

export interface CreateDonPayload {
  montant: number;
  devise: Devise;
  frequence: Frequence;
  methodePaiement: MethodePaiement;
  campagneId: string;
  campagneNom: string;
  message?: string;
  estAnonyme?: boolean;
}

export async function getDons(): Promise<Don[]> {
  return apiClient.get<Don[]>(ENDPOINTS.DONS);
}

export async function createDon(data: CreateDonPayload): Promise<Don> {
  return apiClient.post<Don>(ENDPOINTS.DONS, data);
}

export async function getDonHistory(): Promise<Don[]> {
  return apiClient.get<Don[]>(ENDPOINTS.DON_HISTORY);
}

export async function getSubscriptions(): Promise<Don[]> {
  return apiClient.get<Don[]>(ENDPOINTS.DON_SUBSCRIPTIONS);
}
