'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit2, Loader2, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant, formatRelativeTime } from '@/lib/utils/format';
import { useCampagnes, useDons } from '@/features/dons/hooks/use-dons';
import { useCreateCampagne, useUpdateCampagne } from '@/features/admin/hooks/use-admin';
import { CampagneFormModal } from '@/features/admin/components/campagne-form-modal';
import type { CampagneFormData } from '@/features/admin/components/campagne-form-modal';
import { useToastStore } from '@/stores/toast.store';
import type { Campagne } from '@/types';

export function GestionCampagnesContent() {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const { addToast } = useToastStore();

  const { data: campagnes, isLoading } = useCampagnes();
  const { data: allDons } = useDons();
  const createMutation = useCreateCampagne();
  const updateMutation = useUpdateCampagne();

  const [showForm, setShowForm] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState<Campagne | null>(null);
  const [expandedCampagne, setExpandedCampagne] = useState<string | null>(null);

  const handleSubmit = (formData: CampagneFormData) => {
    if (editingCampagne) {
      updateMutation.mutate(
        { id: editingCampagne.id, data: formData },
        {
          onSuccess: () => {
            addToast(t('campaignUpdated'), 'success');
            setShowForm(false);
            setEditingCampagne(null);
          },
          onError: () => addToast(t('campaignUpdateError'), 'error'),
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          addToast(t('campaignCreated'), 'success');
          setShowForm(false);
        },
        onError: () => addToast(t('campaignCreateError'), 'error'),
      });
    }
  };

  const openCreate = () => {
    setEditingCampagne(null);
    setShowForm(true);
  };

  const openEdit = (campagne: Campagne) => {
    setEditingCampagne(campagne);
    setShowForm(true);
  };

  return (
    <>
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-semibold text-forest-900 md:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Campagnes de dons
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              Creez et gerez les campagnes de collecte de votre paroisse
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('newCampaign')}</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
          </div>
        ) : campagnes && campagnes.length > 0 ? (
          <div className="space-y-4">
            {campagnes.map((campagne) => {
              const obj = campagne.objectifMontant ?? 0;
              const pct = obj > 0
                ? Math.min(Math.round((campagne.montantCollecte / obj) * 100), 100)
                : 0;
              const isTerminee = campagne.statut === 'terminee';
              const isPausee = campagne.statut === 'pausee';
              return (
                <div
                  key={campagne.id}
                  className={cn(
                    'rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
                    isTerminee && 'opacity-75',
                  )}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h4
                          className="text-lg font-semibold text-forest-900"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {campagne.titre}
                        </h4>
                        {campagne.statut === 'active' && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            {t('statusActive')}
                          </span>
                        )}
                        {isPausee && (
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                            {t('statusPaused')}
                          </span>
                        )}
                        {isTerminee && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {t('statusCompleted')}
                          </span>
                        )}
                      </div>
                      {campagne.description && (
                        <p className="mb-2 text-sm text-ink-500 line-clamp-2">{campagne.description}</p>
                      )}
                      {campagne.objectifMontant != null && (
                        <div className="mb-2 h-3 w-full rounded-full bg-sage-200">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-forest-900 to-sage-400 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-500">
                          <strong className="text-forest-900">
                            {formatMontant(campagne.montantCollecte, 'EUR')}
                          </strong>{' '}
                          {campagne.objectifMontant != null
                            ? t('collectedOf', { amount: formatMontant(campagne.objectifMontant, 'EUR') })
                            : t('freeObjective')}
                        </span>
                        {campagne.objectifMontant != null && (
                          <span className="font-semibold text-forest-900">{pct}%</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedCampagne(expandedCampagne === campagne.id ? null : campagne.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-forest-900/20 px-3 py-2 text-sm text-forest-900 transition hover:bg-sage-200"
                      >
                        <User className="h-3.5 w-3.5" />
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expandedCampagne === campagne.id && 'rotate-180')} />
                      </button>
                      <button
                        onClick={() => openEdit(campagne)}
                        className="flex items-center gap-1.5 rounded-xl border border-forest-900/20 px-4 py-2 text-sm text-forest-900 transition hover:bg-sage-200"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        {tc('edit')}
                      </button>
                    </div>
                  </div>

                  {/* Donor history panel */}
                  {expandedCampagne === campagne.id && (() => {
                    const campaignDons = (allDons ?? [])
                      .filter((d) => d.campagneId === campagne.id)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    const totalCampagne = campaignDons.reduce((sum, d) => sum + Number(d.montant), 0);
                    const donateursUniques = new Set(campaignDons.filter((d) => !d.estAnonyme && d.donateurId).map((d) => d.donateurId)).size;

                    return (
                      <div className="mt-4 border-t border-forest-900/5 pt-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h5 className="text-sm font-semibold text-ink-900">
                            {t('donorHistory')} ({campaignDons.length})
                          </h5>
                          <div className="flex items-center gap-3 text-xs text-ink-400">
                            <span>{donateursUniques} {t('uniqueDonors')}</span>
                            <span className="font-medium text-forest-700">{formatMontant(totalCampagne, 'EUR')}</span>
                          </div>
                        </div>
                        {campaignDons.length > 0 ? (
                          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                            {campaignDons.map((d) => (
                              <div key={d.id} className="flex items-center justify-between gap-3 py-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-terra-500/10 text-[10px] font-semibold text-terra-700">
                                    {d.estAnonyme ? '?' : (d.donateurNom ?? '?').split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm text-ink-900 truncate">{d.estAnonyme ? t('anonymous') : d.donateurNom}</p>
                                    <p className="text-[10px] text-ink-400">{formatRelativeTime(d.createdAt)}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-forest-900 flex-shrink-0">{formatMontant(d.montant, d.devise)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="py-4 text-center text-sm text-ink-400">{t('noDonorsYet')}</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-cream-50 py-16 text-center">
            <p className="mb-4 text-sm text-ink-400">{t('noCampaigns')}</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-700"
            >
              <Plus className="h-4 w-4" />
              {t('newCampaign')}
            </button>
          </div>
        )}
      </section>

      {showForm && (
        <CampagneFormModal
          campagne={editingCampagne}
          onClose={() => { setShowForm(false); setEditingCampagne(null); }}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </>
  );
}
