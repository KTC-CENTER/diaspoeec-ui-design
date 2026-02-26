'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { OnboardingSteps } from '@/features/auth/components/onboarding-steps';
import {
  onboardingDiasporaSchema,
  type OnboardingDiasporaFormData,
} from '@/features/auth/schemas/auth.schema';
import {
  DIASPORA_TYPES,
  PAYS_LIST,
} from '@/lib/constants/onboarding';

export default function OnboardingDiasporaPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingDiasporaFormData>({
    resolver: zodResolver(onboardingDiasporaSchema),
    defaultValues: {
      typeDiaspora: '',
      paysResidence: '',
      ville: '',
    },
  });

  const onSubmit = (_data: OnboardingDiasporaFormData) => {
    router.push('/onboarding/church');
  };

  return (
    <div className="space-y-8">
      <OnboardingSteps currentStep={2} />

      <div className="space-y-2 text-center">
        <h2 className="font-heading text-xl font-bold text-ink-900">
          Votre diaspora
        </h2>
        <p className="text-sm text-ink-500">
          Aidez-nous &agrave; vous connecter avec votre communaut&eacute;
          locale.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Type de diaspora */}
        <div className="space-y-1.5">
          <label
            htmlFor="typeDiaspora"
            className="block text-sm font-medium text-ink-700"
          >
            Type de diaspora
          </label>
          <select
            id="typeDiaspora"
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
              'focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
              errors.typeDiaspora ? 'border-red-400' : 'border-ink-200'
            )}
            {...register('typeDiaspora')}
          >
            <option value="">S&eacute;lectionnez un type</option>
            {DIASPORA_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.typeDiaspora && (
            <p className="text-xs text-red-600">
              {errors.typeDiaspora.message}
            </p>
          )}
        </div>

        {/* Pays de residence */}
        <div className="space-y-1.5">
          <label
            htmlFor="paysResidence"
            className="block text-sm font-medium text-ink-700"
          >
            Pays de r&eacute;sidence
          </label>
          <select
            id="paysResidence"
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
              'focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
              errors.paysResidence ? 'border-red-400' : 'border-ink-200'
            )}
            {...register('paysResidence')}
          >
            <option value="">S&eacute;lectionnez un pays</option>
            {PAYS_LIST.map((pays) => (
              <option key={pays.value} value={pays.value}>
                {pays.label}
              </option>
            ))}
          </select>
          {errors.paysResidence && (
            <p className="text-xs text-red-600">
              {errors.paysResidence.message}
            </p>
          )}
        </div>

        {/* Ville */}
        <div className="space-y-1.5">
          <label
            htmlFor="ville"
            className="block text-sm font-medium text-ink-700"
          >
            Ville
          </label>
          <input
            id="ville"
            type="text"
            placeholder="Ex: Paris, Bruxelles, Montr&eacute;al..."
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
              'placeholder:text-ink-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
              errors.ville ? 'border-red-400' : 'border-ink-200'
            )}
            {...register('ville')}
          />
          {errors.ville && (
            <p className="text-xs text-red-600">{errors.ville.message}</p>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/onboarding/identity')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-6 py-3 text-sm font-medium text-ink-600 transition-all',
              'hover:bg-ink-100 active:scale-[0.98]'
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Pr&eacute;c&eacute;dent
          </button>
          <button
            type="submit"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
              'bg-forest-900 hover:bg-forest-700 active:scale-[0.98]'
            )}
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
