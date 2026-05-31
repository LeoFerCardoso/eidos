'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Icons,
} from '@eidos/ui';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';

/**
 * Unified appearance menu — one DS context menu (<DropdownMenu>) for BOTH theme
 * axes the app exposes: the dark/light MODE (next-themes, `data-mode`) and the
 * color THEME / accent (forge · dusk · fjord, `data-ds-theme`). It replaces the
 * old pair of bespoke controls (a colour pill + a hand-rolled segmented toggle)
 * with a single trigger that opens the canonical menu.
 *
 * Both axes use the canonical single-select pattern — a <DropdownMenuRadioGroup>
 * whose <DropdownMenuRadioItem> carries the menu's built-in radio indicator (no
 * bespoke check). Accent rows render the theme's swatch as a rounded SQUARE chip
 * so it reads as a colour preview, clearly distinct from the round selection dot
 * — and the theme hint sits in the trailing shortcut slot. Both switches are
 * GLOBAL (every sub-DS shares them).
 */
export function ThemePicker() {
  const { theme, setTheme, themes } = useColorTheme();
  const { resolvedTheme, setTheme: setMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = themes.find((t) => t.id === theme) ?? themes[0];
  const mode = mounted ? resolvedTheme ?? 'dark' : 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="ds-theme-pill"
        aria-label={`Appearance — ${current.label} theme, ${mode} mode`}
      >
        <span className="ds-theme-dot" style={{ background: current.swatch }} aria-hidden="true" />
        <span className="label">{current.label}</span>
        <Icons.chevronDown size={13} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v)} indicator="check">
          <DropdownMenuRadioItem value="light">
            <span className="ds-theme-opt">
              <Icons.sun size={14} aria-hidden="true" />
              Light
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <span className="ds-theme-opt">
              <Icons.moon size={14} aria-hidden="true" />
              Dark
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Accent</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as ColorTheme)} indicator="check">
          {themes.map((t) => (
            <DropdownMenuRadioItem key={t.id} value={t.id} shortcut={t.hint}>
              <span className="ds-theme-opt">
                <span className="ds-theme-swatch" style={{ background: t.swatch }} aria-hidden="true" />
                {t.label}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
