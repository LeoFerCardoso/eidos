import * as React from 'react';
import { Chip } from '@/components/forge/chip';

// Inlined Forge mock palette (LangBadge) — keeps this file self-contained.
const MOCKS = { LANGS: { TypeScript: '#3178C6', Go: '#00ADD8', Java: '#F89820', Python: '#FFD43B', Rust: '#CE422B' } } as { LANGS: Record<string, string> };

const LangBadge = ({
  lang,
  className,
}: {
  lang?: string;
  className?: string;
}) => (
  <Chip
    icon={
      <span
        aria-hidden="true"
        style={{ display: 'inline-block', flex: '0 0 auto', width: 7, height: 7, borderRadius: '50%', background: MOCKS.LANGS[lang] || 'var(--fg-subtle)' }}
      />
    }
    className={className}
  >
    {lang}
  </Chip>
);

export { LangBadge };
