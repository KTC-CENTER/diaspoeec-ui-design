'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CustomSelect } from '@/components/forms/custom-select';
import { OnboardingSteps } from '@/features/auth/components/onboarding-steps';
import { useAuthStore } from '@/stores/auth.store';
import { updateMember, type UpdateMemberPayload } from '@/lib/api/members.api';
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
  const { user, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingDiasporaFormData>({
    resolver: zodResolver(onboardingDiasporaSchema),
    defaultValues: {
      typeDiaspora: '',
      paysResidence: '',
      ville: '',
    },
  });

  const onSubmit = async (data: OnboardingDiasporaFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const updated = await updateMember(user.id, data as UpdateMemberPayload);
      updateUser(updated);
      router.push('/onboarding/church');
    } catch {
      router.push('/onboarding/church');
    } finally {
      setIsSubmitting(false);
    }
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
          <label className="block text-sm font-medium text-ink-700">
            Type de diaspora
          </label>
          <CustomSelect
            value={watch('typeDiaspora') || ''}
            onChange={(value) => setValue('typeDiaspora', value, { shouldValidate: true })}
            options={DIASPORA_TYPES}
            placeholder="Selectionnez un type"
            error={!!errors.typeDiaspora}
          />
          {errors.typeDiaspora && (
            <p className="text-xs text-red-600">
              {errors.typeDiaspora.message}
            </p>
          )}
        </div>

        {/* Pays de residence */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink-700">
            Pays de residence
          </label>
          <CustomSelect
            value={watch('paysResidence') || ''}
            onChange={(value) => setValue('paysResidence', value, { shouldValidate: true })}
            options={PAYS_LIST}
            placeholder="Selectionnez un pays"
            error={!!errors.paysResidence}
          />
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
            disabled={isSubmitting}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all',
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
        </div>
      </form>
    </div>
  );
}
