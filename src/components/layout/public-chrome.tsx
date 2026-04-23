'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { EmergencyDock } from '@/components/layout/emergency-dock';
import type { ReactNode } from 'react';

/**
 * Wraps the public-facing pages with the main site header, footer, and
 * floating emergency dock. On backend routes (admin + doctor portals and
 * the queue-display TV screen) none of these should render, because those
 * areas have their own dedicated shells.
 */
const BACKEND_PREFIXES = ['/admin', '/doctor', '/queue-display'];

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBackend = BACKEND_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isBackend) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-[60vh]">{children}</main>
      <SiteFooter />
      <EmergencyDock />
    </>
  );
}
