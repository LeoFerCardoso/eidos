import * as React from 'react';

const Mono = ({ children, tone = 'ember' }: { children?: React.ReactNode; tone?: 'ember' | 'subtle' }) => (
  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: tone === 'subtle' ? 'var(--fg-subtle)' : 'var(--ember)' }}>{children}</code>
);

export { Mono };
