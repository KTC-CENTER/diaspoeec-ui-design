'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDynamicId } from '@/hooks/use-dynamic-id';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, Eye, Clock, Radio, Calendar, HandCoins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import { useVideoById, useToggleVideoLike } from '@/features/cultes/hooks/use-cultes';

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetIso: string | null | undefined) {
  const [now, setNow] = useState(Date.now());
  if (typeof window !== 'undefined') {
    setTimeout(() => setNow(Date.now()), 1000);
  }
  if (!targetIso) return null;
  const diff = new Date(targetIso).getTime() - now;
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return { h, m, s };
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params);
  const id = useDynamicId(rawId);
  const router = useRouter();
  const t = useTranslations('cultes');
  const tc = useTranslations('common');
  const { addToast } = useToastStore();
  const { data: video, isLoading } = useVideoById(id);
  const toggleLike = useToggleVideoLike();

  const [liked, setLiked] = useState<boolean | null>(null);
  const [likesCount, setLikesCount] = useState<number | null>(null);

  const resolvedLiked = liked ?? video?.userLiked ?? false;
  const resolvedLikes = likesCount ?? video?.likes ?? 0;

  const countdown = useCountdown(video?.scheduledAt);

  const handleShare = async () => {
    const url = `${window.location.origin}/cultes/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: video?.titre ?? 'Video', url });
      } catch {
        // dismissed
      }
    } else {
      await navigator.clipboard.writeText(url);
      addToast(tc('linkCopied'), 'success');
    }
  };

  const handleLike = () => {
    if (!video) return;
    const newLiked = !resolvedLiked;
    setLiked(newLiked);
    setLikesCount(resolvedLikes + (newLiked ? 1 : -1));
    toggleLike.mutate(video.id, {
      onError: () => {
        setLiked(!newLiked);
        setLikesCount(resolvedLikes + (newLiked ? -1 : 1));
      },
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div>
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-ink-500 hover:text-ink-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">{tc('back')}</span>
        </button>
        <div className="aspect-video w-full rounded-2xl shimmer-bg mb-6" />
        <div className="space-y-3">
          <div className="h-6 w-3/4 rounded shimmer-bg" />
          <div className="h-4 w-1/3 rounded shimmer-bg" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-500">{t('notFound')}</p>
        <button onClick={() => router.back()} className="mt-4 text-forest-900 font-semibold underline">
          {tc('back')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-ink-500 hover:text-ink-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">{tc('back')}</span>
      </button>

      {/* ── LIVE player ── */}
      {video.type === 'live' && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-ink-900 shadow-xl">
          <div className="flex items-center gap-2 px-4 pt-4 pb-2">
            <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
              <span className="h-2 w-2 rounded-full bg-white animate-[livePulse_1.5s_ease-in-out_infinite]" />
              {t('live')}
            </span>
            {video.spectateursLive && (
              <span className="text-sm text-white/60">{video.spectateursLive} {tc('viewers')}</span>
            )}
          </div>
          <div className="mx-4 mb-4 aspect-video overflow-hidden rounded-xl">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.titre}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      {/* ── PLANIFIE — countdown ── */}
      {video.type === 'planifie' && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-[#2a1a3e] to-forest-900 p-6 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gold-400" />
            <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              {t('plannedCulte')}
            </span>
          </div>

          {video.scheduledAt && (
            <p className="mb-6 text-white/60 text-sm">
              {new Date(video.scheduledAt).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}{' '}
              à{' '}
              {new Date(video.scheduledAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          )}

          {countdown ? (
            <div className="flex items-center gap-3">
              {[
                { value: countdown.h, label: t('hours') },
                { value: countdown.m, label: t('minutes') },
                { value: countdown.s, label: t('seconds') },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center rounded-xl bg-white/10 px-4 py-3 min-w-[70px]">
                  <span className="text-3xl font-bold text-white tabular-nums">
                    {value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-white/50">{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white/60">
              <Radio className="h-4 w-4 animate-pulse text-red-400" />
              <span className="text-sm">{t('startingSoon')}</span>
            </div>
          )}

          {/* Thumbnail placeholder */}
          <div
            className={cn(
              'mt-6 aspect-video rounded-xl bg-gradient-to-br opacity-30',
              video.thumbnailGradient || 'from-forest-700 to-ink-800',
            )}
          />
        </div>
      )}

      {/* ── ENREGISTRE player ── */}
      {video.type === 'enregistre' && (
        <div className="mb-6 aspect-video overflow-hidden rounded-2xl shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
            title={video.titre}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}

      {/* ── Info ── */}
      <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm">
        {/* Badges */}
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          {video.type === 'live' && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
              {t('live')}
            </span>
          )}
          {video.type === 'planifie' && (
            <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-700">
              {t('upcoming')}
            </span>
          )}
          {video.badge && (
            <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-bold text-gold-700">
              {video.badge}
            </span>
          )}
        </div>

        <h1
          className="mb-1 text-xl font-bold text-ink-900 md:text-2xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {video.titre}
        </h1>
        <p className="mb-4 text-sm text-ink-500">{video.auteur}</p>

        {/* Stats */}
        <div className="mb-5 flex items-center gap-4 text-xs text-ink-400">
          {video.type === 'enregistre' && (
            <>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {video.vues} {tc('views')}
              </span>
              {video.dureeSeconds && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(video.dureeSeconds)}
                </span>
              )}
              <span>{formatRelativeTime(video.publishedAt)}</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleLike}
            disabled={toggleLike.isPending || video.type === 'planifie'}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
              resolvedLiked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-sage-100 text-ink-700 hover:bg-sage-200',
              video.type === 'planifie' && 'opacity-40 cursor-not-allowed',
            )}
          >
            <Heart className={cn('h-4 w-4', resolvedLiked && 'fill-red-500')} />
            {resolvedLikes}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-xl bg-sage-100 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-sage-200"
          >
            <Share2 className="h-4 w-4" />
            {tc('share')}
          </button>

          {/* Bouton don — visible pendant le live et les enregistrements */}
          {video.type !== 'planifie' && (
            <Link
              href="/dons"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <HandCoins className="h-4 w-4" />
              {tc('donate')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
