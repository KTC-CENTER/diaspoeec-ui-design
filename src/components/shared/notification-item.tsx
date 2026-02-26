import { BookOpen, Calendar, HeartHandshake, Radio, MessageCircle, Bell, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Notification, TypeNotification } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

interface NotificationMeta {
  borderColor: string;
  bgColor: string;
  icon: LucideIcon;
  iconColor: string;
}

function getNotificationMeta(type: TypeNotification): NotificationMeta {
  switch (type) {
    case 'nouvelle_meditation':
    case 'rappel_lecture':
      return {
        borderColor: 'border-l-forest-700',
        bgColor: 'bg-forest-700/10',
        icon: BookOpen,
        iconColor: 'text-forest-700',
      };
    case 'rappel_evenement':
    case 'nouvel_evenement_zone':
      return {
        borderColor: 'border-l-gold-600',
        bgColor: 'bg-gold-400/15',
        icon: Calendar,
        iconColor: 'text-gold-600',
      };
    case 'confirmation_don':
    case 'anniversaire':
      return {
        borderColor: 'border-l-terra-600',
        bgColor: 'bg-terra-600/10',
        icon: HeartHandshake,
        iconColor: 'text-terra-600',
      };
    case 'culte_en_direct':
      return {
        borderColor: 'border-l-error',
        bgColor: 'bg-error/10',
        icon: Radio,
        iconColor: 'text-error',
      };
    case 'reponse_commentaire':
    case 'like':
      return {
        borderColor: 'border-l-forest-500',
        bgColor: 'bg-forest-500/10',
        icon: MessageCircle,
        iconColor: 'text-forest-500',
      };
    case 'nouveau_membre':
      return {
        borderColor: 'border-l-sage-400',
        bgColor: 'bg-sage-400/15',
        icon: Users,
        iconColor: 'text-forest-600',
      };
    case 'moderation':
      return {
        borderColor: 'border-l-error',
        bgColor: 'bg-error/10',
        icon: Shield,
        iconColor: 'text-error',
      };
    default:
      return {
        borderColor: 'border-l-ink-300',
        bgColor: 'bg-ink-100',
        icon: Bell,
        iconColor: 'text-ink-500',
      };
  }
}

function formatTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr });
  } catch {
    return dateStr;
  }
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const meta = getNotificationMeta(notification.type);
  const Icon = meta.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-left transition-all hover:shadow-sm',
        meta.borderColor,
        notification.lu
          ? 'bg-white hover:bg-cream-50'
          : 'bg-cream-50 hover:bg-cream-100'
      )}
    >
      {/* Icon Circle */}
      <div
        className={cn(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          meta.bgColor
        )}
      >
        <Icon className={cn('h-4 w-4', meta.iconColor)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm leading-snug',
              notification.lu ? 'text-ink-700' : 'font-semibold text-ink-900'
            )}
          >
            {notification.titre}
          </p>
          {/* Unread Dot */}
          {!notification.lu && (
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-forest-500" />
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-500 line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-ink-400">
          {formatTime(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
