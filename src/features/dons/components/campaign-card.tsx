'use client';

import Link from 'next/link';
import { Heart, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatMontant } from '@/lib/utils/format';
import type { Campagne } from '@/types';

const statusBadge: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-sage-200 text-forest-900',
  },
  terminee: {
    label: 'Terminee',
    className: 'bg-ink-200 text-ink-600',
  },
  pausee: {
    label: 'En pause',
    className: 'bg-gold-200 text-gold-700',
  },
};

interface CampaignCardProps {
  campagne: Campagne;
}

export function CampaignCard({ campagne }: CampaignCardProps) {
  const tc = useTranslations('common');
  const objectif = campagne.objectifMontant ?? 0;
  const progress = objectif > 0
    ? Math.round((campagne.montantCollecte / objectif) * 100)
    : 0;
  const badge = statusBadge[campagne.statut] || statusBadge.active;

  return (
    <Link href={`/dons/campagnes/${campagne.id}`}>
      <div
        className={cn(
          'group rounded-2xl border border-sage-200/40 bg-white p-5 shadow-sm transition-all duration-300',
          'hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(27,67,50,0.1)]'
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-semibold text-ink-900 group-hover:text-forest-700 transition-colors line-clamp-2">
            {campagne.titre}
          </h3>
          <span
            className={cn(
              'flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
              badge.className
            )}
          >
            {badge.label}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-ink-600 line-clamp-2">
          {campagne.description}
        </p>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-forest-900 to-sage-400 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-900">
              {formatMontant(campagne.montantCollecte, 'EUR')}
              <span className="font-normal text-ink-400">
                {' '}
                / {formatMontant(objectif, 'EUR')}
              </span>
            </span>
            <span className="text-xs font-medium text-forest-900">
              {progress}%
            </span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-400">
            <Users className="h-3.5 w-3.5" />
            <span>{campagne.nombreDonateurs} {tc('donors')}</span>
          </div>
          {campagne.statut === 'active' && (
            <span
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
                'bg-gradient-to-r from-gold-600 to-gold-400 text-forest-900',
                'group-hover:shadow-md transition-shadow'
              )}
            >
              <Heart className="h-3.5 w-3.5" />
              {tc('donate')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
