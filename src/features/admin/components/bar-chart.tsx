'use client';

import { cn } from '@/lib/utils/cn';

interface BarChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[];
  maxValue?: number;
  color?: string;
  horizontal?: boolean;
  title?: string;
}

export function BarChart({
  data,
  maxValue,
  color = 'forest',
  horizontal = false,
  title,
}: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  const colorMap: Record<
    string,
    {
      gradient: string;
      gradientHighlight: string;
      text: string;
      trackBg: string;
      hGradient: string;
      hTrackBg: string;
    }
  > = {
    forest: {
      gradient: 'bg-gradient-to-t from-forest-900 to-forest-700',
      gradientHighlight: 'bg-gradient-to-t from-forest-900 to-sage-400',
      text: 'text-forest-900',
      trackBg: 'bg-sage-200',
      hGradient: 'bg-gradient-to-r from-forest-900 to-forest-700',
      hTrackBg: 'bg-sage-200',
    },
    gold: {
      gradient: 'bg-gradient-to-t from-gold-600 to-gold-400',
      gradientHighlight: 'bg-gradient-to-t from-gold-600 to-gold-400',
      text: 'text-gold-600',
      trackBg: 'bg-gold-400/20',
      hGradient: 'bg-gradient-to-r from-gold-600 to-gold-400',
      hTrackBg: 'bg-gold-400/20',
    },
    sage: {
      gradient: 'bg-gradient-to-t from-sage-400 to-forest-500',
      gradientHighlight: 'bg-gradient-to-t from-sage-400 to-forest-500',
      text: 'text-forest-600',
      trackBg: 'bg-sage-200',
      hGradient: 'bg-gradient-to-r from-sage-400 to-forest-500',
      hTrackBg: 'bg-sage-200',
    },
    terra: {
      gradient: 'bg-gradient-to-t from-terra-600 to-orange-300',
      gradientHighlight: 'bg-gradient-to-t from-terra-600 to-orange-300',
      text: 'text-terra-600',
      trackBg: 'bg-orange-50',
      hGradient: 'bg-gradient-to-r from-terra-600 to-orange-300',
      hTrackBg: 'bg-orange-50',
    },
  };

  const colors = colorMap[color] || colorMap.forest;

  if (horizontal) {
    return (
      <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
        {title && (
          <h3
            className="mb-6 text-lg font-semibold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h3>
        )}
        <div className="space-y-5">
          {data.map((item, i) => {
            const percent = max > 0 ? Math.round((item.value / max) * 100) : 0;
            // Pick specific colors per campaign to match HTML
            const itemColors = getHorizontalBarColors(i, data.length);
            return (
              <div key={i}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-ink-900">{item.label}</span>
                  <span className={cn('font-semibold', itemColors.text)}>
                    {item.value.toLocaleString('fr-FR')} &euro;
                  </span>
                </div>
                <div className={cn('h-3 w-full rounded-full', itemColors.track)}>
                  <div
                    className={cn(
                      'h-3 rounded-full bar-h-animate',
                      itemColors.bar
                    )}
                    style={
                      {
                        '--w': `${Math.min(percent, 100)}%`,
                        width: `${Math.min(percent, 100)}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
      {title && (
        <h3
          className="mb-6 text-lg font-semibold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h3>
      )}
      <div className="flex items-end gap-3 px-2" style={{ height: '200px' }}>
        {data.map((item, i) => {
          const percent = max > 0 ? Math.round((item.value / max) * 100) : 0;
          // Highlight the highest bar
          const isHighest = item.value === max;
          const barGradient =
            isHighest || i === data.length - 1
              ? colors.gradientHighlight
              : colors.gradient;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >
              <span
                className={cn('mb-1 text-xs font-semibold', colors.text)}
              >
                {item.value.toLocaleString('fr-FR')}
              </span>
              <div
                className={cn('w-full rounded-t-lg bar-animate', barGradient)}
                style={
                  {
                    '--h': `${Math.max(percent, 4)}%`,
                    height: `${Math.max(percent, 4)}%`,
                  } as React.CSSProperties
                }
              />
              <span className="mt-2 text-[11px] text-ink-500">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Returns appropriate colors for each horizontal bar item to match the HTML design. */
function getHorizontalBarColors(
  index: number,
  _total: number
): { bar: string; track: string; text: string } {
  const palette = [
    {
      bar: 'bg-gradient-to-r from-forest-900 to-forest-700',
      track: 'bg-sage-200',
      text: 'text-forest-900',
    },
    {
      bar: 'bg-gradient-to-r from-forest-900 to-sage-400',
      track: 'bg-sage-200',
      text: 'text-forest-900',
    },
    {
      bar: 'bg-gradient-to-r from-gold-600 to-gold-400',
      track: 'bg-gold-400/20',
      text: 'text-gold-600',
    },
    {
      bar: 'bg-gradient-to-r from-terra-600 to-orange-300',
      track: 'bg-orange-50',
      text: 'text-terra-600',
    },
  ];
  return palette[index % palette.length];
}
