'use client';

import { useRouter } from 'next/navigation';
import { Radio, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatRelativeTime } from '@/lib/utils/format';
import type { Video as VideoType } from '@/types';

interface LiveBannerProps {
  video: VideoType;
}

export function LiveBanner({ video }: LiveBannerProps) {
  const router = useRouter();
  const t = useTranslations('cultes');
  const startedAgo = formatRelativeTime(video.publishedAt);

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-[#2a1a3e] to-[#1a1a2e] shadow-xl shadow-ink-900/20">
      {/* Live badge bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-white animate-[livePulse_1.5s_ease-in-out_infinite]" />
            EN DIRECT
          </span>
          {video.spectateursLive && (
            <span className="text-sm text-white/60">
              {video.spectateursLive} spectateurs en direct
            </span>
          )}
        </div>
        <span className="hidden text-xs text-white/40 sm:block">
          Commence {startedAgo}
        </span>
      </div>

      {/* Video placeholder — clique ouvre le player intégré */}
      <div
        onClick={() => router.push(`/cultes/${video.id}`)}
        className="group relative mx-5 my-3 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a2e] via-[#2d1b45] to-forest-900/40"
      >
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border border-white/5" />
          <div className="absolute h-48 w-48 rounded-full border border-white/[0.03]" />
        </div>
        {/* Play button */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
          <svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {/* Corner label */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-lg bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
          <Video className="h-3 w-3" /> LIVE
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-5">
        <h2
          className="mb-1 text-xl font-bold text-white md:text-2xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {video.titre}
        </h2>
        <p className="mb-4 text-sm text-white/50">
          Commence {startedAgo}
        </p>
        <button
          onClick={() => router.push(`/cultes/${video.id}`)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-terra-600 px-8 py-3 font-semibold text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:from-red-700 hover:to-terra-600/90 hover:shadow-red-600/40 sm:w-auto"
        >
          <Radio className="h-5 w-5" />
          {t('joinLive')}
        </button>
      </div>
    </div>
  );
}
