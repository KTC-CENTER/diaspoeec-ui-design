import type { User, Don, SignalementModeration } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Admin API
// ============================================================================

export interface DashboardStats {
  totalMembres: number;
  membresActifs: number;
  nouveauxMembres: number;
  totalDons: number;
  donsMoisEnCours: number;
  donsMoisCount: number;
  montantTotalDons: number;
  totalEvenements: number;
  evenementsAVenir: number;
  totalMeditations: number;
  meditationsMoisEnCours: number;
  campagnesActives: number;
  signalementsEnAttente: number;
  repartitionPays: { pays: string; nombre: number }[];
  donsParCampagne: { campagne: string; montant: number }[];
  topDonateurs: { nom: string; montant: number; nbDons: number }[];
  methodePaiement: { methode: string; nombre: number; montant: number; pourcentage: number }[];
  actionsRecentes: { type: string; description: string; createdAt: string; montant?: number; devise?: string }[];
  evolutionMembres: { mois: string; nombre: number }[];
  evolutionDons: { mois: string; montant: number }[];
}

export interface MemberAdminFilters {
  role?: string;
  statut?: string;
  pays?: string;
  diaspora?: string;
  recherche?: string;
  page?: number;
  limit?: number;
}

export type ModerationAction = 'approuve' | 'supprime' | 'utilisateur_suspendu';

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>(ENDPOINTS.ADMIN.DASHBOARD);
}

export async function getMembersAdmin(filters?: MemberAdminFilters): Promise<{
  members: User[];
  total: number;
}> {
  const params: Record<string, string> = {};
  if (filters?.role) params.role = filters.role;
  if (filters?.statut) params.statut = filters.statut;
  if (filters?.pays) params.pays = filters.pays;
  if (filters?.diaspora) params.diaspora = filters.diaspora;
  if (filters?.recherche) params.recherche = filters.recherche;
  if (filters?.page !== undefined) params.page = String(filters.page);
  if (filters?.limit !== undefined) params.limit = String(filters.limit);
  return apiClient.get<{ members: User[]; total: number }>(ENDPOINTS.ADMIN.MEMBERS, { params });
}

export async function getDonsAdmin(): Promise<{
  dons: Don[];
  totalMontant: number;
  totalDonateurs: number;
}> {
  return apiClient.get<{ dons: Don[]; totalMontant: number; totalDonateurs: number }>(ENDPOINTS.ADMIN.DONS);
}

export async function getModeration(): Promise<SignalementModeration[]> {
  return apiClient.get<SignalementModeration[]>(ENDPOINTS.ADMIN.MODERATION);
}

export async function moderateItem(
  id: string,
  action: ModerationAction,
): Promise<SignalementModeration> {
  return apiClient.put<SignalementModeration>(ENDPOINTS.ADMIN.MODERATE_ITEM(id), { action });
}
