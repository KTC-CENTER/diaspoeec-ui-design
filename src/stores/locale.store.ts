'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLocale = 'fr' | 'en' | 'de' | 'es';
export const DEFAULT_LOCALE: AppLocale = 'fr';
export const SUPPORTED_LOCALES: AppLocale[] = ['fr', 'en', 'de', 'es'];

interface LocaleState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale: AppLocale) => {
        set({ locale });
        // Update html lang attribute
        if (typeof document !== 'undefined') {
          document.documentElement.lang = locale;
        }
      },
    }),
    {
      name: 'diaspoeec-locale',
    }
  )
);
