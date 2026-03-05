'use client';

import { useEffect, useState } from 'react';
import { initializeCapacitor } from '@/lib/capacitor-init';
import { restoreTokensFromNative } from '@/lib/api/client';
import { restoreAuthFromNative } from '@/stores/auth.store';

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Restore tokens and auth state from native storage before rendering
      await restoreTokensFromNative();
      await restoreAuthFromNative();
      await initializeCapacitor();
      setReady(true);
    };
    init();
  }, []);

  // On web, render immediately; on native, wait for restoration
  if (!ready && typeof window !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Capacitor } = require('@capacitor/core');
      if (Capacitor.isNativePlatform()) {
        return (
          <div className="flex min-h-screen items-center justify-center bg-cream-50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest-900/20 border-t-forest-900" />
          </div>
        );
      }
    } catch {
      // Not native, continue
    }
  }

  return <>{children}</>;
}
