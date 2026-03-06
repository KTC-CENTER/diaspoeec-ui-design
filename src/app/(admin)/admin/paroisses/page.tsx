'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus,
  Pencil,
  Trash2,
  Church,
  Loader2,
  Check,
  X,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
  useParoissesAdmin,
  useCreateParoisse,
  useUpdateParoisse,
  useDeleteParoisse,
} from '@/features/admin/hooks/use-admin';
import type { ParoisseData } from '@/lib/api/admin.api';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminParoissesPage() {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const { data: paroisses, isLoading } = useParoissesAdmin();
  const createMutation = useCreateParoisse();
  const updateMutation = useUpdateParoisse();
  const deleteMutation = useDeleteParoisse();
  const { addToast } = useToastStore();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ParoisseData | null>(null);
  const [formLabel, setFormLabel] = useState('');
  const [formVille, setFormVille] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ParoisseData | null>(null);

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormLabel('');
    setFormVille('');
    setFormSlug('');
  };

  const startEdit = (p: ParoisseData) => {
    setEditing(p);
    setFormLabel(p.label);
    setFormVille(p.ville ?? '');
    setFormSlug(p.slug);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formLabel.trim()) return;
    const slug = formSlug.trim() || slugify(formLabel);

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: { label: formLabel.trim(), ville: formVille.trim() || undefined, slug },
        });
        addToast(t('parishUpdated'), 'success');
      } else {
        await createMutation.mutateAsync({
          slug,
          label: formLabel.trim(),
          ville: formVille.trim() || undefined,
        });
        addToast(t('parishAdded'), 'success');
      }
      resetForm();
    } catch {
      addToast(t('saveError'), 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      addToast(t('parishDeleted'), 'success');
    } catch {
      addToast(t('deleteError'), 'error');
    }
    setDeleteTarget(null);
  };

  const handleToggleActif = async (p: ParoisseData) => {
    try {
      await updateMutation.mutateAsync({ id: p.id, data: { actif: !p.actif } });
      addToast(p.actif ? t('parishDeactivated') : t('parishActivated'), 'success');
    } catch {
      addToast(tc('error'), 'error');
    }
  };

  return (
    <section className="mx-auto max-w-[1000px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('parishesTitle')}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {t('parishesSubtitle')}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          {t('addParish')}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {editing ? t('editParish') : t('newParish')}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">{t('parishName')}</label>
              <input
                value={formLabel}
                onChange={(e) => {
                  setFormLabel(e.target.value);
                  if (!editing) setFormSlug(slugify(e.target.value));
                }}
                placeholder={t('parishNamePlaceholder')}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">{t('parishCity')}</label>
              <input
                value={formVille}
                onChange={(e) => setFormVille(e.target.value)}
                placeholder={t('parishCityPlaceholder')}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">{t('parishSlug')}</label>
              <input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder={t('parishSlugPlaceholder')}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-forest-700 disabled:opacity-60"
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {editing ? tc('edit') : tc('add')}
            </button>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
              {tc('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
          <div className="divide-y divide-gray-50">
            {paroisses && paroisses.length > 0 ? (
              paroisses.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-cream-50/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-sage-200">
                      <Church className="h-4 w-4 text-forest-900" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{p.label}</p>
                      <div className="flex items-center gap-2">
                        {p.ville && (
                          <span className="flex items-center gap-1 text-xs text-ink-500">
                            <MapPin className="h-3 w-3" />
                            {p.ville}
                          </span>
                        )}
                        <span className="text-xs text-ink-400">{p.slug}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActif(p)}
                      className={cn(
                        'relative h-6 w-[44px] flex-shrink-0 rounded-xl transition-colors duration-300',
                        p.actif ? 'bg-forest-700' : 'bg-ink-200'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
                          p.actif && 'translate-x-[20px]'
                        )}
                      />
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-sage-100 hover:text-forest-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="rounded-lg p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Church className="mx-auto mb-3 h-10 w-10 text-ink-300" />
                <p className="text-sm text-ink-500">{t('noParishes')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {paroisses && paroisses.length > 0 && (
        <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
          <span>{paroisses.length} {t('parishTotal')}</span>
          <span>{paroisses.filter((p) => p.actif).length} {t('parishActiveCount')}</span>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={t('deleteParish')}
        message={t('deleteParishConfirm', { name: deleteTarget?.label ?? '' })}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
