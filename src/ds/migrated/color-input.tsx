'use client';
// Forge DS — Components / Color Input.
//
// A trigger that shows the current color as a swatch + hex code, opening
// a popover with a real H/S/V picker — saturation/value square, hue slider,
// optional alpha slider, and hex/RGB inputs that stay in sync.
//
// State lives in HSV space (the only space where the geometry of the picker
// makes sense) — RGB and hex are derived. All math is inline; no library.
import * as React from 'react';
import { Icons, Frame, CodeBlock, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';


const USAGE_CODE = `import { ColorInput } from "@/components/forge/color-input"

export function Demo() {
  const [color, setColor] = React.useState("#FF6B35")
  return <ColorInput value={color} onChange={setColor}/>
}`;


// ─── Color helpers ──────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const round = (v) => Math.round(v);

const hsvToRgb = (h, s, v) => {
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
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255) };
};

const rgbToHsv = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = ((b - r) / d) + 2;
    else h = ((r - g) / d) + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return { h, s, v };
};

const rgbToHex = (r, g, b, a) => {
  const h = (n) => clamp(round(n), 0, 255).toString(16).padStart(2, '0');
  let s = '#' + h(r) + h(g) + h(b);
  if (a !== undefined && a < 1) s += h(a * 255);
  return s.toUpperCase();
};

const hexToRgb = (hex) => {
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
};

