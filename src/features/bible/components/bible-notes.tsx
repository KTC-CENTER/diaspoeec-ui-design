'use client';

import { StickyNote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { NoteBible } from '@/types';

interface BibleNotesProps {
  notes: NoteBible[];
}

const badgeColors = [
  'bg-sage-200 text-forest-900',
  'bg-gold-400/50 text-gold-600',
  'bg-terra-600/10 text-terra-600',
  'bg-sage-200 text-forest-900',
  'bg-gold-400/50 text-gold-600',
];

export function BibleNotes({ notes }: BibleNotesProps) {
  const t = useTranslations('bible');

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-forest-900/6 py-10 text-center shadow-sm">
        <StickyNote className="mb-3 h-10 w-10 text-ink-300" />
        <p className="text-sm text-ink-400">
          {t('noNotes')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className="bg-white rounded-2xl border border-forest-900/6 p-5 shadow-sm card-hover"
        >
          <div className="flex items-start justify-between mb-2">
            <span className={cn(
              'px-2.5 py-0.5 rounded-full text-xs font-semibold',
              badgeColors[index % badgeColors.length]
            )}>
              {note.reference}
            </span>
            <span className="text-xs text-ink-400">
              {formatDate(note.createdAt, 'dd MMM yyyy')}
            </span>
          </div>
          <p className="text-sm text-ink-600 leading-relaxed">
            {note.contenu}
          </p>
        </div>
      ))}
    </div>
  );
}
