'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { ToastContainer } from '@/components/shared/toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      {children}
      <ToastContainer />
    </AdminShell>
  );
}
