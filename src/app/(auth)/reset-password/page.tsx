'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { apiClient, ApiError } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-forest-700" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const t = useTranslations('auth');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError(t('passwordMinLength'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('resetError'));
    }
    setIsLoading(false);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <p className="text-sm text-ink-500">{t('invalidResetLink')}</p>
        <Link
          href="/forgot-password"
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all',
            'bg-forest-900 text-white hover:bg-forest-700 active:scale-[0.98]'
          )}
        >
          {t('requestNewLink')}
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-500/10">
          <CheckCircle2 className="h-8 w-8 text-forest-700" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-semibold text-ink-900">
            {t('passwordReset')}
          </h3>
          <p className="text-sm text-ink-500">
            {t('passwordResetSuccess')}
          </p>
        </div>
        <Link
          href="/login"
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all',
            'bg-forest-900 text-white hover:bg-forest-700 active:scale-[0.98]'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('signIn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-forest-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('backToLogin')}
      </Link>

      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          {t('newPassword')}
        </h2>
        <p className="text-sm text-ink-500">
          {t('newPasswordDescription')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-ink-700">
            {t('newPasswordLabel')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('minimum8Chars')}
              className={cn(
                'w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm transition-colors',
                'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
                'border-ink-200'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink-700">
            {t('confirmPasswordLabel')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('retypePassword')}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
              'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
              'border-ink-200'
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
            'bg-forest-900 hover:bg-forest-700 active:scale-[0.98]',
            'disabled:cursor-not-allowed disabled:opacity-60'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('resetting')}
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              {t('resetPassword')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
