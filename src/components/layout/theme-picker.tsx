'use client';

import { useEffect, useRef, useState } from 'react';
import { useColorTheme } from '@/components/color-theme-provider';
import { DSIcon } from './ds-icon';

/**
 * Color-theme picker — a compact dropdown in the topbar. The trigger shows the
 * active theme's accent swatch + name; the menu lists every registered theme
 * with its swatch, so you preview the colour before choosing. Data-driven from
 * COLOR_THEMES, so adding a theme there makes it appear here automatically.
 * The switch is GLOBAL (re-themes every sub-DS at once).
 */
export function ThemePicker() {
  const { theme, setTheme, themes } = useColorTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = themes.find((t) => t.id === theme) ?? themes[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="ds-theme-picker" ref={ref}>
      <button
        type="button"
        className="ds-theme-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Color theme: ${current.label}`}
        title="Color theme"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ds-theme-dot" style={{ background: current.swatch }} aria-hidden="true" />
        <span className="label">{current.label}</span>
        <DSIcon name="chevronDown" size={13} />
      </button>
      {open && (
        <ul className="ds-theme-picker-menu" role="listbox" aria-label="Color theme">
          {themes.map((t) => (
            <li key={t.id} role="option" aria-selected={t.id === theme}>
              <button
                type="button"
                className={'ds-theme-picker-opt' + (t.id === theme ? ' active' : '')}
                onClick={() => { setTheme(t.id); setOpen(false); }}
              >
                <span className="ds-theme-dot" style={{ background: t.swatch }} aria-hidden="true" />
                <span className="label">{t.label}</span>
                <span className="hint">{t.hint}</span>
                {t.id === theme && <DSIcon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
