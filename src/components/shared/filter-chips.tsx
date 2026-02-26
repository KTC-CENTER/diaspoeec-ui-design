'use client';

import { cn } from '@/lib/utils/cn';

interface FilterChipsProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, selected, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none md:flex-wrap md:overflow-x-visible">
      {options.map((option) => {
        const isSelected = option === selected;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              isSelected
                ? 'bg-forest-900 text-white shadow-sm'
                : 'border border-sage-300/30 bg-white text-ink-600 hover:border-forest-700/20 hover:text-ink-800'
            )}
            aria-pressed={isSelected}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
