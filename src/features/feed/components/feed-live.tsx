'use client';

import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Video } from '@/types';
import { FeedCard } from './feed-card';

interface FeedLiveProps {
  video: Video;
}

export function FeedLive({ video }: FeedLiveProps) {
  const t = useTranslations('cultes');
  return (
    <FeedCard>
      {/* Video Thumbnail */}
      <div className="gradient-deep h-48 relative flex items-center justify-center group cursor-pointer">
        {/* Live Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            EN DIRECT
          </span>
        </div>

        {/* Play Button */}
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom gradient with title */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <h3 className="text-lg font-bold text-white">
            {video.titre}
          </h3>
        </div>
      </div>

      {/* CTA */}
      <div className="p-4">
        <Link
          href="/cultes"
          className="flex items-center justify-center gap-2 text-forest-900 font-semibold text-sm hover:text-forest-700 transition-colors"
        >
          {t('joinLive')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </FeedCard>
  );
}
