'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LikeButtonProps {
  count: number;
  liked?: boolean;
  onToggle?: () => void;
}

export function LikeButton({ count, liked = false, onToggle }: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggle?.();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all',
        liked
          ? 'bg-red-50 text-red-500'
          : 'bg-ink-100/50 text-ink-500 hover:bg-red-50 hover:text-red-400'
      )}
      aria-label={liked ? 'Retirer le j\'aime' : 'Aimer'}
      aria-pressed={liked}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all duration-300',
          liked && 'fill-red-500 text-red-500',
          isAnimating && 'scale-125'
        )}
      />
      <span className="font-medium tabular-nums">{count}</span>
    </button>
  );
}
