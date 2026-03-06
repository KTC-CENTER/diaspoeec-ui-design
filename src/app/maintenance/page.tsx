'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ENDPOINTS } from '@/lib/api/endpoints';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function MaintenancePage() {
  const router = useRouter();
  const t = useTranslations('maintenance');

  const checkMaintenance = useCallback(async () => {
    try {
      // Use raw fetch to avoid the 503 interceptor in apiClient
      const res = await fetch(`${API_BASE}${ENDPOINTS.PAROISSES}`);
      if (res.ok) {
        // Maintenance is over — send user to login
        router.replace('/login');
      }
    } catch {
      // Network error or still in maintenance
    }
  }, [router]);

  useEffect(() => {
    // Check immediately on mount (handles page refresh)
    checkMaintenance();

    // Then poll every 15s
    const interval = setInterval(checkMaintenance, 15_000);
    return () => clearInterval(interval);
  }, [checkMaintenance]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-600/10">
          <Wrench className="h-10 w-10 text-gold-600" />
        </div>

        <h1
          className="mb-3 text-2xl font-bold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('title')}
        </h1>

        <p className="mb-8 text-ink-500">
          {t('description')}
          {' '}{t('siteUnavailable')}
        </p>

        <div className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm text-ink-500 shadow-sm border border-forest-900/5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-600" />
          </span>
          {t('autoCheck')}
        </div>
      </div>
    </div>
  );
}
