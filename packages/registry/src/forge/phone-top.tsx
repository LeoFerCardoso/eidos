import * as React from 'react';
import { StatusBar } from '@/components/forge/status-bar';

type Platform = 'ios' | 'android';

function PhoneTop({
  platform = 'ios', time = '9:41', width = 360, peek = 96, children, frameless = false,
}: {
  platform?: Platform; time?: string; width?: number; peek?: number; children?: React.ReactNode; frameless?: boolean;
}) {
  const ios = platform === 'ios';
  return (
    <div
      style={{
        width, borderStartStartRadius: 30, borderStartEndRadius: 30, border: '1px solid var(--border)', borderBlockEnd: 'none',
        background: 'var(--bg)', overflow: 'hidden', boxShadow: frameless ? 'none' : 'var(--shadow-2)',
      }}
    >
      <div style={{ position: 'relative' }}>
        {ios ? (
          <span aria-hidden="true" style={{ position: 'absolute', insetBlockStart: 9, insetInlineStart: '50%', transform: 'translateX(-50%)', width: 104, height: 26, borderRadius: 999, background: '#08090A' }} />
        ) : (
          <span aria-hidden="true" style={{ position: 'absolute', insetBlockStart: 9, insetInlineStart: '50%', transform: 'translateX(-50%)', width: 9, height: 9, borderRadius: 999, background: '#08090A' }} />
        )}
        <StatusBar platform={platform} time={time} />
      </div>
      {children}
      <div style={{ position: 'relative', height: peek, borderBlockStart: '1px solid var(--border)' }}>
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5 }} aria-hidden="true">
          <span style={{ height: 10, width: '70%', borderRadius: 5, background: 'var(--surface-active)' }} />
          <span style={{ height: 10, width: '52%', borderRadius: 5, background: 'var(--surface-active)' }} />
          <span style={{ height: 10, width: '60%', borderRadius: 5, background: 'var(--surface-active)' }} />
        </div>
        <div style={{ position: 'absolute', insetInline: 0, insetBlockEnd: 0, height: peek * 0.7, background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />
      </div>
    </div>
  );
}

export { PhoneTop };
