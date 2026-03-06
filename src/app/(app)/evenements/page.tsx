'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useEvenements } from '@/features/evenements/hooks/use-evenements';
import { EventCard } from '@/features/evenements/components/event-card';
import { MiniCalendar } from '@/features/evenements/components/mini-calendar';
import type { EventType } from '@/types';

export default function EvenementsPage() {
  const t = useTranslations('evenements');
  const [activeFilter, setActiveFilter] = useState<EventType | 'tous'>('tous');
  const typeFilter = activeFilter === 'tous' ? undefined : activeFilter;
  const { data: evenements, isLoading } = useEvenements(typeFilter);

  const FILTERS: { value: EventType | 'tous'; label: string }[] = [
    { value: 'tous', label: t('all') },
    { value: 'culte', label: t('cultes') },
    { value: 'conference', label: t('conferences') },
    { value: 'retraite', label: t('retreats') },
    { value: 'formation', label: t('trainings') },
    { value: 'jeunesse', label: t('youth') },
  ];

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 animate-[fade-up_0.5s_ease-out_both]">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-ink-600 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Filter Chips */}
      <div className="animate-[fade-up_0.5s_ease-out_0.1s_both] flex gap-2 flex-wrap mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeFilter === f.value
                ? 'bg-forest-900 text-white shadow-md'
                : 'bg-white text-ink-600 border border-ink-200 hover:border-forest-900 hover:text-forest-900'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mini Calendar */}
      <div className="animate-[fade-up_0.5s_ease-out_0.2s_both] mb-8">
        <MiniCalendar events={evenements || []} />
      </div>

      {/* Section Title */}
      <h2 className="font-heading text-xl font-bold text-forest-900 mb-5 animate-[fade-up_0.5s_ease-out_0.2s_both]">
        {t('upcoming')}
      </h2>

      {/* Event Cards */}
      <div className="flex flex-col gap-5">
        {isLoading ? (
          // Skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-border bg-white p-5"
            >
              <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-2xl shimmer-bg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded shimmer-bg" />
                <div className="h-3 w-1/2 rounded shimmer-bg" />
                <div className="h-3 w-1/3 rounded shimmer-bg" />
                <div className="mt-3 flex justify-between">
                  <div className="h-6 w-20 rounded-full shimmer-bg" />
                  <div className="h-6 w-20 rounded-full shimmer-bg" />
                </div>
              </div>
            </div>
          ))
        ) : evenements && evenements.length > 0 ? (
          evenements.map((evt, index) => (
            <EventCard key={evt.id} evenement={evt} delay={index} />
          ))
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-cream-50 py-16 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-200">
              <Calendar className="h-8 w-8 text-forest-700" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-ink-900">
              {t('noEvents')}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              {t('noEventsDescription')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
