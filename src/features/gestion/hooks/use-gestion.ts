'use client';

import { useQuery } from '@tanstack/react-query';
import { mockMeditations } from '@/lib/mock/meditations.mock';
import { mockEvenements } from '@/lib/mock/evenements.mock';
import { mockUsers } from '@/lib/mock/users.mock';
import type { Meditation, Evenement, User } from '@/types';

// Fetch meditations by auteur
async function fetchMyMeditations(auteurId: string): Promise<Meditation[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockMeditations.filter((m) => m.auteurId === auteurId);
}

// Fetch all evenements
async function fetchAllEvenements(): Promise<Evenement[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockEvenements;
}

// Fetch zone members (fideles)
async function fetchZoneMembers(): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockUsers.filter((u) => u.role === 'fidele');
}

export function useMyMeditations(auteurId: string) {
  return useQuery({
    queryKey: ['gestion', 'meditations', auteurId],
    queryFn: () => fetchMyMeditations(auteurId),
    enabled: !!auteurId,
  });
}

export function useAllEvenements() {
  return useQuery({
    queryKey: ['gestion', 'evenements'],
    queryFn: fetchAllEvenements,
  });
}

export function useZoneMembers() {
  return useQuery({
    queryKey: ['gestion', 'membres'],
    queryFn: fetchZoneMembers,
  });
}
