'use client';
// Forge — DeviceFrame. A realistic handset bezel for previewing mobile surfaces at
// true device dimensions, with a header combobox to switch between presets. Composes
// nothing but tokens + the .device-* chrome in ds.css.
import * as React from 'react';

export type Device = {
  id: string; label: string; w: number; h: number; radius: number;
  notch?: 'island' | 'punch' | 'none';
};

// Logical (CSS px) viewport sizes — what a responsive layout actually sees.
export const DEVICES: Device[] = [
  { id: 'iphone-15-pro',     label: 'iPhone 15 Pro',     w: 393, h: 852, radius: 56, notch: 'island' },
  { id: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max', w: 440, h: 956, radius: 62, notch: 'island' },
  { id: 'iphone-se',         label: 'iPhone SE',         w: 375, h: 667, radius: 30, notch: 'none' },
  { id: 'pixel-8',           label: 'Pixel 8',           w: 412, h: 915, radius: 42, notch: 'punch' },
  { id: 'galaxy-s24',        label: 'Galaxy S24',        w: 360, h: 780, radius: 44, notch: 'punch' },
];

export function DeviceFrame({
  children,
  initial = 'iphone-15-pro',
  maxHeight = 600,
  bare = false,
}: {
  children?: React.ReactNode;
  initial?: string;
  maxHeight?: number;
  /** Hide the device picker toolbar (e.g. when used as a static hero visual). */
  bare?: boolean;
}) {
  const [id, setId] = React.useState(initial);
  const dev = DEVICES.find((d) => d.id === id) || DEVICES[0];
  const scale = Math.min(1, maxHeight / dev.h);

  return (
    <div className="device-stage">
      {!bare && (
        <div className="device-toolbar">
          <div className="device-select-wrap">
            <select className="device-select" value={id} onChange={(e) => setId(e.target.value)} aria-label="Preview device">
              {DEVICES.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
            <svg className="device-select-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <span className="device-dims t-mono">{dev.w} × {dev.h}</span>
        </div>
      )}

      <div className="device-scaler" style={{ width: dev.w * scale, height: dev.h * scale }}>
        <div
          className="device"
          style={{ width: dev.w, height: dev.h, borderRadius: dev.radius, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {dev.notch === 'island' && (
            <span className="device-island" aria-hidden="true"><i className="device-cam" /></span>
          )}
          {dev.notch === 'punch' && <span className="device-punch" aria-hidden="true" />}
          <div className="device-screen" style={{ borderRadius: Math.max(0, dev.radius - 10) }}>
            {children}
            <span className="device-home" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Status bar — the OS strip above the app's top navigation. Adapts per platform:
   iOS shows a heavier centred-weight clock with filled signal/wifi and a rounded
   battery; Android uses a lighter clock and outline battery. Icons are drawn here
   (not from the Icons set) so time / signal / wifi / battery stay pixel-aligned.
   ─────────────────────────────────────────────────────────────────────────── */
export type Platform = 'ios' | 'android';
export const platformOf = (deviceId: string): Platform => (deviceId.startsWith('iphone') ? 'ios' : 'android');

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

export function StatusBar({ platform = 'ios', time = '9:41', style }: { platform?: Platform; time?: string; style?: React.CSSProperties }) {
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

/* PhoneTop — shows only the upper slice of a handset (status bar + a top-anchored
   region such as Top Navigation) at a comfortable size, instead of the whole device.
   Rounded top corners + the platform's camera cutout; the content area fades out to
   hint there is more screen below. */
export function PhoneTop({
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
