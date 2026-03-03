'use client';

import Link from 'next/link';
import {
  Users,
  Heart,
  Calendar,
  BookOpen,
  UserPlus,
  CalendarPlus,
  Megaphone,
  BellRing,
  Flag,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant, formatRelativeTime } from '@/lib/utils/format';
import { DashboardStats } from '@/features/admin/components/dashboard-stats';
import { BarChart } from '@/features/admin/components/bar-chart';
import { DiasporaMap } from '@/features/admin/components/diaspora-map';
import { useAdminStats } from '@/features/admin/hooks/use-admin';

const quickActions = [
  {
    label: 'Publier une meditation',
    icon: BookOpen,
    href: '/admin/meditations',
    gradient: 'bg-gradient-to-r from-forest-900 to-forest-700',
  },
  {
    label: 'Creer un evenement',
    icon: CalendarPlus,
    href: '/admin/evenements',
    gradient: 'bg-gradient-to-r from-terra-600 to-orange-400',
  },
  {
    label: 'Lancer une campagne',
    icon: Megaphone,
    href: '/admin/dons',
    gradient: 'bg-gradient-to-r from-gold-600 to-gold-400',
  },
  {
    label: 'Envoyer une notification',
    icon: BellRing,
    href: '/admin/parametres',
    isOutline: true,
  },
];

const ACTION_ICON: Record<string, typeof Heart> = {
  inscription: UserPlus,
  don: Heart,
  meditation: BookOpen,
  evenement: Calendar,
  signalement: Flag,
};

const ACTION_STYLE: Record<string, { bg: string; iconColor: string }> = {
  inscription: { bg: 'bg-sage-200', iconColor: 'text-forest-900' },
  don: { bg: 'bg-gold-400/30', iconColor: 'text-gold-600' },
  meditation: { bg: 'bg-sage-200', iconColor: 'text-forest-700' },
  evenement: { bg: 'bg-orange-50', iconColor: 'text-terra-600' },
  signalement: { bg: 'bg-red-50', iconColor: 'text-red-400' },
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <section className="mx-auto max-w-[1400px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Tableau de bord
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Vue d&apos;ensemble de la communaute DiaspoEEC
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      {/* Charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <div className="h-64 rounded-2xl shimmer-bg" />
            <div className="h-64 rounded-2xl shimmer-bg" />
          </>
        ) : (
          <>
            <BarChart
              data={
                stats?.evolutionMembres?.length
                  ? stats.evolutionMembres.map((e) => ({ label: e.mois, value: e.nombre }))
                  : []
              }
              title="Evolution des inscriptions"
              color="forest"
            />
            <BarChart
              data={
                stats?.donsParCampagne?.length
                  ? stats.donsParCampagne.map((d) => ({ label: d.campagne, value: d.montant }))
                  : []
              }
              title="Dons par campagne"
              color="forest"
              horizontal
            />
          </>
        )}
      </div>

      {/* Diaspora Map */}
      <div className="mb-8">
        {isLoading ? (
          <div className="h-48 rounded-2xl shimmer-bg" />
        ) : (
          <DiasporaMap data={stats?.repartitionPays ?? []} />
        )}
      </div>

      {/* Bottom row: Activity + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity */}
        <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm lg:col-span-2">
          <h3
            className="mb-4 text-lg font-semibold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Activite recente
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 rounded-xl shimmer-bg" />
              ))}
            </div>
          ) : stats?.actionsRecentes?.length ? (
            <div className="space-y-0">
              {stats.actionsRecentes.map((item, i) => {
                const Icon = ACTION_ICON[item.type] ?? Heart;
                const style = ACTION_STYLE[item.type] ?? ACTION_STYLE.don;
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-3 py-3',
                      i < stats.actionsRecentes.length - 1 && 'border-b border-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                        style.bg
                      )}
                    >
                      <Icon className={cn('h-4 w-4', style.iconColor)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink-900">
                        {item.type === 'don' && item.montant ? (
                          <>
                            Don de{' '}
                            <span className="font-semibold text-gold-600">
                              {formatMontant(item.montant, item.devise ?? 'EUR')}
                            </span>{' '}
                            recu{' '}
                            <span className="text-ink-500">
                              ({item.description.split('(')[1]?.replace(')', '') ?? ''})
                            </span>
                          </>
                        ) : (
                          item.description
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-ink-400">Aucune activite recente</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
          <h3
            className="mb-4 text-lg font-semibold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Actions rapides
          </h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              if (action.isOutline) {
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex w-full items-center gap-3 rounded-xl border-2 border-forest-900/20 bg-white px-4 py-3 text-sm font-medium text-forest-900 transition-all hover:bg-sage-200"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg',
                    action.gradient
                  )}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Link>
              );
            })}
          </div>

          {/* Quick stats summary */}
          {stats && (
            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-xs text-ink-500">
                <span>Campagnes actives</span>
                <span className="font-semibold text-forest-900">{stats.campagnesActives}</span>
              </div>
              <div className="flex justify-between text-xs text-ink-500">
                <span>Signalements en attente</span>
                <span className={cn('font-semibold', stats.signalementsEnAttente > 0 ? 'text-red-500' : 'text-forest-900')}>
                  {stats.signalementsEnAttente}
                </span>
              </div>
              <div className="flex justify-between text-xs text-ink-500">
                <span>Evenements a venir</span>
                <span className="font-semibold text-forest-900">{stats.evenementsAVenir}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
