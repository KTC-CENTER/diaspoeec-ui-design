'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/format';
import type { Meditation } from '@/types';

interface MeditationFeaturedProps {
  meditation: Meditation;
}

export function MeditationFeatured({ meditation }: MeditationFeaturedProps) {
  return (
    <Link
      href={`/meditations/${meditation.id}`}
      className="block bg-white rounded-2xl border border-forest-900/6 overflow-hidden card-hover shadow-sm"
    >
      {/* Full-width Gradient Hero */}
      <div className="gradient-warm h-56 md:h-72 relative flex items-end p-6 cursor-pointer">
        {/* Featured Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gold-600 text-white text-xs font-bold shadow-md">
            {'\u{2728}'} Meditation du jour
          </span>
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative text-white w-full">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {meditation.titre}
          </h2>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold backdrop-blur-sm">
              {getInitials(meditation.auteurNom)}
            </div>
            <div>
              <p className="text-white/90 text-sm font-medium">
                {meditation.auteurNom}
              </p>
              <p className="text-white/60 text-xs">
                {meditation.auteurRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
