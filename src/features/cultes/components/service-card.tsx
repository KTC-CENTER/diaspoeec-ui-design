'use client';

import { useState } from 'react';
import { BellRing, Check, Church } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import type { ServiceAVenir } from '@/types';

interface ServiceCardProps {
  service: ServiceAVenir;
  onToggleRappel?: () => void;
}

export function ServiceCard({ service, onToggleRappel }: ServiceCardProps) {
  const [rappelSet, setRappelSet] = useState(false);
  const { addToast } = useToastStore();
  const dateStr = formatDate(service.date + 'T00:00:00Z', 'dd MMMM yyyy');

  return (
    <div className="min-w-[280px] rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900/10">
          <Church className="h-5 w-5 text-forest-900" />
        </div>
        <div>
          <p className="text-xs text-ink-500">{dateStr}</p>
          <p className="text-sm font-semibold text-forest-900">{service.heure}</p>
        </div>
      </div>
      <h3
        className="mb-1 font-bold text-ink-900"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {service.titre}
      </h3>
      <p className="mb-4 text-sm text-ink-500">{service.lieu}</p>
      <button
        onClick={() => {
          setRappelSet(!rappelSet);
          if (onToggleRappel) onToggleRappel();
          addToast(
            rappelSet ? 'Rappel supprime' : `Rappel defini pour "${service.titre}"`,
            rappelSet ? 'info' : 'success'
          );
        }}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition-colors',
          rappelSet
            ? 'border-forest-700 bg-forest-900/10 text-forest-900'
            : 'border-gold-600/30 text-gold-600 hover:border-terra-600/30 hover:text-terra-600'
        )}
      >
        {rappelSet ? <Check className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
        {rappelSet ? 'Rappel defini' : 'Definir un rappel'}
      </button>
    </div>
  );
}
