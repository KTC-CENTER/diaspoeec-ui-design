'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const EMOJI_CATEGORIES = [
  {
    label: 'Spirituel',
    emojis: [
      { emoji: '\u{1F64F}', label: 'Prieres' },
      { emoji: '\u{271D}\u{FE0F}', label: 'Croix' },
      { emoji: '\u{26EA}', label: 'Eglise' },
      { emoji: '\u{1F54A}\u{FE0F}', label: 'Colombe' },
      { emoji: '\u{1F4D6}', label: 'Bible' },
      { emoji: '\u{2728}', label: 'Divin' },
      { emoji: '\u{1F31F}', label: 'Etoile' },
      { emoji: '\u{1F56F}\u{FE0F}', label: 'Bougie' },
      { emoji: '\u{1F525}', label: 'Feu Saint-Esprit' },
      { emoji: '\u{2764}\u{FE0F}', label: 'Amour' },
      { emoji: '\u{1F49C}', label: 'Amour divin' },
      { emoji: '\u{1F49B}', label: 'Joie' },
      { emoji: '\u{1F49A}', label: 'Esperance' },
      { emoji: '\u{1F30D}', label: 'Monde' },
      { emoji: '\u{1F33F}', label: 'Paix' },
    ],
  },
  {
    label: 'Louange',
    emojis: [
      { emoji: '\u{1F64C}', label: 'Louange' },
      { emoji: '\u{1F3B5}', label: 'Chant' },
      { emoji: '\u{1F3B6}', label: 'Musique' },
      { emoji: '\u{1F3B9}', label: 'Piano' },
      { emoji: '\u{1F44F}', label: 'Applaudissements' },
      { emoji: '\u{1F4AA}', label: 'Force' },
      { emoji: '\u{1F91D}', label: 'Communion' },
      { emoji: '\u{1FAF6}', label: 'Coeur mains' },
      { emoji: '\u{270C}\u{FE0F}', label: 'Victoire' },
      { emoji: '\u{1F64F}', label: 'Amen' },
    ],
  },
  {
    label: 'Emotions',
    emojis: [
      { emoji: '\u{1F60A}', label: 'Sourire' },
      { emoji: '\u{1F602}', label: 'Rire' },
      { emoji: '\u{1F622}', label: 'Larmes' },
      { emoji: '\u{1F62D}', label: 'Pleurs' },
      { emoji: '\u{1F970}', label: 'Amour' },
      { emoji: '\u{1F607}', label: 'Ange' },
      { emoji: '\u{1F929}', label: 'Emerveillement' },
      { emoji: '\u{1F917}', label: 'Calin' },
      { emoji: '\u{1F914}', label: 'Reflexion' },
      { emoji: '\u{1F4AF}', label: '100%' },
    ],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ onSelect, className }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-center rounded-lg p-1.5 transition-colors',
          open
            ? 'bg-forest-900/10 text-forest-900'
            : 'text-ink-400 hover:text-forest-900 hover:bg-forest-900/5'
        )}
        aria-label="Emojis"
      >
        <Smile className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 sm:left-auto sm:right-0 z-50 mb-2 w-[280px] max-w-[calc(100vw-2rem)] rounded-2xl border border-forest-900/10 bg-white p-3 shadow-xl">
            {/* Tabs */}
            <div className="mb-2 flex gap-1 border-b border-forest-900/5 pb-2">
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    'flex-1 rounded-lg py-1 text-[11px] font-medium transition-colors',
                    activeTab === i
                      ? 'bg-forest-900 text-white'
                      : 'text-ink-500 hover:bg-sage-200'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div className="grid grid-cols-5 gap-1">
              {EMOJI_CATEGORIES[activeTab].emojis.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onSelect(item.emoji);
                    setOpen(false);
                  }}
                  title={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-transform hover:scale-125 hover:bg-sage-200/50"
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
