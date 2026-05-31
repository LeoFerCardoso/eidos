'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { CommandPalette } from './command-palette';
import { TableOfContents } from './toc';

// The two-column docs shell, re-expressed as idiomatic decomposed TSX but using the
// ORIGINAL .ds-* classes (ds.css) + the original ForgeMark/Icons (window, loaded here) so
// it is visually identical to the legacy shell. Architectural wins over the legacy IIFE:
// typed nav (lib/nav.ts), Next routing (Link/usePathname), next-themes, RSC page content.
export function DocsShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Load the DS core once so window.ForgeMark/Icons (chrome) + the page modules resolve.
  useEffect(() => {
    let active = true;
    import('@/ds/core').then(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!ready) return <div className="ds-app" />;

  return (
    <div className="ds-app">
      <Sidebar />
      <div className="ds-main">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} />
        <div className="ds-main-inner">
          <div className="ds-doc">{children}</div>
          <TableOfContents />
        </div>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
