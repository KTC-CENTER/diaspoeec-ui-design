'use client';

import Link from 'next/link';
import { Home, BookOpen, Calendar, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';

interface Tab {
  key: string;
  labelKey: string;
  icon: LucideIcon;
  href: string;
}

const tabs: Tab[] = [
  { key: 'accueil', labelKey: 'home', icon: Home, href: '/accueil' },
  { key: 'meditations', labelKey: 'meditations', icon: BookOpen, href: '/meditations' },
  { key: 'evenements', labelKey: 'events', icon: Calendar, href: '/evenements' },
  { key: 'dons', labelKey: 'donations', icon: Heart, href: '/dons' },
  { key: 'profil', labelKey: 'profile', icon: User, href: '/profil' },
];

interface BottomTabsProps {
  activeTab: string;
}

export function BottomTabs({ activeTab }: BottomTabsProps) {
  const tn = useTranslations('nav');
  const tc = useTranslations('common');

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-100 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      role="navigation"
      aria-label={tc('mainNav')}
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.key ||
            activeTab.startsWith(tab.href.replace('/', ''));

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition-colors',
                isActive
                  ? 'text-forest-700'
                  : 'text-ink-400 hover:text-ink-600'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-all',
                  isActive && 'scale-110'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  'truncate text-[10px] leading-tight',
                  isActive ? 'font-semibold' : 'font-medium'
                )}
              >
                {tn(tab.labelKey as Parameters<typeof tn>[0])}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
