'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { registerSchema, type RegisterFormData } from '@/features/auth/schemas/auth.schema';
import { useRegister } from '@/features/auth/hooks/use-auth';

// ============================================================================
// Password Rules Indicator
// ============================================================================

function PasswordRules({ password }: { password: string }) {
  const rules = [
    { label: '8 caractères minimum', valid: password.length >= 8 },
    { label: 'Une majuscule', valid: /[A-Z]/.test(password) },
    { label: 'Un chiffre', valid: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      {rules.map((rule) => (
        <div
          key={rule.label}
          className={cn(
            'flex items-center gap-2 text-xs transition-colors',
            rule.valid ? 'text-forest-700' : 'text-ink-400'
          )}
        >
          {rule.valid ? (
            <Check className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
          {rule.label}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Register Form
// ============================================================================

export function RegisterForm() {
  const { mutate: registerUser, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomComplet: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      )}

      {/* Nom Complet */}
      <div className="space-y-1.5">
        <label
          htmlFor="nomComplet"
          className="block text-sm font-medium text-ink-700"
        >
          Nom complet
        </label>
        <input
          id="nomComplet"
          type="text"
          autoComplete="name"
          placeholder="Jean-Paul Mbarga"
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
            'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
            errors.nomComplet ? 'border-red-400' : 'border-ink-200'
          )}
          {...register('nomComplet')}
        />
        {errors.nomComplet && (
          <p className="text-xs text-red-600">{errors.nomComplet.message}</p>
        )}
      </div>

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

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-ink-700"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Cr&eacute;ez un mot de passe"
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
            'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
            errors.password ? 'border-red-400' : 'border-ink-200'
          )}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
        <PasswordRules password={passwordValue || ''} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-ink-700"
        >
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirmez votre mot de passe"
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
            'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
            errors.confirmPassword ? 'border-red-400' : 'border-ink-200'
          )}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Accept Terms */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className={cn(
              'mt-0.5 h-4 w-4 rounded border-ink-300 text-forest-700',
              'focus:ring-forest-500'
            )}
            {...register('acceptTerms')}
          />
          <span className="text-sm text-ink-600">
            J&apos;accepte les{' '}
            <a
              href="/conditions"
              className="font-medium text-forest-700 underline hover:text-forest-500"
            >
              conditions d&apos;utilisation
            </a>{' '}
            et la{' '}
            <a
              href="/confidentialite"
              className="font-medium text-forest-700 underline hover:text-forest-500"
            >
              politique de confidentialit&eacute;
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-red-600">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
          'bg-forest-900 hover:bg-forest-700 active:scale-[0.98]',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Cr&eacute;ation en cours...
          </>
        ) : (
          'Cr\u00e9er mon compte'
        )}
      </button>
    </form>
  );
}
