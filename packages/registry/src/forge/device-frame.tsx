import * as React from 'react';

type Device = {
  id: string; label: string; w: number; h: number; radius: number;
  notch?: 'island' | 'punch' | 'none';
};

const DEVICES: Device[] = [
  { id: 'iphone-15-pro',     label: 'iPhone 15 Pro',     w: 393, h: 852, radius: 56, notch: 'island' },
  { id: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max', w: 440, h: 956, radius: 62, notch: 'island' },
  { id: 'iphone-se',         label: 'iPhone SE',         w: 375, h: 667, radius: 30, notch: 'none' },
  { id: 'pixel-8',           label: 'Pixel 8',           w: 412, h: 915, radius: 42, notch: 'punch' },
  { id: 'galaxy-s24',        label: 'Galaxy S24',        w: 360, h: 780, radius: 44, notch: 'punch' },
];

function DeviceFrame({
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

export { DeviceFrame };
