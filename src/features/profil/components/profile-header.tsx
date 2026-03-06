'use client';

import { Camera, MapPin, Globe, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatDate, getInitials } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import { PAYS_LIST } from '@/lib/utils/constants';
import type { User } from '@/types';

const diasporaKeys: Record<string, string> = {
  etudiante: 'studentType',
  professionnelle: 'professionalType',
  familiale: 'familyType',
  missionnaire: 'missionaryType',
};

interface ProfileHeaderProps {
  user: User;
  onEdit?: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const initials = getInitials(user.nomComplet);
  const { addToast } = useToastStore();
  const t = useTranslations('profil');

  return (
    <div className="rounded-2xl border border-sage-400/10 bg-white shadow-md">
      {/* Pattern banner with kente-bar at bottom */}
      <div
        className="relative h-28 overflow-hidden rounded-t-2xl bg-gradient-to-r from-cream-100 via-sage-100/30 to-cream-100 md:h-36"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(212,160,23,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(27,67,50,0.06) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L30 25 L25 15Z' fill='none' stroke='%23D4A017' stroke-width='0.5' opacity='0.12'/%3E%3Cpath d='M10 25 L15 35 L10 45 L5 35Z' fill='none' stroke='%231B4332' stroke-width='0.5' opacity='0.08'/%3E%3Cpath d='M50 25 L55 35 L50 45 L45 35Z' fill='none' stroke='%23D4A017' stroke-width='0.5' opacity='0.10'/%3E%3Ccircle cx='30' cy='30' r='2' fill='none' stroke='%231B4332' stroke-width='0.5' opacity='0.08'/%3E%3Ccircle cx='30' cy='30' r='6' fill='none' stroke='%23D4A017' stroke-width='0.3' opacity='0.06'/%3E%3C/svg%3E")
          `,
        }}
      >
        {/* Kente bar at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-1 rounded-sm"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              #D4A017 0px, #D4A017 8px,
              #1B4332 8px, #1B4332 16px,
              #C17817 16px, #C17817 24px,
              #2D6A4F 24px, #2D6A4F 32px
            )`,
          }}
        />
      </div>

      {/* Profile info */}
      <div className="px-4 pb-5 pt-3 sm:px-5 sm:pt-2 md:px-8 md:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Avatar — own negative margin to overlap banner independently */}
          <div className="-mt-12 sm:-mt-14 group relative flex-shrink-0">
            <div
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg ring-4 ring-white sm:h-24 sm:w-24 sm:text-3xl',
                user.avatarUrl ? '' : 'bg-gradient-to-br from-gold-600 via-terra-600 to-forest-900'
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.nomComplet}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <button
              onClick={() => addToast(t('photoComingSoon'), 'info')}
              className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-sage-400/20 bg-white shadow-md transition-colors group-hover:bg-forest-900 group-hover:text-white sm:h-8 sm:w-8"
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Name & info */}
          <div className="min-w-0 flex-1">
            <h1
              className="truncate text-xl font-bold text-ink-900 sm:text-2xl md:text-3xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {user.nomComplet}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-600/20 bg-gold-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold-700 sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {diasporaKeys[user.typeDiaspora] ? t(diasporaKeys[user.typeDiaspora]) : user.typeDiaspora}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-ink-500 sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {user.ville}, {PAYS_LIST.find((p) => p.value === user.paysResidence)?.label || user.paysResidence}
              </span>
              <span className="hidden text-xs text-ink-500/70 sm:inline">
                {t('memberSince', { date: formatDate(user.createdAt, 'MMMM yyyy') })}
              </span>
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={onEdit ?? (() => addToast(t('editComingSoon'), 'info'))}
            className="inline-flex items-center gap-2 self-start rounded-xl border-2 border-forest-900 px-4 py-2 text-sm font-semibold text-forest-900 transition-all duration-300 hover:bg-forest-900 hover:text-white sm:self-center sm:px-5 sm:py-2.5"
          >
            <PenLine className="h-4 w-4" />
            {t('editProfile')}
          </button>
        </div>
      </div>
    </div>
  );
}
