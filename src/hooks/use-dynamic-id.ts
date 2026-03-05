'use client';

import { usePathname } from 'next/navigation';

/**
 * In Capacitor static export mode, generateStaticParams returns [{ id: '_' }].
 * Next.js resolves params to { id: '_' } instead of the actual UUID from the URL.
 * This hook extracts the real ID from the pathname when the param is the placeholder.
 */
export function useDynamicId(paramId: string): string {
  const pathname = usePathname();

  if (paramId && paramId !== '_') {
    return paramId;
  }

  // Extract last path segment as the ID
  // e.g. /evenements/abc-123/ → abc-123
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] || paramId;
}
