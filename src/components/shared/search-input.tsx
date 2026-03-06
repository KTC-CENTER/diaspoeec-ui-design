'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  className,
}: SearchInputProps) {
  const tc = useTranslations('common');
  const resolvedPlaceholder = placeholder ?? `${tc('search')}...`;
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2.5 transition-all focus-within:border-forest-500 focus-within:ring-2 focus-within:ring-forest-500/10',
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-ink-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-600 transition-colors"
          aria-label={tc('clearSearch')}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
