'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatMontant } from '@/lib/utils/format';
import type { Campagne } from '@/types';

interface CampaignProgressProps {
  campagne: Campagne;
}

export function CampaignProgress({ campagne }: CampaignProgressProps) {
  const t = useTranslations('dons');
  const tc = useTranslations('common');
  const objectif = campagne.objectifMontant ?? 0;
  const progress = objectif > 0
    ? Math.round((campagne.montantCollecte / objectif) * 100)
    : 0;
  const remaining = objectif - campagne.montantCollecte;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage-200/40 p-6 md:p-8">
      {/* Top section: amount + stats */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-ink-600 text-sm mb-1">{t('amountCollected')}</p>
          <p className="font-heading text-4xl md:text-5xl font-bold text-forest-900">
            {formatMontant(campagne.montantCollecte, 'EUR')}
          </p>
          <p className="text-ink-600 text-sm">
            sur {formatMontant(objectif, 'EUR')}
          </p>
        </div>
        <div className="text-right">
          <div className="flex gap-6">
            <div>
              <p className="font-heading text-2xl font-bold text-gold-600">
                {campagne.nombreDonateurs}
              </p>
              <p className="text-xs text-ink-600">{tc('donors')}</p>
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-terra-600">
                {formatMontant(remaining > 0 ? remaining : 0, 'EUR')}
              </p>
              <p className="text-xs text-ink-600">{t('remaining')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar with shimmer */}
      <div className="w-full h-4 bg-ink-100 rounded-full overflow-hidden mb-4 relative">
        <div
          className="h-full bg-gradient-to-r from-forest-900 via-forest-700 to-sage-400 rounded-full relative"
          style={{
            width: `${Math.min(progress, 100)}%`,
            animation: 'progressFill 1.5s ease-out both',
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-ink-600">0 EUR</span>
        <span className="font-bold text-forest-900">{progress}%</span>
        <span className="text-ink-600">{formatMontant(objectif, 'EUR')}</span>
      </div>

      {/* CTA */}
      {campagne.statut === 'active' && (
        <div className="mt-6">
          <Link
            href={`/dons/nouveau?campagne=${campagne.id}`}
            className={cn(
              'w-full md:w-auto px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-400 text-forest-900 font-bold rounded-xl text-lg',
              'hover:shadow-lg transition hover:scale-[1.02] active:scale-[0.98]',
              'flex items-center justify-center gap-2 inline-flex'
            )}
          >
            <Heart className="w-5 h-5" />
            {tc('donate')}
          </Link>
        </div>
      )}
    </div>
  );
}
