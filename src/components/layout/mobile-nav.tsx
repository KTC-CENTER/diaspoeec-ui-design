'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Bell, LogOut, Home, BookOpen, Calendar, Heart, User, Church, Radio, Settings, PenSquare, CalendarPlus, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
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

const baseMobileNavItems: MobileNavItem[] = [
  { icon: Home, label: 'Accueil', href: '/accueil' },
  { icon: BookOpen, label: 'Meditations', href: '/meditations' },
  { icon: Calendar, label: 'Evenements', href: '/evenements' },
  { icon: Heart, label: 'Dons', href: '/dons' },
  { icon: Church, label: 'Cultes', href: '/cultes' },
  { icon: Radio, label: 'Bible', href: '/bible' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: User, label: 'Profil', href: '/profil' },
  { icon: Settings, label: 'Parametres', href: '/profil/notifications' },
];

function getMobileGestionItems(role?: UserRole): MobileNavItem[] {
  if (!role) return [];
  const items: MobileNavItem[] = [];
  if (role === 'pasteur' || role === 'admin') {
    items.push({ icon: PenSquare, label: 'Mes meditations', href: '/gestion/meditations' });
  }
  if (role === 'pasteur' || role === 'responsable_zone' || role === 'admin') {
    items.push({ icon: CalendarPlus, label: 'Mes evenements', href: '/gestion/evenements' });
  }
  if (role === 'responsable_zone' || role === 'admin') {
    items.push({ icon: ClipboardList, label: 'Membres zone', href: '/gestion/membres' });
  }
  return items;
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
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-ink-100 bg-white px-4 md:hidden">
        {/* Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <span
          className="font-heading text-lg font-semibold text-forest-900 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          DiaspoEEC
        </span>

        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 transition-colors"
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} non lues)` : ''}`}
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
          'fixed inset-y-0 left-0 z-[70] w-[280px] transform bg-cream-100 shadow-xl transition-transform duration-300 ease-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        onKeyDown={handleKeyDown}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <span
            className="font-heading text-xl font-semibold text-forest-900 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            DiaspoEEC
          </span>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
            aria-label="Fermer le menu"
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
                {user?.nomComplet ?? 'Utilisateur'}
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
              aria-label="Se deconnecter"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
