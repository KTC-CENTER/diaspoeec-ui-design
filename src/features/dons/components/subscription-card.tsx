'use client';

import { useState } from 'react';
import { RefreshCw, Check, X, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatMontant, formatDate } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import type { Don } from '@/types';

interface SubscriptionCardProps {
  don: Don;
}

const montantPresets = [10, 25, 50, 100];

export function SubscriptionCard({ don }: SubscriptionCardProps) {
  const t = useTranslations('dons');
  const tc = useTranslations('common');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [editing, setEditing] = useState(false);
  const [montant, setMontant] = useState(don.montant);
  const [newMontant, setNewMontant] = useState(don.montant.toString());
  const [saving, setSaving] = useState(false);
  const { addToast } = useToastStore();

  // Calculate next debit date (one month after last payment)
  const lastPayment = new Date(don.createdAt);
  const nextDebit = new Date(lastPayment);
  nextDebit.setMonth(nextDebit.getMonth() + 1);

  const handleSave = async () => {
    const parsed = parseFloat(newMontant);
    if (!parsed || parsed <= 0) {
      addToast(t('invalidAmount'), 'error');
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    setMontant(parsed);
    setEditing(false);
    setSaving(false);
    addToast(t('monthlyAmountUpdated', { amount: `${formatMontant(parsed, don.devise)}` }), 'success');
  };

  if (cancelled) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-sage-200/40 p-5 opacity-60">
        <div className="flex items-center gap-3 text-ink-400">
          <X className="w-5 h-5" />
          <p className="text-sm">{t('monthlyCancelled', { name: don.campagneNom })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage-200/40 p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-forest-900 to-sage-400 rounded-xl flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-ink-900">
              {t('monthlyDonLabel')} - {don.campagneNom}
            </p>
            <p className="text-2xl font-heading font-bold text-forest-900">
              {formatMontant(montant, don.devise)}{' '}
              <span className="text-sm font-body text-ink-600 font-normal">{t('perMonth')}</span>
            </p>
            <div className="text-xs text-ink-600 mt-1 space-y-0.5">
              <p>{t('since')} {formatDate(don.createdAt, 'MMMM yyyy')}</p>
              <p>{t('nextDebit')} : {formatDate(nextDebit.toISOString(), 'dd MMMM yyyy')}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {confirmCancel ? (
            <>
              <span className="self-center text-xs text-red-500 mr-1">{t('confirmCancel')}</span>
              <button
                onClick={() => {
                  setCancelled(true);
                  addToast(t('monthlyCancelled', { name: don.campagneNom }), 'success');
                }}
                className="px-4 py-2 border-2 border-red-500 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('yesCancelIt')}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="px-4 py-2 border-2 border-forest-900/20 text-ink-600 text-sm font-semibold rounded-xl hover:bg-cream-100 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {tc('no')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setNewMontant(montant.toString());
                  setEditing(true);
                }}
                className="px-4 py-2 border-2 border-forest-900 text-forest-900 text-sm font-semibold rounded-xl hover:bg-forest-900 hover:text-white transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('modify')}
              </button>
              <button
                onClick={() => setConfirmCancel(true)}
                className="px-4 py-2 border-2 border-red-300 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                {tc('cancel')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="mt-4 pt-4 border-t border-sage-200/40">
          <div className="flex items-center gap-2 mb-3">
            <PenLine className="w-4 h-4 text-forest-900" />
            <p className="text-sm font-semibold text-ink-900">{t('editMonthlyAmount')}</p>
          </div>

          {/* Preset amounts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {montantPresets.map((preset) => (
              <button
                key={preset}
                onClick={() => setNewMontant(preset.toString())}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border-2 transition',
                  parseFloat(newMontant) === preset
                    ? 'border-forest-900 bg-forest-900/10 text-forest-900'
                    : 'border-ink-200 text-ink-600 hover:border-ink-300'
                )}
              >
                {formatMontant(preset, don.devise)}
              </button>
            ))}
          </div>

          {/* Custom amount input */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                min="1"
                step="0.01"
                value={newMontant}
                onChange={(e) => setNewMontant(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium focus:border-forest-900 focus:ring-2 focus:ring-sage-200 outline-none"
                placeholder={t('customAmountPlaceholder')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">
                {don.devise} / mois
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {saving ? tc('saving') : tc('save')}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-4 py-2.5 border border-ink-200 text-ink-500 text-sm rounded-xl hover:bg-ink-50 transition"
            >
              {tc('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
