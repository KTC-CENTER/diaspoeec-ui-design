'use client';

import { useState } from 'react';
import {
  Search,
  Edit3,
  Trash2,
  Eye,
  Play,
  Heart,
  Clock,
  TrendingUp,
  Video,
  Upload,
  X,
  Calendar,
  Radio,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getVideos } from '@/lib/api/cultes.api';
import { useCreateVideo, useUpdateVideo, useDeleteVideo } from '@/features/cultes/hooks/use-cultes';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { CustomSelect } from '@/components/forms/custom-select';
import type { Video as VideoType } from '@/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: 'enregistre', label: 'Enregistre' },
  { value: 'planifie', label: 'Live planifie' },
];

const GRADIENT_OPTIONS = [
  { value: 'from-forest-700 to-forest-500', label: 'Vert foret' },
  { value: 'from-forest-900 to-sage-400', label: 'Foret profond' },
  { value: 'from-gold-600 to-terra-600', label: 'Or et terre' },
  { value: 'from-terra-600 to-gold-500', label: 'Terre chaude' },
  { value: 'from-forest-900 to-ink-800', label: 'Nuit profonde' },
  { value: 'from-ink-900 via-[#2a1a3e] to-forest-900', label: 'Mystique' },
];

const BADGE_OPTIONS = [
  { value: '', label: 'Aucun badge' },
  { value: 'POPULAIRE', label: 'Populaire' },
  { value: 'NOEL', label: 'Noel' },
];

