'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

// Mock current user for development
const MOCK_CURRENT_USER: User = {
  id: 'usr_001',
  nomComplet: 'Jean-Paul Mbarga',
  email: 'jean-paul.mbarga@email.com',
  emailVerified: true,
  avatarUrl: '/images/avatars/default-male.svg',
  dateNaissance: '1988-03-15',
  sexe: 'homme',
  telephone: '+33612345678',
  telephoneCountryCode: '+33',
  typeDiaspora: 'professionnelle',
  paysResidence: 'France',
  ville: 'Paris',
  paroisseOrigine: 'Paroisse de Bonanjo - Douala',
  baptise: true,
  dateBapteme: '2002-06-23',
  ministeres: ['chorale', 'jeunesse'],
  role: 'fidele',
  statut: 'actif',
  donsEffectues: 12,
  evenementsSuivis: 8,
  jaimesTotal: 45,
  createdAt: '2024-01-15T10:00:00Z',
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (data: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'diaspoeec-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
