'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, BookOpen, Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useFavoris } from '@/features/favoris/hooks/use-favoris';
import { MeditationCard } from '@/features/meditations/components/meditation-card';
import { VideoCard } from '@/features/cultes/components/video-card';
import type { FavoriteItem, Meditation, Video } from '@/types';

const tabs = [
  { key: 'tout', label: 'Tout' },
  { key: 'meditation', label: 'Meditations' },
  { key: 'video', label: 'Cultes' },
  { key: 'lecture', label: 'Lectures' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

function LectureCard({ item }: { item: FavoriteItem }) {
  const lecture = item.lecture;
  if (!lecture) return null;

  return (
    <Link
      href="/bible"
      className="block rounded-2xl border border-forest-900/6 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,67,50,0.12)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl gradient-forest">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-ink-900 mb-1">{lecture.titre}</h3>
          <p className="text-sm text-ink-500">{lecture.reference}</p>
          {lecture.contenu && (
            <p className="mt-2 text-sm text-ink-600 line-clamp-2">{lecture.contenu}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-xs text-ink-400">
            <Heart className="h-3 w-3" />
            <span>{lecture.likeCount ?? 0}</span>
            <span>&middot;</span>
            <span>Lecture du jour</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-900/5 mb-4">
        <Star className="h-8 w-8 text-forest-700" />
      </div>
      <h3 className="text-lg font-bold text-ink-900 mb-2">Aucun favori</h3>
      <p className="text-sm text-ink-500 max-w-xs">
        Likez des meditations, videos ou lectures pour les retrouver ici.
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-forest-900/6 bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="h-40 bg-sage-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-sage-200 rounded w-3/4" />
        <div className="h-3 bg-sage-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function FavorisPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('tout');
  const { data: favorites, isLoading } = useFavoris();

  const filtered = favorites?.filter(
    (f) => activeTab === 'tout' || f.type === activeTab,
  ) ?? [];

  const counts = {
    tout: favorites?.length ?? 0,
    meditation: favorites?.filter((f) => f.type === 'meditation').length ?? 0,
    video: favorites?.filter((f) => f.type === 'video').length ?? 0,
    lecture: favorites?.filter((f) => f.type === 'lecture').length ?? 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-forest-900/6 px-4 pt-6 pb-4 md:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-forest">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Mes Favoris
            </h1>
            <p className="text-sm text-ink-500">
              {counts.tout} contenu{counts.tout !== 1 ? 's' : ''} sauvegarde{counts.tout !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-forest-900 text-white'
                  : 'bg-forest-900/5 text-ink-600 hover:bg-forest-900/10',
              )}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={cn(
                  'ml-1.5 text-xs',
                  activeTab === tab.key ? 'text-white/70' : 'text-ink-400',
                )}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, i) => {
              if (item.type === 'meditation' && item.meditation) {
                return (
                  <MeditationCard
                    key={`med-${item.meditation.id ?? i}`}
                    meditation={item.meditation as Meditation}
                  />
                );
              }
              if (item.type === 'video' && item.video) {
                return (
                  <VideoCard
                    key={`vid-${item.video.id ?? i}`}
                    video={item.video as Video}
                  />
                );
              }
              if (item.type === 'lecture') {
                return <LectureCard key={`lec-${i}`} item={item} />;
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
