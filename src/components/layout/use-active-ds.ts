'use client';

import { usePathname } from 'next/navigation';
import { navForPath, type DesignSystemId } from '@/lib/nav';

/** The active Design System, derived from the current route (defaults to `core`). */
export function useActiveDs(): DesignSystemId {
  return navForPath(usePathname()).ds;
}
