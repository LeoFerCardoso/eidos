'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

// Wraps next-themes, configured to share the legacy contract: the `data-mode`
// attribute + the `eidos-mode` localStorage key. This keeps the new layout's
// ThemeToggle and the legacy DSShell theme logic converged on the same value.
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-mode"
      defaultTheme="dark"
      storageKey="eidos-mode"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
