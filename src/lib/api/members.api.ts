import type { User, UserRole } from '@/types';
import { mockUsers, mockCurrentUser } from '@/lib/mock/users.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Members API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

export interface MemberFilters {
  role?: UserRole;
  statut?: 'actif' | 'inactif';
  ville?: string;
  pays?: string;
  recherche?: string;
  page?: number;
  limit?: number;
}

export interface UpdateMemberPayload {
  nomComplet?: string;
  telephone?: string;
  telephoneCountryCode?: string;
  ville?: string;
  paysResidence?: string;
  typeDiaspora?: User['typeDiaspora'];
  avatarUrl?: string;
}

/**
 * Recupere la liste des membres avec filtres optionnels.
 */
export async function getMembers(filters?: MemberFilters): Promise<User[]> {
  await delay(300);

  let result = [...mockUsers];

  if (filters?.role) {
    result = result.filter((u) => u.role === filters.role);
  }

  if (filters?.statut) {
    result = result.filter((u) => u.statut === filters.statut);
  }

  if (filters?.ville) {
    result = result.filter((u) => u.ville.toLowerCase() === filters.ville!.toLowerCase());
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
        u.ville.toLowerCase().includes(search) ||
        u.paroisseOrigine.toLowerCase().includes(search),
    );
  }

  // Tri par nom
  result.sort((a, b) => a.nomComplet.localeCompare(b.nomComplet));

  // Pagination
  if (filters?.page !== undefined && filters?.limit !== undefined) {
    const start = filters.page * filters.limit;
    result = result.slice(start, start + filters.limit);
  }

  return result;

  // --- Production ---
  // const params: Record<string, string> = {};
  // if (filters?.role) params.role = filters.role;
  // if (filters?.statut) params.statut = filters.statut;
  // if (filters?.ville) params.ville = filters.ville;
  // if (filters?.pays) params.pays = filters.pays;
  // if (filters?.recherche) params.recherche = filters.recherche;
  // if (filters?.page !== undefined) params.page = String(filters.page);
  // if (filters?.limit !== undefined) params.limit = String(filters.limit);
  // return apiClient.get<User[]>(ENDPOINTS.MEMBERS, { params });
}

/**
 * Recupere un membre par son identifiant.
 */
export async function getMemberById(id: string): Promise<User | null> {
  await delay(200);

  const member = mockUsers.find((u) => u.id === id);
  return member ?? null;

  // --- Production ---
  // return apiClient.get<User>(ENDPOINTS.MEMBER_BY_ID(id));
}

/**
 * Met a jour les informations d'un membre.
 */
export async function updateMember(id: string, data: UpdateMemberPayload): Promise<User> {
  await delay(400);

  const memberIndex = mockUsers.findIndex((u) => u.id === id);
  if (memberIndex === -1) {
    throw new Error('Membre introuvable');
  }

  const updatedMember = { ...mockUsers[memberIndex], ...data };
  mockUsers[memberIndex] = updatedMember;
  return updatedMember;

  // --- Production ---
  // return apiClient.put<User>(ENDPOINTS.MEMBER_BY_ID(id), data);
}

/**
 * Recupere les informations de l'utilisateur actuellement connecte.
 */
export async function getCurrentUser(): Promise<User> {
  await delay(200);

  return { ...mockCurrentUser };

  // --- Production ---
  // return apiClient.get<User>(ENDPOINTS.AUTH.ME);
}
