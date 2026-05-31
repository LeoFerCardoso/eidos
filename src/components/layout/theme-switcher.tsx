'use client';

import { useColorTheme } from '@/components/color-theme-provider';

/**
 * Compact segmented color-theme switch (Forge · Iris) — sits beside the
 * dark/light ThemeToggle in the topbar. Each option shows a fixed accent
 * swatch (theme-independent) so you can preview what it selects; the active
 * option is lit. The switch is GLOBAL — it re-themes every sub-DS at once.
 */
export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useColorTheme();

  return (
    <div className="ds-theme-switch" role="group" aria-label="Color theme">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          className={theme === t.id ? 'active' : ''}
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
          title={`${t.label} theme`}
        >
          <span className={`ds-theme-swatch ds-theme-swatch--${t.id}`} aria-hidden="true" />
          {t.label}
        </button>
      ))}
    </div>
  );
}
