'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  className?: string;
  error?: boolean;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Selectionner...',
  className,
  error,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(options.length * 44 + 8, 240);
    const spaceBelow = viewportHeight - rect.bottom;
    const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    setPosition({
      top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      openUpward,
    });
  }, [options.length]);

  const handleOpen = () => {
    calculatePosition();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => calculatePosition();
    const handleResize = () => setOpen(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, calculatePosition]);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm transition-all',
          open
            ? 'border-forest-500 ring-2 ring-forest-500/10'
            : error
              ? 'border-error'
              : 'border-ink-200 hover:border-ink-300'
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={cn('truncate', selected ? 'text-ink-900' : 'text-ink-400')}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-ink-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {mounted && open && position &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setOpen(false)}
            />
            <div
              role="listbox"
              style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 9999,
              }}
              className="max-h-60 overflow-y-auto rounded-xl border border-ink-200 bg-white py-1 shadow-xl"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-cream-50',
                    value === option.value
                      ? 'bg-forest-900/5 font-medium text-forest-900'
                      : 'text-ink-600'
                  )}
                >
                  {value === option.value && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-forest-900" />
                  )}
                  <span className={value === option.value ? '' : 'pl-[22px]'}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
