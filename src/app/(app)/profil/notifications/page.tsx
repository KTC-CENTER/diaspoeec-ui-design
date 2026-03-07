'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  BookHeart,
  CalendarDays,
  BookOpen,
  Cake,
  HeartHandshake,
  Radio,
  MessageCircle,
  Heart,
  MapPin,
  Send,
  ListChecks,
  Check,
  Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/features/notifications/hooks/use-notifications';
import type { NotificationPreferences } from '@/lib/api/notifications.api';

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative h-6 w-[44px] cursor-pointer rounded-xl transition-colors duration-300',
        enabled ? 'bg-forest-700' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
          enabled && 'translate-x-5'
        )}
      />
    </button>
  );
}

type PrefsKey = keyof Omit<NotificationPreferences, 'pushEnabled'>;

export default function NotificationPrefsPage() {
  const t = useTranslations('notifications');
  const tc = useTranslations('common');

  const typeItems: { key: PrefsKey; label: string; icon: typeof BookHeart; iconColor: string }[] = [
    {
      key: 'nouvelleMeditation',
      label: t('newMeditations'),
      icon: BookHeart,
      iconColor: 'text-forest-900',
    },
    {
      key: 'rappelEvenement',
      label: t('eventReminders'),
      icon: CalendarDays,
      iconColor: 'text-gold-600',
    },
    {
      key: 'rappelLecture',
      label: t('bibleReminders'),
      icon: BookOpen,
      iconColor: 'text-forest-900',
    },
    {
      key: 'anniversaire',
      label: t('birthdays'),
      icon: Cake,
      iconColor: 'text-gold-600',
    },
    {
      key: 'confirmationDon',
      label: t('donationsCampaigns'),
      icon: HeartHandshake,
      iconColor: 'text-terra-600',
    },
    {
      key: 'culteEnDirect',
      label: t('liveServices'),
      icon: Radio,
      iconColor: 'text-red-500',
    },
    {
      key: 'reponseCommentaire',
      label: t('commentsReplies'),
      icon: MessageCircle,
      iconColor: 'text-forest-700',
    },
    {
      key: 'likesEnabled',
      label: t('likesOnContent'),
      icon: Heart,
      iconColor: 'text-red-400',
    },
    {
      key: 'nouvelEvenementZone',
      label: t('newEvents'),
      icon: MapPin,
      iconColor: 'text-gold-600',
    },
    {
      key: 'nouveauMessage',
      label: t('newMessages'),
      icon: Send,
      iconColor: 'text-forest-700',
    },
  ];

  const { data: prefs, isLoading } = useNotificationPreferences();
  const updateMutation = useUpdateNotificationPreferences();

  const [local, setLocal] = useState<NotificationPreferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefs && !local) {
      setLocal(prefs);
    }
  }, [prefs, local]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!local) return;
    setLocal({ ...local, [key]: !local[key] });
  };

  const handleSave = () => {
    if (!local) return;
    updateMutation.mutate(local, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  if (isLoading || !local) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-forest-700" />
      </div>
    );
  }

  return (
    <div>
      {/* Header with back */}
      <div className="mb-8">
        <Link
          href="/notifications"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t('backToNotifications')}
        </Link>
        <h1
          className="mb-1 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('preferencesTitle')}
        </h1>
        <p className="text-ink-500">{t('preferencesSubtitle')}</p>
      </div>

      {/* Push Channel */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Bell className="h-5 w-5 text-gold-600" />
          {t('pushNotifications')}
        </h2>
        <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
              <Bell className="h-4 w-4 text-forest-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{t('pushNotifications')}</p>
              <p className="text-xs text-ink-500">{t('pushDescription')}</p>
            </div>
          </div>
          <Toggle enabled={local.pushEnabled} onChange={() => handleToggle('pushEnabled')} />
        </div>
      </div>

      {/* Notification Types */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <ListChecks className="h-5 w-5 text-gold-600" />
          {t('notificationTypes')}
        </h2>
        <div className="space-y-1">
          {typeItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-cream-50/30"
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-4 w-4', item.iconColor)} />
                  <span className="text-sm font-medium text-ink-900">{item.label}</span>
                </div>
                <Toggle
                  enabled={local[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-10 py-3.5 font-semibold text-white shadow-lg shadow-forest-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-forest-900/30 md:w-auto',
          'disabled:opacity-60'
        )}
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {tc('saving')}
          </>
        ) : saved ? (
          <>
            <Check className="h-5 w-5" />
            {t('preferencesSaved')}
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            {t('savePreferences')}
          </>
        )}
      </button>
    </div>
  );
}
