import type { User, Don, SignalementModeration } from '@/types';
import { mockUsers } from '@/lib/mock/users.mock';
import { mockDons } from '@/lib/mock/dons.mock';
import { mockCampagnes } from '@/lib/mock/campagnes.mock';
import { mockMeditations } from '@/lib/mock/meditations.mock';
import { mockEvenements } from '@/lib/mock/evenements.mock';
import { mockSignalements } from '@/lib/mock/moderation.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Admin API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

export interface DashboardStats {
  totalMembres: number;
  membresActifs: number;
  totalDons: number;
  donsMoisEnCours: number;
  totalEvenements: number;
  evenementsAVenir: number;
  totalMeditations: number;
  meditationsMoisEnCours: number;
  campagnesActives: number;
  repartitionPays: { pays: string; nombre: number }[];
  evolutionMembres: { mois: string; nombre: number }[];
  evolutionDons: { mois: string; montant: number }[];
}

export interface MemberAdminFilters {
  role?: string;
  statut?: string;
  pays?: string;
  recherche?: string;
  page?: number;
  limit?: number;
}

export type ModerationAction = 'approuve' | 'supprime' | 'utilisateur_suspendu';

/**
 * Recupere les statistiques du tableau de bord administrateur.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(400);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const donsMoisEnCours = mockDons
    .filter((d) => {
      const date = new Date(d.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + d.montant, 0);

  const meditationsMoisEnCours = mockMeditations.filter((m) => {
    const date = new Date(m.publishedAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const evenementsAVenir = mockEvenements.filter(
    (e) => new Date(e.date).getTime() > now.getTime() && e.actif,
  ).length;

  const campagnesActives = mockCampagnes.filter((c) => c.statut === 'active').length;

  // Repartition par pays
  const paysMap = new Map<string, number>();
  mockUsers.forEach((u) => {
    const count = paysMap.get(u.paysResidence) || 0;
    paysMap.set(u.paysResidence, count + 1);
  });
  const repartitionPays = Array.from(paysMap.entries())
    .map(([pays, nombre]) => ({ pays, nombre }))
    .sort((a, b) => b.nombre - a.nombre);

  // Evolution des membres (6 derniers mois)
  const evolutionMembres = [
    { mois: 'Sep 2025', nombre: 42 },
    { mois: 'Oct 2025', nombre: 48 },
    { mois: 'Nov 2025', nombre: 55 },
    { mois: 'Dec 2025', nombre: 61 },
    { mois: 'Jan 2026', nombre: 72 },
    { mois: 'Fev 2026', nombre: mockUsers.length },
  ];

  // Evolution des dons (6 derniers mois)
  const evolutionDons = [
    { mois: 'Sep 2025', montant: 3200 },
    { mois: 'Oct 2025', montant: 4100 },
    { mois: 'Nov 2025', montant: 3800 },
    { mois: 'Dec 2025', montant: 6500 },
    { mois: 'Jan 2026', montant: 5200 },
    { mois: 'Fev 2026', montant: donsMoisEnCours },
  ];

  return {
    totalMembres: mockUsers.length,
    membresActifs: mockUsers.filter((u) => u.statut === 'actif').length,
    totalDons: mockDons.reduce((sum, d) => sum + d.montant, 0),
    donsMoisEnCours,
    totalEvenements: mockEvenements.length,
    evenementsAVenir,
    totalMeditations: mockMeditations.length,
    meditationsMoisEnCours,
    campagnesActives,
    repartitionPays,
    evolutionMembres,
    evolutionDons,
  };

  // --- Production ---
  // return apiClient.get<DashboardStats>(ENDPOINTS.ADMIN.DASHBOARD);
}

/**
 * Recupere la liste des membres pour l'administration.
 */
export async function getMembersAdmin(filters?: MemberAdminFilters): Promise<{
  members: User[];
  total: number;
}> {
  await delay(300);

  let result = [...mockUsers];

  if (filters?.role) {
    result = result.filter((u) => u.role === filters.role);
  }

  if (filters?.statut) {
    result = result.filter((u) => u.statut === filters.statut);
  }

  if (filters?.pays) {
    result = result.filter((u) => u.paysResidence === filters.pays);
  }

  if (filters?.recherche) {
    const search = filters.recherche.toLowerCase();
    result = result.filter(
      (u) =>
        u.nomComplet.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.ville.toLowerCase().includes(search),
    );
  }

  const total = result.length;

  // Pagination
  if (filters?.page !== undefined && filters?.limit !== undefined) {
    const start = filters.page * filters.limit;
    result = result.slice(start, start + filters.limit);
  }

  return { members: result, total };

  // --- Production ---
  // const params: Record<string, string> = {};
  // if (filters?.role) params.role = filters.role;
  // if (filters?.statut) params.statut = filters.statut;
  // if (filters?.pays) params.pays = filters.pays;
  // if (filters?.recherche) params.recherche = filters.recherche;
  // if (filters?.page !== undefined) params.page = String(filters.page);
  // if (filters?.limit !== undefined) params.limit = String(filters.limit);
  // return apiClient.get<{ members: User[]; total: number }>(ENDPOINTS.ADMIN.MEMBERS, { params });
}

/**
 * Recupere les statistiques des dons pour l'administration.
 */
export async function getDonsAdmin(): Promise<{
  dons: Don[];
  totalMontant: number;
  totalDonateurs: number;
}> {
  await delay(300);

  const dons = [...mockDons].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalMontant = dons.reduce((sum, d) => sum + d.montant, 0);

  const donateursUniques = new Set(dons.filter((d) => d.donateurId).map((d) => d.donateurId));
  const totalDonateurs = donateursUniques.size;

  return { dons, totalMontant, totalDonateurs };

  // --- Production ---
  // return apiClient.get<{ dons: Don[]; totalMontant: number; totalDonateurs: number }>(
  //   ENDPOINTS.ADMIN.DONS,
  // );
}

/**
 * Recupere les signalements en attente de moderation.
 */
export async function getModeration(): Promise<SignalementModeration[]> {
  await delay(300);

  return [...mockSignalements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // --- Production ---
  // return apiClient.get<SignalementModeration[]>(ENDPOINTS.ADMIN.MODERATION);
}

/**
 * Effectue une action de moderation sur un signalement.
 */
export async function moderateItem(
  id: string,
  action: ModerationAction,
): Promise<SignalementModeration> {
  await delay(400);

  const signalement = mockSignalements.find((s) => s.id === id);
  if (!signalement) {
    throw new Error('Signalement introuvable');
  }

  signalement.statut = action;
  return { ...signalement };

  // --- Production ---
  // return apiClient.put<SignalementModeration>(ENDPOINTS.ADMIN.MODERATE_ITEM(id), { action });
}
