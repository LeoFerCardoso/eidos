'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgeMark } from './forge-mark';
import { DSIcon } from './ds-icon';
import { DESIGN_SYSTEMS, dsHref, type DesignSystem, type DesignSystemId } from '@/lib/nav';

// The ember tile glyph for a DS: the ForgeMark for `core`, otherwise the DS icon.
// Inherits `currentColor` (= the tile's var(--bg)) so it flips dark/light with theme.
function DsGlyph({ ds, size }: { ds: DesignSystem; size: number }) {
  return ds.id === 'core' ? (
    <ForgeMark size={size} color="currentColor" />
  ) : (
    <DSIcon name={ds.icon} size={size} />
  );
}

/** Sidebar header — shows the active Design System and switches between the family. */
export function DsSwitcher({ activeDs }: { activeDs: DesignSystemId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = DESIGN_SYSTEMS.find((d) => d.id === activeDs) ?? DESIGN_SYSTEMS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (ds: DesignSystem) => {
    setOpen(false);
    router.push(dsHref(ds));
  };

  return (
    <div className="brand ds-switcher" ref={ref}>
      <button
        type="button"
        className="ds-switcher-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Design system: ${current.label}. Switch design system`}
      >
        <span className="brand-mark" aria-hidden="true">
          <DsGlyph ds={current} size={current.id === 'core' ? 28 : 20} />
        </span>
        <span className="name">
          {current.label}
          <span className="sub">{current.tagline}</span>
        </span>
        <DSIcon name="more" size={16} />
      </button>

      {open && (
        <div className="ds-switcher-menu" role="menu" aria-label="Design systems">
          <div className="ds-switcher-label">Design systems</div>
          {DESIGN_SYSTEMS.map((ds) => (
            <button
              key={ds.id}
              type="button"
              role="menuitem"
              className={'ds-switcher-item' + (ds.id === activeDs ? ' is-active' : '')}
              onClick={() => pick(ds)}
            >
              <span className="ds-switcher-tile" aria-hidden="true">
                <DsGlyph ds={ds} size={ds.id === 'core' ? 16 : 15} />
              </span>
              <span className="ds-switcher-text">
                <span className="ds-switcher-name">{ds.label}</span>
                <span className="ds-switcher-tagline">{ds.tagline}</span>
              </span>
              {ds.id === activeDs && (
                <span className="ds-switcher-check" aria-hidden="true">
                  <DSIcon name="check" size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
