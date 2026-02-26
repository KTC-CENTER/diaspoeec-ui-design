'use client';

import { useState } from 'react';
import {
  Heart,
  TrendingUp,
  Users,
  CreditCard,
  Plus,
  FileText,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant, formatDate } from '@/lib/utils/format';
import { useAdminDons } from '@/features/admin/hooks/use-admin';
import { BarChart } from '@/features/admin/components/bar-chart';
import { useToastStore } from '@/stores/toast.store';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import type { ExportColumn } from '@/lib/utils/export';

type TabValue = 'overview' | 'campaigns' | 'history';

interface DonRow {
  date: string;
  donor: string;
  campaign: string;
  amount: string;
  method: string;
  methodClass: string;
}

const donationHistory: DonRow[] = [
  { date: '20/02/2026', donor: 'Anonyme', campaign: 'Centre Communautaire', amount: '200 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
  { date: '20/02/2026', donor: 'Marie Fotso', campaign: 'Etudiants EEC', amount: '50 \u20AC', method: 'PayPal', methodClass: 'bg-blue-50 text-blue-600' },
  { date: '19/02/2026', donor: 'Jean-Paul Mbarga', campaign: 'Don mensuel EEC', amount: '50 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
  { date: '19/02/2026', donor: 'Samuel Biyong', campaign: 'Centre Communautaire', amount: '200 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
  { date: '18/02/2026', donor: 'Paul Essomba', campaign: 'Don mensuel EEC', amount: '75 \u20AC', method: 'PayPal', methodClass: 'bg-blue-50 text-blue-600' },
  { date: '18/02/2026', donor: 'Anonyme', campaign: 'Aide Cameroun', amount: '150 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
  { date: '17/02/2026', donor: 'Jeanne Atangana', campaign: 'Centre Communautaire', amount: '100 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
  { date: '17/02/2026', donor: 'David Eyinga', campaign: 'Etudiants EEC', amount: '30 \u20AC', method: 'PayPal', methodClass: 'bg-blue-50 text-blue-600' },
  { date: '16/02/2026', donor: 'Marie-Claire Fotso', campaign: 'Centre Communautaire', amount: '300 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
  { date: '15/02/2026', donor: 'Anonyme', campaign: 'Don mensuel EEC', amount: '150 \u20AC', method: 'Stripe', methodClass: 'bg-forest-900/10 text-forest-900' },
];

const donExportColumns: ExportColumn<DonRow>[] = [
  { header: 'Date', accessor: (r) => r.date },
  { header: 'Donateur', accessor: (r) => r.donor },
  { header: 'Campagne', accessor: (r) => r.campaign },
  { header: 'Montant', accessor: (r) => r.amount },
  { header: 'Methode', accessor: (r) => r.method },
];

export default function AdminDonsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('overview');
  const { data, isLoading } = useAdminDons();
  const { addToast } = useToastStore();

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'overview', label: "Vue d'ensemble" },
    { value: 'campaigns', label: 'Campagnes' },
    { value: 'history', label: 'Historique des dons' },
  ];

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1400px] p-4 md:p-8">
        <div className="mb-6">
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dons &amp; Campagnes
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
    <section className="mx-auto max-w-[1400px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Dons &amp; Campagnes
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Suivi des dons et gestion des campagnes de collecte
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
              <p className="text-xs uppercase tracking-wide text-ink-500">
                Total collecte
              </p>
              <p
                className="mt-1 text-2xl font-bold text-forest-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {formatMontant(data.totalCollecte, 'EUR')}
              </p>
              <p className="mt-1 text-xs text-ink-500">Depuis le lancement</p>
            </div>
            <div className="rounded-2xl border-l-4 border-gold-600 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">
                Ce mois
              </p>
              <p
                className="mt-1 text-2xl font-bold text-gold-600"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                12 450 &euro;
              </p>
              <p className="mt-1 text-xs font-medium text-green-600">
                +18% vs mois dernier
              </p>
            </div>
            <div className="rounded-2xl border-l-4 border-forest-700 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">
                Donateurs actifs
              </p>
              <p
                className="mt-1 text-2xl font-bold text-forest-700"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                342
              </p>
              <p className="mt-1 text-xs text-ink-500">Ce mois</p>
            </div>
            <div className="rounded-2xl border-l-4 border-terra-600 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink-500">
                Don moyen
              </p>
              <p
                className="mt-1 text-2xl font-bold text-terra-600"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                36,40 &euro;
              </p>
              <p className="mt-1 text-xs text-ink-500">Par transaction</p>
            </div>
          </div>

          {/* Monthly trend chart */}
          <div className="mb-8">
            <BarChart
              data={[
                { label: 'Sep', value: 8200 },
                { label: 'Oct', value: 9500 },
                { label: 'Nov', value: 10800 },
                { label: 'Dec', value: 15200 },
                { label: 'Jan', value: 10500 },
                { label: 'Fev', value: 12400 },
              ]}
              title="Evolution des dons mensuels"
              color="gold"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Donors */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
              <h3
                className="mb-4 text-lg font-semibold text-forest-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Top donateurs ce mois
              </h3>
              <div className="space-y-3">
                {[
                  {
                    rank: 1,
                    name: 'Anonyme',
                    dons: '3 dons',
                    amount: '500 \u20AC',
                    bg: 'bg-gold-400/10',
                    rankBg: 'bg-gold-600 text-white',
                    amountClass: 'font-bold text-gold-600',
                    amountFont: true,
                  },
                  {
                    rank: 2,
                    name: 'Marie-Claire Fotso',
                    dons: '2 dons',
                    amount: '350 \u20AC',
                    bg: 'bg-gray-50',
                    rankBg: 'bg-gray-300 text-white',
                    amountClass: 'font-bold text-forest-900',
                    amountFont: true,
                  },
                  {
                    rank: 3,
                    name: 'Jean-Paul Mbarga',
                    dons: '5 dons',
                    amount: '250 \u20AC',
                    bg: 'bg-orange-50/50',
                    rankBg: 'bg-terra-600 text-white',
                    amountClass: 'font-bold text-forest-900',
                    amountFont: true,
                  },
                  {
                    rank: 4,
                    name: 'Samuel Biyong',
                    dons: '1 don',
                    amount: '200 \u20AC',
                    bg: '',
                    rankBg: 'bg-gray-100 text-ink-500',
                    amountClass: 'font-medium text-forest-900',
                    amountFont: false,
                  },
                  {
                    rank: 5,
                    name: 'Paul Essomba',
                    dons: '3 dons',
                    amount: '150 \u20AC',
                    bg: '',
                    rankBg: 'bg-gray-100 text-ink-500',
                    amountClass: 'font-medium text-forest-900',
                    amountFont: false,
                  },
                ].map((donor) => (
                  <div
                    key={donor.rank}
                    className={cn(
                      'flex items-center gap-3 rounded-xl',
                      donor.bg ? `p-3 ${donor.bg}` : 'p-2.5'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                        donor.rankBg
                      )}
                    >
                      {donor.rank}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{donor.name}</p>
                      <p className="text-xs text-ink-500">{donor.dons}</p>
                    </div>
                    <span
                      className={donor.amountClass}
                      style={
                        donor.amountFont
                          ? { fontFamily: 'var(--font-heading)' }
                          : undefined
                      }
                    >
                      {donor.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
              <h3
                className="mb-4 text-lg font-semibold text-forest-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Par methode de paiement
              </h3>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="h-3 w-3 rounded-sm bg-forest-900" />
                      Stripe
                    </span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-sage-200">
                    <div
                      className="bar-h-animate h-4 rounded-full bg-gradient-to-r from-forest-900 to-forest-700"
                      style={
                        {
                          '--w': '78%',
                          width: '78%',
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="h-3 w-3 rounded-sm bg-blue-500" />
                      PayPal
                    </span>
                    <span className="font-semibold">22%</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-blue-50">
                    <div
                      className="bar-h-animate h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      style={
                        {
                          '--w': '22%',
                          width: '22%',
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-xl bg-cream-100 p-4">
                <p className="text-xs text-ink-500">
                  Total des transactions ce mois
                </p>
                <p
                  className="mt-1 text-xl font-bold text-forest-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  342 transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <div className="mb-6 space-y-4">
            {/* Campaign 1 */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4
                      className="text-lg font-semibold text-forest-900"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Construction Centre Communautaire
                    </h4>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="mb-2 h-3 w-full rounded-full bg-sage-200">
                    <div
                      className="bar-h-animate h-3 rounded-full bg-gradient-to-r from-forest-900 to-sage-400"
                      style={
                        {
                          '--w': '72%',
                          width: '72%',
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">
                      <strong className="text-forest-900">72 000 &euro;</strong>{' '}
                      collectes sur 100 000 &euro;
                    </span>
                    <span className="font-semibold text-forest-900">72%</span>
                  </div>
                </div>
                <button
                  onClick={() => addToast('Modification de la campagne en cours...', 'info')}
                  className="rounded-xl border border-forest-900/20 px-4 py-2 text-sm text-forest-900 transition hover:bg-sage-200"
                >
                  Modifier
                </button>
              </div>
            </div>

            {/* Campaign 2 */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4
                      className="text-lg font-semibold text-forest-900"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Soutien aux etudiants EEC
                    </h4>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="mb-2 h-3 w-full rounded-full bg-gold-400/20">
                    <div
                      className="bar-h-animate h-3 rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                      style={
                        {
                          '--w': '45%',
                          width: '45%',
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">
                      <strong className="text-gold-600">4 500 &euro;</strong>{' '}
                      collectes sur 10 000 &euro;
                    </span>
                    <span className="font-semibold text-gold-600">45%</span>
                  </div>
                </div>
                <button
                  onClick={() => addToast('Modification de la campagne en cours...', 'info')}
                  className="rounded-xl border border-forest-900/20 px-4 py-2 text-sm text-forest-900 transition hover:bg-sage-200"
                >
                  Modifier
                </button>
              </div>
            </div>

            {/* Campaign 3 */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4
                      className="text-lg font-semibold text-forest-900"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Aide humanitaire Cameroun
                    </h4>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="mb-2 h-3 w-full rounded-full bg-orange-50">
                    <div
                      className="bar-h-animate h-3 rounded-full bg-gradient-to-r from-terra-600 to-orange-300"
                      style={
                        {
                          '--w': '23%',
                          width: '23%',
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">
                      <strong className="text-terra-600">2 300 &euro;</strong>{' '}
                      collectes sur 10 000 &euro;
                    </span>
                    <span className="font-semibold text-terra-600">23%</span>
                  </div>
                </div>
                <button
                  onClick={() => addToast('Modification de la campagne en cours...', 'info')}
                  className="rounded-xl border border-forest-900/20 px-4 py-2 text-sm text-forest-900 transition hover:bg-sage-200"
                >
                  Modifier
                </button>
              </div>
            </div>

            {/* Campaign 4 - Completed */}
            <div className="rounded-2xl border border-forest-900/5 bg-white p-5 opacity-80 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4
                      className="text-lg font-semibold text-ink-500"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Renovation Temple Douala
                    </h4>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      Terminee
                    </span>
                  </div>
                  <div className="mb-2 h-3 w-full rounded-full bg-sage-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-forest-900 to-sage-400"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-500">
                      <strong className="text-forest-900">
                        15 000 &euro;
                      </strong>{' '}
                      collectes sur 15 000 &euro;
                    </span>
                    <span className="font-semibold text-green-600">100%</span>
                  </div>
                </div>
                <span className="text-2xl">&#9989;</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => addToast('Formulaire de creation de campagne ouvert', 'info')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Nouvelle campagne
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="mb-4 overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-forest-900/5 bg-forest-900/[0.03]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Donateur
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Campagne
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Montant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Methode
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ink-500">
                      Recu
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {donationHistory.map((row, i) => (
                    <tr
                      key={i}
                      className={cn(
                        'tbl-row border-b border-gray-50 transition-colors',
                        i % 2 === 1 && 'bg-cream-50/30'
                      )}
                    >
                      <td className="px-4 py-3 text-ink-500">{row.date}</td>
                      <td className="px-4 py-3 font-medium">{row.donor}</td>
                      <td className="px-4 py-3">{row.campaign}</td>
                      <td className="px-4 py-3 text-right font-semibold text-forest-900">
                        {row.amount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs',
                            row.methodClass
                          )}
                        >
                          {row.method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => addToast('Recu telecharge', 'success')}
                          className="text-ink-500 transition hover:text-forest-900"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                exportToCSV(donationHistory, donExportColumns, 'dons');
                addToast('Export CSV des dons telecharge', 'success');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white"
            >
              <FileText className="h-3.5 w-3.5" />
              Exporter CSV
            </button>
            <button
              onClick={() => {
                exportToExcel(donationHistory, donExportColumns, 'dons');
                addToast('Export Excel des dons telecharge', 'success');
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Exporter Excel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
