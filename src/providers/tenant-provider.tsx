'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTenantStore } from '@/stores/tenant.store';

const PUBLIC_PATHS = ['/paroisse-setup', '/splash', '/maintenance'];

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConfigured, _hasHydrated, paroisse } = useTenantStore();

  // Apply dynamic theme colors from parish
  useEffect(() => {
    if (!paroisse) return;
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary', paroisse.couleurPrimaire);
    root.style.setProperty('--tenant-secondary', paroisse.couleurSecondaire);
    root.style.setProperty('--tenant-accent', paroisse.couleurAccent);

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', paroisse.couleurPrimaire);
  }, [paroisse]);

  // Redirect to setup if not configured
  useEffect(() => {
    if (!_hasHydrated) return;
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return;

    if (!isConfigured) {
      router.replace('/paroisse-setup');
    }
  }, [_hasHydrated, isConfigured, pathname, router]);

  // Don't block rendering while hydrating — show nothing briefly
  if (!_hasHydrated) {
    return null;
  }

  // If not configured and not on a public path, show nothing (redirect happening)
  if (!isConfigured && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return null;
  }

  return <>{children}</>;
}
