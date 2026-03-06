'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LoginForm } from '@/features/auth/components/login-form';
import { GoogleOAuthButton } from '@/features/auth/components/google-oauth-button';
import { QuickLoginButtons } from '@/features/auth/components/quick-login-buttons';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tc = useTranslations('common');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2
          className="text-2xl font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('welcomeBack')}
        </h2>
        <p className="text-sm text-ink-600 mt-2">
          {t('loginSubtitle')}
        </p>
      </div>

      {/* Quick Login (Dev mode) */}
      <QuickLoginButtons />

      {/* Login Form */}
      <LoginForm />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-ink-600">{tc('or')}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google OAuth */}
      <GoogleOAuthButton />

      {/* Register link */}
      <p className="text-center text-sm text-ink-600 mt-8">
        {t('noAccount')}{' '}
        <Link
          href="/register"
          className="font-semibold text-forest-900 hover:underline ml-1"
        >
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
