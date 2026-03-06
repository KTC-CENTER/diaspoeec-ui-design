'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Campagne } from '@/types';

interface CampagneFormModalProps {
  campagne?: Campagne | null;
  onClose: () => void;
  onSubmit: (data: CampagneFormData) => void;
  isLoading?: boolean;
}

export interface CampagneFormData {
  titre: string;
  description: string;
  objectifMontant: number | null;
  affectationFonds: string[];
  dateDebut: string;
  dateFin?: string;
  statut: 'active' | 'terminee' | 'pausee';
}

export function CampagneFormModal({ campagne, onClose, onSubmit, isLoading }: CampagneFormModalProps) {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const isEdit = !!campagne;

  const STATUT_OPTIONS = [
    { value: 'active', label: tc('active') },
    { value: 'pausee', label: tc('suspended') },
    { value: 'terminee', label: tc('inactive') },
  ];

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [objectifMontant, setObjectifMontant] = useState('');
  const [affectationFonds, setAffectationFonds] = useState<string[]>(['']);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statut, setStatut] = useState<'active' | 'terminee' | 'pausee'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (campagne) {
      setTitre(campagne.titre);
      setDescription(campagne.description);
      setObjectifMontant(campagne.objectifMontant != null ? String(campagne.objectifMontant) : '');
      setAffectationFonds(campagne.affectationFonds.length > 0 ? campagne.affectationFonds : ['']);
      setDateDebut(campagne.dateDebut?.slice(0, 10) || '');
      setDateFin(campagne.dateFin?.slice(0, 10) || '');
      setStatut(campagne.statut);
    }
  }, [campagne]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!titre.trim()) newErrors.titre = tc('title');
    if (!description.trim()) newErrors.description = tc('description');
    if (objectifMontant && Number(objectifMontant) <= 0) newErrors.objectifMontant = t('campaignInvalidAmount');
    if (!dateDebut) newErrors.dateDebut = tc('startDate');
    const fondsValides = affectationFonds.filter((f) => f.trim());
    if (fondsValides.length === 0) newErrors.affectationFonds = t('campaignAllocation');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      titre: titre.trim(),
      description: description.trim(),
      objectifMontant: objectifMontant ? Number(objectifMontant) : null,
      affectationFonds: affectationFonds.filter((f) => f.trim()),
      dateDebut,
      dateFin: dateFin || undefined,
      statut,
    });
  };

  const addAffectation = () => setAffectationFonds((prev) => [...prev, '']);
  const removeAffectation = (i: number) =>
    setAffectationFonds((prev) => prev.filter((_, idx) => idx !== i));
  const updateAffectation = (i: number, val: string) =>
    setAffectationFonds((prev) => prev.map((f, idx) => (idx === i ? val : f)));

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          className="mb-1 text-xl font-semibold text-ink-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isEdit ? t('editCampaign') : t('newCampaign')}
        </h2>
        <p className="mb-6 text-sm text-ink-500">
          {isEdit ? `${t('editCampaign')} : ${campagne?.titre}` : t('newCampaignDesc')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Titre */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              {tc('title')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder={t('campaignTitlePlaceholder')}
              className={cn(
                'w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/20',
                errors.titre ? 'border-red-400' : 'border-ink-200 focus:border-forest-500'
              )}
            />
            {errors.titre && <p className="mt-1 text-xs text-red-500">{errors.titre}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              {tc('description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t('campaignDescPlaceholder')}
              className={cn(
                'w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/20 resize-none',
                errors.description ? 'border-red-400' : 'border-ink-200 focus:border-forest-500'
              )}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Objectif montant */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              {t('campaignObjective')} <span className="text-ink-400">({t('optional')})</span>
            </label>
            <input
              type="number"
              min="0"
              value={objectifMontant}
              onChange={(e) => setObjectifMontant(e.target.value)}
              placeholder="Ex: 10000"
              className={cn(
                'w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/20',
                errors.objectifMontant ? 'border-red-400' : 'border-ink-200 focus:border-forest-500'
              )}
            />
            {errors.objectifMontant && <p className="mt-1 text-xs text-red-500">{errors.objectifMontant}</p>}
          </div>

          {/* Affectation des fonds */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              {t('campaignAllocation')} <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {affectationFonds.map((fonds, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={fonds}
                    onChange={(e) => updateAffectation(i, e.target.value)}
                    placeholder={t('campaignAllocationPlaceholder')}
                    className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
                  />
                  {affectationFonds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAffectation(i)}
                      className="rounded-lg p-2 text-red-400 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addAffectation}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-forest-900 transition hover:text-forest-700"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('campaignAddAllocation')}
            </button>
            {errors.affectationFonds && <p className="mt-1 text-xs text-red-500">{errors.affectationFonds}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                {tc('startDate')} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className={cn(
                  'w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/20',
                  errors.dateDebut ? 'border-red-400' : 'border-ink-200 focus:border-forest-500'
                )}
              />
              {errors.dateDebut && <p className="mt-1 text-xs text-red-500">{errors.dateDebut}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                {tc('endDate')} <span className="text-ink-400">({t('optional')})</span>
              </label>
              <input
                type="date"
                value={dateFin}
                min={dateDebut}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
              />
            </div>
          </div>

          {/* Statut (uniquement en edit) */}
          {isEdit && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">{tc('status')}</label>
              <div className="flex gap-3">
                {STATUT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatut(opt.value as typeof statut)}
                    className={cn(
                      'flex-1 rounded-xl border py-2.5 text-sm font-medium transition',
                      statut === opt.value
                        ? 'border-forest-900 bg-forest-900/5 text-forest-900'
                        : 'border-ink-200 text-ink-600 hover:border-ink-300'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
            >
              {tc('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-60"
            >
              {isLoading ? tc('saving') : isEdit ? tc('save') : t('createCampaign')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
