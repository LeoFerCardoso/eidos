'use client';

import { DS_VERSIONS, DS_VERSION, DS_CHANNEL } from '@/lib/site';
import { useActiveDs } from './use-active-ds';

/** The "v1.14.0 · Stable" pill — DS-aware: shows the version of the active Design System. */
export function VersionBadge() {
  const ds = useActiveDs();
  const version = DS_VERSIONS[ds] ?? DS_VERSION;
  return (
    <span className="pill ember">
      <span className="dot" />v{version} · {DS_CHANNEL}
    </span>
  );
}
