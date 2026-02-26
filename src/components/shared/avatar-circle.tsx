import { cn } from '@/lib/utils/cn';

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
} as const;

const gradients = [
  'bg-gradient-to-br from-forest-900 to-forest-600',
  'bg-gradient-to-br from-gold-600 to-gold-400',
  'bg-gradient-to-br from-terra-600 to-terra-400',
  'bg-gradient-to-br from-sage-400 to-forest-500',
  'bg-gradient-to-br from-forest-700 to-sage-400',
  'bg-gradient-to-br from-gold-700 to-terra-500',
  'bg-gradient-to-br from-terra-500 to-gold-400',
  'bg-gradient-to-br from-forest-600 to-gold-500',
] as const;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface AvatarCircleProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarCircle({ name, size = 'md', className }: AvatarCircleProps) {
  const initials = getInitials(name);
  const gradientIndex = hashName(name) % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none',
        sizeClasses[size],
        gradient,
        className
      )}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
