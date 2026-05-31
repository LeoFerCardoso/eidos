import * as React from 'react';

type Platform = 'ios' | 'android';

function SignalGlyph({ filled }: { filled: boolean }) {
  const bars = [3, 6, 9, 12];
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" aria-hidden="true" style={{ display: 'block' }}>
      {bars.map((h, i) => (
        <rect key={i} x={i * 4.5} y={13 - h} width="3" height={h} rx={filled ? 1 : 0.6}
          fill={filled || i < 3 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1}
          opacity={filled ? 1 : i < 3 ? 1 : 0.45} />
      ))}
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M1.5 4.4a10 10 0 0 1 14 0" />
      <path d="M4.4 7.6a6 6 0 0 1 8.2 0" />
      <circle cx="8.5" cy="11" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryGlyph({ ios }: { ios: boolean }) {
  const level = 0.74;
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true" style={{ display: 'block' }}>
      <rect x="0.6" y="0.6" width="23" height="11.8" rx={ios ? 3.4 : 2.2} fill="none" stroke="currentColor" strokeWidth="1.1" opacity={ios ? 0.42 : 0.6} />
      <rect x={2} y={2} width={(23 - 2.8) * level} height="7.8" rx={ios ? 2 : 1.2} fill="currentColor" />
      <path d={ios ? 'M25.4 4.4v4.2a1.7 1.7 0 0 0 1.1-1.6v-1a1.7 1.7 0 0 0-1.1-1.6Z' : 'M25 4.6h1.2v3.8H25Z'} fill="currentColor" opacity={ios ? 0.55 : 0.7} />
    </svg>
  );
}

function StatusBar({ platform = 'ios', time = '9:41', style }: { platform?: Platform; time?: string; style?: React.CSSProperties }) {
  const ios = platform === 'ios';
  return (
    <div
      style={{
        height: ios ? 44 : 36, flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingInline: ios ? 22 : 16, color: 'var(--fg)', userSelect: 'none', ...style,
      }}
    >
      <span style={{ fontFamily: ios ? 'var(--font-sans)' : 'var(--font-mono)', fontSize: ios ? 15 : 13, fontWeight: ios ? 600 : 500, letterSpacing: ios ? '-0.01em' : 0, fontVariantNumeric: 'tabular-nums' }}>
        {time}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: ios ? 6 : 7 }}>
        <SignalGlyph filled={ios} />
        <WifiGlyph />
        <BatteryGlyph ios={ios} />
      </span>
    </div>
  );
}

export { StatusBar };
