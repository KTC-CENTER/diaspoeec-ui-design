'use client';

import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { formatMontant, formatRelativeTime, getInitials } from '@/lib/utils/format';
import type { Don } from '@/types';

const avatarGradients = [
  'from-gold-600 to-gold-400',
  'from-forest-900 to-sage-400',
  'from-terra-600 to-gold-600',
  'from-forest-700 to-forest-900',
  'from-sage-400 to-forest-900',
];

interface DonorListProps {
  dons: Don[];
}

export function DonorList({ dons }: DonorListProps) {
  const t = useTranslations('dons');

  if (!dons || dons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream-50 py-8 text-center">
        <p className="text-sm text-ink-400">{t('noDonors')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6">
      <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
        {t('lastDonors')}
      </h2>
      <div className="space-y-3">
        {dons.map((don, index) => {
          const nom = don.estAnonyme ? 'Anonyme' : don.donateurNom || 'Anonyme';
          const initials = don.estAnonyme ? '' : getInitials(nom);
          const gradientIndex = index % avatarGradients.length;

          return (
            <div key={don.id}>
              <div className="flex items-center gap-3 py-2">
                {/* Avatar */}
                {don.estAnonyme ? (
                  <div className="w-10 h-10 rounded-full bg-ink-200 flex items-center justify-center text-ink-600 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
                      avatarGradients[gradientIndex]
                    )}
                  >
                    {initials}
                  </div>
                )}

                {/* Name and time */}
                <div className="flex-1">
                  <p className={cn(
                    'font-medium text-sm',
                    don.estAnonyme ? 'text-ink-900' : 'text-ink-900'
                  )}>
                    {nom}
                  </p>
                  <p className="text-xs text-ink-600">
                    {formatRelativeTime(don.createdAt)}
                  </p>
                </div>

                {/* Amount */}
                <span className="font-heading font-bold text-forest-900">
                  {formatMontant(don.montant, don.devise)}
                </span>
              </div>
              {/* Divider (not on last item) */}
              {index < dons.length - 1 && (
                <div className="h-px bg-ink-100/50" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
