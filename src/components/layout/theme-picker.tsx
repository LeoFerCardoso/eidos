'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Icons,
} from '@eidos/ui';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';

/**
 * Color-theme picker — a compact PILL trigger that opens the DS context menu
 * (<DropdownMenu>). The pill stays small (swatch + name); the menu panel sizes
 * to its content, so options are never clipped. Each row shows the theme's
 * accent swatch + name; the active theme gets a trailing check. Data-driven
 * from COLOR_THEMES. The switch is GLOBAL (re-themes every sub-DS at once).
 */
export function ThemePicker() {
  const { theme, setTheme, themes } = useColorTheme();
  const current = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ds-theme-pill" aria-label={`Color theme: ${current.label}`}>
        <span className="ds-theme-dot" style={{ background: current.swatch }} aria-hidden="true" />
        <span className="label">{current.label}</span>
        <Icons.chevronDown size={13} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            icon={() => <span className="ds-theme-dot" style={{ background: t.swatch }} aria-hidden="true" />}
            shortcut={t.id === theme ? '✓' : undefined}
            onSelect={() => setTheme(t.id)}
          >
            {t.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
