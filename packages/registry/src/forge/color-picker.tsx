import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface ColorPickerProps {
  /** Current hex value (#RRGGBB or #RRGGBBAA). */
  value?: string;
  /** Show the alpha slider and allow 8-char hex. */
  alpha?: boolean;
  /** Curated palette shown below the inputs. Each entry is a hex string. */
  swatches?: string[];
  /** Called on every color change (drag, hex type, swatch click, eyedropper). */
  onChange?: (hex: string) => void;
  /** Forwarded ref — used by ColorInput to detect outside clicks. */
  popRef?: React.RefObject<HTMLDivElement | null>;
  /** Inline style (used for fixed-position placement by ColorInput). */
  style?: React.CSSProperties;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const rnd = (v: number) => Math.round(v);

interface Rgb { r: number; g: number; b: number }

interface RgbA extends Rgb { a: number }

interface Hsv { h: number; s: number; v: number }

interface HsvA extends Hsv { a: number }

function hsvToRgb(h: number, s: number, v: number): Rgb {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let [r, g, b] = [0, 0, 0];
  if (h < 60)       [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else              [r, g, b] = [c, 0, x];
  return { r: rnd((r + m) * 255), g: rnd((g + m) * 255), b: rnd((b + m) * 255) };
}

function rgbToHsv(r: number, g: number, b: number): Hsv {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r)      h = ((g - b) / d) % 6;
    else if (max === g) h = ((b - r) / d) + 2;
    else                h = ((r - g) / d) + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return { h, s, v };
}

function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const h = (n: number) => clamp(rnd(n), 0, 255).toString(16).padStart(2, '0');
  let s = '#' + h(r) + h(g) + h(b);
  if (a !== undefined && a < 1) s += h(a * 255);
  return s.toUpperCase();
}

function hexToRgba(hex: string): RgbA | null {
  if (!hex) return null;
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6 && h.length !== 8) return null;
  if (!/^[0-9a-f]+$/i.test(h)) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function hexToHsva(hex: string): HsvA | null {
  const rgba = hexToRgba(hex);
  if (!rgba) return null;
  const hsv = rgbToHsv(rgba.r, rgba.g, rgba.b);
  return { ...hsv, a: rgba.a };
}

