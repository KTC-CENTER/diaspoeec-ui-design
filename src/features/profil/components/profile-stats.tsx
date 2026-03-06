import { Heart, CalendarCheck, ThumbsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { User } from '@/types';

interface ProfileStatsProps {
  user: User;
}

export function ProfileStats({ user }: ProfileStatsProps) {
  const t = useTranslations('profil');
  const stats = [
    {
      label: t('donationsMade'),
      value: user.donsEffectues,
      icon: Heart,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-50',
    },
    {
      label: t('eventsFollowed'),
      value: user.evenementsSuivis,
      icon: CalendarCheck,
      iconColor: 'text-gold-600',
      bgColor: 'bg-gold-600/10',
    },
    {
      label: t('likesGiven'),
      value: user.jaimesTotal,
      icon: ThumbsUp,
      iconColor: 'text-forest-900',
      bgColor: 'bg-forest-900/10',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-sage-400/10 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(27,67,50,0.1)] md:p-5"
        >
          <div
            className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}
          >
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </div>
          <p
            className="text-2xl font-bold text-ink-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {stat.value}
          </p>
          <p className="mt-0.5 text-xs text-ink-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
