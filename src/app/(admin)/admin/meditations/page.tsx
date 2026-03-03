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
import { getMeditations } from '@/lib/api/meditations.api';
import { useCreateMeditation, useUpdateMeditation, useDeleteMeditation } from '@/features/meditations/hooks/use-meditations';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { CustomSelect } from '@/components/forms/custom-select';
import type { Meditation, MeditationCategorie } from '@/types';

const categories = ['Toutes', 'Foi', 'Priere', 'Esperance', 'Famille', 'Grace', 'Perseverance'];
const categorieOptions: MeditationCategorie[] = ['foi', 'priere', 'esperance', 'famille', 'grace', 'perseverance'];

export default function AdminMeditationsPage() {
  const { data: meditationsData } = useQuery({ queryKey: ['admin-meditations'], queryFn: () => getMeditations() });
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

  // Handlers
  const handleView = (meditation: Meditation) => {
    setViewItem(meditation);
  };

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
          addToast('Meditation mise a jour', 'success');
        },
        onError: () => {
          addToast('Erreur lors de la mise a jour', 'error');
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id, {
      onSuccess: () => {
        setDeleteItem(null);
        addToast('Meditation supprimee', 'success');
      },
      onError: () => {
        addToast('Erreur lors de la suppression', 'error');
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
      addToast('Veuillez remplir tous les champs', 'error');
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
          addToast('Meditation creee', 'success');
        },
        onError: () => {
          addToast('Erreur lors de la creation', 'error');
        },
      }
    );
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
            Meditations
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Gerez et publiez les meditations de la communaute
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Nouvelle meditation
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher une meditation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-ink-600 border border-ink-200 hover:bg-sage-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {items.length} meditations
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {items.length} publiees
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-cream-50/50">
                <th className="px-4 py-3 text-left font-medium text-ink-500">Titre</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 md:table-cell">Auteur</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 sm:table-cell">Categorie</th>
                <th className="hidden px-4 py-3 text-center font-medium text-ink-500 lg:table-cell">Interactions</th>
                <th className="px-4 py-3 text-left font-medium text-ink-500">Date</th>
                <th className="px-4 py-3 text-right font-medium text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((meditation, i) => (
                <tr
                  key={meditation.id}
                  className={`tbl-row border-b border-gray-50 transition-colors ${
                    i % 2 === 0 ? 'bg-cream-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="max-w-[280px]">
                      <p className="truncate font-medium text-ink-900">{meditation.titre}</p>
                      <p className="mt-0.5 truncate text-xs text-ink-500">{meditation.extrait}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="text-ink-600">{meditation.auteurNom}</span>
                    <p className="text-xs text-ink-400">{meditation.auteurRole}</p>
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
                        onClick={() => handleView(meditation)}
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
              Detail de la meditation
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink-500">Titre</p>
                <p className="text-sm text-ink-900">{viewItem.titre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Auteur</p>
                <p className="text-sm text-ink-900">{viewItem.auteurNom}</p>
                <p className="text-xs text-ink-400">{viewItem.auteurRole}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Categorie</p>
                <span className="inline-block rounded-full bg-sage-200 px-2.5 py-0.5 text-xs font-medium capitalize text-forest-900">
                  {viewItem.categorie}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Extrait</p>
                <p className="text-sm leading-relaxed text-ink-700">{viewItem.extrait}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Date de publication</p>
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
                  <p className="text-sm font-medium text-ink-500">Likes</p>
                  <p className="flex items-center gap-1 text-sm text-ink-900">
                    <Heart className="h-3.5 w-3.5" /> {viewItem.likes}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-500">Commentaires</p>
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
                Fermer
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
              Modifier la meditation
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Titre</label>
                <input
                  type="text"
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Categorie</label>
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
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Extrait</label>
                <textarea
                  value={editExtrait}
                  onChange={(e) => setEditExtrait(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Contenu</label>
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
              Nouvelle meditation
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Titre</label>
                <input
                  type="text"
                  value={createTitre}
                  onChange={(e) => setCreateTitre(e.target.value)}
                  placeholder="Titre de la meditation"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Categorie</label>
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
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Extrait</label>
                <textarea
                  value={createExtrait}
                  onChange={(e) => setCreateExtrait(e.target.value)}
                  rows={3}
                  placeholder="Resume de la meditation"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Contenu</label>
                <textarea
                  value={createContenu}
                  onChange={(e) => setCreateContenu(e.target.value)}
                  rows={8}
                  placeholder="Redigez le contenu de votre meditation..."
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSubmit}
                disabled={createMutation.isPending}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creation...' : 'Creer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteItem}
        title="Supprimer cette meditation ?"
        message={`Etes-vous sur de vouloir supprimer "${deleteItem?.titre ?? ''}" ? Cette action est irreversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </section>
  );
}
