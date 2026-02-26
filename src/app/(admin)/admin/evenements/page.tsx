'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Users,
  Calendar,
  X,
} from 'lucide-react';
import { mockEvenements } from '@/lib/mock/evenements.mock';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import type { Evenement, EventType } from '@/types';

const typeLabels: Record<string, string> = {
  culte: 'Culte',
  conference: 'Conference',
  retraite: 'Retraite',
  formation: 'Formation',
  jeunesse: 'Jeunesse',
};

const typeBadgeColors: Record<string, string> = {
  culte: 'bg-sage-200 text-forest-900',
  conference: 'bg-gold-200/50 text-gold-600',
  retraite: 'bg-terra-500/10 text-terra-600',
  formation: 'bg-blue-50 text-blue-700',
  jeunesse: 'bg-purple-50 text-purple-700',
};

const types = ['Tous', 'culte', 'conference', 'retraite', 'formation', 'jeunesse'];
const typeOptions: EventType[] = ['culte', 'conference', 'retraite', 'formation', 'jeunesse'];

export default function AdminEvenementsPage() {
  const [activeType, setActiveType] = useState('Tous');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Evenement[]>(mockEvenements);

  // Modal states
  const [viewItem, setViewItem] = useState<Evenement | null>(null);
  const [editItem, setEditItem] = useState<Evenement | null>(null);
  const [deleteItem, setDeleteItem] = useState<Evenement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit form state
  const [editTitre, setEditTitre] = useState('');
  const [editType, setEditType] = useState<EventType>('culte');
  const [editLieu, setEditLieu] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Create form state
  const [createTitre, setCreateTitre] = useState('');
  const [createType, setCreateType] = useState<EventType>('culte');
  const [createLieu, setCreateLieu] = useState('');
  const [createDescription, setCreateDescription] = useState('');

  const { addToast } = useToastStore();

  const filtered = items.filter((e) => {
    const matchType = activeType === 'Tous' || e.type === activeType;
    const matchSearch =
      !search || e.titre.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Handlers
  const handleView = (evt: Evenement) => {
    setViewItem(evt);
  };

  const handleEditOpen = (evt: Evenement) => {
    setEditTitre(evt.titre);
    setEditType(evt.type);
    setEditLieu(evt.lieu);
    setEditDescription(evt.description);
    setEditItem(evt);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    setItems((prev) =>
      prev.map((e) =>
        e.id === editItem.id
          ? { ...e, titre: editTitre, type: editType, lieu: editLieu, description: editDescription }
          : e
      )
    );
    setEditItem(null);
    addToast('Evenement mis a jour', 'success');
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    setItems((prev) => prev.filter((e) => e.id !== deleteItem.id));
    setDeleteItem(null);
    addToast('Evenement supprime', 'success');
  };

  const handleCreateOpen = () => {
    setCreateTitre('');
    setCreateType('culte');
    setCreateLieu('');
    setCreateDescription('');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = () => {
    const newEvenement: Evenement = {
      id: `evt_${Date.now()}`,
      titre: createTitre,
      type: createType,
      date: new Date().toISOString(),
      lieu: createLieu,
      description: createDescription,
      programme: [],
      participantsInscrits: 0,
      commentCount: 0,
      actif: true,
    };
    setItems((prev) => [newEvenement, ...prev]);
    setShowCreateModal(false);
    addToast('Evenement cree', 'success');
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
            Evenements
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Gerez les evenements de la communaute
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-terra-600 to-orange-400 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Nouvel evenement
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher un evenement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                activeType === type
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-ink-600 border border-ink-200 hover:bg-sage-200'
              }`}
            >
              {type === 'Tous' ? 'Tous' : typeLabels[type] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {items.length} evenements
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {items.filter((e) => e.actif).length} actifs
        </span>
        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
          {items.filter((e) => new Date(e.date) > new Date()).length} a venir
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-cream-50/50">
                <th className="px-4 py-3 text-left font-medium text-ink-500">Evenement</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 sm:table-cell">Type</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 md:table-cell">Lieu</th>
                <th className="hidden px-4 py-3 text-center font-medium text-ink-500 lg:table-cell">Participants</th>
                <th className="px-4 py-3 text-left font-medium text-ink-500">Date</th>
                <th className="px-4 py-3 text-right font-medium text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((evt, i) => (
                <tr
                  key={evt.id}
                  className={`tbl-row border-b border-gray-50 transition-colors ${
                    i % 2 === 0 ? 'bg-cream-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="max-w-[280px]">
                      <p className="truncate font-medium text-ink-900">{evt.titre}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{evt.lieu}</span>
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColors[evt.type] || 'bg-gray-100 text-gray-600'}`}>
                      {typeLabels[evt.type] || evt.type}
                    </span>
                  </td>
                  <td className="hidden max-w-[200px] px-4 py-3 md:table-cell">
                    <span className="truncate text-ink-600">{evt.lieu.split(',')[0]}</span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex items-center justify-center gap-1 text-ink-500">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {evt.participantsInscrits}
                        {evt.maxParticipants ? ` / ${evt.maxParticipants}` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-ink-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(evt.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(evt)}
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditOpen(evt)}
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteItem(evt)}
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
              Detail de l&apos;evenement
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink-500">Titre</p>
                <p className="text-sm text-ink-900">{viewItem.titre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Type</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColors[viewItem.type] || 'bg-gray-100 text-gray-600'}`}>
                  {typeLabels[viewItem.type] || viewItem.type}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Date</p>
                <p className="text-sm text-ink-900">
                  {new Date(viewItem.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' a '}
                  {new Date(viewItem.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {viewItem.heureFin && (
                    <>
                      {' - '}
                      {new Date(viewItem.heureFin).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Lieu</p>
                <p className="flex items-center gap-1 text-sm text-ink-900">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                  {viewItem.lieu}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Description</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
                  {viewItem.description}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">Participants</p>
                <p className="flex items-center gap-1 text-sm text-ink-900">
                  <Users className="h-3.5 w-3.5 text-ink-400" />
                  {viewItem.participantsInscrits} inscrits
                  {viewItem.maxParticipants ? ` / ${viewItem.maxParticipants} places` : ''}
                </p>
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
              Modifier l&apos;evenement
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
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as EventType)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Lieu</label>
                <input
                  type="text"
                  value={editLieu}
                  onChange={(e) => setEditLieu(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={5}
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
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg"
              >
                Enregistrer
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
              Nouvel evenement
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Titre</label>
                <input
                  type="text"
                  value={createTitre}
                  onChange={(e) => setCreateTitre(e.target.value)}
                  placeholder="Titre de l'evenement"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Type</label>
                <select
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value as EventType)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {typeLabels[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Lieu</label>
                <input
                  type="text"
                  value={createLieu}
                  onChange={(e) => setCreateLieu(e.target.value)}
                  placeholder="Lieu de l'evenement"
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Description</label>
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  rows={5}
                  placeholder="Description de l'evenement"
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
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg"
              >
                Creer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteItem}
        title="Supprimer cet evenement ?"
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
