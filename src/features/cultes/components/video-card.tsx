'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import { useToggleVideoLike } from '../hooks/use-cultes';
import type { Video } from '@/types';

interface VideoCardProps {
  video: Video;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function VideoCard({ video }: VideoCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(video.userLiked ?? false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const { addToast } = useToastStore();
  const toggleLike = useToggleVideoLike();

  return (
    <div
      onClick={() => router.push(`/cultes/${video.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-sage-400/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,67,50,0.12)]"
    >
      {/* 16:9 Thumbnail */}
      <div
        className={cn(
          'relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br',
          video.thumbnailGradient || 'from-forest-700/80 via-forest-600/60 to-sage-400/40'
        )}
      >
        {/* Play Overlay - opacity 0 by default, shown on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
            <svg className="ml-0.5 h-6 w-6 text-forest-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration Badge */}
        {video.dureeSeconds && (
          <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            {formatDuration(video.dureeSeconds)}
          </div>
        )}

        {/* Badge (POPULAIRE or NOEL etc.) */}
        {video.badge && (
          <div
            className={cn(
              'absolute left-2 top-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-white',
              video.badge === 'POPULAIRE'
                ? 'bg-gold-600/90'
                : 'bg-red-700/80'
            )}
          >
            {video.badge !== 'POPULAIRE' && (
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {video.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="mb-1 line-clamp-2 font-bold text-ink-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {video.titre}
        </h3>
        <p className="mb-3 text-sm text-ink-500">{video.auteur}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span>{video.vues} vues</span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-400" />
              {likesCount}
            </span>
            <span>{formatRelativeTime(video.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newLiked = !liked;
                setLiked(newLiked);
                setLikesCount((prev) => prev + (newLiked ? 1 : -1));
                toggleLike.mutate(video.id, {
                  onError: () => {
                    setLiked(!newLiked);
                    setLikesCount((prev) => prev + (newLiked ? -1 : 1));
                  },
                });
              }}
              disabled={toggleLike.isPending}
              className="rounded-lg p-1.5 transition-colors hover:bg-sage-100/50"
            >
              <Heart className={cn('h-4 w-4', liked ? 'fill-red-400 text-red-400' : 'text-ink-500')} />
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const url = `${window.location.origin}/cultes/${video.id}`;
                if (navigator.share) {
                  try {
                    await navigator.share({ title: video.titre, url });
                  } catch {
                    // user dismissed share sheet — silently ignore
                  }
                } else {
                  await navigator.clipboard.writeText(url);
                  addToast('Lien copie dans le presse-papier', 'success');
                }
              }}
              className="rounded-lg p-1.5 transition-colors hover:bg-sage-100/50"
            >
              <Share2 className="h-4 w-4 text-ink-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
