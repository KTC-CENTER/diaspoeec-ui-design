'use client';

import Link from 'next/link';
import { ArrowLeft, Smartphone, Monitor, Tablet, LogOut, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useSessions, useRevokeSession, useRevokeAllSessions } from '@/features/profil/hooks/use-sessions';
import { formatRelativeTime } from '@/lib/utils/format';

const iconMap: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export default function AppareilsPage() {
  const { addToast } = useToastStore();
  const { data: sessions, isLoading } = useSessions();
  const revokeMutation = useRevokeSession();
  const revokeAllMutation = useRevokeAllSessions();

  const handleDisconnect = (sessionId: string, deviceName: string) => {
    revokeMutation.mutate(sessionId, {
      onSuccess: () => addToast(`Appareil "${deviceName}" deconnecte`, 'success'),
      onError: () => addToast('Erreur lors de la deconnexion', 'error'),
    });
  };

  const handleDisconnectAll = () => {
    revokeAllMutation.mutate(undefined, {
      onSuccess: () => addToast('Tous les autres appareils ont ete deconnectes', 'success'),
      onError: () => addToast('Erreur lors de la deconnexion', 'error'),
    });
  };

  const otherSessions = sessions?.filter((s) => !s.current) ?? [];

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
          {isLoading ? (
            'Chargement...'
          ) : (
            <>
              {sessions?.length ?? 0} appareil{(sessions?.length ?? 0) > 1 ? 's' : ''} connecte
              {(sessions?.length ?? 0) > 1 ? 's' : ''}
            </>
          )}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-forest-700" />
          </div>
        ) : (
          <div className="space-y-3">
            {sessions?.map((session) => {
              const Icon = iconMap[session.deviceType] || Monitor;
              return (
                <div
                  key={session.id}
                  className={cn(
                    'flex items-center gap-4 rounded-xl p-4 transition-colors',
                    session.current ? 'border-2 border-forest-700/20 bg-forest-900/5' : 'bg-cream-50/50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                      session.current ? 'bg-forest-700 text-white' : 'bg-ink-100 text-ink-500'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-900">{session.deviceName}</p>
                      {session.current && (
                        <span className="flex items-center gap-1 rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                          <Check className="h-3 w-3" />
                          Cet appareil
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-500">
                      {session.current ? 'Actif maintenant' : formatRelativeTime(session.lastActiveAt)}
                      {session.ipAddress && <> &middot; {session.ipAddress}</>}
                    </p>
                  </div>
                  {!session.current && (
                    <button
                      onClick={() => handleDisconnect(session.id, session.deviceName)}
                      disabled={revokeMutation.isPending}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Deconnecter
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {otherSessions.length > 0 && (
        <button
          onClick={handleDisconnectAll}
          disabled={revokeAllMutation.isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-500 px-6 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 disabled:opacity-50 md:w-auto"
        >
          {revokeAllMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Deconnecter tous les autres appareils
        </button>
      )}
    </div>
  );
}
