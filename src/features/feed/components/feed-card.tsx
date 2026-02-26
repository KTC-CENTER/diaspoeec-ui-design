'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface FeedCardProps {
  children: ReactNode;
  className?: string;
}

export function FeedCard({ children, className }: FeedCardProps) {
  return (
    <article
      className={cn(
        'bg-white rounded-2xl border border-forest-900/6 overflow-hidden card-hover shadow-sm',
        className
      )}
    >
      {children}
    </article>
  );
}
