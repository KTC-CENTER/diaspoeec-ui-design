'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore, type AppLocale } from '@/stores/locale.store';
import { useEffect } from 'react';

import fr from '@/messages/fr.json';
import en from '@/messages/en.json';
import de from '@/messages/de.json';
import es from '@/messages/es.json';

const messages: Record<AppLocale, typeof fr> = { fr, en, de, es };

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);

  // Sync html lang attribute on mount and locale change
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Europe/Paris">
      {children}
    </NextIntlClientProvider>
  );
}
