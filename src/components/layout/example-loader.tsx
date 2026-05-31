'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { EXAMPLES_REG } from '@/ds/examples/registry';

// Standalone IDP example screens — rendered full-screen, OUTSIDE the docs shell.
// Each example is an idiomatic TSX module (default export) that composes the
// Eidos shells + core primitives directly; no window registry.
export function ExampleLoader({ name }: { name: string }) {
  const [view, setView] = useState<{ C: ComponentType } | null>(null);

  useEffect(() => {
    let active = true;
    setView(null);
    const load = EXAMPLES_REG[name];
    if (!load) return;
    load().then((mod) => {
      if (active) setView({ C: mod.default });
    });
    return () => {
      active = false;
    };
  }, [name]);

  if (!view?.C) return null;
  const C = view.C;
  return <C />;
}
