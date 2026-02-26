'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'light',

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setMobileMenuOpen: (open: boolean) =>
        set({ mobileMenuOpen: open }),

      toggleMobileMenu: () =>
        set((state) => ({
          mobileMenuOpen: !state.mobileMenuOpen,
        })),

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
    }),
    {
      name: 'diaspoeec-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync dark class on page load from persisted theme
        if (state?.theme === 'dark' && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
