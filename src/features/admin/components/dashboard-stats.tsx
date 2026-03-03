'use client';

import { Users, Heart, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatMontant } from '@/lib/utils/format';
import { useAdminStats } from '@/features/admin/hooks/use-admin';

export function DashboardStats() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl shimmer-bg" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: 'Fideles inscrits',
      value: stats.totalMembres.toLocaleString('fr-FR'),
      sub: `+${stats.nouveauxMembres}`,
      subLabel: 'ce mois',
      icon: Users,
      iconBg: 'bg-sage-200',
      iconColor: 'text-forest-900',
      valueColor: 'text-forest-900',
      subColor: 'text-green-600',
      delay: 'fade-in-d1',
    },
    {
      label: 'Dons du mois',
      value: formatMontant(stats.donsMoisEnCours, 'EUR'),
      sub: `${stats.donsMoisCount}`,
      subLabel: 'transactions ce mois',
      icon: Heart,
      iconBg: 'bg-gold-400/30',
      iconColor: 'text-gold-600',
      valueColor: 'text-gold-600',
      subColor: 'text-green-600',
      delay: 'fade-in-d2',
    },
    {
      label: 'Evenements actifs',
      value: stats.totalEvenements.toString(),
      sub: stats.evenementsAVenir.toString(),
      subLabel: 'a venir',
      icon: Calendar,
      iconBg: 'bg-orange-50',
      iconColor: 'text-terra-600',
      valueColor: 'text-terra-600',
      subColor: 'text-terra-600',
      delay: 'fade-in-d3',
    },
    {
      label: 'Meditations publiees',
      value: stats.totalMeditations.toString(),
      sub: stats.meditationsMoisEnCours.toString(),
      subLabel: 'ce mois',
      icon: BookOpen,
      iconBg: 'bg-sage-200',
      iconColor: 'text-forest-700',
      valueColor: 'text-forest-700',
      subColor: 'text-forest-700',
      delay: 'fade-in-d4',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            'fade-in rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
            card.delay
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">
                {card.label}
              </p>
              <p
                className={cn('mt-1 text-3xl font-bold', card.valueColor)}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {card.value}
              </p>
            </div>
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', card.iconBg)}>
              <card.icon className={cn('h-5 w-5', card.iconColor)} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs">
            <span className={cn('flex items-center gap-0.5 font-medium', card.subColor)}>
              {card.subColor === 'text-green-600' && <TrendingUp className="h-3 w-3" />}
              {card.sub}
            </span>
            <span className="text-ink-500">{card.subLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
