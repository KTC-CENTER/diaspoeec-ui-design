import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMeditations, getMeditationById, likeMeditation, bookmarkMeditation, createMeditation, updateMeditation, deleteMeditation } from '@/lib/api/meditations.api';
import { toggleFollowMember } from '@/lib/api/members.api';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { MeditationCategorie, Comment } from '@/types';

export function useMeditations(categorie?: string) {
  return useQuery({
    queryKey: ['meditations', categorie],
    queryFn: async () => {
      if (!categorie || categorie === 'toutes') {
        return getMeditations();
      }
      return getMeditations({ categorie: categorie as MeditationCategorie });
    },
  });
}

export function useMeditation(id: string) {
  return useQuery({
    queryKey: ['meditation', id],
    queryFn: async () => {
      const meditation = await getMeditationById(id);
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
    }: {
      meditationId: string;
      liked: boolean;
    }) => {
      const result = await likeMeditation(meditationId);
      return { meditationId, ...result };
    },
    onSuccess: ({ meditationId, likes }) => {
      queryClient.setQueryData(
        ['meditation', meditationId],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          return { ...old as object, likes };
        }
      );
    },
  });
}

export function useBookmarkMeditation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meditationId }: { meditationId: string }) => {
      const result = await bookmarkMeditation(meditationId);
      return { meditationId, ...result };
    },
    onSuccess: ({ meditationId, bookmarked }) => {
      queryClient.setQueryData(
        ['meditation', meditationId],
        (old: unknown) => {
          if (!old || typeof old !== 'object') return old;
          return { ...old as object, userBookmarked: bookmarked };
        }
      );
    },
  });
}

export function useFollowAuteur() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ auteurId }: { auteurId: string }) => {
      const result = await toggleFollowMember(auteurId);
      return { auteurId, ...result };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditation'] });
    },
  });
}

export function useComments(meditationId: string) {
  return useQuery({
    queryKey: ['comments', meditationId],
    queryFn: async () => {
      return apiClient.get<Comment[]>(ENDPOINTS.COMMENTS_BY_TARGET('meditation', meditationId));
    },
    enabled: !!meditationId,
  });
}

export function useCreateMeditation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeditation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditations'] });
      queryClient.invalidateQueries({ queryKey: ['gestion-meditations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-meditations'] });
    },
  });
}

export function useUpdateMeditation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { titre?: string; extrait?: string; contenu?: string; categorie?: MeditationCategorie } }) => updateMeditation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditations'] });
      queryClient.invalidateQueries({ queryKey: ['gestion-meditations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-meditations'] });
    },
  });
}

export function useDeleteMeditation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeditation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditations'] });
      queryClient.invalidateQueries({ queryKey: ['gestion-meditations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-meditations'] });
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { targetType: string; targetId: string; contenu: string; parentId?: string }) => {
      return apiClient.post<Comment>(ENDPOINTS.COMMENTS, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['meditation', variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['meditations'] });
    },
  });
}
