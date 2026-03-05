'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
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
      const message = error instanceof ApiError ? error.message : 'Une erreur est survenue';
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
            Email envoy&eacute; !
          </h3>
          <p className="text-sm text-ink-500">
            Si un compte est associ&eacute; &agrave; cette adresse email, vous
            recevrez un lien pour r&eacute;initialiser votre mot de passe
            d&apos;ici quelques minutes.
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
          Retour &agrave; la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-ink-500">
        Entrez votre adresse email et nous vous enverrons un lien pour
        r&eacute;initialiser votre mot de passe.
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
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="votre@email.com"
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
            Envoi en cours...
          </>
        ) : (
          'Envoyer le lien'
        )}
      </button>
    </form>
  );
}
