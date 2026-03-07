import type { User, UserRole } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Members API
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
  dateNaissance?: string;
  sexe?: string;
  paroisseOrigine?: string;
  baptise?: boolean;
  ministeres?: string[];
  role?: UserRole;
  statut?: string;
}

export async function getMembers(filters?: MemberFilters): Promise<User[]> {
  const params: Record<string, string> = {};
  if (filters?.role) params.role = filters.role;
  if (filters?.statut) params.statut = filters.statut;
  if (filters?.ville) params.ville = filters.ville;
  if (filters?.pays) params.pays = filters.pays;
  if (filters?.recherche) params.recherche = filters.recherche;
  if (filters?.page !== undefined) params.page = String(filters.page);
  if (filters?.limit !== undefined) params.limit = String(filters.limit);
  return apiClient.get<User[]>(ENDPOINTS.MEMBERS, { params });
}

export async function getMemberById(id: string): Promise<User | null> {
  return apiClient.get<User>(ENDPOINTS.MEMBER_BY_ID(id));
}

export async function updateMember(id: string, data: UpdateMemberPayload): Promise<User> {
  return apiClient.put<User>(ENDPOINTS.MEMBER_BY_ID(id), data);
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>(ENDPOINTS.AUTH.ME);
}

export async function toggleFollowMember(id: string): Promise<{ following: boolean }> {
  return apiClient.post<{ following: boolean }>(ENDPOINTS.MEMBER_FOLLOW(id));
}

// ── Pasteurs ──

export interface CreatePasteurPayload {
  nomComplet: string;
  email: string;
  password: string;
}

export async function getPasteurs(): Promise<User[]> {
  return apiClient.get<User[]>(ENDPOINTS.PASTEURS_LIST);
}

export async function createPasteur(data: CreatePasteurPayload): Promise<User> {
  return apiClient.post<User>(ENDPOINTS.PASTEURS, data);
}

export async function removePasteur(id: string): Promise<User> {
  return apiClient.delete<User>(ENDPOINTS.PASTEUR_BY_ID(id));
}
