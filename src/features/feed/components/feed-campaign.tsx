'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Campagne } from '@/types';
import { FeedCard } from './feed-card';

interface FeedCampaignProps {
  campagne: Campagne;
}

export function FeedCampaign({ campagne }: FeedCampaignProps) {
  const t = useTranslations('dons');
  const tc = useTranslations('common');
  const objectif = campagne.objectifMontant ?? 0;
  const percentage = objectif > 0
    ? Math.min(100, Math.round((campagne.montantCollecte / objectif) * 100))
    : 0;

  return (
    <FeedCard>
      <div className="p-5">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{'\u{1F49B}'}</span>
          <span className="text-xs font-semibold text-gold-600 uppercase tracking-wider">
            {t('campaign')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-ink-900 mb-3">
          {campagne.titre}
        </h3>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-semibold text-forest-900">
              {campagne.montantCollecte.toLocaleString('fr-FR')} &euro;
            </span>
            <span className="text-sm text-ink-400">
              {objectif.toLocaleString('fr-FR')} &euro;
            </span>
          </div>
          <div className="w-full h-3 bg-sage-200 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full rounded-full gradient-green"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-ink-400 mt-1.5">
            {t('goalPercentage', { percentage })}
          </p>
        </div>

        {/* Action - Gold button, full width */}
        <Link
          href={`/dons/campagnes/${campagne.id}`}
          className="block w-full py-2.5 bg-gold-600 text-white text-sm font-semibold rounded-xl hover:bg-terra-600 transition-colors shadow-sm text-center"
        >
          {tc('donate')}
        </Link>
      </div>
    </FeedCard>
  );
}
