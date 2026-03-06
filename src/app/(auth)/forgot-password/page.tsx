'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-forest-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToLogin')}
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          {t('forgotPasswordTitle')}
        </h2>
        <p className="text-sm text-ink-500">
          {t('forgotPasswordDescription')}
        </p>
      </div>

      {/* Form */}
      <ForgotPasswordForm />
    </div>
  );
}
