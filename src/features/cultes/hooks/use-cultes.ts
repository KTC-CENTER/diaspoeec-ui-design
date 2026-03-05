import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideos, getServicesAVenir, toggleRappel, toggleVideoLike, getVideoById, createVideo, updateVideo, deleteVideo } from '@/lib/api/cultes.api';
import type { CreateVideoPayload } from '@/lib/api/cultes.api';

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: getVideos,
  });
}

export function useVideoById(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id),
    enabled: !!id,
    // Polling toutes les 30s si le video est en live (mise a jour spectateursLive)
    refetchInterval: (query) =>
      query.state.data?.type === 'live' ? 30_000 : false,
  });
}

export function useServicesAVenir() {
  return useQuery({
    queryKey: ['services-a-venir'],
    queryFn: getServicesAVenir,
  });
}

export function useToggleRappel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleRappel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-a-venir'] });
    },
  });
}

export function useToggleVideoLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleVideoLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['favoris'] });
    },
  });
}

export function useCreateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVideoPayload) => createVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    },
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVideoPayload> }) =>
      updateVideo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    },
  });
}

export function useDeleteVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    },
  });
}
