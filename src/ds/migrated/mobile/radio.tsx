'use client';
// Eidos Mobile — Radio. Single-select from a mutually exclusive group,
// rendered as inset list rows. Two idioms: iOS-style trailing checkmark
// (clean, less visual noise), and leading radio-dot (more explicit affordance
// for dense option sets). States: selected, unselected, disabled.
// The full row is the touch target; the radio glyph is decorative only.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Primitives ───────────────────────────────────────────────────────────────

/** Leading radio-dot glyph (outer ring + inner fill). */
function RadioDot({ selected, disabled }: { selected: boolean; disabled?: boolean }) {
  const color = disabled ? 'var(--fg-faint)' : selected ? 'var(--accent)' : 'var(--border-strong)';
  return (
    <span
      aria-hidden="true"
      style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: 'var(--radius-full)',
        border: `2px solid ${color}`,
        display: 'grid',
        placeItems: 'center',
        transition: 'border-color var(--dur-fast) var(--ease)',
      }}
    >
      {selected && (
        <span style={{
          width: 10,
          height: 10,
          borderRadius: 'var(--radius-full)',
          background: disabled ? 'var(--fg-faint)' : 'var(--accent)',
          transition: 'transform var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)',
        }} />
      )}
    </span>
  );
}

// ── Leading-dot row ──────────────────────────────────────────────────────────

function RadioRow({
  label,
  sublabel,
  selected = false,
  disabled = false,
  onSelect,
  tabIndex,
  rowRef,
  onKeyDown,
}: {
  label: string;
  sublabel?: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  /** Roving-tabindex value supplied by the enclosing radiogroup (defaults to non-roving 0/-1). */
  tabIndex?: number;
  rowRef?: React.Ref<HTMLDivElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      ref={rowRef}
      className="focus-ring"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      tabIndex={tabIndex ?? (disabled ? -1 : 0)}
      onClick={() => !disabled && onSelect?.()}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !disabled) { e.preventDefault(); onSelect?.(); }
        onKeyDown?.(e);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 44,
        paddingInline: 16,
        paddingBlock: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        background: selected ? 'var(--ember-softer)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease)',
      }}
    >
      <RadioDot selected={selected} disabled={disabled} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: disabled ? 'var(--fg-muted)' : 'var(--fg)', lineHeight: 1.35 }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.4 }}>{sublabel}</span>
        )}
      </span>
    </div>
  );
}

// ── Trailing-checkmark row (iOS inset list idiom) ────────────────────────────

function TrailingCheckRow({
  label,
  sublabel,
  selected = false,
  disabled = false,
  onSelect,
  tabIndex,
  rowRef,
  onKeyDown,
}: {
  label: string;
  sublabel?: string;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  /** Roving-tabindex value supplied by the enclosing radiogroup (defaults to non-roving 0/-1). */
  tabIndex?: number;
  rowRef?: React.Ref<HTMLDivElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      ref={rowRef}
      className="focus-ring"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      tabIndex={tabIndex ?? (disabled ? -1 : 0)}
      onClick={() => !disabled && onSelect?.()}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !disabled) { e.preventDefault(); onSelect?.(); }
        onKeyDown?.(e);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 44,
        paddingInline: 16,
        paddingBlock: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        background: 'transparent',
      }}
    >
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: disabled ? 'var(--fg-muted)' : 'var(--fg)', lineHeight: 1.35 }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.4 }}>{sublabel}</span>
        )}
      </span>
      {selected && !disabled && (
        <Icons.check size={18} color="var(--accent)" strokeWidth={2.5} />
      )}
      {selected && disabled && (
        <Icons.check size={18} color="var(--fg-faint)" strokeWidth={2.5} />
      )}
    </div>
  );
}

// ── Roving-tabindex + Arrow-key navigation ──────────────────────────────────
// A WAI-ARIA radiogroup is a single tab stop: only one row holds tabIndex=0
// (the selected one, or the first enabled row if none is selected); the rest
// are -1. Arrow Up/Left moves to the previous enabled option, Arrow Down/Right
// to the next, wrapping around — and selecting on arrival, per the radio
// pattern. Home/End jump to the first/last enabled option.

