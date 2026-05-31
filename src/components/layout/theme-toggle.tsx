'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { DSIcon } from './ds-icon';

/** Compact segmented dark/light toggle — two icon options, the active one lit. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const theme = mounted ? resolvedTheme : 'dark';

  return (
    <div className="ds-theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <DSIcon name="moon" size={14} />
      </button>
      <button
        type="button"
        className={theme === 'light' ? 'active' : ''}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        aria-label="Light mode"
        title="Light mode"
      >
        <DSIcon name="sun" size={14} />
      </button>
    </div>
  );
}
