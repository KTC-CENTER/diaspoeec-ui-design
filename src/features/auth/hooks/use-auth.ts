'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { apiClient, clearTokens } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { LoginFormData, RegisterFormData } from '@/features/auth/schemas/auth.schema';
import type { User } from '@/types';

// ============================================================================
// Demo accounts for quick login (kept for convenience)
// ============================================================================

export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@eec-diaspora.org',
    password: 'Admin123!',
    label: 'Admin',
    description: 'Tableau de bord administration',
  },
  pasteur: {
    email: 'emmanuel.ndongo@eec-diaspora.org',
    password: 'Pasteur123!',
    label: 'Pasteur',
    description: 'Gestion meditations & evenements',
  },
  responsable: {
    email: 'jeanne.atangana@eec-diaspora.org',
    password: 'Resp123!',
    label: 'Resp. Zone',
    description: 'Evenements & membres zone',
  },
  user: {
    email: 'jeanpaul.mbarga@email.com',
    password: 'User123!',
    label: 'Utilisateur',
    description: 'Espace membre fidele',
  },
} as const;

// ============================================================================
// API Types
// ============================================================================

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ============================================================================
// API calls
// ============================================================================

async function apiLogin(data: LoginFormData): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
    email: data.email,
    password: data.password,
  });
}

async function apiRegister(data: RegisterFormData): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
    nomComplet: data.nomComplet,
    email: data.email,
    password: data.password,
  });
}

// ============================================================================
// useLogin Hook
// ============================================================================

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: apiLogin,
    onSuccess: (response) => {
      login(response.user, response.accessToken, response.refreshToken);
      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/accueil');
      }
    },
  });
}

// ============================================================================
// useRegister Hook
// ============================================================================

export function useRegister() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: apiRegister,
    onSuccess: (response) => {
      login(response.user, response.accessToken, response.refreshToken);
      router.push('/onboarding/identity');
    },
  });
}

// ============================================================================
// useLogout Hook
// ============================================================================

export function useLogout() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    clearTokens();
    logout();
    router.push('/login');
  };

  return { logout: handleLogout };
}
