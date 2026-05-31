'use client';

import { Select } from '@eidos/ui';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';

/**
 * Color-theme picker — built on the DS <Select> (a closed 3-option set needs a
 * select, not a searchable combobox). Each option carries its accent swatch as
 * the leading icon, so you preview the colour before choosing; the trigger
 * shows the active theme's swatch + name; the selected row gets a trailing
 * check (the slot is reserved on every row, so they stay aligned). Data-driven
 * from COLOR_THEMES. The switch is GLOBAL (re-themes every sub-DS at once).
 */
export function ThemePicker() {
  const { theme, setTheme, themes } = useColorTheme();

  const options = themes.map((t) => ({
    value: t.id,
    label: t.label,
    // Select's icon is a component; bind each theme's fixed preview swatch.
    icon: () => <span className="ds-theme-dot" style={{ background: t.swatch }} aria-hidden="true" />,
  }));

  return (
    <div className="ds-theme-picker">
      <Select
        size="sm"
        width="160px"
        options={options}
        value={theme}
        onValueChange={(v) => setTheme(v as ColorTheme)}
      />
    </div>
  );
}
