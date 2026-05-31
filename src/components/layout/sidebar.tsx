'use client';

import { NavTree } from './nav-tree';
import { DsSwitcher } from './ds-switcher';
import { useActiveDs } from './use-active-ds';
import { NAV_BY_DS } from '@/lib/nav';

/** Left rail — DS switcher header + the active Design System's navigation tree. */
export function Sidebar() {
  const activeDs = useActiveDs();
  return (
    <aside className="ds-sidenav">
      <DsSwitcher activeDs={activeDs} />

      <NavTree groups={NAV_BY_DS[activeDs] ?? []} />

      <div style={{ marginTop: 24, padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <div className="t-mono-label" style={{ padding: 0, marginBottom: 8 }}>Maintained by</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Forge Platform Team</div>
        <div style={{ fontSize: 11, color: 'var(--fg-faint)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
          forge@equifax.com.br
        </div>
      </div>
    </aside>
  );
}
