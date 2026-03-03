'use client';

import Link from 'next/link';
import {
  BookHeart,
  CalendarDays,
  Cake,
  Heart,
  MessageCircle,
  HeartHandshake,
  BookOpen,
  Radio,
  CalendarPlus,
  MoreHorizontal,
  Users,
  Shield,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { useMarkAsRead } from '@/features/notifications/hooks/use-notifications';
import type { Notification, NotificationType } from '@/types';

interface NotificationListProps {
  notifications: Notification[];
  filter: 'all' | 'unread';
}

const typeConfig: Record<
  NotificationType,
  { icon: typeof BookHeart; iconColor: string; iconBg: string; borderColor: string }
> = {
  nouvelle_meditation: {
    icon: BookHeart,
    iconColor: 'text-forest-900',
    iconBg: 'bg-forest-900/10',
    borderColor: 'border-l-forest-700',
  },
  rappel_evenement: {
    icon: CalendarDays,
    iconColor: 'text-gold-600',
    iconBg: 'bg-gold-600/10',
    borderColor: 'border-l-gold-600',
  },
  anniversaire: {
    icon: Cake,
    iconColor: 'text-gold-600',
    iconBg: 'bg-gold-400/20',
    borderColor: 'border-l-gold-400',
  },
  confirmation_don: {
    icon: HeartHandshake,
    iconColor: 'text-terra-600',
    iconBg: 'bg-terra-600/10',
    borderColor: 'border-l-terra-600',
  },
  reponse_commentaire: {
    icon: MessageCircle,
    iconColor: 'text-forest-700',
    iconBg: 'bg-forest-900/10',
    borderColor: 'border-l-forest-900/30',
  },
  like: {
    icon: Heart,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-50',
    borderColor: 'border-l-red-300',
  },
  rappel_lecture: {
    icon: BookOpen,
    iconColor: 'text-forest-900',
    iconBg: 'bg-forest-900/10',
    borderColor: 'border-l-forest-900/20',
  },
  culte_en_direct: {
    icon: Radio,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    borderColor: 'border-l-red-400',
  },
  nouvel_evenement_zone: {
    icon: CalendarPlus,
    iconColor: 'text-gold-600',
    iconBg: 'bg-gold-600/10',
    borderColor: 'border-l-gold-600/50',
  },
  nouveau_membre: {
    icon: Users,
    iconColor: 'text-forest-600',
    iconBg: 'bg-forest-600/10',
    borderColor: 'border-l-forest-600/50',
  },
  moderation: {
    icon: Shield,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    borderColor: 'border-l-red-400',
  },
};

function groupNotificationsByPeriod(notifications: Notification[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; items: Notification[] }[] = [
    { label: "Aujourd'hui", items: [] },
    { label: 'Hier', items: [] },
    { label: 'Cette semaine', items: [] },
    { label: 'Plus ancien', items: [] },
  ];

  for (const notif of notifications) {
    const notifDate = new Date(notif.createdAt);
    if (notifDate >= today) {
      groups[0].items.push(notif);
    } else if (notifDate >= yesterday) {
      groups[1].items.push(notif);
    } else if (notifDate >= weekAgo) {
      groups[2].items.push(notif);
    } else {
      groups[3].items.push(notif);
    }
  }

  return groups.filter((g) => g.items.length > 0);
}

function NotificationItem({ notification }: { notification: Notification }) {
  const config = typeConfig[notification.type] || {
    icon: BookOpen,
    iconColor: 'text-ink-500',
    iconBg: 'bg-ink-100',
    borderColor: 'border-l-ink-300',
  };
  const Icon = config.icon;
  const markAsRead = useMarkAsRead();

  const content = (
    <div
      className={cn(
        'flex items-start gap-4 rounded-2xl border border-sage-400/10 bg-white p-4 shadow-sm transition-all duration-200',
        'border-l-4',
        config.borderColor,
        !notification.lu && 'bg-cream-50/80',
        'hover:bg-cream-100/60 hover:translate-x-1'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
          config.iconBg
        )}
      >
        <Icon className={cn('h-5 w-5', config.iconColor)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <h4 className="text-sm font-semibold text-ink-900">
            {notification.titre}
          </h4>
          {!notification.lu && (
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-forest-900" />
          )}
        </div>
        <p className="text-sm text-ink-500">
          {notification.description}
        </p>
        <p className="mt-1 text-xs text-ink-500/60">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Mark as read button */}
      {!notification.lu ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            markAsRead.mutate(notification.id);
          }}
          className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-sage-100/50"
          title="Marquer comme lu"
        >
          <Check className="h-4 w-4 text-ink-500" />
        </button>
      ) : (
        <button className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-sage-100/50">
          <MoreHorizontal className="h-4 w-4 text-ink-500" />
        </button>
      )}
    </div>
  );

  if (notification.lien) {
    return (
      <Link href={notification.lien} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function NotificationList({ notifications, filter }: NotificationListProps) {
  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.lu)
      : notifications;

  if (filteredNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <BookOpen className="h-7 w-7 text-sage-400" />
        </div>
        <p className="text-sm text-ink-500">
          {filter === 'unread'
            ? 'Aucune notification non lue'
            : 'Aucune notification'}
        </p>
      </div>
    );
  }

  const groups = groupNotificationsByPeriod(filteredNotifications);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="mb-3 pl-1 text-xs font-bold uppercase tracking-wider text-ink-500">
            {group.label}
          </h3>
          <div className="space-y-3">
            {group.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
