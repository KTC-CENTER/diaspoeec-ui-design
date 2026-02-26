import type { Don, Devise, Frequence, MethodePaiement } from '@/types';
import { mockDons } from '@/lib/mock/dons.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Dons API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
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

/**
 * Recupere la liste de tous les dons (admin) ou les dons de l'utilisateur courant.
 */
export async function getDons(): Promise<Don[]> {
  await delay(300);

  return [...mockDons].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // --- Production ---
  // return apiClient.get<Don[]>(ENDPOINTS.DONS);
}

/**
 * Cree un nouveau don.
 * Retourne le don cree avec son identifiant et sa reference.
 */
export async function createDon(data: CreateDonPayload): Promise<Don> {
  await delay(500);

  const newDon: Don = {
    id: `don_${Date.now()}`,
    donateurId: data.estAnonyme ? undefined : 'usr_001',
    donateurNom: data.estAnonyme ? undefined : 'Jean-Paul Mbarga',
    estAnonyme: data.estAnonyme ?? false,
    campagneId: data.campagneId,
    campagneNom: data.campagneNom,
    montant: data.montant,
    devise: data.devise,
    frequence: data.frequence,
    message: data.message,
    methodePaiement: data.methodePaiement,
    recuDisponible: false,
    createdAt: new Date().toISOString(),
  };

  mockDons.unshift(newDon);
  return newDon;

  // --- Production ---
  // return apiClient.post<Don>(ENDPOINTS.DONS, data);
}

/**
 * Recupere l'historique des dons de l'utilisateur courant.
 */
export async function getDonHistory(): Promise<Don[]> {
  await delay(300);

  const currentUserId = 'usr_001';
  return mockDons
    .filter((d) => d.donateurId === currentUserId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // --- Production ---
  // return apiClient.get<Don[]>(ENDPOINTS.DON_HISTORY);
}

/**
 * Recupere les abonnements (dons mensuels recurrents) de l'utilisateur courant.
 */
export async function getSubscriptions(): Promise<Don[]> {
  await delay(300);

  const currentUserId = 'usr_001';
  return mockDons
    .filter((d) => d.donateurId === currentUserId && d.frequence === 'mensuel')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // --- Production ---
  // return apiClient.get<Don[]>(ENDPOINTS.DON_SUBSCRIPTIONS);
}
