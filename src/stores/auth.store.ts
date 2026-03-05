'use client';

import { create } from 'zustand';
import { persist, type StateStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { setTokens, clearTokens } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  login: (user: User, accessToken: string, refreshToken: string, sessionId?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      login: (user: User, accessToken: string, refreshToken: string, sessionId?: string) => {
        setTokens(accessToken, refreshToken, sessionId);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        // Also persist auth state to Capacitor Preferences
        persistAuthNative(user);
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        clearAuthNative();
      },

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

// Robust hydration tracking using Zustand persist public API
if (typeof window !== 'undefined') {
  // If already hydrated (synchronous localStorage read)
  if (useAuthStore.persist.hasHydrated()) {
    useAuthStore.setState({ _hasHydrated: true });
  }
  // Listen for async hydration completion
  useAuthStore.persist.onFinishHydration(() => {
    useAuthStore.setState({ _hasHydrated: true });
  });
}

// ============================================================================
// Native persistence helpers (Capacitor Preferences)
// ============================================================================

function persistAuthNative(user: User) {
  import('@capacitor/core').then(({ Capacitor }) => {
    if (!Capacitor.isNativePlatform()) return;
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.set({
        key: 'diaspoeec-auth',
        value: JSON.stringify({ user, isAuthenticated: true }),
      });
    });
  }).catch(() => {});
}

function clearAuthNative() {
  import('@capacitor/core').then(({ Capacitor }) => {
    if (!Capacitor.isNativePlatform()) return;
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.remove({ key: 'diaspoeec-auth' });
    });
  }).catch(() => {});
}

/** Restore auth state from Capacitor Preferences into Zustand + localStorage */
export async function restoreAuthFromNative(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return false;
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: 'diaspoeec-auth' });
    if (value) {
      const parsed = JSON.parse(value);
      if (parsed.user && parsed.isAuthenticated) {
        // Restore to localStorage so Zustand persist can read it
        localStorage.setItem('diaspoeec-auth', JSON.stringify({
          state: { user: parsed.user, isAuthenticated: true },
          version: 0,
        }));
        // Also set in Zustand directly
        useAuthStore.setState({
          user: parsed.user,
          isAuthenticated: true,
          _hasHydrated: true,
        });
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
