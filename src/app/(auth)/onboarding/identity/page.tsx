'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, User, Phone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { OnboardingSteps } from '@/features/auth/components/onboarding-steps';
import { useAuthStore } from '@/stores/auth.store';
import { updateMember } from '@/lib/api/members.api';
import {
  onboardingIdentitySchema,
  type OnboardingIdentityFormData,
} from '@/features/auth/schemas/auth.schema';

export default function OnboardingIdentityPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingIdentityFormData>({
    resolver: zodResolver(onboardingIdentitySchema),
    defaultValues: {
      dateNaissance: '',
      sexe: undefined,
      telephone: '',
    },
  });

  const selectedSexe = watch('sexe');

  const onSubmit = async (data: OnboardingIdentityFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const updated = await updateMember(user.id, {
        ...data,
      });
      updateUser(updated);
      router.push('/onboarding/diaspora');
    } catch {
      router.push('/onboarding/diaspora');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <OnboardingSteps currentStep={1} />

      <div className="space-y-2 text-center">
        <h2 className="font-heading text-xl font-bold text-ink-900">
          Parlons un peu de vous
        </h2>
        <p className="text-sm text-ink-500">
          Ces informations nous aident &agrave; personnaliser votre
          exp&eacute;rience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date de naissance */}
        <div className="space-y-1.5">
          <label
            htmlFor="dateNaissance"
            className="block text-sm font-medium text-ink-700"
          >
            Date de naissance
          </label>
          <input
            id="dateNaissance"
            type="date"
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
              'focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
              errors.dateNaissance ? 'border-red-400' : 'border-ink-200'
            )}
            {...register('dateNaissance')}
          />
          {errors.dateNaissance && (
            <p className="text-xs text-red-600">
              {errors.dateNaissance.message}
            </p>
          )}
        </div>

        {/* Sexe - Radio Cards */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink-700">
            Sexe
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['homme', 'femme'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setValue('sexe', option, { shouldValidate: true })}
                className={cn(
                  'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all',
                  selectedSexe === option
                    ? 'border-forest-700 bg-forest-900/5 text-forest-900'
                    : 'border-ink-200 text-ink-500 hover:border-ink-300'
                )}
              >
                <User className="h-4 w-4" />
                {option === 'homme' ? 'Homme' : 'Femme'}
              </button>
            ))}
          </div>
          {errors.sexe && (
            <p className="text-xs text-red-600">{errors.sexe.message}</p>
          )}
        </div>

        {/* Telephone */}
        <div className="space-y-1.5">
          <label
            htmlFor="telephone"
            className="block text-sm font-medium text-ink-700"
          >
            T&eacute;l&eacute;phone{' '}
            <span className="text-ink-400">(optionnel)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              id="telephone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              className={cn(
                'w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm transition-colors',
                'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
                'border-ink-200'
              )}
              {...register('telephone')}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
            'bg-forest-900 hover:bg-forest-700 active:scale-[0.98] disabled:opacity-60'
          )}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Continuer
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
