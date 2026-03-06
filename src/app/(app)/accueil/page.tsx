'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth.store';
import { useFeed } from '@/features/feed/hooks/use-feed';
import { FeedMeditation } from '@/features/feed/components/feed-meditation';
import { FeedEvent } from '@/features/feed/components/feed-event';
import { FeedBirthday } from '@/features/feed/components/feed-birthday';
import { FeedCampaign } from '@/features/feed/components/feed-campaign';
import { FeedLive } from '@/features/feed/components/feed-live';
import { FeedBible } from '@/features/feed/components/feed-bible';
import type { Meditation, Evenement, Campagne, Video } from '@/types';

const quickActionKeys = [
  { key: 'dailyMeditation' as const, emoji: '\u{1F64F}', href: '/meditations', bgColor: 'bg-sage-200' },
  { key: 'nextEvent' as const, emoji: '\u{1F4C5}', href: '/evenements', bgColor: 'bg-gold-400/40' },
  { key: 'donate' as const, emoji: '\u{1F49B}', href: '/dons/nouveau', bgColor: 'bg-gold-400/50' },
  { key: 'dailyReading' as const, emoji: '\u{1F4D6}', href: '/bible', bgColor: 'bg-sage-200' },
];

function FeedSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white p-5 border border-forest-900/6 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full shimmer-bg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded shimmer-bg" />
              <div className="h-2.5 w-20 rounded shimmer-bg" />
            </div>
          </div>
          <div className="mb-3 h-36 rounded-xl shimmer-bg" />
          <div className="mb-2 h-4 w-3/4 rounded shimmer-bg" />
          <div className="mb-4 h-3 w-full rounded shimmer-bg" />
          <div className="h-3 w-1/4 rounded shimmer-bg" />
        </div>
      ))}
    </div>
  );
}

export default function AccueilPage() {
  const { user } = useAuthStore();
  const { data: feedItems, isLoading } = useFeed();
  const t = useTranslations('accueil');

  const today = formatDate(new Date().toISOString(), 'EEEE dd MMMM yyyy');
  const userName = user?.nomComplet || 'Fidele';

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 md:text-4xl">
          {t('greeting', { name: userName })} <span className="inline-block">{'\u{1F44B}'}</span>
        </h1>
        <p className="text-base text-ink-600">
          {t('blessing')}
        </p>
        <p className="mt-1 text-sm font-medium text-gold-600 capitalize">{today}</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar md:grid md:grid-cols-4 md:overflow-visible">
          {quickActionKeys.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex-shrink-0 w-[140px] md:w-auto bg-white rounded-2xl p-4 border border-forest-900/6 card-hover shadow-sm text-left"
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl mb-3 group-hover:scale-110 transition-transform',
                action.bgColor
              )}>
                <span className="text-xl">{action.emoji}</span>
              </div>
              <p className="text-sm font-semibold text-ink-900">
                {t(action.key)}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Afro Divider */}
      <div className="afro-divider mb-8" />

      {/* Community Feed */}
      <h2 className="text-xl font-bold text-ink-900 mb-5">
        {t('communityFeed')}
      </h2>

      {isLoading ? (
        <FeedSkeleton />
      ) : (
        <div className="space-y-5">
          {feedItems?.map((item, index) => {
            const element = (() => {
              switch (item.type) {
                case 'meditation': {
                  const med = item.data as unknown as Meditation;
                  return <FeedMeditation key={item.id} meditation={med} />;
                }
                case 'evenement': {
                  const evt = item.data as unknown as Evenement;
                  return <FeedEvent key={item.id} evenement={evt} />;
                }
                case 'anniversaire': {
                  const bd = item.data as { nom: string; age: number };
                  return (
                    <FeedBirthday
                      key={item.id}
                      name={bd.nom}
                      age={bd.age}
                    />
                  );
                }
                case 'campagne': {
                  const camp = item.data as unknown as Campagne;
                  return <FeedCampaign key={item.id} campagne={camp} />;
                }
                case 'live': {
                  const vid = item.data as unknown as Video;
                  return <FeedLive key={item.id} video={vid} />;
                }
                case 'lecture': {
                  const lecture = item.data as {
                    reference: string;
                    titre: string;
                    texte: string | null;
                  };
                  return (
                    <FeedBible
                      key={item.id}
                      reference={lecture.reference}
                      titre={lecture.titre}
                      texte={lecture.texte}
                    />
                  );
                }
                default:
                  return null;
              }
            })();

            // Add afro-divider-sm after birthday card (index 2 typically)
            if (item.type === 'anniversaire') {
              return (
                <div key={item.id}>
                  {element}
                  <div className="afro-divider-sm mt-5" />
                </div>
              );
            }

            return element;
          })}
        </div>
      )}
    </div>
  );
}
