'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import { useRSVP } from '@/features/evenements/hooks/use-evenements';
import type { Evenement } from '@/types';

const typeColors: Record<string, {
  gradient: string;
  badge: string;
  border: string;
  iconColor: string;
  buttonBorder: string;
  buttonText: string;
  buttonHoverBg: string;
}> = {
  culte: {
    gradient: 'from-forest-900 to-forest-700',
    badge: 'bg-sage-200 text-forest-900',
    border: 'border-sage-200/40',
    iconColor: 'text-forest-700',
    buttonBorder: 'border-forest-900',
    buttonText: 'text-forest-900',
    buttonHoverBg: 'hover:bg-forest-900 hover:text-white',
  },
  conference: {
    gradient: 'from-gold-600 to-gold-400',
    badge: 'bg-gold-400/40 text-gold-600',
    border: 'border-gold-400/40',
    iconColor: 'text-gold-600',
    buttonBorder: 'border-gold-600',
    buttonText: 'text-gold-600',
    buttonHoverBg: 'hover:bg-gold-600 hover:text-white',
  },
  retraite: {
    gradient: 'from-terra-600 to-gold-500',
    badge: 'bg-orange-100 text-terra-600',
    border: 'border-orange-200/50',
    iconColor: 'text-terra-600',
    buttonBorder: 'border-terra-600',
    buttonText: 'text-terra-600',
    buttonHoverBg: 'hover:bg-terra-600 hover:text-white',
  },
  formation: {
    gradient: 'from-terra-600 to-gold-500',
    badge: 'bg-orange-100 text-terra-600',
    border: 'border-orange-200/50',
    iconColor: 'text-terra-600',
    buttonBorder: 'border-terra-600',
    buttonText: 'text-terra-600',
    buttonHoverBg: 'hover:bg-terra-600 hover:text-white',
  },
  jeunesse: {
    gradient: 'from-forest-700 to-sage-400',
    badge: 'bg-sage-200 text-forest-900',
    border: 'border-sage-200/40',
    iconColor: 'text-forest-700',
    buttonBorder: 'border-forest-900',
    buttonText: 'text-forest-900',
    buttonHoverBg: 'hover:bg-forest-900 hover:text-white',
  },
};

const typeLabels: Record<string, string> = {
  culte: 'Culte',
  conference: 'Conference',
  retraite: 'Retraite',
  formation: 'Formation',
  jeunesse: 'Jeunesse',
};

interface EventCardProps {
  evenement: Evenement;
  delay?: number;
}

export function EventCard({ evenement, delay = 0 }: EventCardProps) {
  const [inscrit, setInscrit] = useState(evenement.userParticipe ?? false);

  // Sync with API data when the event is refetched after RSVP
  useEffect(() => {
    setInscrit(evenement.userParticipe ?? false);
  }, [evenement.userParticipe]);
  const { addToast } = useToastStore();
  const rsvpMutation = useRSVP();
  const colors = typeColors[evenement.type] || typeColors.culte;
  const dayNum = formatDate(evenement.date, 'dd');
  const monthShort = formatDate(evenement.date, 'MMM').toUpperCase();
  const timeStr = formatDate(evenement.date, 'HH:mm');
  const timeEnd = evenement.heureFin ? formatDate(evenement.heureFin, 'HH:mm') : null;

  // Animation delay classes
  const animDelay = Math.min(delay, 4) * 0.1 + 0.2;

  return (
    <Link href={`/evenements/${evenement.id}`}>
      <div
        className={cn(
          'bg-white rounded-2xl shadow-md p-5 cursor-pointer',
          'border',
          colors.border,
          'transition-all duration-300',
          'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(27,67,50,0.1)]'
        )}
        style={{ animation: `fade-up 0.5s ease-out ${animDelay}s both` }}
      >
        <div className="flex gap-4">
          {/* Date badge */}
          <div
            className={cn(
              'flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br rounded-2xl flex flex-col items-center justify-center text-white shadow-md',
              colors.gradient
            )}
          >
            <span className="text-lg md:text-xl font-bold leading-none">{dayNum}</span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">
              {monthShort}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={cn(
                  'px-2.5 py-0.5 text-xs font-semibold rounded-full',
                  colors.badge
                )}
              >
                {typeLabels[evenement.type]}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading font-bold text-ink-900 text-lg mb-1.5">
              {evenement.titre}
            </h3>

            {/* Info lines */}
            <div className="space-y-1 text-sm text-ink-600">
              <p className="flex items-center gap-1.5">
                <MapPin className={cn('w-3.5 h-3.5', colors.iconColor)} />
                {evenement.lieu}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className={cn('w-3.5 h-3.5', colors.iconColor)} />
                {timeStr}{timeEnd ? ` - ${timeEnd}` : ''}
              </p>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center', colors.badge)}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM17 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07zM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5z"/>
                  </svg>
                </div>
                <span className="text-xs text-ink-600 font-medium">
                  {evenement.participantsInscrits} inscrits
                </span>
              </div>

              <button
                className={cn(
                  'flex-shrink-0 whitespace-nowrap px-4 py-2 border-2 text-sm font-semibold rounded-xl transition-all',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  inscrit
                    ? 'border-forest-700 bg-forest-900 text-white'
                    : cn(colors.buttonBorder, colors.buttonText, colors.buttonHoverBg)
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const wasInscrit = inscrit;
                  setInscrit(!wasInscrit);
                  rsvpMutation.mutate(
                    { eventId: evenement.id, participe: !wasInscrit, nombrePersonnes: 1 },
                    {
                      onSuccess: () => {
                        addToast(
                          wasInscrit ? 'Inscription annulee' : `Inscription confirmee pour "${evenement.titre}"`,
                          wasInscrit ? 'info' : 'success'
                        );
                      },
                      onError: () => {
                        setInscrit(wasInscrit);
                        addToast('Erreur lors de l\'inscription', 'error');
                      },
                    }
                  );
                }}
              >
                {inscrit ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Inscrit
                  </span>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
