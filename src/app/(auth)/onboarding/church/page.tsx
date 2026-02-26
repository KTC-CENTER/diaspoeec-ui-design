'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { OnboardingSteps } from '@/features/auth/components/onboarding-steps';
import {
  onboardingChurchSchema,
  type OnboardingChurchFormData,
} from '@/features/auth/schemas/auth.schema';
import { PAROISSES, MINISTERES_OPTIONS } from '@/lib/constants/onboarding';

// ============================================================================
// Ministry Chips Component
// ============================================================================

function MinistryChips({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  const toggleMinistry = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {MINISTERES_OPTIONS.map((ministry) => {
        const isSelected = selected.includes(ministry.value);
        return (
          <button
            key={ministry.value}
            type="button"
            onClick={() => toggleMinistry(ministry.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
              isSelected
                ? 'bg-forest-900 text-white'
                : 'border border-ink-200 bg-white text-ink-600 hover:border-forest-400 hover:text-forest-700'
            )}
          >
            {isSelected && <Check className="h-3.5 w-3.5" />}
            {ministry.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Church Page
// ============================================================================

export default function OnboardingChurchPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingChurchFormData>({
    resolver: zodResolver(onboardingChurchSchema),
    defaultValues: {
      paroisseOrigine: '',
      baptise: false,
      ministeres: [],
    },
  });

  const baptise = watch('baptise');

  const onSubmit = (_data: OnboardingChurchFormData) => {
    router.push('/onboarding/welcome');
  };

  return (
    <div className="space-y-8">
      <OnboardingSteps currentStep={3} />

      <div className="space-y-2 text-center">
        <h2 className="font-heading text-xl font-bold text-ink-900">
          Votre vie d&apos;&eacute;glise
        </h2>
        <p className="text-sm text-ink-500">
          Partagez votre parcours spirituel avec nous.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Paroisse d'origine */}
        <div className="space-y-1.5">
          <label
            htmlFor="paroisseOrigine"
            className="block text-sm font-medium text-ink-700"
          >
            Paroisse d&apos;origine
          </label>
          <select
            id="paroisseOrigine"
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors',
              'focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20',
              errors.paroisseOrigine ? 'border-red-400' : 'border-ink-200'
            )}
            {...register('paroisseOrigine')}
          >
            <option value="">S&eacute;lectionnez votre paroisse</option>
            {PAROISSES.map((paroisse) => (
              <option key={paroisse.value} value={paroisse.value}>
                {paroisse.label}
              </option>
            ))}
          </select>
          {errors.paroisseOrigine && (
            <p className="text-xs text-red-600">
              {errors.paroisseOrigine.message}
            </p>
          )}
        </div>

        {/* Baptise toggle */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink-700">
            Baptis&eacute;(e) ?
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={baptise}
            onClick={() => setValue('baptise', !baptise, { shouldValidate: true })}
            className={cn(
              'relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              baptise ? 'bg-forest-700' : 'bg-ink-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition-transform',
                baptise ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
          <p className="text-xs text-ink-400">
            {baptise ? 'Oui, je suis baptis\u00e9(e)' : 'Non, pas encore'}
          </p>
        </div>

        {/* Ministeres */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink-700">
            Minist&egrave;res{' '}
            <span className="text-ink-400">(optionnel)</span>
          </label>
          <p className="text-xs text-ink-400">
            S&eacute;lectionnez les minist&egrave;res auxquels vous participez.
          </p>
          <Controller
            name="ministeres"
            control={control}
            render={({ field }) => (
              <MinistryChips
                selected={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/onboarding/diaspora')}
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
              'bg-gold-600 hover:bg-gold-700 active:scale-[0.98]'
            )}
          >
            Terminer
          </button>
        </div>
      </form>
    </div>
  );
}
