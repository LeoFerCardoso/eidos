'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { MIGRATED } from '@/ds/migrated/registry';

// Renders a DS page inside the persisted (ds) DocsShell (SPA; the sidebar
// persists, only this content swaps). Every page is an idiomatic TSX module
// (default export) resolved from the generated MIGRATED registry.
// routeKey '' = home/overview.
export function DSPageLoader({ routeKey }: { routeKey: string }) {
  const [view, setView] = useState<{ C: ComponentType } | null>(null);

  useEffect(() => {
    let active = true;
    setView(null);
    // Home ('') is the Introduction — registered under the `overview` slug.
    const key = routeKey === '' ? 'overview' : routeKey;
    const load = MIGRATED[key];
    if (!load) return;
    load().then((mod) => {
      if (active) setView({ C: mod.default });
    });
    return () => {
      active = false;
    };
  }, [routeKey]);

  if (!view?.C) return null;
  const C = view.C;
  return <C />;
}
