'use client';

import { CalendarClock, PlayCircle } from 'lucide-react';
import { useVideos, useServicesAVenir } from '@/features/cultes/hooks/use-cultes';
import { LiveBanner } from '@/features/cultes/components/live-banner';
import { VideoCard } from '@/features/cultes/components/video-card';
import { ServiceCard } from '@/features/cultes/components/service-card';

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

export default function CultesPage() {
  const { data: videos, isLoading: loadingVideos } = useVideos();
  const { data: services, isLoading: loadingServices } = useServicesAVenir();

  const liveVideo = videos?.find((v) => v.type === 'live');
  const recordedVideos = videos?.filter((v) => v.type === 'enregistre') || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="mb-2 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Cultes & Videos
        </h1>
        <p className="text-lg text-ink-500">Vivez les cultes ou que vous soyez</p>
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
          Prochains cultes en direct
        </h2>

        {loadingServices ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        ) : services && services.length > 0 ? (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sage-400/10 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-ink-500">
              Aucun culte programme pour le moment.
            </p>
          </div>
        )}
      </div>

      {/* Recent Videos */}
      <div>
        <h2
          className="mb-4 flex items-center gap-2 text-xl font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <PlayCircle className="h-5 w-5 text-gold-600" />
          Videos recentes
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
              Aucune video disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