function formatDuration(seconds?: number) {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const inputCls =
  'w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10';

type ModalState =
  | { type: 'view'; video: VideoType }
  | { type: 'edit'; video: VideoType }
  | { type: 'create' }
  | null;

export default function AdminYoutubePage() {
  const { data: videosData } = useQuery({ queryKey: ['admin-videos'], queryFn: getVideos });
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();
  const { addToast } = useToastStore();
  const user = useAuthStore((s) => s.user);

  const items = videosData ?? [];
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<VideoType | null>(null);

  // Edit form state
  const [editTitre, setEditTitre] = useState('');
  const [editAuteur, setEditAuteur] = useState('');
  const [editYoutubeId, setEditYoutubeId] = useState('');
  const [editType, setEditType] = useState<'enregistre' | 'planifie'>('enregistre');
  const [editScheduledDate, setEditScheduledDate] = useState('');
  const [editScheduledTime, setEditScheduledTime] = useState('');
  const [editGradient, setEditGradient] = useState(GRADIENT_OPTIONS[0].value);
  const [editBadge, setEditBadge] = useState('');
  const [editDuree, setEditDuree] = useState('');

  // Create form state
  const [createTitre, setCreateTitre] = useState('');
  const [createYoutubeId, setCreateYoutubeId] = useState('');
  const [createAuteur, setCreateAuteur] = useState('');
  const [createType, setCreateType] = useState<'enregistre' | 'planifie'>('enregistre');
  const [createScheduledDate, setCreateScheduledDate] = useState('');
  const [createScheduledTime, setCreateScheduledTime] = useState('');
  const [createGradient, setCreateGradient] = useState(GRADIENT_OPTIONS[0].value);
  const [createBadge, setCreateBadge] = useState('');
  const [createDuree, setCreateDuree] = useState('');

  const filtered = items.filter(
    (v) => !search || v.titre.toLowerCase().includes(search.toLowerCase())
  );

  const totalViews = items.reduce((acc, v) => acc + v.vues, 0);
  const totalLikes = items.reduce((acc, v) => acc + v.likes, 0);

  const openView = (video: VideoType) => setModal({ type: 'view', video });

  const openEdit = (video: VideoType) => {
    setEditTitre(video.titre);
    setEditAuteur(video.auteur);
    setEditYoutubeId(video.youtubeId);
    setEditType(video.type === 'planifie' ? 'planifie' : 'enregistre');
    if (video.scheduledAt) {
      const d = new Date(video.scheduledAt);
      setEditScheduledDate(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
      setEditScheduledTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    } else {
      setEditScheduledDate('');
      setEditScheduledTime('');
    }
    setEditGradient(video.thumbnailGradient || GRADIENT_OPTIONS[0].value);
    setEditBadge(video.badge ?? '');
    setEditDuree(video.dureeSeconds ? String(video.dureeSeconds) : '');
    setModal({ type: 'edit', video });
  };

  const openCreate = () => {
    setCreateTitre('');
    setCreateYoutubeId('');
    setCreateAuteur(user?.nomComplet ?? '');
    setCreateType('enregistre');
    setCreateScheduledDate('');
    setCreateScheduledTime('');
    setCreateGradient(GRADIENT_OPTIONS[0].value);
    setCreateBadge('');
    setCreateDuree('');
    setModal({ type: 'create' });
  };

  const closeModal = () => setModal(null);

  const handleEditSave = () => {
    if (modal?.type !== 'edit') return;
    const scheduledAt =
      editType === 'planifie' && editScheduledDate
        ? `${editScheduledDate}T${editScheduledTime || '00:00'}:00`
        : undefined;
    updateMutation.mutate(
      {
        id: modal.video.id,
        data: {
          titre: editTitre,
          auteur: editAuteur,
          youtubeId: editYoutubeId,
          type: editType,
          scheduledAt,
          thumbnailGradient: editGradient,
          badge: editBadge || undefined,
          dureeSeconds: editDuree ? Number(editDuree) : undefined,
        },
      },
      {
        onSuccess: () => { closeModal(); addToast('Video mise a jour', 'success'); },
        onError: () => addToast('Erreur lors de la mise a jour', 'error'),
      }
    );
  };

  const handleCreateSubmit = () => {
    if (!createTitre.trim() || !createYoutubeId.trim() || !createAuteur.trim()) {
      addToast("Veuillez remplir le titre, l'auteur et l'ID YouTube", 'error');
      return;
    }
    const scheduledAt =
      createType === 'planifie' && createScheduledDate
        ? `${createScheduledDate}T${createScheduledTime || '00:00'}:00`
        : undefined;
    createMutation.mutate(
      {
        titre: createTitre,
        auteur: createAuteur,
        youtubeId: createYoutubeId,
        type: createType,
        scheduledAt,
        thumbnailGradient: createGradient,
        badge: createBadge || undefined,
        dureeSeconds: createDuree ? Number(createDuree) : undefined,
      },
      {
        onSuccess: () => { closeModal(); addToast('Video ajoutee', 'success'); },
        onError: () => addToast('Erreur lors de la creation', 'error'),
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => { setDeleteTarget(null); addToast('Video supprimee', 'success'); },
      onError: () => addToast('Erreur lors de la suppression', 'error'),
    });
  };

  return (
    <section className="mx-auto max-w-[1400px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            YouTube & Videos
          </h2>
          <p className="mt-1 text-sm text-ink-500">Gerez les videos et contenus multimedia</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Upload className="h-4 w-4" />
          Ajouter une video
        </button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-forest-900/5 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <Video className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {items.length}
              </p>
              <p className="text-xs text-ink-500">Videos</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-forest-900/5 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-200">
              <Eye className="h-5 w-5 text-forest-900" />
            </div>
            <div>
              <p className="text-2xl font-bold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {totalViews.toLocaleString('fr-FR')}
              </p>
              <p className="text-xs text-ink-500">Vues totales</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-forest-900/5 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-200/50">
              <Heart className="h-5 w-5 text-gold-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gold-600" style={{ fontFamily: 'var(--font-heading)' }}>
                {totalLikes.toLocaleString('fr-FR')}
              </p>
              <p className="text-xs text-ink-500">Likes totaux</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-forest-900/5 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terra-500/10">
              <TrendingUp className="h-5 w-5 text-terra-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-terra-600" style={{ fontFamily: 'var(--font-heading)' }}>
                +12%
              </p>
              <p className="text-xs text-ink-500">Croissance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher une video..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((video) => (
          <div
            key={video.id}
            className="group overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Thumbnail */}
            <div className={`relative aspect-video bg-gradient-to-br ${video.thumbnailGradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:opacity-100">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              {video.dureeSeconds && (
                <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {formatDuration(video.dureeSeconds)}
                </span>
              )}
              {video.type === 'live' && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  LIVE
                </span>
              )}
              {video.type === 'planifie' && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-gold-600/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  <Calendar className="h-3 w-3" /> PLANIFIE
                </span>
              )}
              {video.badge && video.type !== 'live' && video.type !== 'planifie' && (
                <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase text-white ${
                  video.badge === 'POPULAIRE' ? 'bg-gold-600/90' : 'bg-red-500/90'
                }`}>
                  {video.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="line-clamp-2 font-medium text-ink-900">{video.titre}</h3>
              <p className="mt-1 text-xs text-ink-400">{video.auteur}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-ink-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {video.vues.toLocaleString('fr-FR')} vues
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" /> {video.likes}
                </span>
                {video.type === 'planifie' && video.scheduledAt ? (
                  <span className="flex items-center gap-1 text-gold-600">
                    <Radio className="h-3.5 w-3.5" />
                    {new Date(video.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(video.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
                <button
                  onClick={() => openView(video)}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEdit(video)}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(video)}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer la video"
        message={`Etes-vous sur de vouloir supprimer "${deleteTarget?.titre}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── View Modal ── */}
      {modal?.type === 'view' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={closeModal} className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50">
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-6 text-xl font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Details de la video
            </h3>
            <div className="mb-5 aspect-video overflow-hidden rounded-xl">
              <iframe
                src={`https://www.youtube.com/embed/${modal.video.youtubeId}?rel=0`}
                title={modal.video.titre}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Titre</p>
                <p className="mt-1 text-sm font-medium text-ink-900">{modal.video.titre}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Auteur</p>
                  <p className="mt-1 text-sm text-ink-700">{modal.video.auteur}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">YouTube ID</p>
                  <p className="mt-1 text-sm font-mono text-ink-700">{modal.video.youtubeId}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Vues</p>
                  <p className="mt-1 text-lg font-bold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                    {modal.video.vues.toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Likes</p>
                  <p className="mt-1 text-lg font-bold text-gold-600" style={{ fontFamily: 'var(--font-heading)' }}>
                    {modal.video.likes}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Duree</p>
                  <p className="mt-1 text-lg font-bold text-ink-700" style={{ fontFamily: 'var(--font-heading)' }}>
                    {modal.video.dureeSeconds ? formatDuration(modal.video.dureeSeconds) : '—'}
                  </p>
                </div>
              </div>
              {modal.video.badge && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Badge</p>
                  <span className={`mt-1 inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase text-white ${
                    modal.video.badge === 'POPULAIRE' ? 'bg-gold-600' : 'bg-red-500'
                  }`}>
                    {modal.video.badge}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={closeModal} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {modal?.type === 'edit' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={closeModal} className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50">
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-6 text-xl font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Modifier la video
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Titre</label>
                <input type="text" value={editTitre} onChange={(e) => setEditTitre(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Auteur</label>
                <input type="text" value={editAuteur} onChange={(e) => setEditAuteur(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">YouTube ID</label>
                <input type="text" value={editYoutubeId} onChange={(e) => setEditYoutubeId(e.target.value)} placeholder="ex: dQw4w9WgXcQ" className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Type</label>
                <CustomSelect value={editType} onChange={(v) => setEditType(v as 'enregistre' | 'planifie')} options={TYPE_OPTIONS} />
              </div>
              {editType === 'planifie' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">
                    Date et heure du live <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={editScheduledDate} onChange={(e) => setEditScheduledDate(e.target.value)} className={inputCls} />
                    <input type="time" value={editScheduledTime} onChange={(e) => setEditScheduledTime(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              {editType === 'enregistre' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Duree (secondes, optionnel)</label>
                  <input type="number" min="0" value={editDuree} onChange={(e) => setEditDuree(e.target.value)} placeholder="ex: 3600 pour 1h" className={inputCls} />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Couleur de vignette</label>
                <CustomSelect value={editGradient} onChange={setEditGradient} options={GRADIENT_OPTIONS} />
                <div className={`mt-2 h-10 rounded-xl bg-gradient-to-r ${editGradient}`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Badge</label>
                <CustomSelect value={editBadge} onChange={setEditBadge} options={BADGE_OPTIONS} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">
                Annuler
              </button>
              <button
                onClick={handleEditSave}
                disabled={updateMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Modal ── */}
      {modal?.type === 'create' && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={closeModal} className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50">
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-6 text-xl font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Ajouter une video
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Titre <span className="text-red-500">*</span></label>
                <input type="text" value={createTitre} onChange={(e) => setCreateTitre(e.target.value)} placeholder="Titre de la video" className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Auteur <span className="text-red-500">*</span></label>
                <input type="text" value={createAuteur} onChange={(e) => setCreateAuteur(e.target.value)} placeholder="Nom du predicateur" className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">YouTube ID <span className="text-red-500">*</span></label>
                <input type="text" value={createYoutubeId} onChange={(e) => setCreateYoutubeId(e.target.value)} placeholder="ex: dQw4w9WgXcQ" className={inputCls} />
                <p className="mt-1 text-xs text-ink-400">L&apos;ID se trouve dans l&apos;URL : youtube.com/watch?v=<strong>ID</strong></p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Type</label>
                <CustomSelect value={createType} onChange={(v) => setCreateType(v as 'enregistre' | 'planifie')} options={TYPE_OPTIONS} />
              </div>
              {createType === 'planifie' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">
                    Date et heure du live <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" value={createScheduledDate} onChange={(e) => setCreateScheduledDate(e.target.value)} className={inputCls} />
                    <input type="time" value={createScheduledTime} onChange={(e) => setCreateScheduledTime(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              {createType === 'enregistre' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Duree (secondes, optionnel)</label>
                  <input type="number" min="0" value={createDuree} onChange={(e) => setCreateDuree(e.target.value)} placeholder="ex: 3600 pour 1h" className={inputCls} />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Couleur de vignette</label>
                <CustomSelect value={createGradient} onChange={setCreateGradient} options={GRADIENT_OPTIONS} />
                <div className={`mt-2 h-10 rounded-xl bg-gradient-to-r ${createGradient}`} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-700">Badge</label>
                <CustomSelect value={createBadge} onChange={setCreateBadge} options={BADGE_OPTIONS} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">
                Annuler
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {createMutation.isPending ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
