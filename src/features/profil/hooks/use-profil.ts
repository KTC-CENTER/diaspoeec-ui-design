'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { updateMember, getCurrentUser } from '@/lib/api/members.api';
import { getBibleStats } from '@/lib/api/bible.api';
import type { User } from '@/types';

export function useProfile() {
  const { user, updateUser } = useAuthStore();

  // Synchronise le store avec les données fraîches du backend.
  // Couvre le cas où le store est désynchronisé après l'onboarding.
  useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const fresh = await getCurrentUser();
      updateUser(fresh);
      return fresh;
    },
    staleTime: 30_000,
    retry: false,
  });

  return {
    user,
    isLoading: false,
  };
}

export function useProfileStats() {
  return useQuery({
    queryKey: ['profile-bible-stats'],
    queryFn: getBibleStats,
  });
}

export function useUpdateProfile() {
  const { user, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      if (!user) throw new Error('Non authentifie');
      return updateMember(user.id, data);
    },
    onSuccess: (data) => {
      updateUser(data);
    },
  });
}
