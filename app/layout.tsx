import type { Metadata } from 'next';
import Script from 'next/script';
// DS stylesheets, in the same order the original HTML shells loaded them.
// The base layer (tokens + ds + ai) ships from the extracted @eidos/ui package.
import '@eidos/ui/styles/tokens.css';
import '@eidos/ui/styles/ds.css';
import '@eidos/ui/styles/ai.css';
import '@eidos/ui/styles/system.gen.css';
import '../src/styles/ai-shell.css';
import '../src/styles/example-shell.css';
import './tailwind.css';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ColorThemeProvider } from '@/components/color-theme-provider';

// Sets the color theme (data-ds-theme) from localStorage before first paint so
// the Dusk theme doesn't flash Forge. Mirrors what next-themes does for mode.
const NO_FOUC_THEME = `(function(){try{var t=localStorage.getItem('eidos-theme');if(t&&/^[a-z0-9-]+$/.test(t)){document.documentElement.setAttribute('data-ds-theme',t);}}catch(e){}})();`;

export const metadata: Metadata = {
  title: 'Eidos — Design System',
  description: "The design system that powers Equifax/Boa Vista's Internal Developer Platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark" data-ds-theme="forge" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* No-FOUC: set data-ds-theme from localStorage before paint. next/script
            beforeInteractive belongs in <body> in the App Router (Next hoists it
            into the initial HTML ahead of hydration); rendering a raw <script> in
            the React-rendered <head> triggers Next 16's "script tag while
            rendering" warning. */}
        <Script id="no-fouc-theme" strategy="beforeInteractive">
          {NO_FOUC_THEME}
        </Script>
        {/* next-themes manages data-mode + the eidos-mode storage key (no-FOUC script
            injected by the provider). The legacy DSShell shares the same contract. */}
        <ThemeProvider>
          <ColorThemeProvider>{children}</ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
