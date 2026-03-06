'use client';

import { useTranslations } from 'next-intl';
import { MembersTable } from '@/features/admin/components/members-table';

export default function AdminFidelesPage() {
  const t = useTranslations('admin');

  return (
    <section className="mx-auto max-w-[1400px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('membersManagement')}
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {t('membersManagementDesc')}
        </p>
      </div>

      {/* Members table */}
      <MembersTable />
    </section>
  );
}
