'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Paroisse } from '@/types';

interface TenantState {
  paroisse: Paroisse | null;
  isConfigured: boolean;
  _hasHydrated: boolean;
  setParoisse: (paroisse: Paroisse) => void;
  clear: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      paroisse: null,
      isConfigured: false,
      _hasHydrated: false,

      setParoisse: (paroisse: Paroisse) => {
        set({ paroisse, isConfigured: true });
        persistTenantNative(paroisse);
      },

      clear: () => {
        set({ paroisse: null, isConfigured: false });
        clearTenantNative();
      },
    }),
    {
      name: 'diaspoeec-tenant',
      partialize: (state) => ({
        paroisse: state.paroisse,
        isConfigured: state.isConfigured,
      }),
    },
  ),
);

// Hydration tracking
if (typeof window !== 'undefined') {
  if (useTenantStore.persist.hasHydrated()) {
    useTenantStore.setState({ _hasHydrated: true });
  }
  useTenantStore.persist.onFinishHydration(() => {
    useTenantStore.setState({ _hasHydrated: true });
  });
}

// ============================================================================
// Native persistence (Capacitor)
// ============================================================================

function persistTenantNative(paroisse: Paroisse) {
  import('@capacitor/core').then(({ Capacitor }) => {
    if (!Capacitor.isNativePlatform()) return;
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.set({
        key: 'diaspoeec-tenant',
        value: JSON.stringify({ paroisse, isConfigured: true }),
      });
    });
  }).catch(() => {});
}

function clearTenantNative() {
  import('@capacitor/core').then(({ Capacitor }) => {
    if (!Capacitor.isNativePlatform()) return;
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.remove({ key: 'diaspoeec-tenant' });
    });
  }).catch(() => {});
}

export async function restoreTenantFromNative(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return false;
    const { Preferences } = await import('@capacitor/preferences');
    const { value } = await Preferences.get({ key: 'diaspoeec-tenant' });
    if (value) {
      const parsed = JSON.parse(value);
      if (parsed.paroisse && parsed.isConfigured) {
        localStorage.setItem('diaspoeec-tenant', JSON.stringify({
          state: { paroisse: parsed.paroisse, isConfigured: true },
          version: 0,
        }));
        useTenantStore.setState({
          paroisse: parsed.paroisse,
          isConfigured: true,
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
