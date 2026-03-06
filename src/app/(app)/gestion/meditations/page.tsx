'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getMeditations } from '@/lib/api/meditations.api';
import { useCreateMeditation, useUpdateMeditation, useDeleteMeditation } from '@/features/meditations/hooks/use-meditations';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RoleGuard } from '@/features/gestion/components/role-guard';
import { CustomSelect } from '@/components/forms/custom-select';
import type { Meditation, MeditationCategorie } from '@/types';

const categorieOptions: MeditationCategorie[] = ['foi', 'priere', 'esperance', 'famille', 'grace', 'perseverance'];

function GestionMeditationsContent() {
  const t = useTranslations('gestion');
  const tm = useTranslations('meditations');
  const tc = useTranslations('common');

  const categories = [
    { key: 'Toutes', label: tm('all') },
    { key: 'Foi', label: tm('faith') },
    { key: 'Priere', label: tm('prayer') },
    { key: 'Esperance', label: tm('hope') },
    { key: 'Famille', label: tm('family') },
    { key: 'Grace', label: tm('grace') },
    { key: 'Perseverance', label: tm('perseverance') },
  ];

  const user = useAuthStore((s) => s.user);
  const { data: meditationsData, isLoading, isError, error } = useQuery({
    queryKey: ['gestion-meditations', user?.id],
    queryFn: () => getMeditations({ auteurId: user?.id }),
    enabled: !!user?.id,
  });
  const createMutation = useCreateMeditation();
  const updateMutation = useUpdateMeditation();
  const deleteMutation = useDeleteMeditation();

  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [search, setSearch] = useState('');
  const items = meditationsData ?? [];

  // Modal states
  const [viewItem, setViewItem] = useState<Meditation | null>(null);
  const [editItem, setEditItem] = useState<Meditation | null>(null);
  const [deleteItem, setDeleteItem] = useState<Meditation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit form state
  const [editTitre, setEditTitre] = useState('');
  const [editCategorie, setEditCategorie] = useState<MeditationCategorie>('foi');
  const [editExtrait, setEditExtrait] = useState('');
  const [editContenu, setEditContenu] = useState('');

  // Create form state
  const [createTitre, setCreateTitre] = useState('');
  const [createCategorie, setCreateCategorie] = useState<MeditationCategorie>('foi');
  const [createExtrait, setCreateExtrait] = useState('');
  const [createContenu, setCreateContenu] = useState('');

  const { addToast } = useToastStore();

  const filtered = items.filter((m) => {
    const matchCategory =
      activeCategory === 'Toutes' || m.categorie === activeCategory.toLowerCase();
    const matchSearch =
      !search || m.titre.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleEditOpen = (meditation: Meditation) => {
    setEditTitre(meditation.titre);
    setEditCategorie(meditation.categorie);
    setEditExtrait(meditation.extrait);
    setEditContenu(meditation.contenu ?? '');
    setEditItem(meditation);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    updateMutation.mutate(
      {
        id: editItem.id,
        data: { titre: editTitre, categorie: editCategorie, extrait: editExtrait, contenu: editContenu },
      },
      {
        onSuccess: () => {
          setEditItem(null);
          addToast(t('meditationUpdated'), 'success');
        },
        onError: () => {
          addToast(t('updateError'), 'error');
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id, {
      onSuccess: () => {
        setDeleteItem(null);
        addToast(t('meditationDeleted'), 'success');
      },
      onError: () => {
        addToast(t('deleteError'), 'error');
      },
    });
  };

  const handleCreateOpen = () => {
    setCreateTitre('');
    setCreateCategorie('foi');
    setCreateExtrait('');
    setCreateContenu('');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = () => {
    if (!createTitre.trim() || !createExtrait.trim()) {
      addToast(t('fillAllFields'), 'error');
      return;
    }
    createMutation.mutate(
      {
        titre: createTitre,
        extrait: createExtrait,
        contenu: createContenu || `<p>${createExtrait}</p>`,
        categorie: createCategorie,
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          addToast(t('meditationPublished'), 'success');
        },
        onError: () => {
          addToast(t('createError'), 'error');
        },
      }
    );
  };

  return (
    <section className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('myMeditations')}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {t('newMeditation')}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-ink-600 border border-ink-200 hover:bg-sage-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {t('meditationCount', { count: items.length })}
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-forest-900/20 border-t-forest-900" />
          <p className="mt-4 text-sm text-ink-400">{t('loadingMeditations')}</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/50 py-16">
          <p className="text-ink-500 mb-2">{t('loadError')}</p>
          <p className="text-sm text-ink-400">{t('checkServer')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <p className="text-ink-400 mb-4">{t('noMeditations')}</p>
          <button
            onClick={handleCreateOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-800"
          >
            <Plus className="h-4 w-4" />
            {t('createFirst')}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-cream-50/50">
                  <th className="px-4 py-3 text-left font-medium text-ink-500">{t('tableTitle')}</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-ink-500 sm:table-cell">{t('tableCategory')}</th>
                  <th className="hidden px-4 py-3 text-center font-medium text-ink-500 lg:table-cell">{t('tableInteractions')}</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-500">{t('tableDate')}</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-500">{t('tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((meditation, i) => (
                  <tr
                    key={meditation.id}
                    className={`border-b border-gray-50 transition-colors hover:bg-sage-200/20 ${
                      i % 2 === 0 ? 'bg-cream-50/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="max-w-[280px]">
                        <p className="truncate font-medium text-ink-900">{meditation.titre}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-500">{meditation.extrait}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="rounded-full bg-sage-200 px-2.5 py-0.5 text-xs font-medium capitalize text-forest-900">
                        {meditation.categorie}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center justify-center gap-3 text-ink-500">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" /> {meditation.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" /> {meditation.commentCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-ink-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(meditation.publishedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewItem(meditation)}
                          className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditOpen(meditation)}
                          className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteItem(meditation)}
                          className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setViewItem(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>

            <h3
              className="mb-4 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('viewDetail')}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink-500">{t('tableTitle')}</p>
                <p className="text-sm text-ink-900">{viewItem.titre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('tableCategory')}</p>
                <span className="inline-block rounded-full bg-sage-200 px-2.5 py-0.5 text-xs font-medium capitalize text-forest-900">
                  {viewItem.categorie}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('excerpt')}</p>
                <p className="text-sm leading-relaxed text-ink-700">{viewItem.extrait}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('publishDate')}</p>
                <p className="text-sm text-ink-900">
                  {new Date(viewItem.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm font-medium text-ink-500">{t('likes')}</p>
                  <p className="flex items-center gap-1 text-sm text-ink-900">
                    <Heart className="h-3.5 w-3.5" /> {viewItem.likes}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-500">{t('commentsLabel')}</p>
                  <p className="flex items-center gap-1 text-sm text-ink-900">
                    <MessageCircle className="h-3.5 w-3.5" /> {viewItem.commentCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewItem(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                {tc('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditItem(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setEditItem(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>

            <h3
              className="mb-4 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('editMeditation')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('tableTitle')}</label>
                <input
                  type="text"
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('tableCategory')}</label>
                <CustomSelect
                  value={editCategorie}
                  onChange={(value) => setEditCategorie(value as MeditationCategorie)}
                  options={categorieOptions.map((cat) => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('excerpt')}</label>
                <textarea
                  value={editExtrait}
                  onChange={(e) => setEditExtrait(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('content')}</label>
                <textarea
                  value={editContenu}
                  onChange={(e) => setEditContenu(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditItem(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                {tc('cancel')}
              </button>
              <button
                onClick={handleEditSave}
                disabled={updateMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {updateMutation.isPending ? tc('saving') : tc('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>

            <h3
              className="mb-4 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('newMeditation')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('tableTitle')}</label>
                <input
                  type="text"
                  value={createTitre}
                  onChange={(e) => setCreateTitre(e.target.value)}
                  placeholder={t('titlePlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('tableCategory')}</label>
                <CustomSelect
                  value={createCategorie}
                  onChange={(value) => setCreateCategorie(value as MeditationCategorie)}
                  options={categorieOptions.map((cat) => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('excerpt')}</label>
                <textarea
                  value={createExtrait}
                  onChange={(e) => setCreateExtrait(e.target.value)}
                  rows={3}
                  placeholder={t('excerptPlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('content')}</label>
                <textarea
                  value={createContenu}
                  onChange={(e) => setCreateContenu(e.target.value)}
                  rows={8}
                  placeholder={t('contentPlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                {tc('cancel')}
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {createMutation.isPending ? tc('publishing') : tc('publish')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteItem}
        title={t('deleteConfirmTitle')}
        message={t('deleteConfirmMessage', { title: deleteItem?.titre ?? '' })}
        confirmLabel={t('deleteConfirmLabel')}
        cancelLabel={tc('cancel')}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </section>
  );
}

export default function GestionMeditationsPage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'admin']}>
      <GestionMeditationsContent />
    </RoleGuard>
  );
}
