'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FeedCard } from './feed-card';

interface FeedBibleProps {
  reference: string;
  titre: string;
  texte?: string | null;
}

export function FeedBible({ reference, titre, texte }: FeedBibleProps) {
  const t = useTranslations('bible');
  return (
    <FeedCard>
      <div className="p-5">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{'\u{1F4D6}'}</span>
          <span className="text-xs font-semibold text-forest-900 uppercase tracking-wider">
            {t('dailyReading')}
          </span>
        </div>

        {/* Reference */}
        <h3 className="text-lg font-bold text-ink-900 mb-1">{reference}</h3>

        {/* Titre (si différent de la référence) */}
        {titre && titre !== reference && (
          <p className="text-sm font-medium text-forest-700 mb-3">{titre}</p>
        )}

        {/* Extrait du texte */}
        {texte && (
          <p className="text-sm text-ink-600 leading-relaxed mb-4 line-clamp-4 italic">
            &ldquo;{texte}&rdquo;
          </p>
        )}

        {/* CTA */}
        <Link
          href="/bible"
          className="block w-full py-2.5 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors shadow-sm text-center"
        >
          {t('readInBible')}
        </Link>
      </div>
    </FeedCard>
  );
}
