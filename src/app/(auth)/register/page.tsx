'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Lock } from 'lucide-react';
import { RegisterForm } from '@/features/auth/components/register-form';
import { GoogleOAuthButton } from '@/features/auth/components/google-oauth-button';
import { ENDPOINTS } from '@/lib/api/endpoints';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function RegisterPage() {
  const [inscriptionsOuvertes, setInscriptionsOuvertes] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}${ENDPOINTS.SETTINGS_PUBLIC}`)
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data ?? json;
        setInscriptionsOuvertes(data.inscriptionsOuvertes ?? true);
      })
      .catch(() => setInscriptionsOuvertes(true));
  }, []);

  if (inscriptionsOuvertes === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!inscriptionsOuvertes) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-terra-500/10">
          <Lock className="h-8 w-8 text-terra-600" />
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-ink-900">
            Inscriptions ferm&eacute;es
          </h2>
          <p className="text-sm text-ink-500">
            Les inscriptions sont temporairement suspendues.
            Veuillez r&eacute;essayer ult&eacute;rieurement.
          </p>
        </div>
        <p className="text-center text-sm text-ink-500">
          D&eacute;j&agrave; un compte ?{' '}
          <Link
            href="/login"
            className="font-semibold text-forest-700 transition-colors hover:text-forest-500"
          >
            Se connecter
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          Cr&eacute;er votre compte
        </h2>
        <p className="text-sm text-ink-500">
          Rejoignez la communaut&eacute; DiaspoEEC
        </p>
      </div>

      {/* Register Form */}
      <RegisterForm />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-ink-200" />
        <span className="text-xs font-medium text-ink-400">ou</span>
        <div className="h-px flex-1 bg-ink-200" />
      </div>

      {/* Google OAuth */}
      <GoogleOAuthButton />

      {/* Login link */}
      <p className="text-center text-sm text-ink-500">
        D&eacute;j&agrave; un compte ?{' '}
        <Link
          href="/login"
          className="font-semibold text-forest-700 transition-colors hover:text-forest-500"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
