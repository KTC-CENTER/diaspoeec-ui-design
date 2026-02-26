'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, History } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const tabs = [
  { href: '/dons/nouveau', label: 'Faire un don', icon: Heart },
  { href: '/dons/historique', label: 'Mes dons', icon: History },
];

export default function DonsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show tabs on campaign detail pages
  const isCampaignDetail = pathname.startsWith('/dons/campagnes/');

  return (
    <div>
      {!isCampaignDetail && (
        <div className="border-b border-sage-400/10 px-4 md:px-8">
          <nav className="flex gap-1 max-w-4xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                pathname === tab.href || pathname.startsWith(tab.href + '/');

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-forest-900 text-forest-900'
                      : 'border-transparent text-ink-400 hover:text-ink-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      {children}
    </div>
  );
}
