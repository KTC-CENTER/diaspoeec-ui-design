import { cn } from '@/lib/utils/cn';

interface LiveBadgeProps {
  variant?: 'full' | 'dot';
  className?: string;
}

export function LiveBadge({ variant = 'full', className }: LiveBadgeProps) {
  if (variant === 'dot') {
    return (
      <span
        className={cn('relative inline-flex h-3 w-3', className)}
        aria-label="En direct"
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
      aria-label="En direct"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      EN DIRECT
    </span>
  );
}
