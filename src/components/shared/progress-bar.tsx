'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  shimmer?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
} as const;

export function ProgressBar({
  value,
  showLabel = false,
  size = 'md',
  shimmer = false,
  className,
}: ProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const clampedValue = Math.min(100, Math.max(0, value));

  // Animate on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(clampedValue);
    }, 100);
    return () => clearTimeout(timeout);
  }, [clampedValue]);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-ink-500">Progression</span>
          <span
            className="text-xs font-semibold text-forest-700"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-sage-200/50',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r from-forest-700 to-sage-400 transition-all duration-700 ease-out',
            shimmer && 'relative overflow-hidden'
          )}
          style={{ width: `${animatedValue}%` }}
        >
          {shimmer && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer bg-[length:200%_100%]" />
          )}
        </div>
      </div>
    </div>
  );
}
