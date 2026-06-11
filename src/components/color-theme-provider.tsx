'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Eidos is the design system; the COLOR THEME (Forge default, Dusk alt) is a
// second axis orthogonal to the dark/light MODE that next-themes manages.
// The theme is applied as `data-ds-theme` on <html> and persisted under the
// `eidos-theme` localStorage key. A tiny no-FOUC script in app/layout.tsx sets
// the attribute before paint; this provider mirrors it into React state so the
// ThemePicker reflects the current value. The switch is GLOBAL (every sub-DS
// shares the same theme).
export type ColorTheme = 'forge' | 'dusk' | 'fjord' | 'cobalt' | 'garnet' | 'graphite' | 'dune';
// The registry of selectable color themes. `swatch` is a fixed preview of each
// theme's accent (theme-independent) so the picker can show the colour before
// you choose. Add a theme here + its [data-ds-theme] block in tokens.css and it
// appears in the picker automatically — the list is built to expand.
export const COLOR_THEMES: { id: ColorTheme; label: string; swatch: string; hint: string }[] = [
  { id: 'forge', label: 'Forge', swatch: '#FF6B35', hint: 'Warm ember' },
  { id: 'dusk',  label: 'Dusk',  swatch: '#9B8CFF', hint: 'Violet' },
  { id: 'fjord',  label: 'Fjord',  swatch: '#2DD4BF', hint: 'Calm teal' },
  // Cool blue theme anchored on #2563EB (deep cobalt in light mode, its bright
  // sibling in dark) with cold blue-tinted surfaces. See the [data-ds-theme="cobalt"]
  // block in tokens.css. Secondary accents: electric cyan (info/AI) + brass gold.
  { id: 'cobalt', label: 'Cobalt', swatch: '#4F86F7', hint: 'Cool blue' },
  // Brand theme anchored on the deep crimson #9E1B32 (the literal primary in
  // light mode; a brightened crimson in dark). Neutrals drive the surface/text
  // system; the brand's five auxiliary colours map to the semantic roles
  // (teal=info, green=success, gold=warning, purple=premium) + the categorical
  // chart palette. See the [data-ds-theme="garnet"] block in tokens.css.
  { id: 'garnet', label: 'Garnet', swatch: '#9E1B32', hint: 'Brand crimson' },
  // Apple-inspired, MONOCHROME: pure neutral surfaces (white / Apple grey in
  // light, true OLED black in dark) + a greyscale accent — a near-black pill in
  // light, a near-white pill in dark (like Apple's buttons). Colour lives only in
  // the functional roles (iOS/macOS system palette).
  { id: 'graphite', label: 'Graphite', swatch: '#8E8E93', hint: 'Clean neutral' },
  // Warm monochrome (the thermal opposite of Graphite): earthy beige/brown
  // surfaces with a coffee accent in light, espresso surfaces with a latte
  // accent in dark. Built from a sand-to-coffee palette.
  { id: 'dune', label: 'Dune', swatch: '#A4886A', hint: 'Warm earth' },
];
const STORAGE_KEY = 'eidos-theme';
const RECENTS_KEY = 'eidos-theme-recents';
const DEFAULT_THEME: ColorTheme = 'forge';
const RECENTS_MAX = 6;
const isTheme = (v: unknown): v is ColorTheme => COLOR_THEMES.some((t) => t.id === v);

const ColorThemeContext = createContext<{
  theme: ColorTheme;
  setTheme: (t: ColorTheme) => void;
  themes: typeof COLOR_THEMES;
  /** most-recently-used theme ids, newest first (for the quick-access picker). */
  recents: ColorTheme[];
}>({ theme: DEFAULT_THEME, setTheme: () => {}, themes: COLOR_THEMES, recents: [] });

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ColorTheme>(DEFAULT_THEME);
  const [recents, setRecents] = useState<ColorTheme[]>([]);

  // Hydrate from the attribute the no-FOUC script already set (falls back to
  // localStorage, then the default). Avoids a flash and keeps SSR markup stable.
  useEffect(() => {
    const fromDom = document.documentElement.getAttribute('data-ds-theme');
    const stored = (() => {
      try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    })();
    const initial = stored ?? fromDom;
    const active = isTheme(initial) ? initial : DEFAULT_THEME;
    if (active !== DEFAULT_THEME) setThemeState(active);

    let storedRecents: ColorTheme[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
      if (Array.isArray(raw)) storedRecents = raw.filter(isTheme);
    } catch { /* ignore */ }
    // Always lead the MRU list with the active theme.
    setRecents([active, ...storedRecents.filter((t) => t !== active)].slice(0, RECENTS_MAX));
  }, []);

  const setTheme = useCallback((t: ColorTheme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-ds-theme', t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* ignore */ }
    setRecents((prev) => {
      const next = [t, ...prev.filter((x) => x !== t)].slice(0, RECENTS_MAX);
      try { localStorage.setItem(RECENTS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme, themes: COLOR_THEMES, recents }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
