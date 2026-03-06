'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Plus,
  FileText,
  FileSpreadsheet,
  Loader2,
  Edit2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant, formatDate } from '@/lib/utils/format';
import { useAdminDons, useCreateCampagne, useUpdateCampagne } from '@/features/admin/hooks/use-admin';
import { useCampagnes } from '@/features/dons/hooks/use-dons';
import { BarChart } from '@/features/admin/components/bar-chart';
import { CampagneFormModal } from '@/features/admin/components/campagne-form-modal';
import type { CampagneFormData } from '@/features/admin/components/campagne-form-modal';
import { useToastStore } from '@/stores/toast.store';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import type { Campagne } from '@/types';

type TabValue = 'overview' | 'campaigns' | 'history';

export default function AdminDonsPage() {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const td = useTranslations('dons');

  const [activeTab, setActiveTab] = useState<TabValue>('overview');
  const [showCampagneForm, setShowCampagneForm] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState<Campagne | null>(null);

  const { data, isLoading } = useAdminDons();
  const { data: campagnes, isLoading: campagnesLoading } = useCampagnes();
  const createCampagneMutation = useCreateCampagne();
  const updateCampagneMutation = useUpdateCampagne();
  const { addToast } = useToastStore();

  const handleCampagneSubmit = (formData: CampagneFormData) => {
    if (editingCampagne) {
      updateCampagneMutation.mutate(
        { id: editingCampagne.id, data: formData },
        {
          onSuccess: () => {
            addToast(t('campaignUpdated'), 'success');
            setShowCampagneForm(false);
            setEditingCampagne(null);
          },
          onError: () => addToast(t('campaignUpdateError'), 'error'),
        }
      );
    } else {
      createCampagneMutation.mutate(formData, {
        onSuccess: () => {
          addToast(t('campaignCreated'), 'success');
          setShowCampagneForm(false);
        },
        onError: () => addToast(t('campaignCreateError'), 'error'),
      });
    }
  };

  const openCreate = () => {
    setEditingCampagne(null);
    setShowCampagneForm(true);
  };

  const openEdit = (campagne: Campagne) => {
    setEditingCampagne(campagne);
    setShowCampagneForm(true);
  };

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'overview', label: t('donationsAndCampaigns') },
    { value: 'campaigns', label: t('activeCampaigns') },
    { value: 'history', label: td('donationHistory') },
  ];

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1400px] p-4 md:p-8">
        <div className="mb-6">
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('donationsAndCampaigns')}
          </h2>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <>
    <section className="mx-auto max-w-[1400px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('donationsAndCampaigns')}
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {t('donationsSubtitle')}
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm transition-all',
              activeTab === tab.value
                ? 'border-b-2 border-gold-600 font-semibold text-forest-900'
                : 'text-ink-500'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats with border-l-4 */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-l-4 border-forest-900 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">{t('totalCollected')}</p>
              <p className="mt-1 text-2xl font-bold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatMontant(data.totalCollecte, 'EUR')}
              </p>
              <p className="mt-1 text-xs text-ink-500">{t('sinceLaunch')}</p>
            </div>
            <div className="rounded-2xl border-l-4 border-gold-600 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">{t('currentMonthDonations')}</p>
              <p className="mt-1 text-2xl font-bold text-gold-600" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatMontant(data.donsMoisEnCours, 'EUR')}
              </p>
              <p className="mt-1 text-xs text-ink-500">{t('currentMonthDonations')}</p>
            </div>
            <div className="rounded-2xl border-l-4 border-forest-700 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">{t('uniqueDonors')}</p>
              <p className="mt-1 text-2xl font-bold text-forest-700" style={{ fontFamily: 'var(--font-heading)' }}>
                {data.totalDonateurs.toLocaleString('fr-FR')}
              </p>
              <p className="mt-1 text-xs text-ink-500">{t('totalAllDonations')}</p>
            </div>
            <div className="rounded-2xl border-l-4 border-terra-600 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">{t('averageDonation')}</p>
              <p className="mt-1 text-2xl font-bold text-terra-600" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatMontant(data.donMoyen, 'EUR')}
              </p>
              <p className="mt-1 text-xs text-ink-500">{t('perTransaction')}</p>
            </div>
          </div>

          {/* Monthly trend chart */}
          <div className="mb-8">
            <BarChart
              data={data.monthlyData}
              title={t('monthlyDonationsTrend')}
              color="gold"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Donors */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('topDonorsMonth')}
              </h3>
              {data.topDonateurs.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-400">{t('noDonationsThisMonth')}</p>
              ) : (
                <div className="space-y-3">
                  {data.topDonateurs.map((donor, i) => {
                    const rankStyles = [
                      { bg: 'bg-gold-400/10', rankBg: 'bg-gold-600 text-white', amountClass: 'font-bold text-gold-600' },
                      { bg: 'bg-gray-50', rankBg: 'bg-gray-300 text-white', amountClass: 'font-bold text-forest-900' },
                      { bg: 'bg-orange-50/50', rankBg: 'bg-terra-600 text-white', amountClass: 'font-bold text-forest-900' },
                    ];
                    const style = rankStyles[i] ?? { bg: '', rankBg: 'bg-gray-100 text-ink-500', amountClass: 'font-medium text-forest-900' };
                    return (
                      <div key={donor.nom} className={cn('flex items-center gap-3 rounded-xl', style.bg ? `p-3 ${style.bg}` : 'p-2.5')}>
                        <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold', style.rankBg)}>
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{donor.nom || tc('anonymous')}</p>
                          <p className="text-xs text-ink-500">{t('donationCountLabel', { count: donor.nbDons })}</p>
                        </div>
                        <span className={style.amountClass} style={{ fontFamily: 'var(--font-heading)' }}>
                          {formatMontant(donor.montant, 'EUR')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                {t('byPaymentMethod')}
              </h3>
              {data.methodePaiement.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-400">{tc('noData')}</p>
              ) : (
                <div className="mt-2 space-y-5">
                  {data.methodePaiement.map((mp, i) => {
                    const colors = [
                      { bar: 'bg-gradient-to-r from-forest-900 to-forest-700', track: 'bg-sage-200', dot: 'bg-forest-900' },
                      { bar: 'bg-gradient-to-r from-blue-500 to-blue-400', track: 'bg-blue-50', dot: 'bg-blue-500' },
                      { bar: 'bg-gradient-to-r from-gold-600 to-gold-400', track: 'bg-gold-400/20', dot: 'bg-gold-600' },
                    ];
                    const color = colors[i % colors.length];
                    return (
                      <div key={mp.methode}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="flex items-center gap-2 font-medium">
                            <span className={cn('h-3 w-3 rounded-sm', color.dot)} />
                            {mp.methode}
                          </span>
                          <span className="font-semibold">{mp.pourcentage}%</span>
                        </div>
                        <div className={cn('h-4 w-full rounded-full', color.track)}>
                          <div
                            className={cn('bar-h-animate h-4 rounded-full', color.bar)}
                            style={{ '--w': `${mp.pourcentage}%`, width: `${mp.pourcentage}%` } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-8 rounded-xl bg-cream-100 p-4">
                <p className="text-xs text-ink-500">{t('totalTransactions')}</p>
                <p className="mt-1 text-xl font-bold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t('transactionsCount', { count: data.dons.length })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          {campagnesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl shimmer-bg" />
              ))}
            </div>
          ) : campagnes && campagnes.length > 0 ? (
            <div className="mb-6 space-y-4">
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
                      isTerminee && 'opacity-75'
                    )}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                          <h4
                            className="text-lg font-semibold text-forest-900"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {campagne.titre}
                          </h4>
                          {campagne.statut === 'active' && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{t('statusActive')}</span>
                          )}
                          {isPausee && (
                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">{t('statusPaused')}</span>
                          )}
                          {isTerminee && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{t('statusCompleted')}</span>
                          )}
                        </div>
                        {campagne.objectifMontant != null && (
                          <div className="mb-2 h-3 w-full rounded-full bg-sage-200">
                            <div
                              className="bar-h-animate h-3 rounded-full bg-gradient-to-r from-forest-900 to-sage-400"
                              style={{ '--w': `${pct}%`, width: `${pct}%` } as React.CSSProperties}
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
                      <button
                        onClick={() => openEdit(campagne)}
                        className="flex items-center gap-1.5 rounded-xl border border-forest-900/20 px-4 py-2 text-sm text-forest-900 transition hover:bg-sage-200"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        {tc('edit')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-dashed border-ink-200 bg-cream-50 py-16 text-center">
              <p className="text-sm text-ink-400">{t('noCampaigns')}</p>
            </div>
          )}

          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            {t('newCampaign')}
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {data.dons.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-cream-50 py-16 text-center">
              <p className="text-sm text-ink-400">{t('noDonations')}</p>
            </div>
          ) : (
            <div className="mb-4 overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-forest-900/5 bg-forest-900/[0.03]">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{td('date')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{td('donorName')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{td('campaign')}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-500">{td('amount')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{td('method')}</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ink-500">{td('currency')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dons.map((don, i) => {
                      const methodeClass = don.methodePaiement?.toLowerCase().includes('paypal')
                        ? 'bg-blue-50 text-blue-600'
                        : don.methodePaiement?.toLowerCase().includes('virement')
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-forest-900/10 text-forest-900';
                      return (
                        <tr key={don.id} className={cn('tbl-row border-b border-gray-50 transition-colors', i % 2 === 1 && 'bg-cream-50/30')}>
                          <td className="px-4 py-3 text-ink-500">{formatDate(don.createdAt, 'dd/MM/yyyy')}</td>
                          <td className="px-4 py-3 font-medium">{don.estAnonyme || !don.donateurNom ? tc('anonymous') : don.donateurNom}</td>
                          <td className="px-4 py-3">{don.campagneNom}</td>
                          <td className="px-4 py-3 text-right font-semibold text-forest-900">
                            {formatMontant(don.montant, don.devise || 'EUR')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('rounded-full px-2 py-0.5 text-xs', methodeClass)}>
                              {don.methodePaiement}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => addToast(t('receiptAvailable'), 'success')}
                              className="text-ink-500 transition hover:text-forest-900"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                const rows = data.dons.map((d) => ({
                  date: formatDate(d.createdAt, 'dd/MM/yyyy'),
                  donor: d.estAnonyme || !d.donateurNom ? tc('anonymous') : d.donateurNom,
                  campaign: d.campagneNom,
                  amount: formatMontant(d.montant, d.devise || 'EUR'),
                  method: d.methodePaiement,
                }));
                exportToCSV(rows, [
                  { header: td('date'), accessor: (r) => r.date },
                  { header: td('donorName'), accessor: (r) => r.donor },
                  { header: td('campaign'), accessor: (r) => r.campaign },
                  { header: td('amount'), accessor: (r) => r.amount },
                  { header: td('method'), accessor: (r) => r.method },
                ], 'dons');
                addToast(t('csvDonationsExported'), 'success');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white"
            >
              <FileText className="h-3.5 w-3.5" />
              {td('exportCsv')}
            </button>
            <button
              onClick={() => {
                const rows = data.dons.map((d) => ({
                  date: formatDate(d.createdAt, 'dd/MM/yyyy'),
                  donor: d.estAnonyme || !d.donateurNom ? tc('anonymous') : d.donateurNom,
                  campaign: d.campagneNom,
                  amount: formatMontant(d.montant, d.devise || 'EUR'),
                  method: d.methodePaiement,
                }));
                exportToExcel(rows, [
                  { header: td('date'), accessor: (r) => r.date },
                  { header: td('donorName'), accessor: (r) => r.donor },
                  { header: td('campaign'), accessor: (r) => r.campaign },
                  { header: td('amount'), accessor: (r) => r.amount },
                  { header: td('method'), accessor: (r) => r.method },
                ], 'dons');
                addToast(t('excelDonationsExported'), 'success');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              {td('exportExcel')}
            </button>
          </div>
        </div>
      )}
    </section>

    {showCampagneForm && (
      <CampagneFormModal
        campagne={editingCampagne}
        onClose={() => { setShowCampagneForm(false); setEditingCampagne(null); }}
        onSubmit={handleCampagneSubmit}
        isLoading={createCampagneMutation.isPending || updateCampagneMutation.isPending}
      />
    )}
    </>
  );
}
