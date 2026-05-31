'use client';
// Forge Mobile — Tag. A small content-classification label (category, topic,
// keyword) that lives inline with text or at the top of a card. NOT a status
// pill and NOT the notification Badge. Variants: solid, soft, outline,
// removable (×), plus an optional leading dot or icon. Tap target on removable
// tags is the × button only, which holds ≥44px via padding; the tag label
// itself is not pressable unless the whole tag is interactive.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Primitive ────────────────────────────────────────────────────────────────
// Shared geometry — the single source of the tag's pill metrics. These mirror
// the `m-tag` recipe (see sharedRequest): label uses the mono eyebrow tracking,
// the capsule reads from --space-* so the rhythm matches the rest of Forge.

const TAG_TRACK = '0.03em';             // mono keyword tracking (matches eyebrows)
const TAG_GAP = 'var(--space-1)';       // 4px between dot/icon and label
const TAG_PAD_BLOCK = 'var(--space-1)'; // 4px
const TAG_PAD_INLINE = 'var(--space-3)';// 12px (≈10px snapped to scale)
const TAG_PAD_INLINE_RM = 'var(--space-1)'; // 4px inline-end when removable

type TagVariant = 'solid' | 'soft' | 'outline';

function Tag({
  label,
  variant = 'soft',
  dot,
  icon,
  removable = false,
  onRemove,
  disabled = false,
}: {
  label: string;
  variant?: TagVariant;
  dot?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}) {
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: TAG_GAP,
    paddingInlineStart: TAG_PAD_INLINE,
    paddingInlineEnd: removable ? TAG_PAD_INLINE_RM : TAG_PAD_INLINE,
    paddingBlock: TAG_PAD_BLOCK,
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    letterSpacing: TAG_TRACK,
    lineHeight: 1,
    opacity: disabled ? 0.45 : 1,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    // variant-specific:
    ...(variant === 'solid' ? {
      background: 'var(--accent)',
      color: 'var(--ember-fg)',
      border: 'none',
    } : variant === 'soft' ? {
      background: 'var(--ember-soft)',
      color: 'var(--ember-glow)',
      border: 'none',
    } : /* outline */ {
      background: 'transparent',
      color: 'var(--fg-muted)',
      border: '1px solid var(--border-strong)',
    }),
  };

  return (
    <span style={styles}>
      {dot && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: 'var(--radius-full)',
          background: variant === 'solid' ? 'var(--ember-fg)' : 'var(--accent)',
          flexShrink: 0,
        }} />
      )}
      {icon && !dot && (
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', color: 'inherit', flexShrink: 0 }}>
          {icon}
        </span>
      )}
      {label}
      {removable && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Enlarge hit area to ≥44px with padding trick, keep visual small
            padding: '10px 8px 10px 3px',
            margin: '-10px -4px -10px 0',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: 'inherit',
            opacity: 0.7,
            borderRadius: 'var(--radius-full)',
          }}
        >
          <Icons.x size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}

// ── Neutral-tone variants (for topics / outline lists) ────────────────────────
// These use the standard border/surface tokens instead of ember.

function NeutralTag({
  label,
  variant = 'outline',
  icon,
  removable = false,
  onRemove,
}: {
  label: string;
  variant?: 'outline' | 'soft';
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: TAG_GAP,
      paddingInlineStart: TAG_PAD_INLINE,
      paddingInlineEnd: removable ? TAG_PAD_INLINE_RM : TAG_PAD_INLINE,
      paddingBlock: TAG_PAD_BLOCK,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      letterSpacing: TAG_TRACK,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      background: variant === 'soft' ? 'var(--surface-active)' : 'transparent',
      color: 'var(--fg-muted)',
      border: variant === 'outline' ? '1px solid var(--border-strong)' : 'none',
    }}>
      {icon && (
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', color: 'inherit', flexShrink: 0 }}>
          {icon}
        </span>
      )}
      {label}
      {removable && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 8px 10px 3px', margin: '-10px -4px -10px 0',
            background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7,
            borderRadius: 'var(--radius-full)',
          }}
        >
          <Icons.x size={10} strokeWidth={2.5} />
        </button>
      )}
    </span>
  );
}

// ── Screen demo ──────────────────────────────────────────────────────────────

