'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Calendar, Heart, Church, BookMarked, Bell, User, PenSquare, CalendarPlus, Users, ClipboardList, BookCheck, Video, Star } from 'lucide-react';
import { Sidebar, type NavItem } from './sidebar';
import { BottomTabs } from './bottom-tabs';
import { MobileNav } from './mobile-nav';
import { PullToRefresh } from '@/components/shared/pull-to-refresh';
import { useAuthStore } from '@/stores/auth.store';
import { useUnreadCount } from '@/features/notifications/hooks/use-notifications';
import { usePushNotifications } from '@/features/notifications/hooks/use-push-notifications';
import type { UserRole } from '@/types';

const baseNavItems: NavItem[] = [
  { icon: Home, label: 'Accueil', href: '/accueil' },
  { icon: BookOpen, label: 'Meditations', href: '/meditations' },
  { icon: Calendar, label: 'Evenements', href: '/evenements' },
  { icon: Heart, label: 'Dons', href: '/dons' },
  { icon: Church, label: 'Cultes', href: '/cultes' },
  { icon: BookMarked, label: 'Bible', href: '/bible' },
  { icon: Star, label: 'Mes Favoris', href: '/favoris' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: User, label: 'Profil', href: '/profil' },
];

function getGestionItems(role?: UserRole): NavItem[] {
  if (!role) return [];
  const items: NavItem[] = [];
  if (role === 'pasteur' || role === 'admin') {
    items.push({ icon: PenSquare, label: 'Mes meditations', href: '/gestion/meditations' });
    items.push({ icon: BookCheck, label: 'Plans Bible', href: '/gestion/bible' });
    items.push({ icon: Video, label: 'Mes videos', href: '/gestion/cultes' });
  }
  if (role === 'pasteur' || role === 'responsable_zone' || role === 'admin') {
    items.push({ icon: CalendarPlus, label: 'Mes evenements', href: '/gestion/evenements' });
  }
  if (role === 'responsable_zone' || role === 'admin') {
    items.push({ icon: ClipboardList, label: 'Membres zone', href: '/gestion/membres' });
  }
  return items;
}

function getActiveHref(pathname: string, allItems: NavItem[]): string {
  // Match the closest nav item from the current path
  const matched = allItems
    .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length);
  return matched[0]?.href ?? '/accueil';
}

function getActiveTab(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] ?? 'accueil';
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Build nav items with role-specific gestion items
  const gestionItems = getGestionItems(user?.role);
  const navItems: NavItem[] = gestionItems.length > 0
    ? [
        ...baseNavItems.slice(0, -1), // All except Profil
        ...gestionItems,
        baseNavItems[baseNavItems.length - 1], // Profil at the end
      ]
    : baseNavItems;

  const activeHref = getActiveHref(pathname, navItems);
  const activeTab = getActiveTab(pathname);

  const sidebarUser = {
    name: user?.nomComplet ?? 'Utilisateur',
    parish: user?.paroisseOrigine ?? '',
  };

  const notificationCount = useUnreadCount();
  usePushNotifications(user?.id);

  // Add badge to notifications nav item
  const itemsWithBadges = navItems.map((item) => {
    if (item.href === '/notifications' && notificationCount > 0) {
      return { ...item, badge: notificationCount };
    }
    return item;
  });

  return (
    <div className="relative min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <Sidebar
          items={itemsWithBadges}
          activeHref={activeHref}
          user={sidebarUser}
          onLogout={() => {
            useAuthStore.getState().logout();
            router.push('/login');
          }}
        />
      </div>

      {/* Mobile Top Bar */}
      <MobileNav notificationCount={notificationCount} />

      {/* Main Content */}
      <main className="min-h-screen pt-[calc(3.5rem+var(--safe-area-top,env(safe-area-inset-top,0px)))] pb-20 md:pl-[280px] md:pt-0 md:pb-0">
        <PullToRefresh>
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </PullToRefresh>
      </main>

      {/* Mobile Bottom Tabs */}
      <BottomTabs activeTab={activeTab} />
    </div>
  );
}
