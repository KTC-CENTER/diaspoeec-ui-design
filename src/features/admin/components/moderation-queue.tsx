'use client';

import { useState } from 'react';
import {
  Check,
  Trash2,
  UserX,
  User,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatRelativeTime } from '@/lib/utils/format';
import { useModeration } from '@/features/admin/hooks/use-admin';
import type { SignalementModeration } from '@/types';

const severityConfig: Record<
  string,
  {
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    label: string;
    contentBg: string;
    contentBorder: string;
  }
> = {
  haute: {
    borderColor: 'border-l-red-400',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
    label: 'Commentaire signale',
    contentBg: 'bg-red-50/50',
    contentBorder: 'border-red-100',
  },
  moyenne: {
    borderColor: 'border-l-orange-400',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-600',
    label: 'Commentaire signale',
    contentBg: 'bg-orange-50/50',
    contentBorder: 'border-orange-100',
  },
  basse: {
    borderColor: 'border-l-yellow-400',
    badgeBg: 'bg-yellow-50',
    badgeText: 'text-yellow-700',
    label: 'Temoignage signale',
    contentBg: 'bg-yellow-50/50',
    contentBorder: 'border-yellow-100',
  },
};

export function ModerationQueue() {
  const { data, isLoading } = useModeration();
  const [handledIds, setHandledIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (id: string, action: string) => {
    setActionLoading(`${id}-${action}`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setHandledIds((prev) => new Set([...prev, id]));
    setActionLoading(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl shimmer-bg" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const pendingItems = data.pending.filter((s) => !handledIds.has(s.id));

  return (
    <div className="space-y-8">
      {/* Moderation Queue */}
      <div className="space-y-4">
        {pendingItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-forest-900/10 bg-cream-50 py-12 text-center">
            <Check className="mx-auto mb-3 h-10 w-10 text-forest-500" />
            <p
              className="text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Tout est en ordre !
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Aucun element en attente de moderation.
            </p>
          </div>
        ) : (
          pendingItems.map((item) => {
            const severity =
              severityConfig[item.severite] || severityConfig.basse;

            return (
              <div
                key={item.id}
                className={cn(
                  'overflow-hidden rounded-2xl border border-forest-900/5 border-l-4 bg-white shadow-sm',
                  severity.borderColor
                )}
              >
                <div className="p-5">
                  {/* Header row */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        severity.badgeBg,
                        severity.badgeText
                      )}
                    >
                      {item.type === 'temoignage'
                        ? 'Temoignage signale'
                        : 'Commentaire signale'}
                    </span>
                    {item.contexte && (
                      <>
                        <span className="text-xs text-ink-500">sur</span>
                        <span className="text-xs font-medium text-forest-900">
                          {item.contexte}
                        </span>
                      </>
                    )}
                    <span className="ml-auto text-xs text-ink-500">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {/* Author + Content */}
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.auteurContenuNom}
                      </p>
                      <div
                        className={cn(
                          'mt-1.5 rounded-lg border p-3',
                          severity.contentBg,
                          severity.contentBorder
                        )}
                      >
                        <p className="text-sm italic text-ink-500">
                          {item.contenuSignale}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reporter + Actions */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-xs text-ink-500">
                      Signale par{' '}
                      <strong>{item.signaleParNom}</strong>
                      {item.autresSignalements > 0 &&
                        ` + ${item.autresSignalements} autre${item.autresSignalements > 1 ? 's' : ''}`}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(item.id, 'approve')}
                        disabled={actionLoading === `${item.id}-approve`}
                        className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-100 disabled:opacity-60"
                      >
                        {actionLoading === `${item.id}-approve` ? (
                          <Loader2 className="inline h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Approuver'
                        )}
                      </button>
                      <button
                        onClick={() => handleAction(item.id, 'delete')}
                        disabled={actionLoading === `${item.id}-delete`}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {actionLoading === `${item.id}-delete` ? (
                          <Loader2 className="inline h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Supprimer'
                        )}
                      </button>
                      <button
                        onClick={() => handleAction(item.id, 'suspend')}
                        disabled={actionLoading === `${item.id}-suspend`}
                        className="rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 transition hover:bg-orange-100 disabled:opacity-60"
                      >
                        {actionLoading === `${item.id}-suspend` ? (
                          <Loader2 className="inline h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Suspendre l'utilisateur"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom row: History + Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Moderation History */}
        <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
          <h3
            className="mb-4 text-lg font-semibold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Historique de moderation
          </h3>
          <div className="space-y-0">
            {data.history.length > 0 ? (
              data.history.map((item, i) => {
                let iconBg = 'bg-green-50';
                let iconColor = 'text-green-500';
                let Icon = CheckCircle;
                let label = 'Commentaire approuve';

                if (item.statut === 'supprime') {
                  iconBg = 'bg-red-50';
                  iconColor = 'text-red-400';
                  Icon = Trash2;
                  label = 'Commentaire supprime';
                } else if (item.statut === 'utilisateur_suspendu') {
                  iconBg = 'bg-orange-50';
                  iconColor = 'text-orange-400';
                  Icon = UserX;
                  label = 'Utilisateur suspendu';
                }

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 py-3',
                      i < data.history.length - 1 && 'border-b border-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
                        iconBg
                      )}
                    >
                      <Icon className={cn('h-4 w-4', iconColor)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-ink-900">
                        <span className="font-medium">{label}</span>
                        {item.statut === 'supprime' && (
                          <span className="text-ink-500"> - Spam</span>
                        )}
                        {item.statut === 'utilisateur_suspendu' && (
                          <span className="text-ink-500"> (3 jours)</span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        Par <strong>Admin</strong> -{' '}
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-4 text-sm text-ink-500">
                Aucun historique de moderation.
              </p>
            )}
          </div>
        </div>

        {/* Moderation Stats */}
        <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
          <h3
            className="mb-4 text-lg font-semibold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Statistiques de moderation
          </h3>
          <p className="mb-1 text-xs uppercase tracking-wide text-ink-500">
            Ce mois
          </p>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-cream-100 p-4 text-center">
              <p
                className="text-2xl font-bold text-forest-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                23
              </p>
              <p className="mt-1 text-xs text-ink-500">
                Signalements traites
              </p>
            </div>
            <div className="rounded-xl bg-cream-100 p-4 text-center">
              <p
                className="text-2xl font-bold text-terra-600"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                4h
              </p>
              <p className="mt-1 text-xs text-ink-500">
                Temps moyen de traitement
              </p>
            </div>
          </div>
          <h4 className="mb-3 text-sm font-semibold text-ink-900">
            Actions realisees
          </h4>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ink-500">Suppressions</span>
                <span className="font-semibold text-red-500">15</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-red-50">
                <div
                  className="h-2.5 rounded-full bg-red-400"
                  style={{ width: '65%' }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ink-500">Approbations</span>
                <span className="font-semibold text-green-600">5</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-green-50">
                <div
                  className="h-2.5 rounded-full bg-green-400"
                  style={{ width: '22%' }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ink-500">Suspensions</span>
                <span className="font-semibold text-orange-500">3</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-orange-50">
                <div
                  className="h-2.5 rounded-full bg-orange-400"
                  style={{ width: '13%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
