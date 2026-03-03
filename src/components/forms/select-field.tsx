'use client';

import { cn } from '@/lib/utils/cn';
import { CustomSelect, type CustomSelectOption } from './custom-select';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  className,
}: SelectFieldProps) {
  const selectId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${selectId}-error`;

  return (
    <div className={cn('w-full', className)}>
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-sm font-medium text-ink-700"
      >
        {label}
      </label>
      <CustomSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        error={!!error}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
