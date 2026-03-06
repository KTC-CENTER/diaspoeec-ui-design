'use client';

import Link from 'next/link';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import type { Meditation } from '@/types';

interface MeditationCardProps {
  meditation: Meditation;
}

const categorieKeys: Record<string, string> = {
  foi: 'faith',
  priere: 'prayer',
  famille: 'family',
  esperance: 'hope',
  grace: 'grace',
  perseverance: 'perseverance',
};

const gradientMap: Record<string, string> = {
  foi: 'gradient-sunset',
  priere: 'gradient-forest',
  famille: 'gradient-green',
  esperance: 'gradient-terra',
  grace: 'gradient-gold',
  perseverance: 'gradient-warm',
};

export function MeditationCard({ meditation }: MeditationCardProps) {
  const t = useTranslations('meditations');
  const gradientClass = gradientMap[meditation.categorie] || 'gradient-green';
  const dateStr = formatDate(meditation.publishedAt, 'dd MMM');

  return (
    <Link
      href={`/meditations/${meditation.id}`}
      className="group block bg-white rounded-2xl border border-forest-900/6 overflow-hidden card-hover shadow-sm cursor-pointer"
    >
      {/* Gradient Thumbnail - h-40 to match design */}
      <div
        className={cn(
          'relative h-40',
          gradientClass
        )}
      >
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium">
            {categorieKeys[meditation.categorie] ? t(categorieKeys[meditation.categorie]) : meditation.categorie}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-bold text-ink-900 mb-1">
          {meditation.titre}
        </h3>

        {/* Author */}
        <p className="text-sm text-ink-400 mb-3">
          {meditation.auteurNom}
        </p>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-xs text-ink-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {meditation.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {meditation.commentCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {meditation.tempsLecture} min
            </span>
            <span>&middot;</span>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
