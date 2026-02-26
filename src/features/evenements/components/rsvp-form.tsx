'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useRSVP } from '@/features/evenements/hooks/use-evenements';

interface RSVPFormProps {
  eventId: string;
}

export function RSVPForm({ eventId }: RSVPFormProps) {
  const [participe, setParticipe] = useState<boolean | null>(null);
  const [nombrePersonnes, setNombrePersonnes] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const rsvpMutation = useRSVP();

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
          setConfirmed(true);
        },
      }
    );
  };

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-sage-300 bg-sage-100 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-900">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
        <p className="font-heading text-lg font-semibold text-forest-900">
          {participe ? 'Inscription confirmee !' : 'Reponse enregistree'}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          {participe
            ? `Vous avez confirme votre participation pour ${nombrePersonnes} personne${nombrePersonnes > 1 ? 's' : ''}.`
            : 'Nous esperons vous voir a un prochain evenement.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sage-200/30 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
        Votre participation
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
          Je participe
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
          Je ne peux pas
        </button>
      </div>

      {/* Nombre de personnes */}
      {participe === true && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-ink-600 font-medium">
            Nombre de personnes :
          </label>
          <select
            value={nombrePersonnes}
            onChange={(e) => setNombrePersonnes(Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-ink-200 text-sm bg-white focus:border-forest-900 focus:ring-2 focus:ring-sage-200 outline-none"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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
              Envoi en cours...
            </>
          ) : (
            'Confirmer'
          )}
        </button>
      )}
    </div>
  );
}
