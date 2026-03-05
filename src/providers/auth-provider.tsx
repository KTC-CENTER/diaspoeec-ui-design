'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { getToken, getRefreshToken, setTokens } from '@/lib/api/client';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  // On mount: validate token, refresh if expired
  useEffect(() => {
    const validate = async () => {
      const { isAuthenticated, logout, updateUser } = useAuthStore.getState();
      if (!isAuthenticated) return;

      const token = getToken();
      const refreshToken = getRefreshToken();

      if (!token && !refreshToken) {
        logout();
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

      try {
        let res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Token expired → try refresh
        if (res.status === 401 && refreshToken) {
          const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const json = await refreshRes.json();
            const data = json?.data ?? json;
            if (data.accessToken && data.refreshToken) {
              setTokens(data.accessToken, data.refreshToken);
              res = await fetch(`${API_BASE}/api/v1/auth/me`, {
                headers: { Authorization: `Bearer ${data.accessToken}` },
              });
            }
          }
        }

        if (res.ok) {
          const json = await res.json();
          const userData = json?.data ?? json;
          updateUser(userData);
        } else {
          logout();
        }
      } catch {
        // Network error (offline) — keep current state
      }
    };

    validate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
