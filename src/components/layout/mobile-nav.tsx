'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, LogOut, Home, BookOpen, Calendar, Heart, User, Church, Radio, PenSquare, CalendarPlus, ClipboardList, BookCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslations } from 'next-intl';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/types';

interface MobileNavProps {
  notificationCount?: number;
}

interface MobileNavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function MobileNav({ notificationCount = 0 }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const tn = useTranslations('nav');
  const tc = useTranslations('common');

  const baseMobileNavItems: MobileNavItem[] = [
    { icon: Home, label: tn('home'), href: '/accueil' },
    { icon: BookOpen, label: tn('meditations'), href: '/meditations' },
    { icon: Calendar, label: tn('events'), href: '/evenements' },
    { icon: Heart, label: tn('donations'), href: '/dons' },
    { icon: Church, label: tn('services'), href: '/cultes' },
    { icon: Radio, label: tn('bible'), href: '/bible' },
    { icon: Bell, label: tn('notifications'), href: '/notifications' },
    { icon: User, label: tn('profile'), href: '/profil' },
  ];

  function getMobileGestionItems(role?: UserRole): MobileNavItem[] {
    if (!role) return [];
    const items: MobileNavItem[] = [];
    if (role === 'pasteur' || role === 'admin') {
      items.push({ icon: PenSquare, label: tn('myMeditations'), href: '/gestion/meditations' });
      items.push({ icon: BookCheck, label: tn('biblePlans'), href: '/gestion/bible' });
    }
    if (role === 'pasteur' || role === 'responsable_zone' || role === 'admin') {
      items.push({ icon: CalendarPlus, label: tn('myEvents'), href: '/gestion/evenements' });
    }
    if (role === 'responsable_zone' || role === 'admin') {
      items.push({ icon: ClipboardList, label: tn('zoneMembers'), href: '/gestion/membres' });
    }
    return items;
  }

  // Build nav items with role-specific gestion items
  const gestionItems = getMobileGestionItems(user?.role);
  const mobileNavItems: MobileNavItem[] = gestionItems.length > 0
    ? [
        ...baseMobileNavItems.slice(0, -2), // All except Profil & Parametres
        ...gestionItems,
        ...baseMobileNavItems.slice(-2), // Profil & Parametres at the end
      ]
    : baseMobileNavItems;

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, [setMobileMenuOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <>
      {/* Top Bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-ink-100 bg-white px-4 pt-[var(--safe-area-top,env(safe-area-inset-top,0px))] md:hidden">
        {/* Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 transition-colors"
          aria-label={tc('openMenu')}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/icons/icon-96.png" alt="DiaspoEEC" width={28} height={28} className="h-7 w-7" />
          <span
            className="font-heading text-lg font-semibold text-forest-900 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            DiaspoEEC
          </span>
        </div>

        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 transition-colors"
          aria-label={`${tn('notifications')}${notificationCount > 0 ? ` (${notificationCount} ${tn('unread')})` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Link>
      </header>

      {/* Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[70] flex w-[280px] flex-col transform pt-[var(--safe-area-top,env(safe-area-inset-top,0px))] bg-cream-100 shadow-xl transition-transform duration-300 ease-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={tc('navMenu')}
        onKeyDown={handleKeyDown}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icons/icon-96.png" alt="DiaspoEEC" width={32} height={32} className="h-8 w-8" />
            <span
              className="font-heading text-xl font-semibold text-forest-900 tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              DiaspoEEC
            </span>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
            aria-label={tc('closeMenu')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-ink-200/50" />

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleClose}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-forest-900 text-white shadow-md'
                        : 'text-ink-600 hover:bg-forest-900/5 hover:text-ink-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        isActive ? 'text-current' : 'text-ink-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-ink-200/50" />

        {/* User Card at bottom */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-900 text-sm font-semibold text-cream-100">
              {user ? getInitials(user.nomComplet) : '??'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">
                {user?.nomComplet ?? tc('user')}
              </p>
              <p className="truncate text-xs text-ink-500">
                {user?.paroisseOrigine ?? ''}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                handleClose();
                router.push('/login');
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
              aria-label={tc('logout')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
