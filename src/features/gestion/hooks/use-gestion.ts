'use client';

import { useQuery } from '@tanstack/react-query';
import { getMeditations } from '@/lib/api/meditations.api';
import { getEvenements } from '@/lib/api/evenements.api';
import { getMembers } from '@/lib/api/members.api';
import type { Meditation, Evenement, User } from '@/types';

export function useMyMeditations(auteurId: string) {
  return useQuery({
    queryKey: ['gestion', 'meditations', auteurId],
    queryFn: () => getMeditations({ auteurId }),
    enabled: !!auteurId,
  });
}

export function useAllEvenements() {
  return useQuery({
    queryKey: ['gestion', 'evenements'],
    queryFn: () => getEvenements(),
  });
}

export function useZoneMembers() {
  return useQuery({
    queryKey: ['gestion', 'membres'],
    queryFn: () => getMembers({ role: 'fidele' }),
  });
}
