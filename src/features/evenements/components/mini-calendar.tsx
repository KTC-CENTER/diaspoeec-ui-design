'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Evenement } from '@/types';

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const MOIS_NOMS = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

const typeColor: Record<string, string> = {
  culte: 'bg-forest-900',
  conference: 'bg-gold-600',
  retraite: 'bg-terra-600',
  formation: 'bg-terra-600',
  jeunesse: 'bg-forest-700',
};

interface MiniCalendarProps {
  events: Evenement[];
}

export function MiniCalendar({ events }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(1); // 0-indexed, Feb = 1
  const [currentYear, setCurrentYear] = useState(2026);

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const eventsByDay = useMemo(() => {
    const map: Record<number, Evenement[]> = {};
    events.forEach((evt) => {
      const d = new Date(evt.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(evt);
      }
    });
    return map;
  }, [events, currentMonth, currentYear]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (() => {
    const d = new Date(currentYear, currentMonth, 1).getDay();
    return d === 0 ? 6 : d - 1; // Monday = 0
  })();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage-200/50 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-sage-200/50 transition"
          aria-label="Mois precedent"
        >
          <ChevronLeft className="w-5 h-5 text-ink-600" />
        </button>
        <h3 className="font-heading font-bold text-forest-900 text-lg">
          {MOIS_NOMS[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-sage-200/50 transition"
          aria-label="Mois suivant"
        >
          <ChevronRight className="w-5 h-5 text-ink-600" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {JOURS.map((j) => (
          <div key={j} className="text-ink-600 font-medium py-2">
            {j}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="py-2 text-ink-300" />;
          }

          const isToday =
            day === todayDate &&
            currentMonth === todayMonth &&
            currentYear === todayYear;
          const dayEvents = eventsByDay[day] || [];

          return (
            <div
              key={`day-${day}`}
              className="py-2 text-ink-900 relative"
            >
              {isToday ? (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-forest-900 text-white rounded-full font-bold text-sm">
                  {day}
                </span>
              ) : (
                <span>{day}</span>
              )}
              {dayEvents.length > 0 && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((evt, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        typeColor[evt.type] || 'bg-ink-400'
                      )}
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-ink-100 text-xs text-ink-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-forest-900 rounded-full" />
          Culte
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-gold-600 rounded-full" />
          Conference
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-terra-600 rounded-full" />
          Special
        </span>
      </div>
    </div>
  );
}
