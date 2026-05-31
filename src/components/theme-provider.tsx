'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

// Wraps next-themes, configured to share the legacy contract: the `data-theme`
// attribute + the `forge-theme` localStorage key. This keeps the new layout's
// ThemeToggle and the legacy DSShell theme logic converged on the same value.
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      storageKey="forge-theme"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