/** Returns the roving tabIndex for a row and a keydown handler that drives Arrow/Home/End selection. */
function useRovingRadio(
  ids: string[],
  selected: string,
  setSelected: (id: string) => void,
  disabledIds: Set<string> = new Set(),
) {
  const enabled = ids.filter((id) => !disabledIds.has(id));
  const refs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const setRef = React.useCallback((id: string) => (el: HTMLDivElement | null) => { refs.current[id] = el; }, []);

  // The single tab stop: the selected row if enabled, else the first enabled row.
  const tabStop = !disabledIds.has(selected) ? selected : enabled[0];

  const move = React.useCallback((id: string) => {
    setSelected(id);
    // Focus follows selection so the active row is the one screen readers announce.
    requestAnimationFrame(() => refs.current[id]?.focus());
  }, [setSelected]);

  const onKeyDown = React.useCallback((current: string) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (enabled.length === 0) return;
    const i = enabled.indexOf(current);
    const idx = i === -1 ? 0 : i;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      move(enabled[(idx + 1) % enabled.length]);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      move(enabled[(idx - 1 + enabled.length) % enabled.length]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      move(enabled[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      move(enabled[enabled.length - 1]);
    }
  }, [enabled, move]);

  return {
    /** Roving tabIndex for a given option id (0 for the tab stop, -1 otherwise). */
    tabIndexFor: (id: string) => (id === tabStop ? 0 : -1),
    setRef,
    onKeyDown,
  };
}

// ── Screen demo ──────────────────────────────────────────────────────────────

// Each region carries the consequence of choosing it — availability-zone
// count and a baseline monthly compute price. The screen reads these back so
// the radio shows the *effect* of the choice, not just the choice.
const REGIONS = [
  { id: 'us-east-1', label: 'US East (N. Virginia)',  sub: 'us-east-1', azs: 4, usdMo: 412 },
  { id: 'eu-west-1', label: 'EU West (Ireland)',       sub: 'eu-west-1', azs: 3, usdMo: 458 },
  { id: 'ap-south-1', label: 'Asia Pacific (Mumbai)',  sub: 'ap-south-1', azs: 3, usdMo: 391 },
  { id: 'sa-east-1', label: 'South America (São Paulo)', sub: 'sa-east-1', azs: 3, usdMo: 537 },
];

const CHEAPEST_USD = Math.min(...REGIONS.map((r) => r.usdMo));

const ENVS = [
  { id: 'production', label: 'Production',   sub: 'api.forge.dev' },
  { id: 'staging',    label: 'Staging',      sub: 'staging.forge.dev' },
  { id: 'preview',    label: 'Preview',      sub: 'pr-*.forge.dev' },
];

function RadioScreen() {
  const [region, setRegion] = React.useState('us-east-1');
  const [env, setEnv]       = React.useState('staging');
  const regionRoving = useRovingRadio(REGIONS.map((r) => r.id), region, setRegion);
  const envRoving    = useRovingRadio(ENVS.map((e) => e.id), env, setEnv);

  // The follow-on action: the selection drives a live deploy summary.
  const picked = REGIONS.find((r) => r.id === region)!;
  const delta = picked.usdMo - CHEAPEST_USD;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflowY: 'auto' }}>
      {/* Nav */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', paddingInline: 16, borderBlockEnd: '1px solid var(--border)', flexShrink: 0, marginBlockStart: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Deploy settings</span>
      </div>

      {/* Section: region (leading dot) */}
      <div style={{ paddingInline: 16, paddingBlock: '10px 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Region</span>
      </div>
      <div role="radiogroup" aria-label="Region" style={{ borderBlockStart: '1px solid var(--border)', borderBlockEnd: '1px solid var(--border)', background: 'var(--surface)' }}>
        {REGIONS.map((r, i) => (
          <div key={r.id}>
            <RadioRow
              label={r.label}
              sublabel={`${r.sub} · ${r.azs} AZs`}
              selected={region === r.id}
              onSelect={() => setRegion(r.id)}
              tabIndex={regionRoving.tabIndexFor(r.id)}
              rowRef={regionRoving.setRef(r.id)}
              onKeyDown={regionRoving.onKeyDown(r.id)}
            />
            {i < REGIONS.length - 1 && (
              <div style={{ marginInlineStart: 50, height: 1, background: 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Section: environment (trailing checkmark idiom) */}
      <div style={{ paddingInline: 16, paddingBlock: '14px 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Environment</span>
      </div>
      <div role="radiogroup" aria-label="Environment" style={{ borderBlockStart: '1px solid var(--border)', borderBlockEnd: '1px solid var(--border)', background: 'var(--surface)' }}>
        {ENVS.map((e, i) => (
          <div key={e.id}>
            <TrailingCheckRow
              label={e.label}
              sublabel={e.sub}
              selected={env === e.id}
              onSelect={() => setEnv(e.id)}
              tabIndex={envRoving.tabIndexFor(e.id)}
              rowRef={envRoving.setRef(e.id)}
              onKeyDown={envRoving.onKeyDown(e.id)}
            />
            {i < ENVS.length - 1 && (
              <div style={{ marginInlineStart: 16, height: 1, background: 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Follow-on: the region choice drives a live deploy summary. The
          control demonstrates consequence — AZ resilience + a cost delta —
          not just a checked state. */}
      <div style={{ paddingInline: 16, paddingBlock: '18px 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Deploy summary</span>
      </div>
      <div style={{ marginInline: 16, marginBlockEnd: 16, padding: 14, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
            <Icons.server size={15} color="var(--fg-muted)" />
            Spread across
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)' }}>
            {picked.azs} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--fg-muted)' }}>zones</span>
          </span>
        </div>
        <div style={{ height: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Est. monthly compute</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)' }}>
              ${picked.usdMo}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: 'var(--text-xs)',
                color: delta === 0 ? 'var(--fg-muted)' : 'var(--ember-text)',
                background: delta === 0 ? 'transparent' : 'var(--ember-soft)',
                border: delta === 0 ? '1px solid var(--border)' : '1px solid var(--ember-border)',
                borderRadius: 'var(--radius-full)',
                paddingInline: 8,
                paddingBlock: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {delta === 0 ? 'lowest' : `+$${delta}/mo vs cheapest`}
            </span>
          </span>
        </div>
        <button
          type="button"
          className="focus-ring"
          style={{
            marginBlockStart: 2,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            background: 'var(--accent)',
            color: 'var(--bg)',
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Deploy to {picked.sub}
          <Icons.arrowRight size={16} color="var(--bg)" />
        </button>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const VARIANT_DOT_OPTS: Array<[string, string, string, boolean?]> = [
  ['us-east-1', 'US East', 'us-east-1'],
  ['eu-west-1', 'EU West', 'eu-west-1'],
  ['ap-south-1', 'Asia Pacific', 'ap-south-1 — disabled', true],
];

export default function MobileRadio() {
  const [regionA, setRegionA] = React.useState('us-east-1');
  const dotRoving = useRovingRadio(
    VARIANT_DOT_OPTS.map(([id]) => id),
    regionA,
    setRegionA,
    new Set(VARIANT_DOT_OPTS.filter(([, , , dis]) => dis).map(([id]) => id)),
  );

  return (
    <Section
      id="radio"
      num="01"
      title="Radio Button"
      desc="Single-select control for mutually exclusive choices. Two idioms: leading radio-dot for explicit affordance, and trailing checkmark for clean iOS-style lists. Full row is the touch target."
    >
      {/* ── Usage ── */}
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>
        Use radios when exactly one option from a group must be chosen — region pickers,
        environment selectors, sort order. For binary on/off, use a <Mono>Switch</Mono>.
        For multiple-select, use <Mono>Checkbox</Mono>.
      </Lede>

      {/* ── Variants ── */}
      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Leading dot · trailing checkmark · disabled">
        <div style={{ display: 'flex', gap: 24, padding: '20px 24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Leading dot group */}
          <div style={{ flex: '1 1 200px', minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBlockEnd: 8, paddingInlineStart: 4 }}>Leading dot</div>
            <div role="radiogroup" aria-label="Leading dot demo" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              {VARIANT_DOT_OPTS.map(([id, label, sub, dis], i, arr) => (
                <div key={id}>
                  <RadioRow
                    label={label}
                    sublabel={sub}
                    selected={regionA === id}
                    disabled={!!dis}
                    onSelect={() => !dis && setRegionA(id)}
                    tabIndex={dotRoving.tabIndexFor(id)}
                    rowRef={dotRoving.setRef(id)}
                    onKeyDown={dotRoving.onKeyDown(id)}
                  />
                  {i < arr.length - 1 && <div style={{ marginInlineStart: 50, height: 1, background: 'var(--border)' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Trailing check group */}
          <div style={{ flex: '1 1 200px', minWidth: 200 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBlockEnd: 8, paddingInlineStart: 4 }}>Trailing checkmark</div>
            <TrailingCheckVariantGroup />
          </div>
        </div>
      </Frame>

      {/* ── In context ── */}
      <SubHead meta="in context">In context</SubHead>
      <Lede>
        A selection is only useful for what it <b style={{ color: 'var(--fg)' }}>changes</b>.
        In this deploy flow the chosen region drives a live summary — its
        availability-zone spread and a monthly compute delta against the cheapest
        region — and arms the primary action. Pick a region and the consequence
        updates beneath it.
      </Lede>
      <Frame label="Deploy settings · region group (leading dot) and environment group (trailing checkmark) feed a live deploy summary" center>
        <DeviceFrame initial="iphone-se"><RadioScreen /></DeviceFrame>
      </Frame>

      {/* ── Anatomy ── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 36px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', background: 'var(--ember-softer)' }} aria-hidden="true">
              {/* Radio dot */}
              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 'var(--radius-full)', border: '2px solid var(--accent)', display: 'grid', placeItems: 'center' }}>
                <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--accent)' }} />
              </span>
              {/* Label */}
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--fg)' }}>US East</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>us-east-1 · 4 AZs</span>

              {/* Pin 1 — outer ring */}
              <span className="lead v" style={{ top: -32, left: 11, height: 26 }} />
              <div className="pin" style={{ top: -56, left: -2 }}>1</div>

              {/* Pin 2 — inner fill */}
              <span className="lead v" style={{ top: -22, left: 21, height: 16 }} />
              <div className="pin" style={{ top: -46, left: 13 }}>2</div>

              {/* Pin 3 — label */}
              <span className="lead v" style={{ bottom: -30, left: 68, height: 24 }} />
              <div className="pin" style={{ bottom: -54, left: 52 }}>3</div>

              {/* Pin 4 — row */}
              <span className="lead h" style={{ top: '50%', right: -36, width: 30 }} />
              <div className="pin" style={{ top: '50%', right: -64, transform: 'translateY(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Outer ring.</b> 22×22px circle, <Mono>--radius-full</Mono>. Unselected: <Mono>--border-strong</Mono> ring. Selected: <Mono>--accent</Mono> ring.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Inner fill.</b> 10px circle in <Mono>--accent</Mono>. Appears only when selected, centred with CSS Grid. Trailing-checkmark idiom replaces this with a checkmark icon at the row end.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Label + sublabel.</b> Primary label <Mono>--text-md</Mono> weight 500; sublabel <Mono>--text-sm --fg-muted</Mono> for supplementary info.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Touch row.</b> Full-width, ≥44px tall. Only one row in a <Mono>role="radiogroup"</Mono> can be selected at a time.</span>
          </div>
        </div>
      </div>

      {/* ── Accessibility ── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Role + group</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Each row has <Mono>role="radio"</Mono> and <Mono>aria-checked</Mono>. The container has <Mono>role="radiogroup"</Mono> with <Mono>aria-label</Mono> — this tells screen readers it is a mutually exclusive set. The deploy-summary button below is a real <Mono>{'<button>'}</Mono>, focusable in the same tab order.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard navigation</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
<Mono>Tab</Mono> enters and leaves the group as a single stop. <Mono>Arrow Up/Down</Mono> moves to the previous/next enabled option (wrapping) and selects it; <Mono>Home/End</Mono> jump to the ends. <Mono>Space</Mono> and <Mono>Enter</Mono> select the focused option. Roving tabindex: only the selected option (or the first enabled one if none is selected) holds <Mono>tabIndex=0</Mono>; the rest are <Mono>-1</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast, focus + motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The ember ring and fill on <Mono>--surface</Mono> meets WCAG AA; the deploy button is dark ink (<Mono>--bg</Mono>) on the ember fill, never ember-on-ember. Keyboard focus shows a 2px ember outline at 2px offset on every row and the button. Selection transitions ride <Mono>--dur-fast</Mono> and are color-only — no transform — so they hold under <Mono>prefers-reduced-motion</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch target ≥44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The full row (not just the glyph) is the interactive surface. Both idioms — leading dot and trailing checkmark — keep the row height ≥44px and full-width tap area, satisfying iOS HIG and WCAG 2.5.5.
          </div>
        </div>
      </div>

      {/* ── RTL ── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — radio dot flips to inline-end; trailing checkmark flips to inline-start'} center>
        <div dir="rtl" style={{ maxWidth: 340, margin: '0 auto', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <RTLRadioGroup />
        </div>
      </Frame>
      <Lede>
        All spacing uses logical properties (<Mono>paddingInline</Mono>, <Mono>gap</Mono>).
        The leading-dot idiom moves the dot to the <b style={{ color: 'var(--fg)' }}>inline-end</b>{' '}
        in RTL; the trailing-checkmark moves the checkmark to the{' '}
        <b style={{ color: 'var(--fg)' }}>inline-start</b>. Neither needs a{' '}
        <Mono>scaleX(-1)</Mono> — the glyph is radially symmetric.
      </Lede>

      {/* ── Do / Don't ── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — group radios with a shared label</div>
          <div className="body" style={{ flexDirection: 'column', gap: 0, alignItems: 'stretch', padding: '4px 0' }}>
            <div style={{ paddingInline: 16, paddingBlock: '8px 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Environment</div>
            <div role="radiogroup" aria-label="Environment">
              <TrailingCheckRow label="Production" selected onSelect={() => {}} />
              <div style={{ marginInlineStart: 16, height: 1, background: 'var(--border)' }} />
              <TrailingCheckRow label="Staging" onSelect={() => {}} />
            </div>
          </div>
          <div className="note">A visible section label above the group and <Mono>role="radiogroup"</Mono> make the mutual exclusivity clear to both sighted users and screen readers.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — leave radios ungrouped or use them for multi-select</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, alignItems: 'flex-start', padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 22, height: 22, borderRadius: 'var(--radius-full)', border: '2px solid var(--accent)', display: 'grid', placeItems: 'center' }}>
                <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--accent)' }} />
              </span>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--fg)' }}>Alerts</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ width: 22, height: 22, borderRadius: 'var(--radius-full)', border: '2px solid var(--accent)', display: 'grid', placeItems: 'center' }}>
                <span style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--accent)' }} />
              </span>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--fg)' }}>Digests</span>
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginBlockStart: 4 }}>Two radios both selected — impossible in a valid group</span>
          </div>
          <div className="note">Two radios both appearing "selected" breaks the mutually exclusive contract. Use Checkbox rows when multiple items can be active simultaneously.</div>
        </div>
      </div>

      {/* ── Spec ── */}
      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="radio-row"
        lang="tsx"
        code={`<div role="radiogroup" aria-label="Region">
  {options.map((opt) => (
    <div
      key={opt.id}
      className="focus-ring"            /* 2px ember outline at 2px offset on :focus-visible */
      role="radio"
      aria-checked={selected === opt.id}
      aria-disabled={opt.disabled}
      /* Roving tabindex: the group is one tab stop. */
      tabIndex={opt.id === tabStop ? 0 : -1}
      onClick={() => setSelected(opt.id)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') setSelected(opt.id);
        /* Arrow Up/Down (and Left/Right) move to the prev/next enabled
           option, wrapping, and select on arrival; Home/End jump to ends.
           Focus follows selection so the active row is announced. */
        if (e.key === 'ArrowDown') selectAndFocus(next(opt.id));
        if (e.key === 'ArrowUp')   selectAndFocus(prev(opt.id));
      }}
      style={{ minHeight: 44, paddingInline: 16 }}
    >
      {/* Leading-dot idiom: 22px ring + 10px fill in --accent */}
      {/* Trailing-checkmark idiom: <Icons.check color="var(--accent)"> at end */}
      <span className="m-radio-label">{opt.label}</span>
    </div>
  ))}
</div>

/* tabStop = the selected option, or the first enabled option if none selected.
   Selected row bg: var(--ember-softer) on leading-dot variant.
   Trailing-checkmark: no row tint — checkmark alone signals selection.
   Disabled: opacity 0.45, tabIndex -1, aria-disabled="true". */`}
      />
    </Section>
  );
}

// ── Sub-components used inside the page ─────────────────────────────────────

function TrailingCheckVariantGroup() {
  const [sel, setSel] = React.useState('production');
  const opts = [
    { id: 'production', label: 'Production',   sub: 'api.forge.dev' },
    { id: 'staging',    label: 'Staging',       sub: 'staging.forge.dev' },
    { id: 'preview',    label: 'Preview — disabled', sub: '', disabled: true },
  ];
  const roving = useRovingRadio(
    opts.map((o) => o.id),
    sel,
    setSel,
    new Set(opts.filter((o) => o.disabled).map((o) => o.id)),
  );
  return (
    <div role="radiogroup" aria-label="Environment" style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      {opts.map((o, i, arr) => (
        <div key={o.id}>
          <TrailingCheckRow
            label={o.label}
            sublabel={o.sub || undefined}
            selected={sel === o.id}
            disabled={o.disabled}
            onSelect={() => setSel(o.id)}
            tabIndex={roving.tabIndexFor(o.id)}
            rowRef={roving.setRef(o.id)}
            onKeyDown={roving.onKeyDown(o.id)}
          />
          {i < arr.length - 1 && <div style={{ marginInlineStart: 16, height: 1, background: 'var(--border)' }} />}
        </div>
      ))}
    </div>
  );
}

function RTLRadioGroup() {
  const [sel, setSel] = React.useState('us-east-1');
  const opts = [
    { id: 'us-east-1', label: 'شرق الولايات المتحدة',  sub: 'us-east-1' },
    { id: 'eu-west-1', label: 'غرب أوروبا',              sub: 'eu-west-1' },
    { id: 'ap-south-1', label: 'جنوب آسيا والمحيط الهادئ', sub: 'ap-south-1' },
  ];
  const roving = useRovingRadio(opts.map((o) => o.id), sel, setSel);
  return (
    <div role="radiogroup" aria-label="المنطقة">
      {opts.map((o, i) => (
        <div key={o.id}>
          <RadioRow
            label={o.label}
            sublabel={o.sub}
            selected={sel === o.id}
            onSelect={() => setSel(o.id)}
            tabIndex={roving.tabIndexFor(o.id)}
            rowRef={roving.setRef(o.id)}
            onKeyDown={roving.onKeyDown(o.id)}
          />
          {i < opts.length - 1 && <div style={{ marginInlineStart: 50, height: 1, background: 'var(--border)' }} />}
        </div>
      ))}
    </div>
  );
}
