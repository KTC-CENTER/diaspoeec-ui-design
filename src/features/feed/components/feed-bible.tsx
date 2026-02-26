'use client';

import Link from 'next/link';
import { FeedCard } from './feed-card';

interface FeedBibleProps {
  reference: string;
  titre: string;
  planNom: string;
  jour: number;
  totalJours: number;
}

export function FeedBible({
  reference,
  titre,
  planNom,
  jour,
  totalJours,
}: FeedBibleProps) {
  const percentage = Math.round((jour / totalJours) * 100);

  return (
    <FeedCard>
      <div className="p-5">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{'\u{1F4D6}'}</span>
          <span className="text-xs font-semibold text-forest-900 uppercase tracking-wider">
            Lecture du jour
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-ink-900 mb-2">
          {reference} : {titre}
        </h3>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-sage-200 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full rounded-full gradient-green"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-ink-400 font-medium whitespace-nowrap">
            Jour {jour}/{totalJours}
          </span>
        </div>

        {/* Plan Name */}
        <p className="text-sm text-ink-400 mb-4">
          Plan &laquo;{planNom}&raquo;
        </p>

        {/* Action */}
        <Link
          href="/bible"
          className="block w-full py-2.5 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors shadow-sm text-center"
        >
          Continuer la lecture
        </Link>
      </div>
    </FeedCard>
  );
}
