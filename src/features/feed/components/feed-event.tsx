'use client';

import Link from 'next/link';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import type { Evenement } from '@/types';
import { FeedCard } from './feed-card';

interface FeedEventProps {
  evenement: Evenement;
}

const avatarColors = [
  'bg-forest-900',
  'bg-terra-600',
  'bg-gold-600',
  'bg-forest-700',
];

const avatarInitials = ['MC', 'SB', 'JE', 'EN'];

export function FeedEvent({ evenement }: FeedEventProps) {
  const eventDate = new Date(evenement.date);
  const dayNum = eventDate.getDate().toString().padStart(2, '0');
  const monthShort = formatDate(evenement.date, 'MMM').toUpperCase();
  const timeStr = formatDate(evenement.date, 'HH:mm');

  return (
    <FeedCard>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Date Badge - Gold themed */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gold-400/40 flex flex-col items-center justify-center border-2 border-gold-600/30">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">
              {monthShort}
            </span>
            <span className="text-2xl font-bold text-ink-900">
              {dayNum}
            </span>
          </div>

          {/* Event Details */}
          <div className="flex-1 min-w-0">
            {/* Event Tag */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gold-400/40 text-gold-600 text-[11px] font-semibold mb-2">
              <Calendar className="w-3 h-3 mr-1" />
              Evenement
            </span>

            <h3 className="text-lg font-bold text-ink-900 mb-1.5">
              {evenement.titre}
            </h3>

            <div className="flex flex-col gap-1.5 text-sm text-ink-600 mb-3">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terra-600" />
                {evenement.lieu}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-forest-700" />
                {timeStr}
              </span>
            </div>

            {/* Attendees & Action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Avatar Stack */}
                <div className="flex -space-x-2">
                  {avatarInitials.slice(0, Math.min(4, evenement.participantsInscrits)).map(
                    (initials, i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold border-2 border-white',
                          avatarColors[i]
                        )}
                      >
                        {initials}
                      </div>
                    )
                  )}
                </div>
                <span className="ml-2 text-xs text-ink-400">
                  +{evenement.participantsInscrits} inscrits
                </span>
              </div>

              <Link
                href={`/evenements/${evenement.id}`}
                className="px-4 py-2 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors shadow-sm"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FeedCard>
  );
}
