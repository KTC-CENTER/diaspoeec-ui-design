'use client';

import { AppShell } from '@/components/layout/app-shell';
import { ToastContainer } from '@/components/shared/toast';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      {children}
      <ToastContainer />
    </AppShell>
  );
}