function TagScreen() {
  const [activeCat, setActiveCat] = React.useState<string | null>('incidents');
  const [topics, setTopics] = React.useState(['kubernetes', 'observability', 'runbooks', 'SRE', 'cost-optimisation']);

  function removeTopic(t: string) {
    setTopics((prev) => prev.filter((x) => x !== t));
  }

  const cats = [
    { id: 'all',       label: 'All' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'deploys',   label: 'Deploys' },
    { id: 'reviews',   label: 'Reviews' },
  ];

  const articles = [
    { title: 'Root cause: DB connection pool exhaustion', tags: ['P1', 'postgres', 'connection-limits'] },
    { title: 'Deploy pipeline latency regression', tags: ['deploy', 'p50', 'tracing'] },
    { title: 'On-call runbook: Redis failover', tags: ['runbook', 'redis', 'on-call'] },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflowY: 'auto' }}>
      {/* Nav */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', paddingInline: 16, borderBlockEnd: '1px solid var(--border)', flexShrink: 0, marginBlockStart: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Knowledge base</span>
      </div>

      {/* Category filter row — horizontal scrollable solid tags */}
      <div style={{ display: 'flex', gap: 8, paddingInline: 16, paddingBlock: '12px 0', overflowX: 'auto', flexShrink: 0 }} className="hide-sb">
        {cats.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCat(c.id)}
            aria-pressed={activeCat === c.id}
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              paddingInline: TAG_PAD_INLINE,
              paddingBlock: 'var(--space-1)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              letterSpacing: TAG_TRACK,
              cursor: 'pointer',
              border: 'none',
              background: activeCat === c.id ? 'var(--accent)' : 'var(--surface-active)',
              color: activeCat === c.id ? 'var(--ember-fg)' : 'var(--fg-muted)',
              transition: 'background var(--dur-fast) var(--ease)',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Article list */}
      <div style={{ flex: 1, padding: '12px 0' }}>
        {articles.map((a, i) => (
          <div key={i} style={{ paddingInline: 16, paddingBlock: 12, borderBlockEnd: '1px solid var(--border)' }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--fg)', marginBlockEnd: 8, lineHeight: 1.4 }}>{a.title}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {a.tags.map((t) => (
                <NeutralTag key={t} label={t} variant="outline" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Removable topic tags at bottom */}
      <div style={{ paddingInline: 16, paddingBlock: 12, borderBlockStart: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBlockEnd: 8 }}>Your topics</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {topics.length === 0 && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-faint)' }}>No topics — tap + to add</span>
          )}
          {topics.map((t) => (
            <NeutralTag key={t} label={t} variant="soft" removable onRemove={() => removeTopic(t)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileTag() {
  const [chips, setChips] = React.useState(['typescript', 'next.js', 'postgres', 'redis', 'k8s']);
  function remove(t: string) { setChips((p) => p.filter((x) => x !== t)); }

  return (
    <Section
      id="tag"
      num="01"
      title="Tag"
      desc="A small content-classification label for categories, topics, and keywords. Variants: solid (active filter), soft (default), outline (neutral). Supports leading dot or icon, and an inline remove button."
    >
      {/* ── Usage ── */}
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>
        Tags classify content — they are not status signals (use a pill) and not counts
        (use a badge). In filter rows the active tag becomes <Mono>solid</Mono>;
        in body text or card metadata use <Mono>outline</Mono> or <Mono>soft</Mono>.
      </Lede>
      <Frame label="Knowledge base · category filter row · article keyword tags · removable topic chips" center>
        <DeviceFrame initial="iphone-se"><TagScreen /></DeviceFrame>
      </Frame>

      {/* ── Variants ── */}
      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Solid (active filter) · soft · outline · with dot · with icon · removable">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '24px 28px', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Tag label="incidents" variant="solid" />
              <Tag label="deploys" variant="soft" />
              <Tag label="kubernetes" variant="outline" />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Tag label="P1" variant="soft" dot />
              <Tag label="runbook" variant="outline" icon={<Icons.doc size={9} strokeWidth={2} />} />
              <Tag label="incidents" variant="soft" removable />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <NeutralTag label="typescript" variant="outline" />
              <NeutralTag label="next.js" variant="soft" />
              <NeutralTag label="postgres" variant="outline" removable />
            </div>
          </div>
        </div>
      </Frame>

      {/* ── Anatomy ── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 36px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: TAG_GAP }} aria-hidden="true">
              {/* Rendered tag: soft variant with dot — padding scaled up for the diagram */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: TAG_GAP,
                paddingInline: '14px 18px', paddingBlock: 6,
                borderRadius: 'var(--radius-full)',
                background: 'var(--ember-soft)',
                color: 'var(--ember-glow)',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: TAG_TRACK,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 'var(--radius-full)', background: 'var(--accent)', flexShrink: 0 }} />
                incidents
                <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 8px 10px 3px', margin: '-10px -8px -10px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7, borderRadius: 'var(--radius-full)' }}>
                  <Icons.x size={10} strokeWidth={2.5} />
                </button>
              </span>

              {/* Pin 1 — pill shape */}
              <span className="lead v" style={{ top: -32, left: '28%', height: 26 }} />
              <div className="pin" style={{ top: -56, left: '14%' }}>1</div>

              {/* Pin 2 — dot */}
              <span className="lead v" style={{ top: -24, left: 18, height: 18 }} />
              <div className="pin" style={{ top: -48, left: 8 }}>2</div>

              {/* Pin 3 — label */}
              <span className="lead v" style={{ bottom: -30, left: '52%', height: 24 }} />
              <div className="pin" style={{ bottom: -54, left: '40%' }}>3</div>

              {/* Pin 4 — remove button */}
              <span className="lead h" style={{ top: '50%', right: -36, width: 30 }} />
              <div className="pin" style={{ top: '50%', right: -64, transform: 'translateY(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0', lineHeight: 1.55 }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Pill container.</b> <Mono>--radius-full</Mono> capsule. Solid: <Mono>--accent</Mono> fill + <Mono>--ember-fg</Mono>. Soft: <Mono>--ember-soft</Mono> + <Mono>--ember-glow</Mono>. Outline: transparent + <Mono>--border-strong</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Leading dot.</b> Optional 6px circle in <Mono>--accent</Mono> (soft/outline) or <Mono>--ember-fg</Mono> (solid). Can be replaced by a ≤10px icon instead.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Mono, <Mono>--text-xs</Mono> (11px), weight 500, letter-spacing 0.03em. Always a keyword — no sentences, no punctuation.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Remove ×.</b> Negative-margin padding trick inflates the tap target to ≥44px height while the visual × stays 10px. <Mono>aria-label="Remove {'{'}label{'}'}"</Mono>; stopPropagation so tag row click doesn't also fire.</span>
          </div>
        </div>
      </div>

      {/* ── Accessibility ── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Role + label</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            A static tag is <Mono>{'<span>'}</Mono> — no interactive role needed. A removable tag's × button has <Mono>aria-label="Remove kubernetes"</Mono>. If the whole tag is pressable (filter toggle), use <Mono>{'<button>'}</Mono> with <Mono>aria-pressed</Mono> — as the live category row does.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Keyboard</div>
          <dl style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-1)' }}>
              <dt style={{ flex: '0 0 64px' }}><Mono>Tab</Mono></dt>
              <dd style={{ margin: 0 }}>Moves to the next × button (a static label is not focusable).</dd>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <dt style={{ flex: '0 0 64px' }}><Mono>Enter</Mono> / <Mono>Space</Mono></dt>
              <dd style={{ margin: 0 }}>Removes the focused tag, then focus advances to the next × or the add control.</dd>
            </div>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Solid variant: <Mono>--ember-fg</Mono> (dark ink) on ember fill — WCAG AA (≈11:1). Soft variant: <Mono>--ember-glow</Mono> on <Mono>--ember-soft</Mono> meets AA. Outline variant uses <Mono>--fg-muted</Mono> on the page background.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Touch target ≥44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The tag visual is ≈24px tall. The removable × uses negative-margin padding to inflate its hit area to ≥44px without changing the visual size. Interactive filter-toggle tags have a ≥44px tap surface via paddingBlock on the button wrapper.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Focus &amp; reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The × and the filter buttons inherit the canonical <Mono>:focus-visible</Mono> ring (<Mono>--ring</Mono>, 2px offset) — try the live demo with <Mono>Tab</Mono>. The only motion is the filter chip's background <Mono>transition</Mono>, a non-essential color tween honoured by <Mono>prefers-reduced-motion</Mono>.
          </div>
        </div>
      </div>

      {/* ── RTL ── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — dot stays at inline-start; × button moves to inline-start of the tag'} center>
        <div dir="rtl" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: 24 }}>
          <Tag label="حوادث" variant="solid" />
          <Tag label="نشر" variant="soft" dot />
          <Tag label="مراجعات" variant="outline" />
          <NeutralTag label="kubernetes" variant="soft" removable />
          <NeutralTag label="observability" variant="outline" removable />
        </div>
      </Frame>
      <Lede>
        All <Mono>paddingInline</Mono> and <Mono>gap</Mono> values use logical CSS — the leading
        dot naturally shifts to the right (<b style={{ color: 'var(--fg)' }}>inline-start</b>) in
        RTL, and the × button flips to the <b style={{ color: 'var(--fg)' }}>inline-start</b>{' '}
        edge of the tag. No <Mono>scaleX</Mono> or directional overrides are needed.
      </Lede>

      {/* ── Removable demo ── */}
      <Frame label="Removable tags — live: tap × to remove a chip">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 24, justifyContent: 'center', minHeight: 68, alignContent: 'center' }}>
          {chips.length === 0 && (
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>All tags removed</span>
          )}
          {chips.map((c) => (
            <NeutralTag key={c} label={c} variant="soft" removable onRemove={() => remove(c)} />
          ))}
        </div>
      </Frame>

      {/* ── Do / Don't ── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — short keyword labels, two accent tags max per screen</div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '16px 20px' }}>
            <NeutralTag label="kubernetes" variant="outline" />
            <NeutralTag label="postgres" variant="outline" />
            <Tag label="incidents" variant="soft" dot />
            <NeutralTag label="runbook" variant="soft" />
          </div>
          <div className="note">Keywords stay short and scannable. The ember-tinted tag appears once for the active filter category — not on every article tag.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use tags as status signals or stuff long phrases</div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '16px 20px' }}>
            <Tag label="HEALTHY" variant="solid" />
            <Tag label="currently deploying to prod" variant="soft" />
          </div>
          <div className="note">Status belongs in a semantic pill (Healthy / Degraded) with proper color coding. Long phrases break scannable layout — keep tags to one or two words.</div>
        </div>
      </div>

      {/* ── Spec ── */}
      <SubHead meta="reference">Spec</SubHead>
      <Lede>
        The <Mono>m-tag</Mono> recipe is one capsule with three fills.
        Metrics come from the space scale — <Mono>--space-1</Mono> block padding and gap,
        <Mono>--space-3</Mono> inline padding (collapsing to <Mono>--space-1</Mono> on the
        remove side) — so the rhythm matches the rest of Forge. The variant
        modifiers (<Mono>--solid</Mono>, <Mono>--soft</Mono>, <Mono>--outline</Mono>)
        swap only the fill, ink, and border.
      </Lede>
      <CodeBlock
        label="tag"
        lang="tsx"
        code={`{/* Static tag */}
<span className="m-tag m-tag--soft">kubernetes</span>

{/* With leading dot */}
<span className="m-tag m-tag--soft">
  <span className="m-tag-dot" aria-hidden="true" />
  incidents
</span>

{/* Removable */}
<span className="m-tag m-tag--soft">
  runbook
  <button
    type="button"
    aria-label="Remove runbook"
    className="m-tag-remove"
    onClick={onRemove}
  >
    <Icons.x size={10} />
  </button>
</span>

{/* Interactive filter toggle */}
<button
  type="button"
  role="button"
  aria-pressed={active}
  className={active ? 'm-tag m-tag--solid' : 'm-tag m-tag--soft'}
>
  All
</button>

/* Solid:   bg var(--accent), color var(--ember-fg)       — dark ink on ember
   Soft:    bg var(--ember-soft), color var(--ember-glow)
   Outline: bg transparent, border var(--border-strong), color var(--fg-muted)
   Radius:  --radius-full  |  Font: --font-mono --text-xs weight 500
   Remove × hit area: ≥44px via negative-margin padding   */`}
      />
    </Section>
  );
}
