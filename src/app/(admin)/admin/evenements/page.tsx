'use client';

import { useState, useEffect } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getEvenements } from '@/lib/api/evenements.api';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { CustomSelect } from '@/components/forms/custom-select';
import type { Evenement, EventType } from '@/types';

const typeBadgeColors: Record<string, string> = {
  culte: 'bg-sage-200 text-forest-900',
  conference: 'bg-gold-200/50 text-gold-600',
  retraite: 'bg-terra-500/10 text-terra-600',
  formation: 'bg-blue-50 text-blue-700',
  jeunesse: 'bg-purple-50 text-purple-700',
};

const typeKeys = ['culte', 'conference', 'retraite', 'formation', 'jeunesse'] as const;
const typeOptions: EventType[] = ['culte', 'conference', 'retraite', 'formation', 'jeunesse'];

export default function AdminEvenementsPage() {
  const te = useTranslations('evenements');
  const tc = useTranslations('common');
  const t = useTranslations('admin');
  const tge = useTranslations('gestionEvenements');

  const typeLabels: Record<string, string> = {
    culte: te('typeCulte'),
    conference: te('typeConference'),
    retraite: te('typeRetraite'),
    formation: te('typeFormation'),
    jeunesse: te('typeJeunesse'),
  };

  const { data: evenementsData } = useQuery({ queryKey: ['admin-evenements'], queryFn: () => getEvenements() });
  const [activeType, setActiveType] = useState('Tous');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Evenement[]>([]);

  useEffect(() => {
    if (evenementsData) setItems(evenementsData);
  }, [evenementsData]);

  // Modal states
  const [viewItem, setViewItem] = useState<Evenement | null>(null);
  const [editItem, setEditItem] = useState<Evenement | null>(null);
  const [deleteItem, setDeleteItem] = useState<Evenement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit form state
  const [editTitre, setEditTitre] = useState('');
  const [editType, setEditType] = useState<EventType>('culte');
  const [editDate, setEditDate] = useState('');
  const [editLieu, setEditLieu] = useState('');
  const [editMaxParticipants, setEditMaxParticipants] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Create form state
  const [createTitre, setCreateTitre] = useState('');
  const [createType, setCreateType] = useState<EventType>('culte');
  const [createLieu, setCreateLieu] = useState('');
  const [createMaxParticipants, setCreateMaxParticipants] = useState('');
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
    setEditDate(evt.date ? new Date(evt.date).toISOString().slice(0, 16) : '');
    setEditLieu(evt.lieu);
    setEditMaxParticipants(evt.maxParticipants ? String(evt.maxParticipants) : '');
    setEditDescription(evt.description);
    setEditItem(evt);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    setItems((prev) =>
      prev.map((e) =>
        e.id === editItem.id
          ? { ...e, titre: editTitre, type: editType, ...(editDate ? { date: editDate + ':00' } : {}), lieu: editLieu, ...(editMaxParticipants ? { maxParticipants: Number(editMaxParticipants) } : {}), description: editDescription }
          : e
      )
    );
    setEditItem(null);
    addToast(tge('eventUpdated'), 'success');
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    setItems((prev) => prev.filter((e) => e.id !== deleteItem.id));
    setDeleteItem(null);
    addToast(tge('eventDeleted'), 'success');
  };

  const handleCreateOpen = () => {
    setCreateTitre('');
    setCreateType('culte');
    setCreateLieu('');
    setCreateMaxParticipants('');
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
      ...(createMaxParticipants ? { maxParticipants: Number(createMaxParticipants) } : {}),
      participantsInscrits: 0,
      commentCount: 0,
      actif: true,
    };
    setItems((prev) => [newEvenement, ...prev]);
    setShowCreateModal(false);
    addToast(tge('eventCreated'), 'success');
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
            {te('title')}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {t('adminEventsSubtitle')}
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-terra-600 to-orange-400 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {tge('newEvent')}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder={tc('searchEvent')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveType('Tous')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
              activeType === 'Tous'
                ? 'bg-forest-900 text-white shadow-md'
                : 'bg-white text-ink-600 border border-ink-200 hover:bg-sage-200'
            }`}
          >
            {te('all')}
          </button>
          {typeKeys.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                activeType === type
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-ink-600 border border-ink-200 hover:bg-sage-200'
              }`}
            >
              {typeLabels[type] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {tge('eventCount', { count: items.length })}
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {tge('activeCount', { count: items.filter((e) => e.actif).length })}
        </span>
        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
          {tge('upcomingCount', { count: items.filter((e) => new Date(e.date) > new Date()).length })}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-cream-50/50">
                <th className="px-4 py-3 text-left font-medium text-ink-500">{tge('event')}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 sm:table-cell">{tge('type')}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 md:table-cell">{tge('location')}</th>
                <th className="hidden px-4 py-3 text-center font-medium text-ink-500 lg:table-cell">{tge('participantsCol')}</th>
                <th className="px-4 py-3 text-left font-medium text-ink-500">{tge('date')}</th>
                <th className="px-4 py-3 text-right font-medium text-ink-500">{tc('actions')}</th>
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
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-xs text-ink-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(evt.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-ink-400">
                        {new Date(evt.date).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
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
              {tge('eventDetail')}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink-500">{tc('title')}</p>
                <p className="text-sm text-ink-900">{viewItem.titre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{tge('type')}</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColors[viewItem.type] || 'bg-gray-100 text-gray-600'}`}>
                  {typeLabels[viewItem.type] || viewItem.type}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{tge('date')}</p>
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
                <p className="text-sm font-medium text-ink-500">{tge('location')}</p>
                <p className="flex items-center gap-1 text-sm text-ink-900">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                  {viewItem.lieu}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{tc('description')}</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">
                  {viewItem.description}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{tge('participantsCol')}</p>
                <p className="flex items-center gap-1 text-sm text-ink-900">
                  <Users className="h-3.5 w-3.5 text-ink-400" />
                  {te('participantsRegistered', { count: viewItem.participantsInscrits })}
                  {viewItem.maxParticipants ? ` / ${viewItem.maxParticipants}` : ''}
                </p>
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
              {tge('editEvent')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('title')}</label>
                <input
                  type="text"
                  value={editTitre}
                  onChange={(e) => setEditTitre(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('type')}</label>
                <CustomSelect
                  value={editType}
                  onChange={(value) => setEditType(value as EventType)}
                  options={typeOptions.map((tp) => ({ value: tp, label: typeLabels[tp] }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('dateTime')}</label>
                <input
                  type="datetime-local"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('location')}</label>
                <input
                  type="text"
                  value={editLieu}
                  onChange={(e) => setEditLieu(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('maxParticipants')}</label>
                <input
                  type="number"
                  min="1"
                  value={editMaxParticipants}
                  onChange={(e) => setEditMaxParticipants(e.target.value)}
                  placeholder={tge('unlimitedIfEmpty')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('description')}</label>
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
                {tc('cancel')}
              </button>
              <button
                onClick={handleEditSave}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg"
              >
                {tc('save')}
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
              {tge('newEvent')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('title')}</label>
                <input
                  type="text"
                  value={createTitre}
                  onChange={(e) => setCreateTitre(e.target.value)}
                  placeholder={t('eventTitlePlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('type')}</label>
                <CustomSelect
                  value={createType}
                  onChange={(value) => setCreateType(value as EventType)}
                  options={typeOptions.map((tp) => ({ value: tp, label: typeLabels[tp] }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('location')}</label>
                <input
                  type="text"
                  value={createLieu}
                  onChange={(e) => setCreateLieu(e.target.value)}
                  placeholder={t('eventLocationPlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tge('maxParticipants')}</label>
                <input
                  type="number"
                  min="1"
                  value={createMaxParticipants}
                  onChange={(e) => setCreateMaxParticipants(e.target.value)}
                  placeholder={tge('unlimitedIfEmpty')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('description')}</label>
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  rows={5}
                  placeholder={t('eventDescriptionPlaceholder')}
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
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg"
              >
                {tc('create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteItem}
        title={tge('deleteEvent')}
        message={tge('deleteEventConfirm', { title: deleteItem?.titre ?? '' })}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </section>
  );
}
