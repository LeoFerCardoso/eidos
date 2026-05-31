'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  Icons,
} from '@eidos/ui';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';

/**
 * Color-theme picker — a compact PILL trigger that opens the DS context menu
 * (<DropdownMenu>). Single-select, so it uses the canonical RadioGroup pattern:
 * each row is a <DropdownMenuRadioItem> whose built-in radio indicator marks the
 * active theme (no bespoke check). Each row also shows the theme's accent swatch
 * so you preview the colour. Data-driven from COLOR_THEMES; switch is GLOBAL.
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
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as ColorTheme)}>
          {themes.map((t) => (
            <DropdownMenuRadioItem key={t.id} value={t.id}>
              <span className="ds-theme-opt">
                <span className="ds-theme-dot" style={{ background: t.swatch }} aria-hidden="true" />
                {t.label}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
