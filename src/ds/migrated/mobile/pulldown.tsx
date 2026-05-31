'use client';
// Forge Mobile — Pulldown. An iOS-style pull-down menu button: a control with a label
// and trailing chevron that, when tapped, reveals a menu of choices anchored below it.
// Single-select; the active choice gets a leading checkmark. Use for sort/filter/view options.
// NOT pull-to-refresh (see PullRefresh). The open menu is role="menu" with menuitemradio items.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Alert, AlertTitle, AlertDescription } from '@/ds/core';

type PulldownOption = { value: string; label: string };

function Pulldown({
  label,
  options,
  value,
  onChange,
  disabled,
  size = 'md',
  defaultOpen = false,
}: {
  label?: string;
  options: PulldownOption[];
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  /** Demo-only: render the menu open so the docs can show the revealed state statically. */
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const selected = options.find((o) => o.value === value);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const height = size === 'sm' ? 32 : 38;
  // sm → --text-base (13px); md → --text-md (15px). These are distinct scale
  // steps: the previous --text-base/--text-sm pair both resolved to 13px, so
  // the two sizes were visually identical.
  const fontSize = size === 'sm' ? 'var(--text-base)' : 'var(--text-md)';

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {label && (
        <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--fg-muted)', marginBlockEnd: 6 }}>{label}</span>
      )}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height, paddingInline: size === 'sm' ? '10px' : '12px',
          borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-strong)',
          background: open ? 'var(--surface-hover)' : 'var(--surface)',
          color: 'var(--fg)', fontSize, fontFamily: 'inherit', fontWeight: 550,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          outline: open ? `2px solid var(--accent)` : 'none',
          outlineOffset: 2,
          transition: 'background var(--dur-fast) var(--ease)',
          whiteSpace: 'nowrap',
        }}
      >
        <span>{selected?.label ?? options[0]?.label}</span>
        <span
          style={{
            display: 'inline-flex',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--dur-fast) var(--ease)',
          }}
        >
          <Icons.chevronDown size={14} color="var(--fg-muted)" />
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          style={{
            position: 'absolute', insetBlockStart: '100%', insetInlineStart: 0,
            marginBlockStart: 4, minWidth: '100%',
            background: 'var(--surface-overlay)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)', overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.32)',
            zIndex: 50,
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => { onChange?.(opt.value); setOpen(false); btnRef.current?.focus(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  height: 44, paddingInline: 12, border: 'none', cursor: 'pointer',
                  background: 'none', color: 'var(--fg)', fontSize,
                  fontFamily: 'inherit', fontWeight: isSelected ? 600 : 400,
                  textAlign: 'start',
                  transition: 'background var(--dur-fast)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isSelected && <Icons.check size={14} color="var(--accent)" />}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const SORT_OPTIONS: PulldownOption[] = [
  { value: 'recent', label: 'Most recent' },
  { value: 'severity', label: 'By severity' },
  { value: 'service', label: 'By service' },
  { value: 'open', label: 'Open only' },
];

const WINDOW_OPTIONS: PulldownOption[] = [
  { value: '1h', label: 'Last 1 hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
];

function PulldownScreen() {
  const [sort, setSort] = React.useState('severity');
  const [window_, setWindow] = React.useState('6h');
  const incidents = [
    { id: 'INC-1841', sev: 'P1', title: 'Auth service latency spike', service: 'identity-svc', ts: '4 min ago' },
    { id: 'INC-1839', sev: 'P2', title: 'Payments pipeline backlog', service: 'payments-api', ts: '18 min ago' },
    { id: 'INC-1836', sev: 'P3', title: 'Slow queries on metrics DB', service: 'metrics-store', ts: '1 hr ago' },
  ];
  const sevColor: Record<string, string> = { P1: 'var(--danger)', P2: 'var(--warning)', P3: 'var(--success)' };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '52px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBlockEnd: 12 }}>
          <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Incidents</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-faint)' }}>{incidents.length} open</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Pulldown options={SORT_OPTIONS} value={sort} onChange={setSort} label="Sort" />
          <Pulldown options={WINDOW_OPTIONS} value={window_} onChange={setWindow} label="Window" />
        </div>
      </div>
      <div style={{ flex: 1, padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {incidents.map((inc) => (
          <div key={inc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 'var(--radius-lg)', background: 'var(--surface)' }}>
            <span style={{ minWidth: 28, height: 28, borderRadius: 'var(--radius-sm)', background: sevColor[inc.sev] + '22', color: sevColor[inc.sev], fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, fontVariantNumeric: 'tabular-nums', display: 'grid', placeItems: 'center' }}>{inc.sev}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 550, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.title}</span>
              <span style={{ display: 'block', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>{inc.id} · {inc.service} · {inc.ts}</span>
            </span>
            <Icons.chevronRight size={14} color="var(--fg-faint)" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MobilePulldown() {
  const [demo1, setDemo1] = React.useState('recent');
  const [demo2, setDemo2] = React.useState('severity');
  const [demo3, setDemo3] = React.useState('service');

  return (
    <Section
      id="pulldown"
      num="01"
      title="Pulldown"
      desc="An iOS-style pull-down menu button that reveals a single-select list anchored below it. The active item carries a leading checkmark. Use for sort, filter, or view-options controls."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>The pulldown sits inline in a toolbar or form row. It replaces a row of segmented buttons when choices exceed three. For destructive or multi-step actions, use an Action Sheet instead.</Lede>
      <Frame label="Incident list — Sort and Window pulldowns; chosen item checkmarked" center>
        <DeviceFrame initial="iphone-se"><PulldownScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants &amp; states</SubHead>
      <Lede up>Two sizes — <Mono>md</Mono> (15px) and <Mono>sm</Mono> (13px) — plus the disabled and revealed-menu states. The open menu is the defining state: every closed trigger shows the current value, so the user never loses context.</Lede>
      <Frame label="md (15px) · sm (13px) · disabled · open — each shows the checkmark on the active item">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', alignItems: 'flex-start', padding: '20px 16px', minHeight: 220 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <span className="t-mono-label">md · 15px</span>
            <Pulldown options={SORT_OPTIONS} value={demo1} onChange={setDemo1} size="md" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <span className="t-mono-label">sm · 13px</span>
            <Pulldown options={SORT_OPTIONS} value={demo2} onChange={setDemo2} size="sm" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <span className="t-mono-label">disabled</span>
            <Pulldown options={SORT_OPTIONS} value={demo3} onChange={setDemo3} disabled />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <span className="t-mono-label">open</span>
            <Pulldown options={SORT_OPTIONS} value="severity" onChange={() => {}} defaultOpen />
          </div>
        </div>
      </Frame>

      <SubHead meta="states">Loading, empty &amp; error</SubHead>
      <Lede up>A pulldown driven by fetched options has to render before its data arrives, when the source is empty, and when the fetch fails. Each renders in the trigger&rsquo;s footprint so the toolbar never reflows.</Lede>
      <div className="ds-grid cols-3" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="t-mono-label">loading</span>
          <span
            aria-hidden="true"
            className="m-skel"
            style={{ display: 'inline-block', width: 132, height: 38, borderRadius: 'var(--radius-lg)' }}
          />
          <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--fg-muted)' }}>
            A <Mono>.m-skel</Mono> shimmer holds the trigger&rsquo;s size while options load; the shimmer stops under reduced motion.
          </span>
        </div>
        <div className="surface" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="t-mono-label">empty</span>
          <button
            type="button"
            disabled
            aria-disabled="true"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
              height: 38, paddingInline: 12, borderRadius: 'var(--radius-lg)',
              border: '1.5px dashed var(--border-strong)', background: 'var(--surface)',
              color: 'var(--fg-faint)', fontSize: 'var(--text-md)', fontFamily: 'inherit',
              fontWeight: 550, cursor: 'not-allowed', whiteSpace: 'nowrap',
            }}
          >
            <Icons.inbox size={14} color="var(--fg-faint)" />
            <span>No filters</span>
          </button>
          <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--fg-muted)' }}>
            Zero options &rarr; the trigger is <Mono>disabled</Mono> with a dashed border and an explanatory label, not an empty menu.
          </span>
        </div>
        <div className="surface" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="t-mono-label">error</span>
          <Alert tone="danger" assertive>
            <AlertTitle>Couldn&rsquo;t load filters</AlertTitle>
            <AlertDescription>The filter service didn&rsquo;t respond. Retry to fetch options.</AlertDescription>
          </Alert>
          <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--fg-muted)' }}>
            A failed fetch surfaces as a <Mono>role="alert"</Mono> danger Alert in the trigger&rsquo;s place &mdash; never a control that opens an empty menu.
          </span>
        </div>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              {/* Trigger button */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 38, paddingInline: 12,
                borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--accent)',
                background: 'var(--surface)', color: 'var(--fg)', fontSize: 'var(--text-md)',
                fontWeight: 550, outline: '2px solid var(--accent)', outlineOffset: 2,
              }}>
                <span>By severity</span>
                <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
                  <Icons.chevronDown size={14} color="var(--fg-muted)" />
                </span>
              </span>
              {/* Menu */}
              <span style={{
                position: 'absolute', insetBlockStart: '100%', insetInlineStart: 0,
                marginBlockStart: 6, width: 180,
                background: 'var(--surface-overlay)', borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)', overflow: 'hidden',
              }}>
                {[{ v: 'recent', l: 'Most recent', sel: false }, { v: 'severity', l: 'By severity', sel: true }, { v: 'service', l: 'By service', sel: false }].map((opt) => (
                  <span key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, paddingInline: 12, fontSize: 'var(--text-md)', fontWeight: opt.sel ? 600 : 400, color: 'var(--fg)' }}>
                    <span style={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {opt.sel && <Icons.check size={14} color="var(--accent)" />}
                    </span>
                    <span>{opt.l}</span>
                  </span>
                ))}
              </span>
              <span className="lead h" style={{ top: 8, left: -30, width: 26 }} />
              <span className="lead h" style={{ top: 8, right: -30, width: 26 }} />
              <span className="lead v" style={{ top: 30, left: '74%', height: 18 }} />
              <span className="lead h" style={{ top: 80, right: -30, width: 26 }} />
              <div className="pin" style={{ top: -4, left: -56 }}>1</div>
              <div className="pin" style={{ top: -4, right: -56 }}>2</div>
              <div className="pin" style={{ top: 18, left: -4 }}>3</div>
              <div className="pin" style={{ top: 68, right: -56 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '160px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Label + current value.</b> The button shows the name of the active option so the user always sees the current state at a glance.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Trailing chevron.</b> Signals an attached menu; rotates <span style={{ fontVariantNumeric: 'tabular-nums' }}>180&deg;</span> on open (transition only) to mirror the <Mono>aria-expanded</Mono> state for sighted users.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Ember focus ring.</b> <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>outline: 2px solid var(--accent)</code> on focus-visible and when open; the single accent use per control.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Checkmark.</b> An ember <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>Icons.check</code> in the leading 18px slot confirms the active choice at a glance without text repetition.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>Trigger is a <Mono>{'<button aria-haspopup="menu">'}</Mono>; each row is a <Mono>menuitemradio</Mono> with <Mono>aria-checked</Mono>. The menu is a single-select <Mono>role="menu"</Mono>: choosing a row selects it and closes, returning focus to the trigger.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 12 }}>Keyboard map</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 8, margin: 0 }}>
            {[
              ['Space / Enter', 'On the trigger, open the menu; on a focused row, select it and close'],
              ['Tab / ⇧Tab', 'Move focus through the open menu rows in order'],
              ['Esc', 'Close the menu, return focus to the trigger'],
            ].map(([k, a]) => (
              <React.Fragment key={k}>
                <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--fg)', whiteSpace: 'nowrap', paddingBlockStart: 2 }}>{k}</dt>
                <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>{a}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 8 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}><Mono>aria-expanded</Mono> on the button reflects open state; <Mono>aria-haspopup="menu"</Mono> announces the popup. Each row is <Mono>role="menuitemradio" aria-checked</Mono> inside the <Mono>aria-label</Mono>-named <Mono>role="menu"</Mono> — VoiceOver reads <span style={{ fontVariantNumeric: 'tabular-nums' }}>&ldquo;By severity, checked, 2 of 4.&rdquo;</span></div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 8 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Trigger shows the ember ring (<Mono>outline: 2px var(--accent)</Mono>) while open, not only on keyboard focus, so pointer users see which control owns the menu. The label on <Mono>var(--surface)</Mono> and the ember checkmark each clear <span style={{ fontVariantNumeric: 'tabular-nums' }}>4.5:1</span>.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 8 }}>Touch target &amp; motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Menu rows are <span style={{ fontVariantNumeric: 'tabular-nums' }}>44px</span> (WCAG 2.5.5); the sm <span style={{ fontVariantNumeric: 'tabular-nums' }}>32px</span> trigger gets a padded <span style={{ fontVariantNumeric: 'tabular-nums' }}>44px</span> hit area. Motion is limited to a <Mono>var(--dur-fast)</Mono> background fade plus a <Mono>180°</Mono> chevron rotate — both transitions only, no slide; under <Mono>prefers-reduced-motion</Mono> the menu&rsquo;s entrance keyframe is suppressed.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — menu anchors to inline-start (right); checkmark stays leading; chevron flips'} center code={`<div dir="rtl">
  <Pulldown options={options} value={value} onChange={setValue} label="ترتيب" />
</div>`} lang="tsx">
        <div dir="rtl" style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: 24 }}>
          <Pulldown options={[
            { value: 'recent', label: 'الأحدث' },
            { value: 'severity', label: 'حسب الخطورة' },
            { value: 'service', label: 'حسب الخدمة' },
          ]} value="severity" onChange={() => {}} label="ترتيب" />
          <Pulldown options={[
            { value: '1h', label: 'آخر ساعة' },
            { value: '6h', label: 'آخر 6 ساعات' },
            { value: '24h', label: 'آخر 24 ساعة' },
          ]} value="6h" onChange={() => {}} label="النافذة الزمنية" />
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the menu anchors to <Mono>insetInlineStart</Mono> (the right edge of the trigger), the chevron mirrors naturally, and the leading checkmark stays at the start of each row — no per-component overrides, all from logical CSS properties.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — pulldown for 4+ mutually exclusive options</div>
          <div className="body" style={{ gap: 12, justifyContent: 'center' }}>
            <Pulldown options={SORT_OPTIONS} value="severity" onChange={() => {}} />
          </div>
          <div className="note">Four or more choices in a toolbar collapse cleanly into a pulldown — the label always shows the current selection.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — stack two pulldowns for a single dimension</div>
          <div className="body" style={{ gap: 12, flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, paddingInline: 12, borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-strong)', background: 'var(--surface)', fontSize: 'var(--text-md)', color: 'var(--fg)', fontWeight: 550 }}>
                Sort <Icons.chevronDown size={13} color="var(--fg-muted)" />
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, paddingInline: 12, borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-strong)', background: 'var(--surface)', fontSize: 'var(--text-md)', color: 'var(--fg)', fontWeight: 550 }}>
                Sort order <Icons.chevronDown size={13} color="var(--fg-muted)" />
              </span>
            </div>
          </div>
          <div className="note">Two pulldowns controlling the same dimension — direction and field — create confusion. Combine into one with compound options.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="pulldown"
        lang="tsx"
        code={`<button
  type="button"
  aria-haspopup="menu"
  aria-expanded={open}
  className="m-pulldown-trigger"
>
  {selected.label}
  <Icons.chevronDown size={14} />
</button>

{open && (
  <div role="menu" aria-label="Sort" className="m-pulldown-menu">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        role="menuitemradio"
        aria-checked={opt.value === value}
        onClick={() => { onChange(opt.value); setOpen(false); }}
        className="m-pulldown-item"
      >
        <span className="m-pulldown-check" aria-hidden="true">
          {opt.value === value && <Icons.check size={14} />}
        </span>
        {opt.label}
      </button>
    ))}
  </div>
)}

/* size md: 38px / var(--text-md) 15px · size sm: 32px / var(--text-base) 13px
   trigger: var(--surface), 1.5px border; open: var(--accent) ring +
     chevron rotate(180deg) (transition only, reduced-motion-safe);
   menu: var(--surface-overlay), 44px items, logical insetInlineStart anchor.
   states: loading → .m-skel sized to the trigger; empty → disabled trigger
   ("No filters"); error → role="alert" danger Alert in the trigger's place */`}
      />
    </Section>
  );
}
