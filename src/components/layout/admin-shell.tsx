'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  ShieldCheck,
  Church,
  BookOpen,
  Calendar,
  Youtube,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useModeration } from '@/features/admin/hooks/use-admin';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin' },
  { icon: Users, label: 'Fideles', href: '/admin/fideles' },
  { icon: HeartHandshake, label: 'Dons & Campagnes', href: '/admin/dons' },
  { icon: ShieldCheck, label: 'Moderation', href: '/admin/moderation' },
];

const contentNavItems = [
  { icon: BookOpen, label: 'Meditations', href: '/admin/meditations' },
  { icon: Calendar, label: 'Evenements', href: '/admin/evenements' },
  { icon: Youtube, label: 'YouTube', href: '/admin/youtube' },
  { icon: Church, label: 'Paroisses', href: '/admin/paroisses' },
  { icon: Settings, label: 'Parametres', href: '/admin/parametres' },
];

// Re-export NavItem type for compatibility
export type { NavItem } from './sidebar';

function getActiveHref(pathname: string): string {
  const allItems = [...adminNavItems, ...contentNavItems];
  const matched = allItems
    .filter(
      (item) =>
        pathname === item.href || pathname.startsWith(item.href + '/')
    )
    .sort((a, b) => b.href.length - a.href.length);
  return matched[0]?.href ?? '/admin';
}

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const tc = useTranslations('common');
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: moderationData } = useModeration();
  const moderationBadge = moderationData?.pendingCount ?? 0;
  const activeHref = getActiveHref(pathname);

  const userInitials = user?.nomComplet
    ? user.nomComplet
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AE';

  return (
    <div className="relative min-h-screen bg-cream-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-[280px] flex-col pt-[var(--safe-area-top,env(safe-area-inset-top,0px))] bg-forest-900 text-white transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-600">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <div>
              <h1
                className="text-lg font-semibold leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                DiaspoEEC
              </h1>
              <span className="text-xs text-sage-400 opacity-80">
                Administration
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                  isActive
                    ? 'bg-sage-400/15 border-r-[3px] border-sage-400'
                    : 'hover:bg-sage-400/10'
                )}
              >
                <Icon className="h-[18px] w-[18px] opacity-80" />
                <span>{item.label}</span>
                {item.href === '/admin/moderation' && moderationBadge > 0 && (
                  <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {moderationBadge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Content section header */}
          <div className="pb-1 pt-3 px-3">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Contenu
            </span>
          </div>

          {contentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                  isActive
                    ? 'bg-sage-400/15 border-r-[3px] border-sage-400'
                    : 'hover:bg-sage-400/10'
                )}
              >
                <Icon className="h-[18px] w-[18px] opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin user */}
        <div className="border-t border-white/10 px-3 py-3 space-y-1">
          <Link
            href="/admin/profil"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sage-400/10"
          >
            <User className="h-[18px] w-[18px] opacity-80" />
            <span>Mon profil</span>
          </Link>
          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-600/30 text-sm font-semibold">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.nomComplet ?? 'Admin EEC'}
              </p>
              <p className="text-[11px] text-white/50">Administrateur</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="rounded-lg p-1.5 transition hover:bg-white/10"
              title={tc('logout')}
            >
              <LogOut className="h-4 w-4 opacity-60" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-forest-900/5 bg-cream-50/90 pt-[var(--safe-area-top,env(safe-area-inset-top,0px))] backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 transition hover:bg-sage-200 md:hidden"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-forest-900" />
              ) : (
                <Menu className="h-5 w-5 text-forest-900" />
              )}
            </button>

            {/* Tab nav */}
            <div className="flex gap-1 overflow-x-auto">
              {adminNavItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'whitespace-nowrap border-b-[3px] px-4 py-2 text-sm transition-all',
                      isActive
                        ? 'border-forest-900 font-semibold text-forest-900'
                        : 'border-transparent text-ink-500'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Notification */}
            <div className="flex items-center gap-2">
              <button className="relative rounded-lg p-2 transition hover:bg-sage-200">
                <Bell className="h-5 w-5 text-ink-500" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
