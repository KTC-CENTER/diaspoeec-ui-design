'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import type { Meditation } from '@/types';
import { FeedCard } from './feed-card';

interface FeedMeditationProps {
  meditation: Meditation;
}

const categorieLabels: Record<string, string> = {
  foi: 'Foi',
  priere: 'Priere',
  famille: 'Famille',
  esperance: 'Esperance',
  grace: 'Grace',
  perseverance: 'Perseverance',
};

const gradientMap: Record<string, string> = {
  foi: 'gradient-sunset',
  priere: 'gradient-forest',
  famille: 'gradient-green',
  esperance: 'gradient-terra',
  grace: 'gradient-gold',
  perseverance: 'gradient-warm',
};

export function FeedMeditation({ meditation }: FeedMeditationProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(meditation.likes);
  const { addToast } = useToastStore();

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const gradientClass = gradientMap[meditation.categorie] || 'gradient-green';

  return (
    <FeedCard>
      {/* Gradient Header */}
      <Link
        href={`/meditations/${meditation.id}`}
        className={cn(
          'flex h-48 md:h-56 relative items-end p-6',
          gradientClass
        )}
      >
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
            <Heart className="w-3 h-3 mr-1" />
            {categorieLabels[meditation.categorie] || meditation.categorie}
          </span>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Title & Author */}
        <div className="relative text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-1">
            {meditation.titre}
          </h3>
          <p className="text-white/80 text-sm">{meditation.auteurNom}</p>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <p className="text-ink-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {meditation.extrait}
        </p>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                liked
                  ? 'text-red-500'
                  : 'text-ink-400 hover:text-red-500'
              )}
              aria-label={liked ? 'Retirer le jaime' : 'Aimer'}
            >
              <Heart
                className={cn('h-4 w-4', liked && 'fill-current')}
              />
              <span>{likeCount}</span>
            </button>

            <Link
              href={`/meditations/${meditation.id}#commentaires`}
              className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-forest-900 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{meditation.commentCount}</span>
            </Link>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/meditations/${meditation.id}`);
                addToast('Lien copie dans le presse-papier', 'success');
              }}
              className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-forest-900 transition-colors"
              aria-label="Partager"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <span className="text-xs text-ink-400">
            {formatRelativeTime(meditation.publishedAt)}
          </span>
        </div>
      </div>
    </FeedCard>
  );
}
