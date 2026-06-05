'use client';
// Forge — tiny localStorage-backed state hook for the portal mockup.
//
// Why: the portal is a navigable demo. Ephemeral UI state that a person would
// expect to "stick" (sidebar collapsed/expanded, the active workspace, a
// grid/list preference) should survive a full reload — not just client-side
// navigation. Theme already does this via the color-theme provider; this hook
// generalises the pattern for the rest.
//
// SSR-safe: starts from `initial` on the server and on the first client render
// (so hydration markup matches), then reads the stored value once on mount and
// writes back on every change. The `hydrated` guard prevents clobbering the
// stored value with the default before the read happens. Because portal nav is
// now client-side, the one-frame settle only ever occurs on a hard reload.
import * as React from 'react';

export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(initial);
  const [hydrated, setHydrated] = React.useState(false);

  // Read once on mount.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed / unavailable storage */
    }
    setHydrated(true);
    // key is stable per call-site; intentionally read only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist after hydration so the initial default never overwrites a stored value.
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state, hydrated]);

  return [state, setState];
}
