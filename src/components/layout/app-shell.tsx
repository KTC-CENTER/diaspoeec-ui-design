'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Calendar, Heart, Church, BookMarked, Bell, User, PenSquare, CalendarPlus, ClipboardList, BookCheck, Star, LayoutDashboard, MessageCircle, Users } from 'lucide-react';
import { Sidebar, type NavItem } from './sidebar';
import { BottomTabs } from './bottom-tabs';
import { MobileNav } from './mobile-nav';
import { PullToRefresh } from '@/components/shared/pull-to-refresh';
import { useAuthStore } from '@/stores/auth.store';
import { useTenantStore } from '@/stores/tenant.store';
import { useUnreadCount } from '@/features/notifications/hooks/use-notifications';
import { useUnreadMessageCount } from '@/features/messages/hooks/use-messages';
import { usePushNotifications } from '@/features/notifications/hooks/use-push-notifications';
import { useTranslations } from 'next-intl';
import type { UserRole } from '@/types';

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
  const paroisse = useTenantStore((s) => s.paroisse);
  const tn = useTranslations('nav');
  const tc = useTranslations('common');

  const baseNavItems: NavItem[] = [
    { icon: Home, label: tn('home'), href: '/accueil' },
    { icon: BookOpen, label: tn('meditations'), href: '/meditations' },
    { icon: Calendar, label: tn('events'), href: '/evenements' },
    { icon: Heart, label: tn('donations'), href: '/dons' },
    { icon: Church, label: tn('services'), href: '/cultes' },
    { icon: BookMarked, label: tn('bible'), href: '/bible' },
    { icon: Star, label: tn('favorites'), href: '/favoris' },
    { icon: Users, label: tn('community'), href: '/communaute' },
    { icon: MessageCircle, label: tn('messages'), href: '/messages' },
    { icon: Bell, label: tn('notifications'), href: '/notifications' },
    { icon: User, label: tn('profile'), href: '/profil' },
  ];

  function getGestionItems(role?: UserRole): NavItem[] {
    if (!role) return [];
    const items: NavItem[] = [];
    if (role === 'pasteur' || role === 'admin') {
      items.push({ icon: LayoutDashboard, label: 'Ma Paroisse', href: '/gestion/paroisse' });
      items.push({ icon: PenSquare, label: tn('myMeditations'), href: '/gestion/meditations' });
      items.push({ icon: BookCheck, label: tn('biblePlans'), href: '/gestion/bible' });
    } else if (role === 'responsable_zone') {
      items.push({ icon: CalendarPlus, label: tn('myEvents'), href: '/gestion/evenements' });
      items.push({ icon: ClipboardList, label: tn('zoneMembers'), href: '/gestion/membres' });
    }
    return items;
  }

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
    name: user?.nomComplet ?? tc('user'),
    parish: paroisse?.label ?? user?.paroisseOrigine ?? '',
  };

  const notificationCount = useUnreadCount();
  const unreadMessages = useUnreadMessageCount();
  usePushNotifications(user?.id);

  // Add badges to notifications and messages nav items
  const itemsWithBadges = navItems.map((item) => {
    if (item.href === '/notifications' && notificationCount > 0) {
      return { ...item, badge: notificationCount };
    }
    if (item.href === '/messages' && unreadMessages > 0) {
      return { ...item, badge: unreadMessages };
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
          logoText={paroisse?.label ?? 'DiaspoEEC'}
          onLogout={() => {
            useAuthStore.getState().logout();
            router.push('/login');
          }}
        />
      </div>

      {/* Mobile Top Bar */}
      <MobileNav notificationCount={notificationCount} unreadMessages={unreadMessages} />

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
