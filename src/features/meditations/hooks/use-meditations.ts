import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockMeditations } from '@/lib/mock/meditations.mock';
import { mockComments } from '@/lib/mock/comments.mock';
import { delay } from '@/lib/utils/format';
import type { MeditationCategorie } from '@/types';

export function useMeditations(categorie?: string) {
  return useQuery({
    queryKey: ['meditations', categorie],
    queryFn: async () => {
      await delay(300);
      if (!categorie || categorie === 'toutes') {
        return mockMeditations;
      }
      return mockMeditations.filter(
        (m) => m.categorie === (categorie as MeditationCategorie)
      );
    },
  });
}

export function useMeditation(id: string) {
  return useQuery({
    queryKey: ['meditation', id],
    queryFn: async () => {
      await delay(200);
      const meditation = mockMeditations.find((m) => m.id === id);
      if (!meditation) {
        throw new Error('Meditation introuvable');
      }
      return meditation;
    },
    enabled: !!id,
  });
}

export function useLikeMeditation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      meditationId,
      liked,
    }: {
      meditationId: string;
      liked: boolean;
    }) => {
      await delay(150);
      return { meditationId, liked };
    },
    onSuccess: ({ meditationId, liked }) => {
      queryClient.setQueryData(
        ['meditation', meditationId],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          const existing = old as { likes: number };
          return {
            ...existing,
            likes: liked ? existing.likes + 1 : existing.likes - 1,
          };
        }
      );
    },
  });
}

export function useComments(meditationId: string) {
  return useQuery({
    queryKey: ['comments', meditationId],
    queryFn: async () => {
      await delay(200);
      return mockComments[meditationId] || [];
    },
    enabled: !!meditationId,
  });
}
