'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  activeHref: string;
  user: { name: string; parish: string };
  dark?: boolean;
  logoText?: string;
  onLogout?: () => void;
}

function EECLogo({ dark }: { dark?: boolean }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill={dark ? '#2D6A4F' : '#1B4332'} />
      <circle cx="20" cy="20" r="17" fill="none" stroke={dark ? '#95D5B2' : '#D8F3DC'} strokeWidth="1" />
      {/* Cross */}
      <line x1="20" y1="8" x2="20" y2="28" stroke="#FEFAE0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="13" y1="15" x2="27" y2="15" stroke="#FEFAE0" strokeWidth="2.5" strokeLinecap="round" />
      {/* Leaf */}
      <path
        d="M26 24 C28 20 30 16 28 12 C24 14 22 18 24 22 Z"
        fill="#95D5B2"
        stroke="#95D5B2"
        strokeWidth="0.5"
      />
      <line x1="26" y1="18" x2="27" y2="23" stroke="#1B4332" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
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

export function Sidebar({ items, activeHref, user, dark = false, logoText = 'DiaspoEEC', onLogout }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push('/login');
    }
  };

  return (
    <aside
      className={cn(
        'flex h-full w-[280px] flex-col',
        dark
          ? 'bg-forest-900 text-white'
          : 'bg-cream-100 text-ink-900'
      )}
    >
      {/* Logo Block */}
      <div className="flex items-center gap-3 px-6 py-6">
        <EECLogo dark={dark} />
        <span
          className={cn(
            'font-heading text-xl font-semibold tracking-tight',
            dark ? 'text-white' : 'text-forest-900'
          )}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {logoText}
        </span>
      </div>

      {/* Divider */}
      <div className={cn('mx-4 h-px', dark ? 'bg-white/10' : 'bg-ink-200/50')} />

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? dark
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'bg-forest-900 text-white shadow-md'
                      : dark
                        ? 'text-white/70 hover:bg-white/8 hover:text-white'
                        : 'text-ink-600 hover:bg-forest-900/5 hover:text-ink-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive
                        ? 'text-current'
                        : dark
                          ? 'text-white/50'
                          : 'text-ink-400'
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                        isActive
                          ? dark
                            ? 'bg-white/25 text-white'
                            : 'bg-white/25 text-white'
                          : dark
                            ? 'bg-gold-400 text-forest-900'
                            : 'bg-gold-400 text-forest-900'
                      )}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className={cn('mx-4 h-px', dark ? 'bg-white/10' : 'bg-ink-200/50')} />

      {/* User Card */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
              dark
                ? 'bg-sage-400 text-forest-900'
                : 'bg-forest-900 text-cream-100'
            )}
          >
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'truncate text-sm font-semibold',
                dark ? 'text-white' : 'text-ink-900'
              )}
            >
              {user.name}
            </p>
            <p
              className={cn(
                'truncate text-xs',
                dark ? 'text-white/50' : 'text-ink-500'
              )}
            >
              {user.parish}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
              dark
                ? 'text-white/50 hover:bg-white/10 hover:text-white'
                : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700'
            )}
            aria-label="Se deconnecter"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
