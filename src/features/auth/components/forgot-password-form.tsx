'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { apiClient, ApiError } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@/features/auth/schemas/auth.schema';

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const t = useTranslations('auth');
  const tc = useTranslations('common');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setApiError('');
    try {
      await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: data.email });
      setIsSuccess(true);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : tc('errorOccurred');
      setApiError(message);
    }
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-500/10">
          <CheckCircle2 className="h-8 w-8 text-forest-700" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-semibold text-ink-900">
            {t('emailSent')}
          </h3>
          <p className="text-sm text-ink-500">
            {t('emailSentDescription')}
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
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-ink-500">
        {t('forgotPasswordFormDescription')}
      </p>

      {apiError && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-ink-700"
        >
          {tc('emailAddress')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
            'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
            errors.email ? 'border-red-400' : 'border-ink-200'
          )}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Submit */}
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
            {t('sendingEmail')}
          </>
        ) : (
          t('sendLink')
        )}
      </button>
    </form>
  );
}
