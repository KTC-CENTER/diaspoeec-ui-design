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
  Eye,
  EyeOff,
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
import type { ParoisseData, CreateParoissePayload } from '@/lib/api/admin.api';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateCode(label: string): string {
  const base = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)[0]
    ?.toUpperCase()
    .slice(0, 8) ?? 'PARISH';
  return `${base}-${new Date().getFullYear()}`;
}

// ============================================================================
// Color Picker Field
// ============================================================================

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-ink-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-ink-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Form State
// ============================================================================

interface FormState {
  label: string;
  slug: string;
  code: string;
  ville: string;
  synode: string;
  region: string;
  pasteurNom: string;
  messageAccueil: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  couleurAccent: string;
  pasteurEmail: string;
  pasteurPassword: string;
}

const EMPTY_FORM: FormState = {
  label: '',
  slug: '',
  code: '',
  ville: '',
  synode: '',
  region: '',
  pasteurNom: '',
  messageAccueil: '',
  couleurPrimaire: '#1B4332',
  couleurSecondaire: '#D4A017',
  couleurAccent: '#52B788',
  pasteurEmail: '',
  pasteurPassword: '',
};

// ============================================================================
// Page
// ============================================================================

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
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ParoisseData | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowPassword(false);
  };

  const startEdit = (p: ParoisseData) => {
    setEditing(p);
    setForm({
      label: p.label,
      slug: p.slug,
      code: p.code,
      ville: p.ville ?? '',
      synode: p.synode ?? '',
      region: p.region ?? '',
      pasteurNom: p.pasteurNom ?? '',
      messageAccueil: p.messageAccueil ?? '',
      couleurPrimaire: p.couleurPrimaire ?? '#1B4332',
      couleurSecondaire: p.couleurSecondaire ?? '#D4A017',
      couleurAccent: p.couleurAccent ?? '#52B788',
      pasteurEmail: '',
      pasteurPassword: '',
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.label.trim()) return;

    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: {
            label: form.label.trim(),
            slug: form.slug.trim() || slugify(form.label),
            code: form.code.trim(),
            ville: form.ville.trim() || undefined,
            synode: form.synode.trim() || undefined,
            region: form.region.trim() || undefined,
            pasteurNom: form.pasteurNom.trim() || undefined,
            messageAccueil: form.messageAccueil.trim() || undefined,
            couleurPrimaire: form.couleurPrimaire,
            couleurSecondaire: form.couleurSecondaire,
            couleurAccent: form.couleurAccent,
          },
        });
        addToast(t('parishUpdated'), 'success');
      } else {
        if (!form.pasteurEmail.trim() || !form.pasteurPassword.trim()) {
          addToast('Email et mot de passe du pasteur requis', 'error');
          return;
        }
        if (!form.code.trim()) {
          addToast('Le code paroisse est requis', 'error');
          return;
        }
        const payload: CreateParoissePayload = {
          slug: form.slug.trim() || slugify(form.label),
          code: form.code.trim().toUpperCase(),
          label: form.label.trim(),
          ville: form.ville.trim() || undefined,
          synode: form.synode.trim() || undefined,
          region: form.region.trim() || undefined,
          pasteurNom: form.pasteurNom.trim() || undefined,
          messageAccueil: form.messageAccueil.trim() || undefined,
          couleurPrimaire: form.couleurPrimaire,
          couleurSecondaire: form.couleurSecondaire,
          couleurAccent: form.couleurAccent,
          pasteurEmail: form.pasteurEmail.trim(),
          pasteurPassword: form.pasteurPassword,
        };
        await createMutation.mutateAsync(payload);
        addToast(t('parishAdded'), 'success');
      }
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('saveError');
      addToast(msg, 'error');
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

  const isCreating = !editing;

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
          <h3 className="mb-5 text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {editing ? t('editParish') : t('newParish')}
          </h3>

          {/* Section: Identite */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Identite</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">{t('parishName')} *</label>
              <input
                value={form.label}
                onChange={(e) => {
                  updateField('label', e.target.value);
                  if (isCreating) {
                    updateField('slug', slugify(e.target.value));
                    updateField('code', generateCode(e.target.value));
                  }
                }}
                placeholder={t('parishNamePlaceholder')}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Code paroisse *</label>
              <input
                value={form.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                placeholder="BONANJO-2026"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-mono text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">{t('parishSlug')}</label>
              <input
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder={t('parishSlugPlaceholder')}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
          </div>

          {/* Section: Localisation */}
          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-ink-400">Localisation</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">{t('parishCity')}</label>
              <input
                value={form.ville}
                onChange={(e) => updateField('ville', e.target.value)}
                placeholder={t('parishCityPlaceholder')}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Synode</label>
              <input
                value={form.synode}
                onChange={(e) => updateField('synode', e.target.value)}
                placeholder="Synode du Wouri"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Region</label>
              <input
                value={form.region}
                onChange={(e) => updateField('region', e.target.value)}
                placeholder="Littoral"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
          </div>

          {/* Section: Pasteur principal */}
          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-ink-400">Pasteur principal</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-500">Nom du pasteur</label>
              <input
                value={form.pasteurNom}
                onChange={(e) => updateField('pasteurNom', e.target.value)}
                placeholder="Pasteur Jean Mbarga"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
            </div>
            {isCreating && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-500">Email du pasteur *</label>
                  <input
                    type="email"
                    value={form.pasteurEmail}
                    onChange={(e) => updateField('pasteurEmail', e.target.value)}
                    placeholder="pasteur@eec-diaspora.org"
                    className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-500">Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.pasteurPassword}
                      onChange={(e) => updateField('pasteurPassword', e.target.value)}
                      placeholder="Min. 6 caracteres"
                      className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-10 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section: Personnalisation */}
          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-ink-400">Personnalisation</p>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-ink-500">Message d&apos;accueil</label>
            <textarea
              value={form.messageAccueil}
              onChange={(e) => updateField('messageAccueil', e.target.value)}
              placeholder="Bienvenue dans la famille de notre paroisse !"
              rows={2}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ColorField label="Couleur primaire" value={form.couleurPrimaire} onChange={(v) => updateField('couleurPrimaire', v)} />
            <ColorField label="Couleur secondaire" value={form.couleurSecondaire} onChange={(v) => updateField('couleurSecondaire', v)} />
            <ColorField label="Couleur accent" value={form.couleurAccent} onChange={(v) => updateField('couleurAccent', v)} />
          </div>

          {/* Preview */}
          <div className="mt-5 rounded-xl border border-dashed border-ink-200 p-4">
            <p className="mb-2 text-xs font-medium text-ink-400">Apercu des couleurs</p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: form.couleurPrimaire }} />
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: form.couleurSecondaire }} />
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: form.couleurAccent }} />
              <span className="ml-2 text-sm font-medium" style={{ color: form.couleurPrimaire }}>
                {form.label || 'Nom de la paroisse'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-2">
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
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${p.couleurPrimaire ?? '#1B4332'}20` }}
                    >
                      <Church className="h-4 w-4" style={{ color: p.couleurPrimaire ?? '#1B4332' }} />
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
                        <span className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500">
                          {p.code}
                        </span>
                        {p.pasteurNom && (
                          <span className="text-xs text-ink-400">{p.pasteurNom}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Color dots */}
                    <div className="hidden items-center gap-1 sm:flex">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.couleurPrimaire }} />
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.couleurSecondaire }} />
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.couleurAccent }} />
                    </div>
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