// ─── ColorPicker popover content ────────────────────────────────────────
// Drives state in HSV{h,s,v,a}. Surfaces hex / RGB derived.
const ColorPicker = ({ value='#FF6B35', alpha=false, swatches=[], onChange, onRequestClose, popRef, style }) => {
  const initial = hexToRgb(value) || { r: 255, g: 107, b: 53, a: 1 };
  const initialHsv = rgbToHsv(initial.r, initial.g, initial.b);
  const [hsv, setHsv] = React.useState({ ...initialHsv, a: initial.a });
  const [hexEdit, setHexEdit] = React.useState('');

  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const currentHex = rgbToHex(rgb.r, rgb.g, rgb.b, alpha ? hsv.a : undefined);
  const currentRgba = `rgba(${rgb.r},${rgb.g},${rgb.b},${hsv.a.toFixed(2)})`;
  const hueRgb = hsvToRgb(hsv.h, 1, 1);
  const hueColor = `rgb(${hueRgb.r},${hueRgb.g},${hueRgb.b})`;

  React.useEffect(() => {
    if (onChange) onChange(currentHex);
  }, [currentHex, onChange]); // eslint-disable-line

  // SV drag
  const svRef = React.useRef(null);
  const onSvDown = (e) => {
    e.preventDefault();
    const rect = svRef.current.getBoundingClientRect();
    const update = (clientX, clientY) => {
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);
      setHsv(prev => ({ ...prev, s: x, v: 1 - y }));
    };
    update(e.clientX, e.clientY);
    const onMove = (ev) => update(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Hue drag
  const hueRef = React.useRef(null);
  const onHueDown = (e) => {
    e.preventDefault();
    const rect = hueRef.current.getBoundingClientRect();
    const update = (clientX) => {
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      setHsv(prev => ({ ...prev, h: x * 360 }));
    };
    update(e.clientX);
    const onMove = (ev) => update(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Alpha drag
  const alphaRef = React.useRef(null);
  const onAlphaDown = (e) => {
    e.preventDefault();
    const rect = alphaRef.current.getBoundingClientRect();
    const update = (clientX) => {
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      setHsv(prev => ({ ...prev, a: x }));
    };
    update(e.clientX);
    const onMove = (ev) => update(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // ─── Keyboard control of the picker geometry ──────────────────────────
  // The SV square and the hue/alpha bars are role="slider" so arrows step
  // them; the whole picker is reachable and operable without a pointer.
  // Big-step (×10) on Shift, jump to ends on Home/End, like a native range.
  const onSvKey = (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    let { s, v } = hsv;
    if (e.key === 'ArrowRight')      s = clamp(s + step, 0, 1);
    else if (e.key === 'ArrowLeft')  s = clamp(s - step, 0, 1);
    else if (e.key === 'ArrowUp')    v = clamp(v + step, 0, 1);
    else if (e.key === 'ArrowDown')  v = clamp(v - step, 0, 1);
    else return;
    e.preventDefault();
    setHsv(prev => ({ ...prev, s, v }));
  };
  const onHueKey = (e) => {
    const step = e.shiftKey ? 30 : 4;
    let h = hsv.h;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')        h = (h + step) % 360;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')  h = (h - step + 360) % 360;
    else if (e.key === 'Home')                                h = 0;
    else if (e.key === 'End')                                 h = 359;
    else return;
    e.preventDefault();
    setHsv(prev => ({ ...prev, h }));
  };
  const onAlphaKey = (e) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    let a = hsv.a;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')        a = clamp(a + step, 0, 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')  a = clamp(a - step, 0, 1);
    else if (e.key === 'Home')                                a = 0;
    else if (e.key === 'End')                                 a = 1;
    else return;
    e.preventDefault();
    setHsv(prev => ({ ...prev, a }));
  };

  // Focus management: move focus into the picker geometry on open so a
  // keyboard user lands somewhere operable; Esc closes + returns to trigger.
  React.useEffect(() => {
    svRef.current?.focus();
  }, []);
  const onPopKey = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); onRequestClose && onRequestClose(); }
  };

  // Hex input
  const onHexChange = (raw) => {
    setHexEdit(raw);
    const parsed = hexToRgb(raw);
    if (parsed) {
      const next = rgbToHsv(parsed.r, parsed.g, parsed.b);
      setHsv({ ...next, a: parsed.a });
    }
  };
  const onHexBlur = () => setHexEdit('');

  // RGB inputs
  const onRgbChange = (k, val) => {
    const n = clamp(parseInt(val, 10) || 0, 0, 255);
    const next = { r: rgb.r, g: rgb.g, b: rgb.b };
    next[k] = n;
    const h = rgbToHsv(next.r, next.g, next.b);
    setHsv(prev => ({ ...h, a: prev.a }));
  };

  // EyeDropper API (Chrome / Edge)
  const supportsEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;
  const onEyedropper = async () => {
    try {
      const EyeDropperCtor = (window as any).EyeDropper as new () => { open(): Promise<{ sRGBHex?: string }> };
      const ed = new EyeDropperCtor();
      const r = await ed.open();
      if (r && r.sRGBHex) onHexChange(r.sRGBHex);
    } catch (e) { /* user cancelled */ }
  };

  return (
    <div ref={popRef} className="cp-pop" style={style} onClick={(e) => e.stopPropagation()} onKeyDown={onPopKey} role="dialog" aria-label="Color picker" aria-modal="false">
      {/* SV area — a 2D slider: → saturation, ↑ value */}
      <div
        ref={svRef}
        className="cp-sv"
        onPointerDown={onSvDown}
        onKeyDown={onSvKey}
        tabIndex={0}
        role="slider"
        aria-label="Saturation and value"
        aria-valuetext={`Saturation ${round(hsv.s * 100)}%, value ${round(hsv.v * 100)}%`}
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `
        }}
      >
        <div
          className="cp-sv-thumb"
          style={{
            left: (hsv.s * 100) + '%',
            top: ((1 - hsv.v) * 100) + '%',
            background: `rgb(${rgb.r},${rgb.g},${rgb.b})`
          }}
        />
      </div>

      {/* Hue + alpha bars + eyedropper */}
      <div style={{display:'flex', gap: 8, alignItems:'center'}}>
        <div style={{flex: 1, display:'flex', flexDirection:'column', gap: 8}}>
          <div
            ref={hueRef} className="cp-bar hue"
            onPointerDown={onHueDown} onKeyDown={onHueKey}
            tabIndex={0} role="slider"
            aria-label="Hue"
            aria-valuemin={0} aria-valuemax={360} aria-valuenow={round(hsv.h)}
            aria-valuetext={`${round(hsv.h)} degrees`}
          >
            <div className="cp-bar-thumb" style={{ left: (hsv.h / 360) * 100 + '%', background: hueColor }}/>
          </div>
          {alpha && (
            <div
              ref={alphaRef} className="cp-bar alpha"
              onPointerDown={onAlphaDown} onKeyDown={onAlphaKey}
              tabIndex={0} role="slider"
              aria-label="Alpha"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={round(hsv.a * 100)}
              aria-valuetext={`${round(hsv.a * 100)}% opacity`}
            >
              <div className="cp-alpha-fill" style={{background: `linear-gradient(to right, transparent, rgb(${rgb.r},${rgb.g},${rgb.b}))`}}/>
              <div className="cp-bar-thumb" style={{ left: hsv.a * 100 + '%', background: currentRgba }}/>
            </div>
          )}
        </div>
        {supportsEyeDropper && (
          <button type="button" className="cp-eyedropper" onClick={onEyedropper} aria-label="Pick color from screen" title="Pick color from screen">
            <Icons.eyedropper size={15}/>
          </button>
        )}
      </div>

      {/* Hex + RGB inputs */}
      <div className="cp-row">
        <div className="cp-input-field" style={{flex: '1 1 auto', minWidth: 0}}>
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
        <div style={{flex: '0 0 auto', display:'flex', gap: 4}}>
          <div className="cp-input-field">
            <input type="number" min="0" max="255" className="cp-input cp-input-tiny" value={rgb.r} onChange={(e)=>onRgbChange('r', e.target.value)} aria-label="Red"/>
            <div className="cp-input-label">R</div>
          </div>
          <div className="cp-input-field">
            <input type="number" min="0" max="255" className="cp-input cp-input-tiny" value={rgb.g} onChange={(e)=>onRgbChange('g', e.target.value)} aria-label="Green"/>
            <div className="cp-input-label">G</div>
          </div>
          <div className="cp-input-field">
            <input type="number" min="0" max="255" className="cp-input cp-input-tiny" value={rgb.b} onChange={(e)=>onRgbChange('b', e.target.value)} aria-label="Blue"/>
            <div className="cp-input-label">B</div>
          </div>
        </div>
      </div>

      {/* Swatch palette */}
      {swatches.length > 0 && (
        <div className="cp-swatches">
          {swatches.map((c, i) => (
            <button
              type="button" key={c + i}
              className={'cp-sw' + (currentHex === c.toUpperCase() ? ' is-active' : '')}
              style={{background: c}}
              onClick={() => onHexChange(c)}
              aria-label={'Pick ' + c}
              title={c}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ColorInput — trigger that opens the picker in a popover ────────────
// Popover uses position:fixed anchored from the trigger's bounding rect so it
// escapes ancestor overflow:hidden (e.g. .ds-frame). useLayoutEffect runs after
// DOM commit but before paint — no top-left flash on open.
const ColorInput = ({ value='#FF6B35', onChange, alpha=false, swatches=[], size='md', disabled }: {
  value?: string;
  onChange?: (hex: string) => void;
  alpha?: boolean;
  swatches?: string[];
  size?: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState(value);
  const [pos, setPos] = React.useState(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (!open) { setPos(null); return; }
    const place = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  // Close + return focus to the trigger, so a keyboard user is never stranded
  // in a closed popover (the dialog has no tab-stop of its own once gone).
  const close = React.useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') close(true); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onEsc); };
  }, [open, close]);

  const handleChange = (next) => { setVal(next); onChange && onChange(next); };
  return (
    <div style={{display:'inline-block'}}>
      <button
        ref={triggerRef}
        type="button"
        className={'cp-trigger ' + size}
        onClick={() => !disabled && setOpen(o => !o)}
        aria-haspopup="dialog" aria-expanded={open}
        disabled={disabled}
        style={disabled ? { opacity: 0.5, cursor:'not-allowed' } : undefined}
      >
        <span className="cp-swatch"><span style={{background: val}}/></span>
        <span className="cp-trigger-divider"/>
        <span className="cp-trigger-text">{val}</span>
        <span className="cp-trigger-arrow"><Icons.chevronDown size={13}/></span>
      </button>
      {open && pos && (
        <ColorPicker
          popRef={popRef}
          style={{ top: pos.top, left: pos.left }}
          value={val}
          alpha={alpha}
          swatches={swatches}
          onChange={handleChange}
          onRequestClose={() => close(true)}
        />
      )}
    </div>
  );
};

const CODE_BASIC = [
  `const [color, setColor] = React.useState("#FF6B35")`,
  ``,
  `<ColorInput value={color} onChange={setColor}/>`,
  ``,
  `// Click the trigger to open the picker.`,
  `// Drag the SV area, the hue bar, or type a hex value.`,
].join('\n');

