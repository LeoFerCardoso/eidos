'use client';

import { Combobox } from '@eidos/ui';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';

/**
 * Color-theme picker — built on the DS <Combobox>. Each option carries its
 * accent swatch (icon) + a hint (meta), so you preview the colour before
 * choosing; the trigger shows the active theme's swatch + name. Data-driven
 * from COLOR_THEMES — adding a theme there makes it appear here automatically.
 * The switch is GLOBAL (re-themes every sub-DS at once).
 */
export function ThemePicker() {
  const { theme, setTheme, themes } = useColorTheme();

  // The swatch already previews each theme's colour, so the row stays compact —
  // swatch · name · (trailing check) — and fits the narrow topbar panel without
  // truncating the name. (The `hint` lives in COLOR_THEMES for richer surfaces.)
  const options = themes.map((t) => ({
    value: t.id,
    label: t.label,
    icon: <span className="ds-theme-dot" style={{ background: t.swatch }} aria-hidden="true" />,
  }));

  return (
    <div className="ds-theme-picker">
      <Combobox
        size="sm"
        width="140px"
        options={options}
        value={theme}
        onValueChange={(v) => setTheme(v as ColorTheme)}
      />
    </div>
  );
}
