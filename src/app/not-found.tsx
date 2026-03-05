'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // In Capacitor, dynamic routes like /meditations/[id]
    // don't have pre-rendered HTML files.
    // This fallback catches those routes and lets
    // Next.js client-side router handle them.
    const path = window.location.pathname;
    if (path && path !== '/404' && path !== '/404/') {
      router.replace(path);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
    </div>
  );
}