function ColorPicker({
  value = '#FF6B35',
  alpha = false,
  swatches = [],
  onChange,
  popRef,
  style,
}: ColorPickerProps) {
  const initialHsva = hexToHsva(value) ?? { h: 15, s: 0.79, v: 1, a: 1 };
  const [hsv, setHsv] = React.useState<HsvA>(initialHsva);
  // hexEdit holds the raw string while the user is typing in the hex field;
  // empty string means "display the derived hex".
  const [hexEdit, setHexEdit] = React.useState('');

  // Sync internal HSV state when the controlled `value` prop changes from outside
  // (e.g. the parent picks a new color or Storybook Controls updates the prop).
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (value === prevValue.current) return;
    prevValue.current = value;
    // Only sync when the picker is not being dragged (hexEdit is empty).
    if (hexEdit !== '') return;
    const next = hexToHsva(value);
    if (next) setHsv(next);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const currentHex = rgbToHex(rgb.r, rgb.g, rgb.b, alpha ? hsv.a : undefined);
  const currentRgba = `rgba(${rgb.r},${rgb.g},${rgb.b},${hsv.a.toFixed(2)})`;
  const hueRgb = hsvToRgb(hsv.h, 1, 1);
  const hueColor = `rgb(${hueRgb.r},${hueRgb.g},${hueRgb.b})`;

  // Notify parent on every derived hex change.
  React.useEffect(() => {
    onChange?.(currentHex);
  }, [currentHex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── SV drag ────────────────────────────────────────────────────────────────
  const svRef = React.useRef<HTMLDivElement>(null);
  const onSvDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = svRef.current!.getBoundingClientRect();
    const update = (clientX: number, clientY: number) => {
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);
      setHsv(prev => ({ ...prev, s: x, v: 1 - y }));
    };
    update(e.clientX, e.clientY);
    const onMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ── Hue drag ───────────────────────────────────────────────────────────────
  const hueRef = React.useRef<HTMLDivElement>(null);
  const onHueDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = hueRef.current!.getBoundingClientRect();
    const update = (clientX: number) => {
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      setHsv(prev => ({ ...prev, h: x * 360 }));
    };
    update(e.clientX);
    const onMove = (ev: PointerEvent) => update(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ── Alpha drag ─────────────────────────────────────────────────────────────
  const alphaRef = React.useRef<HTMLDivElement>(null);
  const onAlphaDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const rect = alphaRef.current!.getBoundingClientRect();
    const update = (clientX: number) => {
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      setHsv(prev => ({ ...prev, a: x }));
    };
    update(e.clientX);
    const onMove = (ev: PointerEvent) => update(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ── Hex input ──────────────────────────────────────────────────────────────
  const onHexChange = (raw: string) => {
    setHexEdit(raw);
    const rgba = hexToRgba(raw);
    if (rgba) {
      const next = rgbToHsv(rgba.r, rgba.g, rgba.b);
      setHsv({ ...next, a: rgba.a });
    }
  };
  const onHexBlur = () => setHexEdit('');

  // ── RGB inputs ─────────────────────────────────────────────────────────────
  const onRgbChange = (k: 'r' | 'g' | 'b', val: string) => {
    const n = clamp(parseInt(val, 10) || 0, 0, 255);
    const next: Rgb = { r: rgb.r, g: rgb.g, b: rgb.b };
    next[k] = n;
    const h = rgbToHsv(next.r, next.g, next.b);
    setHsv(prev => ({ ...h, a: prev.a }));
  };

  // ── EyeDropper API (Chrome / Edge / Opera) ─────────────────────────────────
  const supportsEyeDropper =
    typeof window !== 'undefined' && 'EyeDropper' in window;

  const onEyedropper = async () => {
    try {
      // EyeDropper is not in the TS DOM lib yet — cast via any.
      const EyeDropperCtor = (window as any).EyeDropper as new () => {
        open(): Promise<{ sRGBHex?: string }>;
      };
      const ed = new EyeDropperCtor();
      const result = await ed.open();
      if (result?.sRGBHex) onHexChange(result.sRGBHex);
    } catch (_) {
      // User cancelled or browser aborted — silently ignore.
    }
  };

  return (
    <div
      ref={popRef as React.RefObject<HTMLDivElement>}
      className="cp-pop"
      style={style}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Color picker"
    >
      {/* Saturation / value area */}
      <div
        ref={svRef}
        className="cp-sv"
        onPointerDown={onSvDown}
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `,
        }}
      >
        <div
          className="cp-sv-thumb"
          style={{
            left: hsv.s * 100 + '%',
            top: (1 - hsv.v) * 100 + '%',
            background: `rgb(${rgb.r},${rgb.g},${rgb.b})`,
          }}
        />
      </div>

      {/* Hue bar + optional alpha bar + eyedropper column */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div ref={hueRef} className="cp-bar hue" onPointerDown={onHueDown}>
            <div
              className="cp-bar-thumb"
              style={{ left: (hsv.h / 360) * 100 + '%', background: hueColor }}
            />
          </div>
          {alpha && (
            <div ref={alphaRef} className="cp-bar alpha" onPointerDown={onAlphaDown}>
              <div
                className="cp-alpha-fill"
                style={{
                  background: `linear-gradient(to right, transparent, rgb(${rgb.r},${rgb.g},${rgb.b}))`,
                }}
              />
              <div
                className="cp-bar-thumb"
                style={{ left: hsv.a * 100 + '%', background: currentRgba }}
              />
            </div>
          )}
        </div>
        {supportsEyeDropper && (
          <button
            type="button"
            className="cp-eyedropper"
            onClick={onEyedropper}
            aria-label="Pick color from screen"
            title="Pick color from screen"
          >
            <Icons.eyedropper size={15} />
          </button>
        )}
      </div>

      {/* Hex + RGB inputs */}
      <div className="cp-row">
        <div className="cp-input-field" style={{ flex: '1 1 auto', minWidth: 0 }}>
          <input
            type="text"
            className="cp-input hex"
            value={hexEdit !== '' ? hexEdit : currentHex}
            onChange={(e) => onHexChange(e.target.value)}
            onBlur={onHexBlur}
            maxLength={alpha ? 9 : 7}
            aria-label="Hex value"
          />
          <div className="cp-input-label">HEX</div>
        </div>
        <div style={{ flex: '0 0 auto', display: 'flex', gap: 4 }}>
          <div className="cp-input-field">
            <input
              type="number" min="0" max="255"
              className="cp-input cp-input-tiny"
              value={rgb.r}
              onChange={(e) => onRgbChange('r', e.target.value)}
              aria-label="Red"
            />
            <div className="cp-input-label">R</div>
          </div>
          <div className="cp-input-field">
            <input
              type="number" min="0" max="255"
              className="cp-input cp-input-tiny"
              value={rgb.g}
              onChange={(e) => onRgbChange('g', e.target.value)}
              aria-label="Green"
            />
            <div className="cp-input-label">G</div>
          </div>
          <div className="cp-input-field">
            <input
              type="number" min="0" max="255"
              className="cp-input cp-input-tiny"
              value={rgb.b}
              onChange={(e) => onRgbChange('b', e.target.value)}
              aria-label="Blue"
            />
            <div className="cp-input-label">B</div>
          </div>
        </div>
      </div>

      {/* Swatch palette */}
      {swatches.length > 0 && (
        <div className="cp-swatches">
          {swatches.map((c, i) => (
            <button
              type="button"
              key={c + i}
              className={'cp-sw' + (currentHex === c.toUpperCase() ? ' is-active' : '')}
              style={{ background: c }}
              onClick={() => onHexChange(c)}
              aria-label={'Pick ' + c}
              title={c}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { ColorPicker };
