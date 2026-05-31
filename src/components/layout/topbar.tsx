'use client';

import { Breadcrumb } from './breadcrumb';
import { ThemeToggle } from './theme-toggle';
import { ThemePicker } from './theme-picker';
import { DSIcon } from './ds-icon';
import { useActiveDs } from './use-active-ds';
import { DS_VERSIONS, DS_VERSION } from '@/lib/site';

/** Top header — breadcrumb on the lead, command-search + theme toggle trailing. */
export function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  const activeDs = useActiveDs();
  return (
    <div className="ds-topbar">
      <div className="ds-topbar-lead">
        <Breadcrumb />
      </div>

      <div className="actions">
        {/* Version badge — DS-aware: shows the version of the Design System you're viewing. */}
        <span className="pill ember ds-topbar-ver">v{DS_VERSIONS[activeDs] ?? DS_VERSION}</span>

        <button type="button" className="ds-topbar-search" onClick={onOpenPalette} aria-label="Search or run a command">
          <DSIcon name="search" size={14} />
          <span className="label">Search or run command…</span>
          <span className="kbd-chord">
            <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span>
            <span className="kbd">K</span>
          </span>
        </button>

        <span className="ds-topbar-div" aria-hidden="true" />

        <ThemePicker />
        <ThemeToggle />
      </div>
    </div>
  );
}
