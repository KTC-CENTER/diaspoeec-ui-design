'use client';

import { useRouter } from 'next/navigation';
import {
  Bell,
  Globe,
  Moon,
  Shield,
  Smartphone,
  CircleHelp,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useLocaleStore } from '@/stores/locale.store';

interface SettingsItem {
  icon: typeof Bell;
  label: string;
  href?: string;
  toggle?: boolean;
  danger?: boolean;
  onClick?: () => void;
  iconBg?: string;
  iconColor?: string;
  trailingText?: string;
  trailingBadge?: string;
}

export function SettingsList() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const locale = useLocaleStore((s) => s.locale);
  const isDarkMode = theme === 'dark';
  const t = useTranslations('settings');

  const localeLabels: Record<string, string> = { fr: 'Francais', en: 'English', de: 'Deutsch', es: 'Espanol' };

  const items: SettingsItem[] = [
    {
      icon: Bell,
      label: t('notificationPreferences'),
      href: '/profil/notifications',
      iconBg: 'bg-forest-900/10',
      iconColor: 'text-forest-900',
    },
    {
      icon: Globe,
      label: t('language'),
      href: '/profil/langue',
      iconBg: 'bg-forest-900/10',
      iconColor: 'text-forest-900',
      trailingText: localeLabels[locale] || 'Francais',
    },
    {
      icon: Moon,
      label: t('darkMode'),
      toggle: true,
      iconBg: 'bg-ink-900/5',
      iconColor: 'text-ink-900',
    },
    {
      icon: Shield,
      label: t('accountSecurity'),
      href: '/profil/securite',
      iconBg: 'bg-forest-900/10',
      iconColor: 'text-forest-900',
    },
    {
      icon: Smartphone,
      label: t('connectedDevices'),
      href: '/profil/appareils',
      iconBg: 'bg-forest-900/10',
      iconColor: 'text-forest-900',
    },
    {
      icon: CircleHelp,
      label: t('helpSupport'),
      href: '/profil/aide',
      iconBg: 'bg-gold-600/10',
      iconColor: 'text-gold-600',
    },
    {
      icon: LogOut,
      label: t('logout'),
      danger: true,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      onClick: () => {
        logout();
        router.push('/login');
      },
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-sage-400/10 bg-white shadow-sm">
      <h2
        className="flex items-center gap-2 p-5 pb-3 text-lg font-bold text-forest-900 md:p-6 md:pb-3"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <Settings className="h-5 w-5 text-gold-600" />
        {t('title')}
      </h2>
      <div className="divide-y divide-sage-400/10">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.toggle) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-5 py-3.5 transition-all duration-200 hover:bg-cream-100/50 hover:pl-[20px] md:px-6"
              >
                <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', item.iconBg)}>
                  <Icon className={cn('h-4 w-4', item.iconColor)} />
                </div>
                <span className="text-sm font-medium text-ink-900">{item.label}</span>
                <div className="ml-auto">
                  <button
                    onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                    className={cn(
                      'relative h-6 w-[44px] cursor-pointer rounded-xl transition-colors duration-300',
                      isDarkMode ? 'bg-forest-700' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
                        isDarkMode && 'translate-x-5'
                      )}
                    />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.href) {
                  router.push(item.href);
                }
              }}
              className={cn(
                'flex w-full items-center gap-3 px-5 py-3.5 transition-all duration-200 hover:bg-cream-100/50 hover:pl-[20px] md:px-6',
                item.danger && 'cursor-pointer'
              )}
            >
              <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', item.iconBg)}>
                <Icon className={cn('h-4 w-4', item.iconColor)} />
              </div>
              <span className={cn('text-sm font-medium', item.danger ? 'text-red-500' : 'text-ink-900')}>
                {item.label}
              </span>
              {item.trailingText && (
                <span className="ml-auto mr-1 text-sm text-ink-500">{item.trailingText}</span>
              )}
              {item.trailingBadge && (
                <span className="ml-auto mr-1 rounded-full bg-sage-100/50 px-2 py-0.5 text-[10px] font-medium text-ink-500">
                  {item.trailingBadge}
                </span>
              )}
              {!item.danger && !item.trailingText && !item.trailingBadge && (
                <ChevronRight className="ml-auto h-4 w-4 text-ink-500" />
              )}
              {(item.trailingText || item.trailingBadge) && (
                <ChevronRight className="h-4 w-4 text-ink-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
