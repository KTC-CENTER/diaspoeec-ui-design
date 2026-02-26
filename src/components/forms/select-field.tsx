import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${selectId}-error`;

    return (
      <div className={cn('w-full', className)}>
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-ink-700"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full appearance-none rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-ink-900 outline-none transition-all',
              'focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10',
              error
                ? 'border-error focus:border-error focus:ring-error/10'
                : 'border-ink-200 hover:border-ink-300',
              !props.value && placeholder && 'text-ink-400'
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-xs text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
