import { cn } from '@/lib/utils/cn';
import { AvatarCircle } from './avatar-circle';

interface AvatarStackProps {
  names: string[];
  max?: number;
  size?: 'sm' | 'md';
}

export function AvatarStack({ names, max = 4, size = 'sm' }: AvatarStackProps) {
  const visible = names.slice(0, max);
  const remaining = names.length - max;

  return (
    <div className="flex items-center">
      {visible.map((name, index) => (
        <div
          key={`${name}-${index}`}
          className={cn(
            'relative ring-2 ring-white rounded-full',
            index > 0 && '-ml-2'
          )}
          style={{ zIndex: visible.length - index }}
        >
          <AvatarCircle name={name} size={size} />
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={cn(
            '-ml-2 relative flex shrink-0 items-center justify-center rounded-full bg-ink-200 font-semibold text-ink-600 ring-2 ring-white select-none',
            size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
          )}
          style={{ zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
