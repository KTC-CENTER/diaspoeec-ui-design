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
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { DashboardStats } from '@/features/admin/components/dashboard-stats';
import { BarChart } from '@/features/admin/components/bar-chart';
import { DiasporaMap } from '@/features/admin/components/diaspora-map';

const inscriptionsData = [
  { label: 'Sep', value: 85 },
  { label: 'Oct', value: 92 },
  { label: 'Nov', value: 110 },
  { label: 'Dec', value: 145 },
  { label: 'Jan', value: 118 },
  { label: 'Fev', value: 124 },
];

const donsParCampagne = [
  { label: 'Centre Communautaire', value: 72000 },
  { label: 'Don general EEC', value: 45000 },
  { label: 'Etudiants EEC', value: 4500 },
  { label: 'Aide Cameroun', value: 2300 },
];

const recentActivity = [
  {
    icon: UserPlus,
    text: (
      <>
        <span className="font-medium">Marie Fotso</span> s&apos;est inscrite
      </>
    ),
    time: 'Il y a 15 min',
    bg: 'bg-sage-200',
    iconColor: 'text-forest-900',
  },
  {
    icon: Heart,
    text: (
      <>
        Don de <span className="font-semibold text-gold-600">100 &euro;</span>{' '}
        recu <span className="text-ink-500">(Centre Communautaire)</span>
      </>
    ),
    time: 'Il y a 30 min',
    bg: 'bg-gold-400/30',
    iconColor: 'text-gold-600',
  },
  {
    icon: BookOpen,
    text: (
      <>
        Nouvelle meditation publiee par{' '}
        <span className="font-medium">Pasteur Ndongo</span>
      </>
    ),
    time: 'Il y a 1h',
    bg: 'bg-sage-200',
    iconColor: 'text-forest-700',
  },
  {
    icon: Calendar,
    text: (
      <>
        <span className="font-semibold">52 inscriptions</span> au Culte de
        Paris
      </>
    ),
    time: 'Il y a 2h',
    bg: 'bg-orange-50',
    iconColor: 'text-terra-600',
  },
  {
    icon: Flag,
    text: (
      <>
        <span className="font-medium">Samuel Biyong</span> a signale un
        commentaire
      </>
    ),
    time: 'Il y a 3h',
    bg: 'bg-red-50',
    iconColor: 'text-red-400',
  },
];

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

export default function AdminDashboardPage() {
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
        <BarChart
          data={inscriptionsData}
          title="Evolution des inscriptions"
          color="forest"
        />
        <BarChart
          data={donsParCampagne}
          title="Dons par campagne"
          color="forest"
          horizontal
        />
      </div>

      {/* Diaspora Map */}
      <div className="mb-8">
        <DiasporaMap />
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
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 py-3',
                  i < recentActivity.length - 1 && 'border-b border-gray-50'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                    item.bg
                  )}
                >
                  <item.icon className={cn('h-4 w-4', item.iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-900">{item.text}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </section>
  );
}
