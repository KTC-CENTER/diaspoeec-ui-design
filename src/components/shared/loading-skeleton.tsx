import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

function Bone({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg shimmer-bg',
        className
      )}
    />
  );
}

/**
 * Skeleton that mimics a typical card layout with image, title, and description.
 */
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-5 shadow-card',
        className
      )}
    >
      {/* Image placeholder */}
      <Bone className="mb-4 h-36 w-full rounded-xl" />
      {/* Title */}
      <Bone className="mb-2 h-5 w-3/4" />
      {/* Subtitle */}
      <Bone className="mb-3 h-4 w-1/2" />
      {/* Description lines */}
      <Bone className="mb-2 h-3 w-full" />
      <Bone className="h-3 w-5/6" />
    </div>
  );
}

/**
 * Skeleton that mimics a list of items (e.g., notifications, comments).
 */
export function ListSkeleton({
  count = 5,
  className,
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm"
        >
          {/* Avatar */}
          <Bone className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            {/* Name */}
            <Bone className="h-4 w-1/3" />
            {/* Text */}
            <Bone className="h-3 w-2/3" />
          </div>
          {/* Timestamp / action */}
          <Bone className="h-3 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton that mimics a table layout with header and rows.
 */
export function TableSkeleton({
  rows = 5,
  cols = 5,
  className,
}: SkeletonProps & { rows?: number; cols?: number }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl bg-white shadow-card', className)}>
      {/* Header row */}
      <div
        className="grid gap-4 border-b border-ink-100 bg-cream-50 px-5 py-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, c) => (
          <Bone key={c} className="h-4 w-3/4" />
        ))}
      </div>

      {/* Body rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 border-b border-ink-100/50 px-5 py-3 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Bone
              key={c}
              className={cn(
                'h-3.5',
                c === 0 ? 'w-2/3' : 'w-4/5'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
