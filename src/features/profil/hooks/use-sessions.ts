'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export interface Session {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ipAddress: string | null;
  lastActiveAt: string;
  createdAt: string;
  current: boolean;
}

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => apiClient.get<Session[]>(ENDPOINTS.AUTH.SESSIONS),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      apiClient.delete(ENDPOINTS.AUTH.SESSION_BY_ID(sessionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete(ENDPOINTS.AUTH.SESSIONS),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
