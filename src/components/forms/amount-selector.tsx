'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

interface AmountSelectorProps {
  amounts: number[];
  selected: number | null;
  onSelect: (amount: number) => void;
  currency: string;
}

export function AmountSelector({
  amounts,
  selected,
  onSelect,
  currency,
}: AmountSelectorProps) {
  const td = useTranslations('dons');
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const isPresetSelected = (amount: number) =>
    selected === amount && !customMode;

  const handlePresetClick = (amount: number) => {
    setCustomMode(false);
    setCustomValue('');
    onSelect(amount);
  };

  const handleCustomFocus = () => {
    setCustomMode(true);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onSelect(num);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preset Amount Buttons */}
      <div className="flex flex-wrap gap-2">
        {amounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePresetClick(amount)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200',
              isPresetSelected(amount)
                ? 'bg-forest-900 text-white shadow-sm'
                : 'border border-ink-200 bg-white text-ink-700 hover:border-forest-700/30 hover:bg-forest-900/5'
            )}
          >
            {amount} {currency}
          </button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          placeholder={td('otherAmountPlaceholder')}
          value={customValue}
          onFocus={handleCustomFocus}
          onChange={handleCustomChange}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all',
            'focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10',
            customMode && customValue
              ? 'border-forest-500 ring-2 ring-forest-500/10'
              : 'border-ink-200 hover:border-ink-300'
          )}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-400">
          {currency}
        </span>
      </div>
    </div>
  );
}
