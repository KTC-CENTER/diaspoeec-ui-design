'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Heart,
  Loader2,
  Check,
  Building,
  GraduationCap,
  Globe,
  Info,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant } from '@/lib/utils/format';
import { CustomSelect } from '@/components/forms/custom-select';
import { useCampagnes, useCreateDon } from '@/features/dons/hooks/use-dons';
import {
  donationSchema,
  type DonationFormData,
} from '@/features/dons/schemas/donation.schema';

const BASE_AMOUNTS_EUR = [10, 25, 50, 100, 200];

// Taux de conversion approximatifs depuis l'EUR
const EUR_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.10,
  XAF: 655.957, // Parite fixe CFA
  GBP: 0.86,
  CHF: 0.95,
};

function getPresetAmounts(devise: string): number[] {
  const rate = EUR_RATES[devise] || 1;
  return BASE_AMOUNTS_EUR.map((eur) => {
    const converted = Math.round(eur * rate);
    if (converted >= 100000) return Math.round(converted / 10000) * 10000;
    if (converted >= 10000) return Math.round(converted / 5000) * 5000;
    if (converted >= 1000) return Math.round(converted / 500) * 500;
    return converted;
  });
}

const DEVISES = [
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'USD', label: 'USD - Dollar US' },
  { value: 'XAF', label: 'XAF - Franc CFA' },
  { value: 'GBP', label: 'GBP - Livre Sterling' },
  { value: 'CHF', label: 'CHF - Franc Suisse' },
];

const campaignIcons: Record<string, React.ReactNode> = {
  default: <Heart className="w-5 h-5 text-forest-900" />,
  building: <Building className="w-5 h-5 text-ink-600" />,
  education: <GraduationCap className="w-5 h-5 text-ink-600" />,
  global: <Globe className="w-5 h-5 text-ink-600" />,
};

