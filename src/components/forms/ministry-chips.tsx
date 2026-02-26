'use client';

import { cn } from '@/lib/utils/cn';

interface ChipOption {
  value: string;
  label: string;
}

interface MinistryChipsProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MinistryChips({ options, selected, onChange }: MinistryChipsProps) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              isSelected
                ? 'bg-forest-900 text-white shadow-sm'
                : 'border border-ink-200 bg-white text-ink-600 hover:border-forest-700/20 hover:text-ink-800'
            )}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