const CODE_SWATCHES = [
  `<ColorInput`,
  `  value={color}`,
  `  onChange={setColor}`,
  `  swatches={[`,
  `    "#FF6B35", "#F8B4B4", "#FACC15",`,
  `    "#4ADE80", "#60A5FA", "#A78BFA",`,
  `    "#08090A", "#FFFFFF",`,
  `  ]}`,
  `/>`,
].join('\n');

// Brand swatches
const BRAND_SWATCHES = [
  '#FF6B35', '#F87171', '#FACC15', '#4ADE80',
  '#60A5FA', '#A78BFA', '#F472B6', '#08090A',
  '#1F2024', '#F4F4F5', '#FFFFFF', '#52525B',
];

const TAILWIND_SWATCHES = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
];

// ─── Page ───────────────────────────────────────────────────────────────
export default function ColorPage() {
  const [c1, setC1] = React.useState('#FF6B35');
  const [c2, setC2] = React.useState('#60A5FA');
  const [c3, setC3] = React.useState('#FF6B35E6');

  return (
    <Section
      id="color-input"
      num="14"
      title="Color Input"
      desc="A swatch + hex code that opens a popover with a real H/S/V picker. Drag to pick visually, or type a hex value directly. Optional alpha channel and curated swatches."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('color-input')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>color-input.tsx</Mono> with the H/S/V picker, hue + alpha bars, hex / RGB inputs, and a swatch palette slot — all in HSV space so the geometry stays intuitive.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <ColorInput value={c1} onChange={setC1}/>
      </Frame>

      {/* 3. EXAMPLES */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <p style={{color:'var(--fg-muted)', maxWidth:'72ch', marginBottom: 22}}>
        State lives in HSV — the only space where the saturation/value square and hue slider have an intuitive 2D / 1D mapping. Hex and RGB are derived: typing into the hex field updates the geometry, dragging the geometry updates the hex field, both stay in sync. Alpha is optional; eyedropper appears when the browser's <Mono>EyeDropper</Mono> API is available (Chrome / Edge / Opera).
      </p>

      {/* Basic */}
      <SubHead meta="default">Basic</SubHead>
      <Frame label="A trigger that opens the picker — Esc or click-away to close" code={CODE_BASIC}>
        <div className="ds-grid cols-2" style={{width:'100%'}}>
          <div className="in-field">
            <label className="in-label">Brand colour</label>
            <ColorInput value={c1} onChange={setC1}/>
            <div className="in-help">Current value: <Mono>{c1}</Mono></div>
          </div>
          <div className="in-field">
            <label className="in-label">Accent</label>
            <ColorInput value={c2} onChange={setC2}/>
          </div>
        </div>
      </Frame>

      {/* With swatches */}
      <SubHead meta="curated palette">With swatches</SubHead>
      <Frame label="Pin the brand palette below the inputs; clicking sets the colour exactly" code={CODE_SWATCHES}>
        <div className="ds-grid cols-2" style={{width:'100%'}}>
          <div className="in-field">
            <label className="in-label">Brand picker</label>
            <ColorInput value={c1} onChange={setC1} swatches={BRAND_SWATCHES}/>
            <div className="in-help">12 brand colours below the picker — click to snap.</div>
          </div>
          <div className="in-field">
            <label className="in-label">Tailwind 500</label>
            <ColorInput value="#3B82F6" onChange={()=>{}} swatches={TAILWIND_SWATCHES}/>
            <div className="in-help">Curated set of all Tailwind hue-500 colours.</div>
          </div>
        </div>
      </Frame>
      <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
        Swatches are how you constrain a free-form picker — surface the palette the user <em>should</em> reach for, while still allowing arbitrary colours via the hex field. For pure brand-only pickers, drop the picker entirely and use a <a href="/select" style={{color:'var(--ember)'}}>Select</a> with named options.
      </p>

      {/* With alpha */}
      <SubHead meta="alpha · transparency">With alpha</SubHead>
      <Frame label="Opt-in alpha bar for transparent fills; hex extends to 8 chars">
        <div className="ds-grid cols-2" style={{width:'100%'}}>
          <div className="in-field">
            <label className="in-label">Background tint</label>
            <ColorInput value={c3} onChange={setC3} alpha swatches={BRAND_SWATCHES}/>
            <div className="in-help">Drag the second bar to control opacity. Hex format extends to <Mono>#RRGGBBAA</Mono>.</div>
          </div>
          <div className="in-field">
            <label className="in-label">Preview</label>
            <div style={{
              width: '100%', height: 80,
              borderRadius: 'var(--radius-xl)',
              backgroundImage: `
                linear-gradient(${c3}, ${c3}),
                linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%),
                linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.08) 75%)
              `,
              backgroundSize: '100% 100%, 16px 16px, 16px 16px',
              backgroundPosition: '0 0, 0 0, 8px 8px',
              border: '1px solid var(--border)',
            }}/>
          </div>
        </div>
      </Frame>

      {/* Sizes */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame label="Match the surrounding form chrome">
        <div style={{display:'flex', alignItems:'center', gap: 14, width:'100%', flexWrap:'wrap'}}>
          <ColorInput value={c1} onChange={setC1} size="sm"/>
          <ColorInput value={c1} onChange={setC1} size="md"/>
          <ColorInput value={c1} onChange={setC1} size="lg"/>
        </div>
      </Frame>

      {/* Native fallback */}
      <SubHead meta="native fallback · type=color">Native input</SubHead>
      <Frame label="When you don't need swatches or alpha — the OS-provided picker is one line of code">
        <div className="in-field" style={{width:'100%', maxWidth: 360}}>
          <label className="in-label" htmlFor="nat">OS-native picker</label>
          <input
            id="nat" type="color" defaultValue="#FF6B35"
            style={{
              width: 80, height: 36, padding: 2,
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              background: 'var(--surface)',
              cursor: 'pointer'
            }}
          />
          <div className="in-help">Hands off to macOS Colors / Windows ColorPicker. No customisation, no consistency, no swatches — but free.</div>
        </div>
      </Frame>
      <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
        Reach for native when colour is a one-off setting and you don't care about brand-style consistency. Reach for our picker when colour is a primary action (theme builder, design tool, branded surface customiser) and you want palette governance.
      </p>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame label="Default · disabled — focus ring lives on the trigger">
        <div className="ds-grid cols-2" style={{width:'100%'}}>
          <div className="in-field">
            <label className="in-label">Default</label>
            <ColorInput value={c1} onChange={setC1}/>
          </div>
          <div className="in-field">
            <label className="in-label">Disabled</label>
            <ColorInput value={c1} onChange={()=>{}} disabled/>
          </div>
        </div>
      </Frame>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <dl style={{margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 8, alignItems: 'baseline'}}>
            <dt><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Open the picker from the trigger.</dd>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Step through SV square → hue → alpha → hex → R/G/B → eyedropper → swatches.</dd>
            <dt><kbd className="kbd">←</kbd><kbd className="kbd">→</kbd><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Move the focused slider; on the SV square ←→ is saturation and ↑↓ is value.</dd>
            <dt><kbd className="kbd">Shift</kbd> + arrow</dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Coarse step for fast travel across hue / alpha / SV.</dd>
            <dt><kbd className="kbd">Home</kbd> <kbd className="kbd">End</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Jump the hue or alpha slider to its minimum / maximum.</dd>
            <dt><kbd className="kbd">Esc</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Close the popover and return focus to the trigger; a click outside also dismisses it.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The trigger carries <Mono>aria-haspopup="dialog"</Mono> with <Mono>aria-expanded</Mono>; the popover is <Mono>role="dialog"</Mono> labelled "Color picker". The SV square, hue, and alpha bars are each <Mono>role="slider"</Mono> with a spoken <Mono>aria-valuetext</Mono> ("Saturation 64%, value 90%", "212 degrees", "40% opacity"); the hex and R/G/B inputs have explicit labels, swatches announce "Pick #RRGGBB", and the eyedropper is labelled "Pick color from screen".</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Opening moves focus into the SV square; <kbd className="kbd">Esc</kbd> returns it to the trigger so a keyboard user is never stranded. Trigger, sliders, inputs, eyedropper, and swatches all show the ember focus ring (<Mono>--ring</Mono>); the active swatch adds a 2px ember outline so selection is shape-plus-colour. The thumbs carry a theme-aware halo so they read on any fill, and the trigger always shows the hex text — value is never colour-only.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Only short border/box-shadow transitions and a swatch hover scale animate. Under prefers-reduced-motion the global guard reduces them to instant; the picker geometry updates synchronously with input, never via animation.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — popover anchors to the trailing edge of the trigger; hex stays LTR (Latin)">
        <div dir="rtl" className="in-field" style={{width:'100%'}}>
          <label className="in-label">لون العلامة (Brand colour)</label>
          <ColorInput value={c1} onChange={setC1} swatches={BRAND_SWATCHES}/>
        </div>
      </Frame>
      <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
        The trigger uses <Mono>inset-inline-start: 0</Mono> for the popover so it anchors visually under the trigger regardless of direction. Hex codes stay LTR — they're not language, they're identifiers.
      </p>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Trigger · popover · SV · hue · alpha · hex / RGB · swatches</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 260}} aria-hidden="true">
              <ColorInput value={c1} onChange={setC1} alpha={false} swatches={BRAND_SWATCHES}/>
              {/* Leader lines */}
              <span className="lead v" style={{top: -22, left: '50%', height: 18}}/>
              <span className="lead h" style={{top: 16, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 44, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 72, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 16, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 44, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 72, left: -28, width: 24}}/>
              {/* Numbered pins overlaid */}
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 8, right: -52}}>2</div>
              <div className="pin" style={{top: 36, right: -52}}>3</div>
              <div className="pin" style={{top: 64, right: -52}}>4</div>
              <div className="pin" style={{top: 8, left: -52}}>5</div>
              <div className="pin" style={{top: 36, left: -52}}>6</div>
              <div className="pin" style={{top: 64, left: -52}}>7</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Trigger.</b> Checker-pattern swatch + hex code + chevron, opens the picker.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>SV area.</b> Drag the dot. Horizontal = saturation, vertical = value (brightness).</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Hue bar.</b> Full rainbow strip; the SV area's right edge tracks this.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Alpha bar.</b> Opt-in opacity slider for transparent fills.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Hex / RGB.</b> Type or paste; geometry updates live.</span>
            <span className="num">6</span><span><b style={{color:'var(--fg)'}}>Swatches.</b> Curated palette below the inputs; click to set.</span>
            <span className="num">7</span><span><b style={{color:'var(--fg)'}}>Eyedropper.</b> <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>EyeDropper</code> API on supported browsers.</span>
          </div>
        </div>
      </div>

      {/* Decision matrix */}
      <SubHead meta="when to reach for what">When to use</SubHead>
      <Frame label="Pick the right primitive — Color Input vs Select vs native input">
        <div className="ds-grid cols-3" style={{width:'100%'}}>
          <div className="surface" style={{padding: 14}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Color Input</div>
            <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
              Free-form colour entry with a curated palette. Theme builders, brand customisers, design tools.
            </p>
          </div>
          <div className="surface" style={{padding: 14}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Select with swatches</div>
            <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
              Fixed list of named colours — "Slate", "Ember", "Forest". When a hex value isn't the user's mental model.
            </p>
          </div>
          <div className="surface" style={{padding: 14}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Native <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>{`<input type="color">`}</code></div>
            <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
              Throw-away one-off colour picks where consistency doesn't matter and you want zero JS.
            </p>
          </div>
        </div>
      </Frame>

      {/* Do / Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show a checker pattern under transparent values</div>
          <div className="body">
            <button type="button" className="cp-trigger" style={{cursor:'default'}} tabIndex={-1}>
              <span className="cp-swatch"><span style={{background:'rgba(255,107,53,0.4)'}}/></span>
              <span className="cp-trigger-divider"/>
              <span className="cp-trigger-text">#FF6B3566</span>
              <span className="cp-trigger-arrow"><Icons.chevronDown size={13}/></span>
            </button>
          </div>
          <div className="note">User can't tell <Mono>#FFFFFF00</Mono> from <Mono>#FFFFFF</Mono> on a white surface. The checker is the universal "this has alpha" signal.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — show alpha when the value can't have it</div>
          <div className="body">
            <button type="button" className="cp-trigger" style={{cursor:'default'}} tabIndex={-1}>
              <span className="cp-swatch" style={{backgroundImage:'none', boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.15)'}}>
                <span style={{background:'rgba(255,107,53,0.4)'}}/>
              </span>
              <span className="cp-trigger-divider"/>
              <span className="cp-trigger-text">#FF6B3566</span>
              <span className="cp-trigger-arrow"><Icons.chevronDown size={13}/></span>
            </button>
          </div>
          <div className="note">If the consumer stores 0–255 RGB only, hide the alpha bar entirely. Don't let the user set a value that gets silently truncated.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pin a curated palette as swatches</div>
          <div className="body" style={{flexDirection:'column', gap: 10}}>
            <button type="button" className="cp-trigger" style={{cursor:'default'}} tabIndex={-1}>
              <span className="cp-swatch"><span style={{background:'#FF6B35'}}/></span>
              <span className="cp-trigger-divider"/>
              <span className="cp-trigger-text">#FF6B35</span>
              <span className="cp-trigger-arrow"><Icons.chevronDown size={13}/></span>
            </button>
            <div style={{display:'flex', gap: 6}}>
              {['#FF6B35','#0A0A0B','#FAFAFA','#3B82F6','#22C55E','#F87171'].map(c => (
                <span key={c} style={{width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: c, border:'1px solid rgba(0,0,0,0.15)'}}/>
              ))}
            </div>
          </div>
          <div className="note">Picker enables freedom; swatches enable governance. Most users pick a brand swatch — the picker is there for edge cases.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — default to a wide-open spectrum</div>
          <div className="body" style={{flexDirection:'column', gap: 10}}>
            <button type="button" className="cp-trigger" style={{cursor:'default'}} tabIndex={-1}>
              <span className="cp-swatch"><span style={{background:'#9F4DBE'}}/></span>
              <span className="cp-trigger-divider"/>
              <span className="cp-trigger-text">#9F4DBE</span>
              <span className="cp-trigger-arrow"><Icons.chevronDown size={13}/></span>
            </button>
            <div style={{fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-faint)'}}>(no swatches — anything goes)</div>
          </div>
          <div className="note">Without swatches, every user invents their own palette. The product UI becomes a paint shop. Always seed.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show the hex code on the trigger</div>
          <div className="body">
            <button type="button" className="cp-trigger" style={{cursor:'default'}} tabIndex={-1}>
              <span className="cp-swatch"><span style={{background:'#3B82F6'}}/></span>
              <span className="cp-trigger-divider"/>
              <span className="cp-trigger-text">#3B82F6</span>
              <span className="cp-trigger-arrow"><Icons.chevronDown size={13}/></span>
            </button>
          </div>
          <div className="note">Swatch alone says "blue-ish". Hex says <Mono>#3B82F6</Mono> exactly — copy-paste in 1 second instead of 10.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — show only the swatch with no value</div>
          <div className="body">
            <button type="button" className="cp-trigger" style={{cursor:'default', padding: '0 8px'}} tabIndex={-1}>
              <span className="cp-swatch"><span style={{background:'#3B82F6'}}/></span>
              <span className="cp-trigger-arrow" style={{marginLeft: 4}}><Icons.chevronDown size={13}/></span>
            </button>
          </div>
          <div className="note">Forces user to open the picker just to read the value. Costly for any copy-paste / cross-tool workflow.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="ColorInputProps">API reference</SubHead>
      <AutoPropsTable component="ColorInput" label="<ColorInput />"/>
    </Section>
  );
}
