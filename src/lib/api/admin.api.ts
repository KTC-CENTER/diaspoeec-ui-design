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

export async function reactivateUser(id: string): Promise<void> {
  return apiClient.put(ENDPOINTS.ADMIN.MEMBER_REACTIVATE(id), {});
}

// ── Settings ──

export interface AppSettingsData {
  id: string;
  nomCommunaute: string;
  langueDefaut: string;
  fuseauHoraire: string;
  modeMaintenance: boolean;
  notificationsPush: boolean;
  emailBienvenue: boolean;
  rappelsEvenements: boolean;
  resumeHebdomadaire: boolean;
  doubleAuthentification: boolean;
  dureeSession: string;
  inscriptionsOuvertes: boolean;
  deviseDefaut: string;
  recusAutomatiques: boolean;
}

export async function getSettings(): Promise<AppSettingsData> {
  return apiClient.get<AppSettingsData>(ENDPOINTS.ADMIN.SETTINGS);
}

export async function updateSettings(data: Partial<AppSettingsData>): Promise<AppSettingsData> {
  // Strip the id field — the DTO doesn't accept it
  const { id, ...payload } = data as AppSettingsData;
  return apiClient.put<AppSettingsData>(ENDPOINTS.ADMIN.SETTINGS, payload);
}

// ── Paroisses (admin) ──

export interface ParoisseData {
  id: string;
  slug: string;
  code: string;
  label: string;
  ville?: string;
  synode?: string;
  region?: string;
  pasteurNom?: string;
  messageAccueil?: string;
  logoUrl?: string;
  splashImageUrl?: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  couleurAccent: string;
  actif: boolean;
  createdAt: string;
  pasteur?: { id: string; email: string; nomComplet: string };
}

export interface CreateParoissePayload {
  slug: string;
  code: string;
  label: string;
  ville?: string;
  synode?: string;
  region?: string;
  pasteurNom?: string;
  messageAccueil?: string;
  couleurPrimaire?: string;
  couleurSecondaire?: string;
  couleurAccent?: string;
  pasteurEmail: string;
  pasteurPassword: string;
}

export async function getParoissesAdmin(): Promise<ParoisseData[]> {
  return apiClient.get<ParoisseData[]>(ENDPOINTS.ADMIN.PAROISSES);
}

export async function createParoisse(data: CreateParoissePayload): Promise<ParoisseData> {
  return apiClient.post<ParoisseData>(ENDPOINTS.ADMIN.PAROISSES, data);
}

export async function updateParoisse(id: string, data: Partial<{
  slug: string; code: string; label: string; ville: string; synode: string; region: string;
  pasteurNom: string; messageAccueil: string; couleurPrimaire: string; couleurSecondaire: string;
  couleurAccent: string; actif: boolean;
}>): Promise<ParoisseData> {
  return apiClient.put<ParoisseData>(ENDPOINTS.ADMIN.PAROISSE_BY_ID(id), data);
}

export async function deleteParoisse(id: string): Promise<void> {
  return apiClient.delete(ENDPOINTS.ADMIN.PAROISSE_BY_ID(id));
}

// ── Paroisses (public) ──

export async function getParoissesPublic(): Promise<ParoisseData[]> {
  return apiClient.get<ParoisseData[]>(ENDPOINTS.PAROISSES);
}
