import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface RadioCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onChange: () => void;
  children?: ReactNode;
}

export function RadioCard({
  label,
  description,
  selected,
  onChange,
  children,
}: RadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onChange}
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200',
        selected
          ? 'border-forest-700 bg-forest-700/5 shadow-sm'
          : 'border-ink-100 bg-white hover:border-ink-200 hover:shadow-sm'
      )}
    >
      {/* Radio Circle Indicator */}
      <div className="mt-0.5 flex shrink-0 items-center justify-center">
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all',
            selected
              ? 'border-forest-700'
              : 'border-ink-300'
          )}
        >
          {selected && (
            <div className="h-2.5 w-2.5 rounded-full bg-forest-700" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-semibold',
            selected ? 'text-forest-900' : 'text-ink-800'
          )}
        >
          {label}
        </p>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-3">{children}</div>
        )}
      </div>
    </button>
  );
}
