'use client';

import { useState } from 'react';
import {
  Plus, Search, Edit3, Trash2, Eye, Play, Heart, Clock, Radio, Calendar, X, Video,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useVideos, useCreateVideo, useUpdateVideo, useDeleteVideo } from '@/features/cultes/hooks/use-cultes';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RoleGuard } from '@/features/gestion/components/role-guard';
import { CustomSelect } from '@/components/forms/custom-select';
import type { Video as VideoType } from '@/types';

// ─── Constants ───────────────────────────────────────────────────────────────

// Constants initialized inside component to use translations

function formatDuration(seconds?: number) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Inner component ─────────────────────────────────────────────────────────

export function GestionCultesContent() {
  const t = useTranslations('gestionCultes');
  const tc = useTranslations('common');

  const TYPE_OPTIONS = [
    { value: 'enregistre', label: t('typeRecorded') },
    { value: 'planifie', label: t('typePlanned') },
  ];

  const GRADIENT_OPTIONS = [
    { value: 'from-forest-700 to-forest-500', label: t('gradientForest') },
    { value: 'from-forest-900 to-sage-400', label: t('gradientDeepForest') },
    { value: 'from-gold-600 to-terra-600', label: t('gradientGoldEarth') },
    { value: 'from-terra-600 to-gold-500', label: t('gradientWarmEarth') },
    { value: 'from-forest-900 to-ink-800', label: t('gradientDeepNight') },
    { value: 'from-ink-900 via-[#2a1a3e] to-forest-900', label: t('gradientMystic') },
  ];

  const BADGE_OPTIONS = [
    { value: '', label: tc('noBadge') },
    { value: 'POPULAIRE', label: tc('popular') },
    { value: 'NOEL', label: t('badgeChristmas') },
  ];

  const { data: videosData, isLoading } = useVideos();
  const user = useAuthStore((s) => s.user);
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();
  const { addToast } = useToastStore();

  const videos = videosData ?? [];
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<VideoType | null>(null);
  const [editItem, setEditItem] = useState<VideoType | null>(null);
  const [deleteItem, setDeleteItem] = useState<VideoType | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Edit state
  const [editTitre, setEditTitre] = useState('');
  const [editAuteur, setEditAuteur] = useState('');
  const [editYoutubeId, setEditYoutubeId] = useState('');
  const [editType, setEditType] = useState<'enregistre' | 'planifie'>('enregistre');
  const [editScheduledDate, setEditScheduledDate] = useState('');
  const [editScheduledTime, setEditScheduledTime] = useState('');
  const [editGradient, setEditGradient] = useState(GRADIENT_OPTIONS[0].value);
  const [editBadge, setEditBadge] = useState('');
  const [editDuree, setEditDuree] = useState('');

  // Create state
  const [createTitre, setCreateTitre] = useState('');
  const [createAuteur, setCreateAuteur] = useState('');
  const [createYoutubeId, setCreateYoutubeId] = useState('');
  const [createType, setCreateType] = useState<'enregistre' | 'planifie'>('enregistre');
  const [createScheduledDate, setCreateScheduledDate] = useState('');
  const [createScheduledTime, setCreateScheduledTime] = useState('');
  const [createGradient, setCreateGradient] = useState(GRADIENT_OPTIONS[0].value);
  const [createBadge, setCreateBadge] = useState('');
  const [createDuree, setCreateDuree] = useState('');

  const filtered = videos.filter(
    (v) => !search || v.titre.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditOpen = (v: VideoType) => {
    setEditTitre(v.titre);
    setEditAuteur(v.auteur);
    setEditYoutubeId(v.youtubeId);
    setEditType(v.type === 'planifie' ? 'planifie' : 'enregistre');
    if (v.scheduledAt) {
      const d = new Date(v.scheduledAt);
      setEditScheduledDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      setEditScheduledTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    } else {
      setEditScheduledDate('');
      setEditScheduledTime('');
    }
    setEditGradient(v.thumbnailGradient || GRADIENT_OPTIONS[0].value);
    setEditBadge(v.badge ?? '');
    setEditDuree(v.dureeSeconds ? String(v.dureeSeconds) : '');
    setEditItem(v);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    const scheduledAt = editType === 'planifie' && editScheduledDate
      ? `${editScheduledDate}T${editScheduledTime || '00:00'}:00`
      : undefined;
    updateMutation.mutate(
      { id: editItem.id, data: { titre: editTitre, auteur: editAuteur, youtubeId: editYoutubeId, type: editType, scheduledAt, thumbnailGradient: editGradient, badge: editBadge || undefined, dureeSeconds: editDuree ? Number(editDuree) : undefined } },
      {
        onSuccess: () => { setEditItem(null); addToast(t('videoUpdated'), 'success'); },
        onError: () => addToast(t('errorUpdate'), 'error'),
      }
    );
  };

  const handleCreateOpen = () => {
    setCreateTitre('');
    setCreateAuteur(user?.nomComplet ?? '');
    setCreateYoutubeId('');
    setCreateType('enregistre');
    setCreateScheduledDate('');
    setCreateScheduledTime('');
    setCreateGradient(GRADIENT_OPTIONS[0].value);
    setCreateBadge('');
    setCreateDuree('');
    setShowCreate(true);
  };

  const handleCreateSubmit = () => {
    if (!createTitre.trim() || !createYoutubeId.trim() || !createAuteur.trim()) {
      addToast(t('errorFieldsRequired'), 'error');
      return;
    }
    const scheduledAt = createType === 'planifie' && createScheduledDate
      ? `${createScheduledDate}T${createScheduledTime || '00:00'}:00`
      : undefined;
    createMutation.mutate(
      { titre: createTitre, auteur: createAuteur, youtubeId: createYoutubeId, type: createType, scheduledAt, thumbnailGradient: createGradient, badge: createBadge || undefined, dureeSeconds: createDuree ? Number(createDuree) : undefined },
      {
        onSuccess: () => { setShowCreate(false); addToast(t('videoAdded'), 'success'); },
        onError: () => addToast(t('errorCreate'), 'error'),
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id, {
      onSuccess: () => { setDeleteItem(null); addToast(t('videoDeleted'), 'success'); },
      onError: () => addToast(t('errorDelete'), 'error'),
    });
  };

  const inputCls = 'w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10';

  return (
    <section className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('pageTitle')}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {t('pageSubtitle')}
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {t('addVideo')}
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {t('videoCount', { count: videos.length })}
        </span>
        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
          {t('liveCount', { count: videos.filter((v) => v.type === 'live').length })}
        </span>
        <span className="rounded-full border border-gold-200 bg-gold-100/50 px-3 py-1 text-xs font-medium text-gold-700">
          {t('scheduledCount', { count: videos.filter((v) => v.type === 'planifie').length })}
        </span>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {t('recordedCount', { count: videos.filter((v) => v.type === 'enregistre').length })}
        </span>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder={t('searchVideo')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-sage-400/10 bg-white shadow-sm">
              <div className="aspect-video shimmer-bg" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded shimmer-bg" />
                <div className="h-3 w-1/3 rounded shimmer-bg" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <Video className="mb-3 h-10 w-10 text-ink-300" />
          <p className="text-ink-400 mb-4">{t('noVideoFound')}</p>
          <button
            onClick={handleCreateOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            {t('addVideo')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="group overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className={`relative aspect-video bg-gradient-to-br ${video.thumbnailGradient}`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="h-5 w-5 text-white" fill="white" />
                  </div>
                </div>
                {video.dureeSeconds && (
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {formatDuration(video.dureeSeconds)}
                  </span>
                )}
                {video.type === 'live' && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
                  </span>
                )}
                {video.type === 'planifie' && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-gold-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    <Calendar className="h-3 w-3" /> {t('scheduledBadge')}
                  </span>
                )}
                {video.badge && video.type !== 'live' && video.type !== 'planifie' && (
                  <span className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white ${video.badge === 'POPULAIRE' ? 'bg-gold-600/90' : 'bg-red-500/90'}`}>
                    {video.badge}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-ink-900 line-clamp-2">{video.titre}</h3>
                <p className="mt-0.5 text-xs text-ink-400">{video.auteur}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {video.vues.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" /> {video.likes}
                  </span>
                  {video.type === 'planifie' && video.scheduledAt && (
                    <span className="flex items-center gap-1 text-gold-600">
                      <Radio className="h-3.5 w-3.5" />
                      {new Date(video.scheduledAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  {video.type === 'enregistre' && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(video.publishedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
                  <button onClick={() => setViewItem(video)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleEditOpen(video)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteItem(video)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── View Modal ── */}
      {viewItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={() => setViewItem(null)} className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50">
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-5 text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>
              {t('videoDetails')}
            </h3>
            <div className={`mb-4 aspect-video overflow-hidden rounded-xl`}>
              <iframe
                src={`https://www.youtube.com/embed/${viewItem.youtubeId}?rel=0`}
                title={viewItem.titre}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="space-y-3">
              <div><p className="text-xs font-medium text-ink-400 uppercase">{tc('title')}</p><p className="text-sm text-ink-900">{viewItem.titre}</p></div>
              <div><p className="text-xs font-medium text-ink-400 uppercase">{t('authorLabel')}</p><p className="text-sm text-ink-900">{viewItem.auteur}</p></div>
              <div><p className="text-xs font-medium text-ink-400 uppercase">YouTube ID</p><p className="text-sm font-mono text-ink-700">{viewItem.youtubeId}</p></div>
              <div className="grid grid-cols-3 gap-4 pt-1">
                <div><p className="text-xs text-ink-400">{tc('views')}</p><p className="text-lg font-bold text-forest-900">{viewItem.vues.toLocaleString()}</p></div>
                <div><p className="text-xs text-ink-400">{t('likes')}</p><p className="text-lg font-bold text-gold-600">{viewItem.likes}</p></div>
                <div><p className="text-xs text-ink-400">{t('duration')}</p><p className="text-lg font-bold text-ink-700">{viewItem.dureeSeconds ? formatDuration(viewItem.dureeSeconds) : '—'}</p></div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setViewItem(null)} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">{tc('close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditItem(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={() => setEditItem(null)} className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"><X className="h-4 w-4" /></button>
            <h3 className="mb-5 text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>{t('editVideo')}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('title')}</label><input type="text" value={editTitre} onChange={(e) => setEditTitre(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('authorLabel')}</label><input type="text" value={editAuteur} onChange={(e) => setEditAuteur(e.target.value)} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">YouTube ID</label><input type="text" value={editYoutubeId} onChange={(e) => setEditYoutubeId(e.target.value)} placeholder={t('youtubeIdPlaceholder')} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('typeLabel')}</label><CustomSelect value={editType} onChange={(v) => setEditType(v as 'enregistre' | 'planifie')} options={TYPE_OPTIONS} /></div>
              {editType === 'planifie' && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('liveDateTime')} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={editScheduledDate} onChange={(e) => setEditScheduledDate(e.target.value)} className={inputCls} />
                    <input type="time" value={editScheduledTime} onChange={(e) => setEditScheduledTime(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              {editType === 'enregistre' && (
                <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('durationLabel')}</label><input type="number" min="0" value={editDuree} onChange={(e) => setEditDuree(e.target.value)} placeholder={t('durationPlaceholder')} className={inputCls} /></div>
              )}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('thumbnailColor')}</label>
                <CustomSelect value={editGradient} onChange={setEditGradient} options={GRADIENT_OPTIONS} />
                <div className={`mt-2 h-10 rounded-xl bg-gradient-to-r ${editGradient}`} />
              </div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('badgeLabel')}</label><CustomSelect value={editBadge} onChange={setEditBadge} options={BADGE_OPTIONS} /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditItem(null)} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">{tc('cancel')}</button>
              <button onClick={handleEditSave} disabled={updateMutation.isPending} className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50">
                {updateMutation.isPending ? tc('saving') : tc('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={() => setShowCreate(false)} className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"><X className="h-4 w-4" /></button>
            <h3 className="mb-5 text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>{t('addVideo')}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('title')} <span className="text-red-500">*</span></label><input type="text" value={createTitre} onChange={(e) => setCreateTitre(e.target.value)} placeholder={t('titlePlaceholder')} className={inputCls} /></div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('authorLabel')} <span className="text-red-500">*</span></label><input type="text" value={createAuteur} onChange={(e) => setCreateAuteur(e.target.value)} placeholder={t('authorPlaceholder')} className={inputCls} /></div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">YouTube ID <span className="text-red-500">*</span></label>
                <input type="text" value={createYoutubeId} onChange={(e) => setCreateYoutubeId(e.target.value)} placeholder={t('youtubeIdPlaceholder')} className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">{t('youtubeIdHint')}</p>
              </div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('typeLabel')}</label><CustomSelect value={createType} onChange={(v) => setCreateType(v as 'enregistre' | 'planifie')} options={TYPE_OPTIONS} /></div>
              {createType === 'planifie' && (
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('liveDateTime')} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={createScheduledDate} onChange={(e) => setCreateScheduledDate(e.target.value)} className={inputCls} />
                    <input type="time" value={createScheduledTime} onChange={(e) => setCreateScheduledTime(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              {createType === 'enregistre' && (
                <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('durationLabel')}</label><input type="number" min="0" value={createDuree} onChange={(e) => setCreateDuree(e.target.value)} placeholder={t('durationPlaceholder')} className={inputCls} /></div>
              )}
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('thumbnailColor')}</label>
                <CustomSelect value={createGradient} onChange={setCreateGradient} options={GRADIENT_OPTIONS} />
                <div className={`mt-2 h-10 rounded-xl bg-gradient-to-r ${createGradient}`} />
              </div>
              <div><label className="block text-sm font-medium text-ink-700 mb-1.5">{t('badgeLabel')}</label><CustomSelect value={createBadge} onChange={setCreateBadge} options={BADGE_OPTIONS} /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">{tc('cancel')}</button>
              <button onClick={handleCreateSubmit} disabled={createMutation.isPending} className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50">
                {createMutation.isPending ? tc('adding') : tc('add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Dialog ── */}
      <ConfirmDialog
        open={!!deleteItem}
        title={t('deleteVideo')}
        message={t('deleteVideoConfirm', { title: deleteItem?.titre ?? '' })}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </section>
  );
}
