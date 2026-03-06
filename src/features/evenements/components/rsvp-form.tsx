'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useRSVP } from '@/features/evenements/hooks/use-evenements';
import { CustomSelect } from '@/components/forms/custom-select';

interface RSVPFormProps {
  eventId: string;
  userParticipe?: boolean;
}

export function RSVPForm({ eventId, userParticipe }: RSVPFormProps) {
  const [participe, setParticipe] = useState<boolean | null>(null);
  const [nombrePersonnes, setNombrePersonnes] = useState(1);
  const [justConfirmed, setJustConfirmed] = useState(false);
  const rsvpMutation = useRSVP();
  const t = useTranslations('evenements');

  // Reset the "just confirmed" flash when API data refreshes with the new state
  useEffect(() => {
    if (justConfirmed && userParticipe !== undefined) {
      setJustConfirmed(false);
    }
  }, [userParticipe]);

  const handleConfirm = async () => {
    if (participe === null) return;

    rsvpMutation.mutate(
      {
        eventId,
        participe,
        nombrePersonnes: participe ? nombrePersonnes : 0,
      },
      {
        onSuccess: () => {
          setJustConfirmed(true);
          setParticipe(null);
        },
      }
    );
  };

  const handleCancel = () => {
    rsvpMutation.mutate(
      { eventId, participe: false, nombrePersonnes: 0 },
      {
        onSuccess: () => {
          setJustConfirmed(false);
        },
      }
    );
  };

  // Already registered (from API) and user hasn't clicked cancel in this session
  if (userParticipe === true && !justConfirmed) {
    return (
      <div className="rounded-2xl border border-sage-300 bg-sage-100 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-forest-900">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-heading text-lg font-semibold text-forest-900">
              {t('youAreRegistered')}
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {t('participationConfirmed')}
            </p>
            <button
              onClick={handleCancel}
              disabled={rsvpMutation.isPending}
              className="mt-3 flex items-center gap-1 text-xs text-terra-600 hover:underline disabled:opacity-50"
            >
              {rsvpMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {t('cancelRegistration')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show confirmation flash after successful RSVP (before API refetch)
  if (justConfirmed) {
    return (
      <div className="rounded-2xl border border-sage-300 bg-sage-100 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-900">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
        <p className="font-heading text-lg font-semibold text-forest-900">
          {t('responseRecorded')}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          {t('participationRecorded')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sage-200/30 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
        {t('yourParticipation')}
      </h2>

      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => setParticipe(true)}
          className={cn(
            'flex-1 min-w-[180px] px-6 py-3.5 font-semibold rounded-xl transition-all',
            'hover:scale-[1.02] active:scale-[0.98]',
            'flex items-center justify-center gap-2',
            participe === true
              ? 'bg-forest-900 text-white'
              : 'bg-forest-900 text-white hover:bg-forest-700'
          )}
        >
          <CheckCircle className="w-5 h-5" />
          {t('iParticipate')}
        </button>
        <button
          onClick={() => setParticipe(false)}
          className={cn(
            'flex-1 min-w-[180px] px-6 py-3.5 border-2 font-semibold rounded-xl transition-all',
            'hover:scale-[1.02] active:scale-[0.98]',
            participe === false
              ? 'border-terra-600 text-terra-600'
              : 'border-ink-200 text-ink-600 hover:border-terra-600 hover:text-terra-600'
          )}
        >
          {t('iCannotAttend')}
        </button>
      </div>

      {/* Nombre de personnes */}
      {participe === true && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="text-sm text-ink-600 font-medium">
            {t('numberOfPeople')}
          </label>
          <CustomSelect
            value={String(nombrePersonnes)}
            onChange={(value) => setNombrePersonnes(Number(value))}
            options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
            className="w-full sm:w-[100px]"
          />
        </div>
      )}

      {/* Confirm button */}
      {participe !== null && (
        <button
          onClick={handleConfirm}
          disabled={rsvpMutation.isPending}
          className={cn(
            'mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors',
            'bg-forest-900 hover:bg-forest-700 disabled:opacity-60'
          )}
        >
          {rsvpMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('sending')}
            </>
          ) : (
            t('confirmBtn')
          )}
        </button>
      )}
    </div>
  );
}
