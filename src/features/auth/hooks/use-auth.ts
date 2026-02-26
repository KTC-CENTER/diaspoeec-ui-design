'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { mockUsers } from '@/lib/mock/users.mock';
import type { LoginFormData, RegisterFormData } from '@/features/auth/schemas/auth.schema';
import type { User } from '@/types';

// ============================================================================
// Demo accounts for quick login
// ============================================================================

export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@eec-diaspora.org',
    password: 'admin123',
    label: 'Admin',
    description: 'Tableau de bord administration',
  },
  pasteur: {
    email: 'emmanuel.ndongo@eec-diaspora.org',
    password: 'pasteur123',
    label: 'Pasteur',
    description: 'Gestion meditations & evenements',
  },
  responsable: {
    email: 'jeanne.atangana@eec-diaspora.org',
    password: 'resp123',
    label: 'Resp. Zone',
    description: 'Evenements & membres zone',
  },
  user: {
    email: 'jeanpaul.mbarga@email.com',
    password: 'user123',
    label: 'Utilisateur',
    description: 'Espace membre fidèle',
  },
} as const;

// ============================================================================
// Simulated API calls (to be replaced with real API)
// ============================================================================

async function simulateLogin(data: LoginFormData): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Check admin account
  if (data.email === DEMO_ACCOUNTS.admin.email && data.password === DEMO_ACCOUNTS.admin.password) {
    const adminUser = mockUsers.find((u) => u.role === 'admin');
    if (adminUser) return adminUser;
  }

  // Check pasteur account
  if (data.email === DEMO_ACCOUNTS.pasteur.email && data.password === DEMO_ACCOUNTS.pasteur.password) {
    const pasteurUser = mockUsers.find((u) => u.id === 'usr_002');
    if (pasteurUser) return pasteurUser;
  }

  // Check responsable zone account
  if (data.email === DEMO_ACCOUNTS.responsable.email && data.password === DEMO_ACCOUNTS.responsable.password) {
    const respUser = mockUsers.find((u) => u.id === 'usr_005');
    if (respUser) return respUser;
  }

  // Check user account
  if (data.email === DEMO_ACCOUNTS.user.email && data.password === DEMO_ACCOUNTS.user.password) {
    const normalUser = mockUsers.find((u) => u.id === 'usr_001');
    if (normalUser) return normalUser;
  }

  // Any other email/password combo: reject
  throw new Error('Email ou mot de passe incorrect');
}

async function simulateRegister(data: RegisterFormData): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (data.email === 'exists@test.com') {
    throw new Error('Un compte avec cet email existe déjà');
  }

  const baseUser = mockUsers[0];
  return {
    ...baseUser,
    id: `usr_new_${Date.now()}`,
    nomComplet: data.nomComplet,
    email: data.email,
    role: 'fidele',
  };
}

// ============================================================================
// useLogin Hook
// ============================================================================

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: simulateLogin,
    onSuccess: (user) => {
      login(user);
      if (user.role === 'admin') {
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
    mutationFn: simulateRegister,
    onSuccess: (user) => {
      login(user);
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
    logout();
    router.push('/login');
  };

  return { logout: handleLogout };
}
