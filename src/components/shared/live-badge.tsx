'use client';

import { cn } from '@/lib/utils/cn';
import { useTranslations } from 'next-intl';

interface LiveBadgeProps {
  variant?: 'full' | 'dot';
  className?: string;
}

export function LiveBadge({ variant = 'full', className }: LiveBadgeProps) {
  const t = useTranslations('cultes');

  if (variant === 'dot') {
    return (
      <span
        className={cn('relative inline-flex h-3 w-3', className)}
        aria-label={t('live')}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white',
        className
      )}
      aria-label={t('live')}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      {t('live')}
    </span>
  );
}
