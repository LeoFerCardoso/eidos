'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Eidos is the design system; the COLOR THEME (Forge default, Dusk alt) is a
// second axis orthogonal to the dark/light MODE that next-themes manages.
// The theme is applied as `data-ds-theme` on <html> and persisted under the
// `eidos-theme` localStorage key. A tiny no-FOUC script in app/layout.tsx sets
// the attribute before paint; this provider mirrors it into React state so the
// ThemePicker reflects the current value. The switch is GLOBAL (every sub-DS
// shares the same theme).
export type ColorTheme = 'forge' | 'dusk' | 'fjord';
// The registry of selectable color themes. `swatch` is a fixed preview of each
// theme's accent (theme-independent) so the picker can show the colour before
// you choose. Add a theme here + its [data-ds-theme] block in tokens.css and it
// appears in the picker automatically — the list is built to expand.
export const COLOR_THEMES: { id: ColorTheme; label: string; swatch: string; hint: string }[] = [
  { id: 'forge', label: 'Forge', swatch: '#FF6B35', hint: 'Warm ember' },
  { id: 'dusk',  label: 'Dusk',  swatch: '#9B8CFF', hint: 'Violet' },
  { id: 'fjord',  label: 'Fjord',  swatch: '#2DD4BF', hint: 'Calm teal' },
];
const STORAGE_KEY = 'eidos-theme';
const DEFAULT_THEME: ColorTheme = 'forge';
const isTheme = (v: unknown): v is ColorTheme => COLOR_THEMES.some((t) => t.id === v);

const ColorThemeContext = createContext<{
  theme: ColorTheme;
  setTheme: (t: ColorTheme) => void;
  themes: typeof COLOR_THEMES;
}>({ theme: DEFAULT_THEME, setTheme: () => {}, themes: COLOR_THEMES });

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>(DEFAULT_THEME);

  // Hydrate from the attribute the no-FOUC script already set (falls back to
  // localStorage, then the default). Avoids a flash and keeps SSR markup stable.
  useEffect(() => {
    const fromDom = document.documentElement.getAttribute('data-ds-theme');
    const stored = (() => {
      try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    })();
    const initial = stored ?? fromDom;
    if (isTheme(initial)) setThemeState(initial);
  }, []);

  const setTheme = useCallback((t: ColorTheme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-ds-theme', t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* ignore */ }
  }, []);

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme, themes: COLOR_THEMES }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
