'use client';

import { useTranslations } from 'next-intl';
import { ModerationQueue } from '@/features/admin/components/moderation-queue';
import { useModeration } from '@/features/admin/hooks/use-admin';

export default function AdminModerationPage() {
  const t = useTranslations('admin');
  const { data } = useModeration();
  const pendingCount = data?.pendingCount ?? 0;

  return (
    <section className="mx-auto max-w-[1400px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('moderation')}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {t('moderationDesc')}
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            {t('itemsToModerate', { count: pendingCount })}
          </span>
        )}
      </div>

      {/* Moderation queue */}
      <ModerationQueue />
    </section>
  );
}
