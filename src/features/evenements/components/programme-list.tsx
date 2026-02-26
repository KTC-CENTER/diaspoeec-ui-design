import { cn } from '@/lib/utils/cn';
import type { ProgrammeItem } from '@/types';

interface ProgrammeListProps {
  items: ProgrammeItem[];
}

export function ProgrammeList({ items }: ProgrammeListProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-sage-200/30 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
        Programme
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="text-sm font-semibold text-forest-900 bg-sage-200 px-2 py-0.5 rounded-md whitespace-nowrap">
              {item.heure}
            </span>
            <span className="text-ink-600 text-sm">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
