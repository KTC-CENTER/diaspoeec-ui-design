'use client';

import { useState } from 'react';
import {
  Download,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant } from '@/lib/utils/format';
import { useDonHistory, useDonStats } from '@/features/dons/hooks/use-dons';
import { CustomSelect } from '@/components/forms/custom-select';
import { DonationHistory } from '@/features/dons/components/donation-history';
import { SubscriptionCard } from '@/features/dons/components/subscription-card';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import { useToastStore } from '@/stores/toast.store';

export default function HistoriqueDonsPage() {
  const { data: dons, isLoading: donsLoading } = useDonHistory();
  const { data: stats, isLoading: statsLoading } = useDonStats();
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { addToast } = useToastStore();

  const userDons = dons || [];

  // Active subscriptions
  const subscriptions = userDons.filter((d) => d.frequence === 'mensuel');
  // Get unique active subscriptions (latest per campaign)
  const uniqueSubscriptions = subscriptions.reduce(
    (acc, don) => {
      if (!acc.find((d) => d.campagneId === don.campagneId)) {
        acc.push(don);
      }
      return acc;
    },
    [] as typeof subscriptions
  );

  // Filtered history
  let filteredDons = userDons;
  if (yearFilter !== 'all') {
    filteredDons = filteredDons.filter(
      (d) => new Date(d.createdAt).getFullYear().toString() === yearFilter
    );
  }
  if (typeFilter !== 'all') {
    filteredDons = filteredDons.filter((d) => d.frequence === typeFilter);
  }

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl">
      {/* Header */}
      <div className="animate-[fade-up_0.5s_ease-out_both] mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest-900 mb-2">
          Mes dons
        </h1>
      </div>

      {/* Stats - centered display with text-3xl, colored top bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer-bg" />
          ))
        ) : (
          <>
            <div className="animate-[fade-up_0.5s_ease-out_0.1s_both] bg-white rounded-2xl shadow-sm border border-sage-200/40 p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-900 to-sage-400" />
              <p className="text-sm text-ink-600 mb-1">Total donne</p>
              <p className="font-heading text-3xl font-bold text-forest-900">
                {formatMontant(stats?.totalDonne || 0, 'EUR')}
              </p>
            </div>
            <div className="animate-[fade-up_0.5s_ease-out_0.2s_both] bg-white rounded-2xl shadow-sm border border-sage-200/40 p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 to-gold-400" />
              <p className="text-sm text-ink-600 mb-1">Dons cette annee</p>
              <p className="font-heading text-3xl font-bold text-gold-600">
                {formatMontant(stats?.totalCetteAnnee || 0, 'EUR')}
              </p>
            </div>
            <div className="animate-[fade-up_0.5s_ease-out_0.3s_both] bg-white rounded-2xl shadow-sm border border-sage-200/40 p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terra-600 to-gold-600" />
              <p className="text-sm text-ink-600 mb-1">Nombre de dons</p>
              <p className="font-heading text-3xl font-bold text-terra-600">
                {stats?.nombreDons || 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
        <CustomSelect
          value={yearFilter}
          onChange={setYearFilter}
          options={[
            { value: 'all', label: 'Toutes les annees' },
            { value: '2026', label: '2026' },
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
          ]}
          className="w-full sm:w-auto sm:min-w-[180px]"
        />
        <CustomSelect
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'Tous' },
            { value: 'ponctuel', label: 'Ponctuels' },
            { value: 'mensuel', label: 'Recurrents' },
          ]}
          className="w-full sm:w-auto sm:min-w-[160px]"
        />
      </div>

      {/* Active subscriptions */}
      {uniqueSubscriptions.length > 0 && (
        <div className="mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            Abonnements actifs
          </h2>
          <div className="space-y-4">
            {uniqueSubscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} don={sub} />
            ))}
          </div>
        </div>
      )}

      {/* Donation history */}
      <div className="animate-[fade-up_0.5s_ease-out_0.3s_both]">
        <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
          Historique des dons
        </h2>
        {donsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
          </div>
        ) : (
          <DonationHistory dons={filteredDons} />
        )}
      </div>

      {/* Export buttons */}
      <div className="flex gap-3 mt-6">
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-ink-200 text-ink-600 rounded-xl text-sm font-medium hover:border-forest-900 hover:text-forest-900 transition hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => {
            exportToCSV(
              filteredDons,
              [
                { header: 'Date', accessor: (d) => new Date(d.createdAt).toLocaleDateString('fr-FR') },
                { header: 'Campagne', accessor: (d) => d.campagneNom },
                { header: 'Montant', accessor: (d) => d.montant },
                { header: 'Devise', accessor: (d) => d.devise },
                { header: 'Frequence', accessor: (d) => d.frequence },
                { header: 'Methode', accessor: (d) => d.methodePaiement },
              ],
              'mes-dons',
            );
            addToast('Export CSV telecharge', 'success');
          }}
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-ink-200 text-ink-600 rounded-xl text-sm font-medium hover:border-forest-900 hover:text-forest-900 transition hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => {
            exportToExcel(
              filteredDons,
              [
                { header: 'Date', accessor: (d) => new Date(d.createdAt).toLocaleDateString('fr-FR') },
                { header: 'Campagne', accessor: (d) => d.campagneNom },
                { header: 'Montant', accessor: (d) => d.montant },
                { header: 'Devise', accessor: (d) => d.devise },
                { header: 'Frequence', accessor: (d) => d.frequence },
                { header: 'Methode', accessor: (d) => d.methodePaiement },
              ],
              'mes-dons',
            );
            addToast('Export Excel telecharge', 'success');
          }}
        >
          <Download className="h-4 w-4" />
          Exporter Excel
        </button>
      </div>
    </div>
  );
}
