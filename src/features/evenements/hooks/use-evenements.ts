import { useQuery, useMutation } from '@tanstack/react-query';
import { mockEvenements } from '@/lib/mock/evenements.mock';
import { delay } from '@/lib/api/client';
import type { EventType } from '@/types';

export function useEvenements(type?: EventType) {
  return useQuery({
    queryKey: ['evenements', type],
    queryFn: async () => {
      await delay(300);
      if (type) return mockEvenements.filter(e => e.type === type);
      return mockEvenements;
    },
  });
}

export function useEvenement(id: string) {
  return useQuery({
    queryKey: ['evenement', id],
    queryFn: async () => {
      await delay(200);
      return mockEvenements.find(e => e.id === id) ?? null;
    },
  });
}

export function useRSVP() {
  return useMutation({
    mutationFn: async (data: { eventId: string; participe: boolean; nombrePersonnes: number }) => {
      await delay(500);
      return { success: true };
    },
  });
}
