'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  useNotifications,
  useMarkAsRead,
  useUnreadCount,
} from '@/features/notifications/hooks/use-notifications';
import { NotificationList } from '@/features/notifications/components/notification-list';

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data: notifications, isLoading } = useNotifications(filter);
  const unreadCount = useUnreadCount();
  const markAsRead = useMarkAsRead();

  const handleMarkAllRead = () => {
    markAsRead.mutate(undefined);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1
              className="mb-1 text-3xl font-bold text-forest-900 md:text-4xl"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Notifications
            </h1>
          </div>
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markAsRead.isPending}
            className="text-sm font-medium text-forest-700 transition-colors hover:text-forest-900 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Marquer tout comme lu
          </button>
        </div>
      </div>

      {/* Tabs - inline buttons with gaps */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
            filter === 'all'
              ? 'bg-gradient-to-r from-forest-900 to-forest-700 text-white shadow-md'
              : 'border border-forest-900/20 text-ink-500 hover:border-forest-900/40'
          )}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'rounded-full px-5 py-2 text-sm font-semibold transition-colors',
            filter === 'unread'
              ? 'bg-gradient-to-r from-forest-900 to-forest-700 text-white shadow-md'
              : 'border border-forest-900/20 text-ink-500 hover:border-forest-900/40'
          )}
        >
          Non lues
          {unreadCount > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-terra-600 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-sage-400/10 bg-white p-4 shadow-sm">
              <div className="h-10 w-10 shrink-0 rounded-xl shimmer-bg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded shimmer-bg" />
                <div className="h-3 w-full rounded shimmer-bg" />
                <div className="h-2.5 w-16 rounded shimmer-bg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NotificationList
          notifications={notifications || []}
          filter={filter}
        />
      )}

      {/* Preferences link - full-width clickable card */}
      <div className="mt-6">
        <button
          onClick={() => router.push('/profil/notifications')}
          className="group flex w-full items-center gap-3 rounded-2xl border border-sage-400/10 bg-white p-4 shadow-sm transition-colors hover:bg-cream-100/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100/50">
            <Settings className="h-5 w-5 text-forest-900 transition-transform duration-500 group-hover:rotate-90" />
          </div>
          <span className="text-sm font-semibold text-forest-900">
            Gerer mes preferences de notification
          </span>
          <ChevronRight className="ml-auto h-4 w-4 text-ink-500" />
        </button>
      </div>
    </div>
  );
}
