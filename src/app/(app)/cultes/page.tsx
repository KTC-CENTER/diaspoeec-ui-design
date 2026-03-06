'use client';

import { CalendarClock, PlayCircle, Clock, Church, MapPin, Video } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useVideos } from '@/features/cultes/hooks/use-cultes';
import { useEvenements } from '@/features/evenements/hooks/use-evenements';
import { LiveBanner } from '@/features/cultes/components/live-banner';
import { VideoCard } from '@/features/cultes/components/video-card';
import type { Evenement } from '@/types';

function VideoSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sage-400/10 bg-white shadow-sm">
      <div className="aspect-video shimmer-bg" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded shimmer-bg" />
        <div className="h-3 w-1/3 rounded shimmer-bg" />
        <div className="h-3 w-1/2 rounded shimmer-bg" />
      </div>
    </div>
  );
}

function ServiceSkeleton() {
  return (
    <div className="min-w-[280px] shrink-0 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl shimmer-bg" />
        <div className="space-y-1">
          <div className="h-3 w-20 rounded shimmer-bg" />
          <div className="h-4 w-12 rounded shimmer-bg" />
        </div>
      </div>
      <div className="mb-1 h-4 w-2/3 rounded shimmer-bg" />
      <div className="mb-4 h-3 w-1/2 rounded shimmer-bg" />
      <div className="h-9 w-full rounded-xl shimmer-bg" />
    </div>
  );
}

function CulteEventCard({ event }: { event: Evenement }) {
  const te = useTranslations('evenements');
  const d = new Date(event.date);
  const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const heureStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-w-[280px] shrink-0 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-900/10">
          <Church className="h-5 w-5 text-forest-900" />
        </div>
        <div>
          <p className="text-xs text-ink-500">{dateStr}</p>
          <p className="text-sm font-semibold text-forest-900">{heureStr}</p>
        </div>
        {event.lienZoom && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
            <Video className="h-3 w-3" /> EN LIGNE
          </span>
        )}
      </div>
      <h3
        className="mb-1 font-bold text-ink-900"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {event.titre}
      </h3>
      <p className="mb-4 flex items-center gap-1 text-sm text-ink-500">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {event.lieu}
      </p>
      <Link
        href={`/evenements/${event.id}?from=cultes`}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold-600/30 py-2 text-sm font-semibold text-gold-600 transition-colors hover:border-terra-600/30 hover:text-terra-600"
      >
        {te('seeDetails')}
      </Link>
    </div>
  );
}

export default function CultesPage() {
  const t = useTranslations('cultes');
  const { data: videos, isLoading: loadingVideos } = useVideos();
  const { data: allCulteEvents, isLoading: loadingCultes } = useEvenements('culte');

  const liveVideo = videos?.find((v) => v.type === 'live');
  const planifieVideos = videos?.filter((v) => v.type === 'planifie') || [];
  const recordedVideos = videos?.filter((v) => v.type === 'enregistre') || [];

  // Cultes du jour et futurs, triés par date (on filtre à partir du début du jour courant)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const prochainsCultes = (allCulteEvents ?? [])
    .filter((e) => new Date(e.date) >= startOfToday)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="mb-2 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('title')}
        </h1>
        <p className="text-lg text-ink-500">{t('subtitle')}</p>
      </div>

      {/* Live Banner */}
      {loadingVideos ? (
        <div className="mb-8 rounded-2xl bg-ink-800 p-6">
          <div className="mb-4 flex gap-3">
            <div className="h-6 w-24 rounded-full shimmer-bg" />
            <div className="h-6 w-32 rounded shimmer-bg" />
          </div>
          <div className="mb-4 aspect-video rounded-xl shimmer-bg" />
          <div className="h-5 w-48 rounded shimmer-bg" />
        </div>
      ) : (
        liveVideo && (
          <div className="mb-8">
            <LiveBanner video={liveVideo} />
          </div>
        )
      )}

      {/* Upcoming Services */}
      <div className="mb-8">
        <h2
          className="mb-4 flex items-center gap-2 text-xl font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <CalendarClock className="h-5 w-5 text-gold-600" />
          {t('upcomingLive')}
        </h2>

        {loadingCultes ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        ) : prochainsCultes.length > 0 ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {prochainsCultes.map((event) => (
              <CulteEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sage-400/10 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-ink-500">
              {t('noScheduled')}
            </p>
          </div>
        )}
      </div>

      {/* Planned lives */}
      {planifieVideos.length > 0 && (
        <div className="mb-8">
          <h2
            className="mb-4 flex items-center gap-2 text-xl font-bold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Clock className="h-5 w-5 text-gold-600" />
            {t('scheduledLives')}
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {planifieVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Videos */}
      <div>
        <h2
          className="mb-4 flex items-center gap-2 text-xl font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <PlayCircle className="h-5 w-5 text-gold-600" />
          {t('recentVideos')}
        </h2>

        {loadingVideos ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        ) : recordedVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {recordedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sage-400/10 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-ink-500">
              {t('noVideos')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
