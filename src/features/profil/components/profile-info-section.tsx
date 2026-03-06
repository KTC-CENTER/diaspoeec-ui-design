import { User, Globe, Church, Mail, Phone, Calendar, UserCircle, CheckCircle, Home, Droplets, PenLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

interface InfoItem {
  label: string;
  value: string;
  badge?: string;
  icon?: string;
}

interface ProfileInfoSectionProps {
  title: string;
  items: InfoItem[];
  sectionIcon?: 'user' | 'globe' | 'church';
  onEdit?: () => void;
}

const iconMap: Record<string, typeof Mail> = {
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  'user-circle': UserCircle,
  home: Home,
  droplets: Droplets,
};

const sectionIconMap: Record<string, typeof User> = {
  user: User,
  globe: Globe,
  church: Church,
};

export function ProfileInfoSection({ title, items, sectionIcon, onEdit }: ProfileInfoSectionProps) {
  const tc = useTranslations('common');
  const SectionIcon = sectionIcon ? sectionIconMap[sectionIcon] : User;

  return (
    <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <SectionIcon className="h-5 w-5 text-gold-600" />
          {title}
        </h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
          >
            <PenLine className="h-3.5 w-3.5" />
            {tc('edit')}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item, i) => {
          const ItemIcon = item.icon ? iconMap[item.icon] : null;
          return (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
              {ItemIcon && <ItemIcon className="h-4 w-4 flex-shrink-0 text-ink-500" />}
              <div className="min-w-0">
                <p className="text-xs text-ink-500">{item.label}</p>
                <p className="text-sm font-medium text-ink-900 truncate">{item.value}</p>
              </div>
              {item.badge && (
                <span className="ml-auto flex flex-shrink-0 items-center gap-1 rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                  <CheckCircle className="h-3 w-3" />
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
