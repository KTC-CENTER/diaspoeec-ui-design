import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvenements, getEvenementById, rsvpEvenement, createEvenement, updateEvenement, deleteEvenement } from '@/lib/api/evenements.api';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { EventType, Comment } from '@/types';

export function useEvenements(type?: EventType) {
  return useQuery({
    queryKey: ['evenements', type],
    queryFn: async () => {
      return getEvenements(type ? { type } : undefined);
    },
  });
}

export function useEvenement(id: string) {
  return useQuery({
    queryKey: ['evenement', id],
    queryFn: async () => {
      return getEvenementById(id);
    },
  });
}

export function useRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { eventId: string; participe: boolean; nombrePersonnes: number }) => {
      const result = await rsvpEvenement(data.eventId, {
        participe: data.participe,
        nombrePersonnes: data.nombrePersonnes,
      });
      return { success: true, ...result };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evenement', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
    },
  });
}

export function useCreateEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvenement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
      queryClient.invalidateQueries({ queryKey: ['gestion-evenements'] });
    },
  });
}

export function useUpdateEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateEvenement>[1] }) => updateEvenement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
      queryClient.invalidateQueries({ queryKey: ['gestion-evenements'] });
    },
  });
}

export function useDeleteEvenement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvenement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
      queryClient.invalidateQueries({ queryKey: ['gestion-evenements'] });
    },
  });
}

export function useEventComments(evenementId: string) {
  return useQuery({
    queryKey: ['comments', evenementId],
    queryFn: async () => {
      return apiClient.get<Comment[]>(ENDPOINTS.COMMENTS_BY_TARGET('evenement', evenementId));
    },
    enabled: !!evenementId,
  });
}

export function useCreateEventComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { targetType: string; targetId: string; contenu: string; parentId?: string }) => {
      return apiClient.post<Comment>(ENDPOINTS.COMMENTS, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['evenement', variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['evenements'] });
    },
  });
}

export function useLikeComment() {
  return useMutation({
    mutationFn: async (commentId: string) => {
      return apiClient.post<{ liked: boolean; likes: number }>(ENDPOINTS.COMMENT_LIKE(commentId));
    },
  });
}
