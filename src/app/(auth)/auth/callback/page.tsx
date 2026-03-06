'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('auth');
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const sessionId = searchParams.get('sessionId');
    const redirectTo = searchParams.get('redirectTo') ?? '/accueil';

    if (!accessToken || !refreshToken) {
      setError(t('connectionFailed'));
      return;
    }

    // Récupérer le profil utilisateur avec l'access token
    fetch(`${API_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token invalide');
        return res.json();
      })
      .then((data) => {
        // L'apiClient unwrap { data } — ici on fetch directement
        const user = data.data ?? data;
        login(user, accessToken, decodeURIComponent(refreshToken), sessionId ?? undefined);
        router.replace(redirectTo);
      })
      .catch(() => {
        setError(t('connectionFailedRetry'));
      });
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          onClick={() => router.replace('/login')}
          className="rounded-xl bg-forest-900 px-6 py-2.5 text-sm font-medium text-white"
        >
          {t('backToLogin')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
      <p className="text-sm text-ink-500">{t('connecting')}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  const t = useTranslations('auth');
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
          <p className="text-sm text-ink-500">{t('connecting')}</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
