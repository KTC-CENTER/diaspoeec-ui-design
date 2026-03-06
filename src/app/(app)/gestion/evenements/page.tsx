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
  Video,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getEvenements } from '@/lib/api/evenements.api';
import { useCreateEvenement, useUpdateEvenement, useDeleteEvenement } from '@/features/evenements/hooks/use-evenements';
import { useTranslations } from 'next-intl';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RoleGuard } from '@/features/gestion/components/role-guard';
import { CustomSelect } from '@/components/forms/custom-select';
import type { Evenement, EventType } from '@/types';

const typeBadgeColors: Record<string, string> = {
  culte: 'bg-sage-200 text-forest-900',
  conference: 'bg-gold-200/50 text-gold-600',
  retraite: 'bg-terra-500/10 text-terra-600',
  formation: 'bg-blue-50 text-blue-700',
  jeunesse: 'bg-purple-50 text-purple-700',
};

const typeOptions: EventType[] = ['culte', 'conference', 'retraite', 'formation', 'jeunesse'];

function GestionEvenementsContent() {
  const t = useTranslations('gestionEvenements');
  const tc = useTranslations('common');
  const te = useTranslations('evenements');

  const typeLabels: Record<string, string> = {
    culte: te('typeCulte'),
    conference: te('typeConference'),
    retraite: te('typeRetraite'),
    formation: te('typeFormation'),
    jeunesse: te('typeJeunesse'),
  };

  const types = [tc('all'), 'culte', 'conference', 'retraite', 'formation', 'jeunesse'];
  const { data: evenementsData } = useQuery({ queryKey: ['gestion-evenements'], queryFn: () => getEvenements() });
  const items = evenementsData ?? [];
  const createMutation = useCreateEvenement();
  const updateMutation = useUpdateEvenement();
  const deleteMutation = useDeleteEvenement();
  const [activeType, setActiveType] = useState(tc('all'));
  const [search, setSearch] = useState('');

  // Modal states
  const [viewItem, setViewItem] = useState<Evenement | null>(null);
  const [editItem, setEditItem] = useState<Evenement | null>(null);
  const [deleteItem, setDeleteItem] = useState<Evenement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Edit form state
  const [editTitre, setEditTitre] = useState('');
  const [editType, setEditType] = useState<EventType>('culte');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLieu, setEditLieu] = useState('');
  const [editMaxParticipants, setEditMaxParticipants] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Create form state
  const [createTitre, setCreateTitre] = useState('');
  const [createType, setCreateType] = useState<EventType>('culte');
  const [createDate, setCreateDate] = useState('');
  const [createTime, setCreateTime] = useState('');
  const [createLieu, setCreateLieu] = useState('');
  const [createMaxParticipants, setCreateMaxParticipants] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createEstEnLigne, setCreateEstEnLigne] = useState(false);
  const [createLienZoom, setCreateLienZoom] = useState('');

  // Edit form extra state (culte)
  const [editEstEnLigne, setEditEstEnLigne] = useState(false);
  const [editLienZoom, setEditLienZoom] = useState('');

  const { addToast } = useToastStore();

  const filtered = items.filter((e) => {
    const matchType = activeType === tc('all') || e.type === activeType;
    const matchSearch =
      !search || e.titre.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleEditOpen = (evt: Evenement) => {
    setEditTitre(evt.titre);
    setEditType(evt.type);
    if (evt.date) {
      const d = new Date(evt.date);
      setEditDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
      setEditTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    } else {
      setEditDate('');
      setEditTime('');
    }
    setEditLieu(evt.lieu);
    setEditMaxParticipants(evt.maxParticipants ? String(evt.maxParticipants) : '');
    setEditDescription(evt.description);
    setEditLienZoom(evt.lienZoom ?? '');
    setEditEstEnLigne(!!evt.lienZoom);
    setEditItem(evt);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    updateMutation.mutate(
      { id: editItem.id, data: { titre: editTitre, type: editType, ...(editDate ? { date: `${editDate}T${editTime || '00:00'}:00` } : {}), lieu: editLieu, ...(editMaxParticipants ? { maxParticipants: Number(editMaxParticipants) } : {}), description: editDescription, lienZoom: editEstEnLigne ? editLienZoom : '' } },
      {
        onSuccess: () => {
          setEditItem(null);
          addToast(t('eventUpdated'), 'success');
        },
        onError: () => {
          addToast(t('errorUpdate'), 'error');
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id, {
      onSuccess: () => {
        setDeleteItem(null);
        addToast(t('eventDeleted'), 'success');
      },
      onError: () => {
        addToast(t('errorDelete'), 'error');
      },
    });
  };

  const handleCreateOpen = () => {
    setCreateTitre('');
    setCreateType('culte');
    setCreateDate('');
    setCreateTime('');
    setCreateLieu('');
    setCreateMaxParticipants('');
    setCreateDescription('');
    setCreateEstEnLigne(false);
    setCreateLienZoom('');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = () => {
    if (!createTitre.trim() || !createLieu.trim() || !createDate) {
      addToast(t('errorFieldsRequired'), 'error');
      return;
    }
    createMutation.mutate(
      {
        titre: createTitre,
        type: createType,
        date: `${createDate}T${createTime || '00:00'}:00`,
        lieu: createLieu,
        ...(createMaxParticipants ? { maxParticipants: Number(createMaxParticipants) } : {}),
        description: createDescription,
        ...(createEstEnLigne && createLienZoom ? { lienZoom: createLienZoom } : {}),
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          addToast(t('eventCreated'), 'success');
        },
        onError: () => {
          addToast(t('errorCreate'), 'error');
        },
      },
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
            {t('pageTitle')}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {t('pageSubtitle')}
          </p>
        </div>
        <button
          onClick={handleCreateOpen}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-terra-600 to-orange-400 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {t('newEvent')}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder={t('searchEvent')}
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
              {type === tc('all') ? tc('all') : typeLabels[type] || type}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {t('eventCount', { count: items.length })}
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {t('activeCount', { count: items.filter((e) => e.actif).length })}
        </span>
        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
          {t('upcomingCount', { count: items.filter((e) => new Date(e.date) > new Date()).length })}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-16">
          <p className="text-ink-400 mb-4">{t('noEventFound')}</p>
          <button
            onClick={handleCreateOpen}
            className="inline-flex items-center gap-2 rounded-xl bg-terra-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-terra-700"
          >
            <Plus className="h-4 w-4" />
            {t('createEvent')}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-cream-50/50">
                  <th className="px-4 py-3 text-left font-medium text-ink-500">{t('event')}</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-ink-500 sm:table-cell">{t('type')}</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-ink-500 md:table-cell">{t('location')}</th>
                  <th className="hidden px-4 py-3 text-center font-medium text-ink-500 lg:table-cell">{t('participantsCol')}</th>
                  <th className="px-4 py-3 text-left font-medium text-ink-500">{t('date')}</th>
                  <th className="px-4 py-3 text-right font-medium text-ink-500">{tc('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((evt, i) => (
                  <tr
                    key={evt.id}
                    className={`border-b border-gray-50 transition-colors hover:bg-sage-200/20 ${
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
                          {new Date(evt.date).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-xs text-ink-400">
                          {new Date(evt.date).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewItem(evt)}
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
              {t('eventDetail')}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink-500">{tc('title')}</p>
                <p className="text-sm text-ink-900">{viewItem.titre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('type')}</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeColors[viewItem.type] || 'bg-gray-100 text-gray-600'}`}>
                  {typeLabels[viewItem.type] || viewItem.type}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('dateTime')}</p>
                <p className="text-sm text-ink-900">
                  {new Date(viewItem.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {` ${t('atTime')} `}
                  {new Date(viewItem.date).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('location')}</p>
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
                <p className="text-sm font-medium text-ink-500">{t('participantsCol')}</p>
                <p className="flex items-center gap-1 text-sm text-ink-900">
                  <Users className="h-3.5 w-3.5 text-ink-400" />
                  {t('registeredCount', { count: viewItem.participantsInscrits })}
                  {viewItem.maxParticipants ? ` / ${viewItem.maxParticipants} ${t('places')}` : ''}
                </p>
              </div>
              {viewItem.lienZoom && (
                <div>
                  <p className="text-sm font-medium text-ink-500">{t('onlineLink')}</p>
                  <a
                    href={viewItem.lienZoom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-forest-700 underline underline-offset-2 hover:text-forest-900 break-all"
                  >
                    <Video className="h-3.5 w-3.5 shrink-0" />
                    {viewItem.lienZoom}
                  </a>
                </div>
              )}
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
              {t('editEvent')}
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
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('type')}</label>
                <CustomSelect
                  value={editType}
                  onChange={(value) => setEditType(value as EventType)}
                  options={typeOptions.map((t) => ({ value: t, label: typeLabels[t] }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('dateTime')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                  />
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('location')}</label>
                <input
                  type="text"
                  value={editLieu}
                  onChange={(e) => setEditLieu(e.target.value)}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('maxParticipants')}</label>
                <input
                  type="number"
                  min="1"
                  value={editMaxParticipants}
                  onChange={(e) => setEditMaxParticipants(e.target.value)}
                  placeholder={t('unlimitedIfEmpty')}
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

              {/* Culte en ligne */}
              {editType === 'culte' && (
                <div className="rounded-xl border border-forest-900/10 bg-sage-200/20 p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editEstEnLigne}
                      onChange={(e) => setEditEstEnLigne(e.target.checked)}
                      className="h-4 w-4 rounded accent-forest-700"
                    />
                    <span className="text-sm font-medium text-ink-700">{tc('onlineService')}</span>
                  </label>
                  {editEstEnLigne && (
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('zoomLink')}</label>
                      <div className="relative">
                        <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input
                          type="url"
                          value={editLienZoom}
                          onChange={(e) => setEditLienZoom(e.target.value)}
                          placeholder={t('zoomPlaceholder')}
                          className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              {t('newEvent')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('title')}</label>
                <input
                  type="text"
                  value={createTitre}
                  onChange={(e) => setCreateTitre(e.target.value)}
                  placeholder={t('titlePlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('type')}</label>
                <CustomSelect
                  value={createType}
                  onChange={(value) => setCreateType(value as EventType)}
                  options={typeOptions.map((t) => ({ value: t, label: typeLabels[t] }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  {t('dateTime')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                  />
                  <input
                    type="time"
                    value={createTime}
                    onChange={(e) => setCreateTime(e.target.value)}
                    className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('location')}</label>
                <input
                  type="text"
                  value={createLieu}
                  onChange={(e) => setCreateLieu(e.target.value)}
                  placeholder={t('locationPlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('maxParticipants')}</label>
                <input
                  type="number"
                  min="1"
                  value={createMaxParticipants}
                  onChange={(e) => setCreateMaxParticipants(e.target.value)}
                  placeholder={t('unlimitedIfEmpty')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">{tc('description')}</label>
                <textarea
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  rows={5}
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                />
              </div>

              {/* Culte en ligne */}
              {createType === 'culte' && (
                <div className="rounded-xl border border-forest-900/10 bg-sage-200/20 p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createEstEnLigne}
                      onChange={(e) => setCreateEstEnLigne(e.target.checked)}
                      className="h-4 w-4 rounded accent-forest-700"
                    />
                    <span className="text-sm font-medium text-ink-700">{tc('onlineService')}</span>
                  </label>
                  {createEstEnLigne && (
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-1.5">{t('zoomLink')}</label>
                      <div className="relative">
                        <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input
                          type="url"
                          value={createLienZoom}
                          onChange={(e) => setCreateLienZoom(e.target.value)}
                          placeholder={t('zoomPlaceholder')}
                          className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                className="rounded-xl bg-gradient-to-r from-terra-600 to-orange-400 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                {createMutation.isPending ? tc('creating') : tc('create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteItem}
        title={t('deleteEvent')}
        message={t('deleteEventConfirm', { title: deleteItem?.titre ?? '' })}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </section>
  );
}

export default function GestionEvenementsPage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'responsable_zone', 'admin']}>
      <GestionEvenementsContent />
    </RoleGuard>
  );
}
