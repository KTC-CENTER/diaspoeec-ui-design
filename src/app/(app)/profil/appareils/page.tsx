'use client';

import Link from 'next/link';
import { ArrowLeft, Smartphone, Monitor, Tablet, LogOut, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';

const devices = [
  {
    id: '1',
    name: 'Chrome - Linux',
    type: 'desktop' as const,
    lastActive: 'Actif maintenant',
    location: 'Paris, France',
    current: true,
  },
  {
    id: '2',
    name: 'Safari - iPhone 15',
    type: 'mobile' as const,
    lastActive: 'Il y a 2 heures',
    location: 'Paris, France',
    current: false,
  },
  {
    id: '3',
    name: 'Chrome - Windows',
    type: 'desktop' as const,
    lastActive: 'Il y a 3 jours',
    location: 'Lyon, France',
    current: false,
  },
  {
    id: '4',
    name: 'App Android - Samsung Galaxy',
    type: 'tablet' as const,
    lastActive: 'Il y a 1 semaine',
    location: 'Douala, Cameroun',
    current: false,
  },
];

const iconMap = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export default function AppareilsPage() {
  const { addToast } = useToastStore();

  const handleDisconnect = (deviceName: string) => {
    addToast(`Appareil "${deviceName}" deconnecte`, 'success');
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/profil"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour au profil
        </Link>
        <h1
          className="mb-1 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Appareils connectes
        </h1>
        <p className="text-ink-500">Gerez les appareils ayant acces a votre compte</p>
      </div>

      <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Smartphone className="h-5 w-5 text-gold-600" />
          {devices.length} appareil{devices.length > 1 ? 's' : ''} connecte{devices.length > 1 ? 's' : ''}
        </h2>
        <div className="space-y-3">
          {devices.map((device) => {
            const Icon = iconMap[device.type];
            return (
              <div
                key={device.id}
                className={cn(
                  'flex items-center gap-4 rounded-xl p-4 transition-colors',
                  device.current ? 'border-2 border-forest-700/20 bg-forest-900/5' : 'bg-cream-50/50'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                    device.current ? 'bg-forest-700 text-white' : 'bg-ink-100 text-ink-500'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink-900">{device.name}</p>
                    {device.current && (
                      <span className="flex items-center gap-1 rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                        <Check className="h-3 w-3" />
                        Cet appareil
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-500">
                    {device.lastActive} &middot; {device.location}
                  </p>
                </div>
                {!device.current && (
                  <button
                    onClick={() => handleDisconnect(device.name)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Deconnecter
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => addToast('Tous les autres appareils ont ete deconnectes', 'success')}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-500 px-6 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 md:w-auto"
      >
        <LogOut className="h-4 w-4" />
        Deconnecter tous les autres appareils
      </button>
    </div>
  );
}
