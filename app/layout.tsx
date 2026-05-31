import type { Metadata } from 'next';
// DS stylesheets, in the same order the original HTML shells loaded them.
// The base layer (tokens + ds + ai) ships from the extracted @eidos/ui package.
import '@eidos/ui/styles/tokens.css';
import '@eidos/ui/styles/ds.css';
import '@eidos/ui/styles/ai.css';
import '../src/styles/ai-shell.css';
import '../src/styles/example-shell.css';
import './tailwind.css';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Eidos — Design System',
  description: "The design system that powers Equifax/Boa Vista's Internal Developer Platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* next-themes manages data-theme + the forge-theme storage key (no-FOUC script
            injected by the provider). The legacy DSShell shares the same contract. */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