export function DonationForm() {
  const { data: campagnes, isLoading: campagnesLoading } = useCampagnes();
  const createDon = useCreateDon();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      devise: 'EUR',
      frequence: 'ponctuel',
      estAnonyme: false,
      methodePaiement: 'stripe',
    },
  });

  const watchedValues = watch();
  const selectedCampagne = campagnes?.find(
    (c) => c.id === watchedValues.campagneId
  );

  const onSubmit = (data: DonationFormData) => {
    createDon.mutate(data, {
      onSuccess: () => {
        setSuccess(true);
      },
    });
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-sage-300 bg-sage-100 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-900">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-forest-900">
          Merci pour votre generosite !
        </h2>
        <p className="mt-2 text-ink-600">
          Votre don de{' '}
          <strong>{formatMontant(watchedValues.montant, watchedValues.devise)}</strong>{' '}
          pour la campagne &quot;{selectedCampagne?.titre}&quot; a bien ete enregistre.
        </p>
        {watchedValues.frequence === 'mensuel' && (
          <p className="mt-2 text-sm text-ink-500">
            Votre don mensuel sera preleve automatiquement chaque mois.
          </p>
        )}
        <p className="mt-4 text-sm italic text-ink-400">
          &laquo; Que chacun donne comme il l&apos;a resolu en son coeur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie. &raquo;
          <br />
          <span className="font-medium">2 Corinthiens 9:7</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Bible quote - african-border pattern */}
      <div
        className="animate-[fade-up_0.5s_ease-out_0.1s_both] bg-cream-100 rounded-2xl border-2 border-gold-400/60 p-6 relative overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='3' fill='none' stroke='%23D4A017' stroke-width='0.8' opacity='0.3'/%3E%3Cpath d='M10 0v20M0 10h20' stroke='%23D4A017' stroke-width='0.3' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="relative z-10">
          <p className="font-heading text-lg text-ink-900 italic leading-relaxed">
            &laquo; Chacun donne comme il l&apos;a resolu en son coeur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie. &raquo;
          </p>
          <p className="text-gold-600 font-semibold text-sm mt-2">
            -- 2 Corinthiens 9:7
          </p>
        </div>
      </div>

      {/* Campaign selection */}
      <div className="animate-[fade-up_0.5s_ease-out_0.1s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Choisir une campagne
        </h2>
        {campagnesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {campagnes
              ?.filter((c) => c.statut === 'active')
              .map((campagne, index) => {
                const hasObjectif = campagne.objectifMontant != null && campagne.objectifMontant > 0;
                const progress = hasObjectif
                  ? Math.min(Math.round((campagne.montantCollecte / campagne.objectifMontant!) * 100), 100)
                  : null;
                const isSelected = watchedValues.campagneId === campagne.id;
                return (
                  <label
                    key={campagne.id}
                    className={cn(
                      'block bg-white rounded-2xl shadow-sm border-2 p-4 cursor-pointer transition-all',
                      'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(27,67,50,0.1)]',
                      isSelected
                        ? 'border-forest-900'
                        : 'border-ink-200 hover:border-forest-900/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio circle */}
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        isSelected ? 'border-forest-900' : 'border-ink-300'
                      )}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-forest-900 rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        value={campagne.id}
                        {...register('campagneId')}
                        className="sr-only"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink-900">
                          {campagne.titre}
                        </p>
                        {/* Barre de progression pour toutes les campagnes avec objectif */}
                        {progress !== null && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-ink-600 mb-1">
                              <span>{formatMontant(campagne.montantCollecte, 'EUR')} collectes</span>
                              <span className="font-medium text-forest-900">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-forest-900 to-sage-400 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-ink-400">
                              sur {formatMontant(campagne.objectifMontant, 'EUR')} objectif
                            </p>
                          </div>
                        )}
                        {progress === null && campagne.montantCollecte > 0 && (
                          <p className="mt-1 text-xs text-ink-500">
                            {formatMontant(campagne.montantCollecte, 'EUR')} collectes · objectif libre
                          </p>
                        )}
                      </div>
                      {/* Icon based on campaign type */}
                      <div className="flex-shrink-0">
                        {index === 0 ? campaignIcons.default :
                         index === 1 ? campaignIcons.building :
                         index === 2 ? campaignIcons.education :
                         campaignIcons.global}
                      </div>
                    </div>
                  </label>
                );
              })}
          </div>
        )}
        {errors.campagneId && (
          <p className="mt-1 text-xs text-error">{errors.campagneId.message}</p>
        )}
      </div>

      {/* Amount Selection */}
      <div className="animate-[fade-up_0.5s_ease-out_0.2s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Montant
        </h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {getPresetAmounts(watchedValues.devise || 'EUR').map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setValue('montant', amount, { shouldValidate: true });
              }}
              className={cn(
                'px-6 py-3 rounded-xl border-2 border-forest-900 font-semibold text-sm transition-all',
                'hover:scale-[1.02] active:scale-[0.98]',
                watchedValues.montant === amount
                  ? 'bg-forest-900 text-white'
                  : 'text-forest-900 hover:bg-forest-900 hover:text-white'
              )}
            >
              {amount.toLocaleString('fr-FR')} {watchedValues.devise || 'EUR'}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="text-sm font-medium text-ink-600 whitespace-nowrap">
            Autre montant :
          </label>
          <div className="relative flex-1 sm:max-w-[200px]">
            <input
              type="number"
              placeholder="0,00"
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-forest-900 focus:ring-2 focus:ring-sage-200 outline-none"
              onChange={(e) =>
                setValue('montant', Number(e.target.value), {
                  shouldValidate: true,
                })
              }
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-600 font-medium text-sm">
              {watchedValues.devise || 'EUR'}
            </span>
          </div>
        </div>
        {errors.montant && (
          <p className="mt-1 text-xs text-error">{errors.montant.message}</p>
        )}
      </div>

      {/* Currency */}
      <div className="relative z-20 animate-[fade-up_0.5s_ease-out_0.2s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Devise
        </h2>
        <CustomSelect
          value={watchedValues.devise || 'EUR'}
          onChange={(value) => setValue('devise', value as DonationFormData['devise'])}
          options={DEVISES}
          className="w-full sm:w-auto sm:min-w-[200px]"
        />
      </div>

      {/* Frequency */}
      <div className="animate-[fade-up_0.5s_ease-out_0.2s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Frequence
        </h2>
        <div className="inline-flex bg-ink-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setValue('frequence', 'ponctuel')}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-semibold transition',
              watchedValues.frequence === 'ponctuel'
                ? 'bg-forest-900 text-white'
                : 'text-ink-600'
            )}
          >
            Don ponctuel
          </button>
          <button
            type="button"
            onClick={() => setValue('frequence', 'mensuel')}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-semibold transition',
              watchedValues.frequence === 'mensuel'
                ? 'bg-forest-900 text-white'
                : 'text-ink-600'
            )}
          >
            Don mensuel
          </button>
        </div>
        {watchedValues.frequence === 'mensuel' && (
          <div className="mt-3 p-3 bg-sage-200/50 rounded-xl text-sm text-forest-900">
            <Info className="w-4 h-4 inline-block mr-1" />
            Vous serez debite de {watchedValues.montant || '...'} {watchedValues.devise || 'EUR'} chaque mois. Annulable a tout moment.
          </div>
        )}
      </div>

      {/* Options */}
      <div className="animate-[fade-up_0.5s_ease-out_0.3s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Options
        </h2>
        <div className="space-y-4">
          {/* Anonymous toggle */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-sage-200/30">
            <span className="text-sm font-medium text-ink-900">Don anonyme</span>
            <button
              type="button"
              onClick={() =>
                setValue('estAnonyme', !watchedValues.estAnonyme)
              }
              className={cn(
                'w-12 h-7 rounded-full relative transition-colors',
                watchedValues.estAnonyme ? 'bg-forest-900' : 'bg-ink-200'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 bg-white rounded-full absolute top-1 left-1 shadow transition-transform',
                  watchedValues.estAnonyme && 'translate-x-5'
                )}
              />
            </button>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-ink-900 block mb-2">
              Laisser un message (optionnel)
            </label>
            <textarea
              {...register('message')}
              rows={2}
              placeholder="Un mot d'encouragement..."
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:border-forest-900 focus:ring-2 focus:ring-sage-200 outline-none resize-none"
              maxLength={500}
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="animate-[fade-up_0.5s_ease-out_0.3s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Methode de paiement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stripe / Carte bancaire */}
          <label
            className={cn(
              'bg-white rounded-2xl shadow-sm border-2 p-5 text-left cursor-pointer transition-all',
              'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(27,67,50,0.1)]',
              watchedValues.methodePaiement === 'stripe'
                ? 'border-forest-900'
                : 'border-ink-200 hover:border-forest-900/50'
            )}
          >
            <input type="radio" value="stripe" {...register('methodePaiement')} className="sr-only" />
            <div className="flex items-center gap-4">
              {/* Stripe — logo local public/logos/stripe.svg */}
              <div className="w-14 h-9 bg-[#635BFF] rounded-lg flex items-center justify-center px-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/stripe.svg" alt="Stripe" className="h-4 w-auto" />
              </div>
              <div>
                <p className="font-semibold text-ink-900">Carte bancaire</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {/* Visa — logo local public/logos/visa.svg */}
                  <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center px-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/visa.svg" alt="Visa" className="h-3.5 w-auto" />
                  </div>
                  {/* Mastercard — deux cercles SVG inline (logo coloré officiel) */}
                  <div className="h-6 w-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-auto" aria-label="Mastercard">
                      <circle cx="15" cy="12" r="10" fill="#EB001B"/>
                      <circle cx="23" cy="12" r="10" fill="#F79E1B"/>
                      <path d="M19 4.9A10 10 0 0 1 22.6 12 10 10 0 0 1 19 19.1 10 10 0 0 1 15.4 12 10 10 0 0 1 19 4.9z" fill="#FF5F00"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </label>

          {/* PayPal */}
          <label
            className={cn(
              'bg-white rounded-2xl shadow-sm border-2 p-5 text-left cursor-pointer transition-all',
              'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(27,67,50,0.1)]',
              watchedValues.methodePaiement === 'paypal'
                ? 'border-forest-900'
                : 'border-ink-200 hover:border-forest-900/50'
            )}
          >
            <input type="radio" value="paypal" {...register('methodePaiement')} className="sr-only" />
            <div className="flex items-center gap-4">
              {/* PayPal — logo local public/logos/paypal.svg */}
              <div className="w-14 h-9 bg-[#003087] rounded-lg flex items-center justify-center px-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/paypal.svg" alt="PayPal" className="h-5 w-auto" />
              </div>
              <div>
                <p className="font-semibold text-ink-900">PayPal</p>
                <p className="text-xs text-ink-500">Compte PayPal ou carte</p>
              </div>
            </div>
          </label>
        </div>
        {errors.methodePaiement && (
          <p className="mt-1 text-xs text-error">
            {errors.methodePaiement.message}
          </p>
        )}
      </div>

      {/* Summary - white bg with mint border (matching HTML design) */}
      {watchedValues.campagneId && watchedValues.montant > 0 && (
        <div className="animate-[fade-up_0.5s_ease-out_0.4s_both] bg-white rounded-2xl shadow-lg border border-sage-200/50 p-6 md:sticky md:bottom-4">
          <h3 className="font-heading font-bold text-forest-900 mb-4">
            Recapitulatif
          </h3>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Campagne</span>
              <span className="font-medium text-ink-900">
                {selectedCampagne?.titre || '...'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Montant</span>
              <span className="font-medium text-ink-900">
                {formatMontant(watchedValues.montant, watchedValues.devise)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Frequence</span>
              <span className="font-medium text-ink-900">
                {watchedValues.frequence === 'mensuel' ? 'Mensuel' : 'Ponctuel'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-600">Paiement</span>
              <span className="font-medium text-ink-900">
                {watchedValues.methodePaiement === 'stripe'
                  ? 'Carte bancaire'
                  : 'PayPal'}
              </span>
            </div>
          </div>
          <div className="h-px bg-ink-100 mb-5" />
          <button
            type="submit"
            disabled={createDon.isPending}
            className={cn(
              'w-full px-6 py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-forest-900 font-bold rounded-xl text-lg',
              'hover:shadow-lg transition hover:scale-[1.02] active:scale-[0.98]',
              'flex items-center justify-center gap-2',
              'disabled:opacity-60'
            )}
          >
            {createDon.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Proceder au paiement
              </>
            )}
          </button>
          <p className="text-center text-xs text-ink-600 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Paiement securise par Stripe
          </p>
        </div>
      )}

      {createDon.isError && (
        <p className="text-center text-sm text-error">
          Une erreur est survenue. Veuillez reessayer.
        </p>
      )}
    </form>
  );
}
