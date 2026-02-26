import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  color?: string;
}

const colorMap: Record<string, { bg: string; icon: string }> = {
  forest: { bg: 'bg-forest-900/10', icon: 'text-forest-700' },
  gold: { bg: 'bg-gold-400/15', icon: 'text-gold-600' },
  terra: { bg: 'bg-terra-600/10', icon: 'text-terra-600' },
  sage: { bg: 'bg-sage-400/15', icon: 'text-forest-600' },
  blue: { bg: 'bg-info/10', icon: 'text-info' },
  red: { bg: 'bg-error/10', icon: 'text-error' },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive,
  color = 'forest',
}: StatCardProps) {
  const colorClasses = colorMap[color] ?? colorMap.forest;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      {/* Icon Circle */}
      <div
        className={cn(
          'mb-4 flex h-11 w-11 items-center justify-center rounded-xl',
          colorClasses.bg
        )}
      >
        <Icon className={cn('h-5 w-5', colorClasses.icon)} />
      </div>

      {/* Value */}
      <p
        className="text-2xl font-bold text-ink-900"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {value}
      </p>

      {/* Label & Trend */}
      <div className="mt-1 flex items-center justify-between">
        <span className="text-sm text-ink-500">{label}</span>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              trendPositive ? 'text-success' : 'text-error'
            )}
          >
            {trendPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
