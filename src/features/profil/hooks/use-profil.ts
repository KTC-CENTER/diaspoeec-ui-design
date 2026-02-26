'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { delay } from '@/lib/api/client';
import type { User } from '@/types';

export function useProfile() {
  const { user } = useAuthStore();
  return {
    user,
    isLoading: false,
  };
}

export function useUpdateProfile() {
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      await delay(800);
      return data;
    },
    onSuccess: (data) => {
      updateUser(data);
    },
  });
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      await delay(200);
      return {
        meditationsLues: 24,
        tempsLectureTotal: 180, // minutes
        serieActuelle: 5, // jours consecutifs
        versetsFavoris: 12,
      };
    },
  });
}
