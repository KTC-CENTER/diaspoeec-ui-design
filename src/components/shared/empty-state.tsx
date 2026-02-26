import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-200/40">
        <Icon className="h-8 w-8 text-ink-400" />
      </div>

      <h3
        className="text-lg font-semibold text-ink-800"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-500">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-forest-700 hover:shadow-md"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
