'use client';
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs,
  Lede, Mono,
} from '@/ds/core';
import { Tooltip } from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Tooltip } from "@forge/ui"

export function Demo() {
  return (
    <Tooltip content="Search (⌘K)">
      <button className="btn icon" aria-label="Search">
        <Icons.search size={14} />
      </button>
    </Tooltip>
  );
}`;

const PLACEMENTS_CODE = `<Tooltip content="Top (default)" side="top">
  <button className="btn icon">↑</button>
</Tooltip>

<Tooltip content="Right" side="right">
  <button className="btn icon">→</button>
</Tooltip>

<Tooltip content="Bottom" side="bottom">
  <button className="btn icon">↓</button>
</Tooltip>

<Tooltip content="Left" side="left">
  <button className="btn icon">←</button>
</Tooltip>`;

const ON_TEXT_CODE = `<p>
  Press{' '}
  <Tooltip content="Opens the command palette" side="top">
    {/* kbd isn't focusable by default — make it keyboard-reachable */}
    <kbd className="kbd focus-ring" tabIndex={0}>⌘K</kbd>
  </Tooltip>
  {' '}to jump to any service.
</p>`;

const STATES_CODE = `// Controlled — pin the bubble open (onboarding coach-mark, live preview)
const [open, setOpen] = useState(true);
<Tooltip content="Deploys to staging (⌘⏎)" side="top" open={open} onOpenChange={setOpen}>
  <button className="btn icon" aria-label="Deploy">
    <Icons.command size={14} />
  </button>
</Tooltip>

// Disabled trigger — a disabled button emits no hover/focus events,
// so no bubble appears. Put the hint on an enabled wrapper instead.
<Tooltip content="Resolve the failing check first">
  <span className="focus-ring" tabIndex={0}>
    <button className="btn ember" disabled>Merge</button>
  </span>
</Tooltip>`;

const RTL_CODE = `<div dir="rtl">
  <Tooltip content="بحث (⌘K)" side="top">
    <button className="btn icon" aria-label="بحث">
      <Icons.search size={14} />
    </button>
  </Tooltip>

  <Tooltip content="فلتر" side="right">
    <button className="btn icon ghost" aria-label="فلتر">
      <Icons.filter size={14} />
    </button>
  </Tooltip>
</div>`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Tooltips() {
  // Controlled-mode demo: the reader can pin the bubble open without hovering,
  // so the documented `open`/`onOpenChange` props actually perform on the page.
  const [pinned, setPinned] = React.useState(true);

  return (
    <Section
      id="tooltips"
      num="11"
      title="Tooltips"
      desc="Short, scoped hints on hover or focus. Supplement; never carry critical information. If the user must read it to act, it is a label — not a tooltip."
    >
      {/* ── 1. INSTALLATION ────────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('tooltip')} ariaLabel="package manager" />
      <Lede>
        The CLI copies <Mono>tooltip.tsx</Mono> and its CSS into your project so you can edit them.
        Forge ships source — not a black-box dependency. Pick the <em>Manual</em> tab to paste the
        files by hand.
      </Lede>

      {/* ── 2. USAGE ─────────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <Tooltip content="Search (⌘K)" side="top" delayDuration={0}>
          <button className="btn icon" aria-label="Search">
            <Icons.search size={14} />
          </button>
        </Tooltip>
      </Frame>
      <Lede up>
        Wrap any focusable element with <Mono>{'<Tooltip>'}</Mono>. The <Mono>content</Mono> prop
        accepts a string or any <Mono>ReactNode</Mono>. The trigger element receives{' '}
        <Mono>aria-describedby</Mono> automatically when the bubble is visible.
      </Lede>

      {/* divider */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-2)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ── PLACEMENTS ──────────────────────────────────────────────────────── */}
      <SubHead meta="4 placements">Placements</SubHead>
      <Frame label="top (default) · right · bottom · left" row code={PLACEMENTS_CODE}>
        <Tooltip content="Top (default)" side="top" delayDuration={0}>
          <button className="btn icon" aria-label="Top">
            <Icons.search size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Right" side="right" delayDuration={0}>
          <button className="btn icon ghost" aria-label="Right">
            <Icons.filter size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Bottom" side="bottom" delayDuration={0}>
          <button className="btn icon outline" aria-label="Bottom">
            <Icons.settings size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Left" side="left" delayDuration={0}>
          <button className="btn icon ghost" aria-label="Left">
            <Icons.bell size={14} />
          </button>
        </Tooltip>
      </Frame>
      <Lede up>
        Each side auto-flips to its opposite if it would clip the viewport edge — no manual override
        needed. Combine with <Mono>align</Mono> (<Mono>"start"</Mono> / <Mono>"center"</Mono> /{' '}
        <Mono>"end"</Mono>) for precise positioning along the chosen axis.
      </Lede>

      {/* ── ON INLINE TEXT ──────────────────────────────────────────────────── */}
      <SubHead meta="on text">On inline text</SubHead>
      <Frame label="explain a term, expose a shortcut" code={ON_TEXT_CODE}>
        <p className="t-body" style={{ color: 'var(--fg-muted)', lineHeight: 1.6, margin: 0 }}>
          Press{' '}
          <Tooltip content="Opens the command palette" side="top" delayDuration={0}>
            <kbd className="kbd focus-ring" tabIndex={0}>⌘K</kbd>
          </Tooltip>
          {' '}to jump to any service. The list is keyboard-navigable —{' '}
          <Tooltip content="Move down" side="top" delayDuration={0}>
            <kbd className="kbd focus-ring" tabIndex={0}>↓</kbd>
          </Tooltip>
          {', '}
          <Tooltip content="Move up" side="top" delayDuration={0}>
            <kbd className="kbd focus-ring" tabIndex={0}>↑</kbd>
          </Tooltip>
          {', '}
          <Tooltip content="Select" side="top" delayDuration={0}>
            <kbd className="kbd focus-ring" tabIndex={0}>Enter</kbd>
          </Tooltip>
          {'.'}
        </p>
      </Frame>

      {/* ── IN CONTEXT ──────────────────────────────────────────────────────── */}
      <SubHead meta="service catalog header">In context</SubHead>
      <Frame label="service-detail action bar — hover any control to reveal its hint">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            paddingBlock: 'var(--space-2)',
            paddingInline: 'var(--space-3)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          {[
            { icon: <Icons.search size={14} />, label: 'Find a service', key: '⌘K' },
            { icon: <Icons.filter size={14} />, label: 'Filter by team', key: undefined },
            { icon: <Icons.bell size={14} />, label: 'Watch for incidents', key: undefined },
            { icon: <Icons.settings size={14} />, label: 'Catalog settings', key: undefined },
          ].map(({ icon, label, key }) => (
            <Tooltip
              key={label}
              content={key ? `${label} (${key})` : label}
              side="bottom"
              delayDuration={200}
            >
              <button
                className="btn icon ghost"
                aria-label={label}
                style={{ inlineSize: 'var(--space-8)', blockSize: 'var(--space-8)' }}
              >
                {icon}
              </button>
            </Tooltip>
          ))}
        </div>
      </Frame>
      <Lede up>
        On a real toolbar, four icon-only buttons would be a guessing game — every glyph carries one
        scoped hint and its shortcut, never a duplicate of the icon. A 200ms open delay keeps quick
        cursor passes from flashing bubbles.
      </Lede>

      {/* ── STATES ──────────────────────────────────────────────────────────── */}
      <SubHead meta="controlled · disabled">States</SubHead>
      <Frame label="controlled (pinned open) · disabled trigger" row code={STATES_CODE}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'center' }}>
          {/* Controlled — the bubble is pinned open via the `open` prop; the reader
              reads it without hovering, and the toggle exercises onOpenChange. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Tooltip content="Deploys to staging (⌘⏎)" side="top" open={pinned} onOpenChange={setPinned}>
              <button className="btn icon" aria-label="Deploy to staging">
                <Icons.command size={14} />
              </button>
            </Tooltip>
            <button
              className="btn ghost xs focus-ring"
              type="button"
              aria-pressed={pinned}
              onClick={() => setPinned((v) => !v)}
            >
              {pinned ? 'Hide bubble' : 'Pin bubble open'}
            </button>
            <span className="t-mono-label">open={String(pinned)}</span>
          </div>

          {/* Disabled — a disabled button fires no events, so the hint moves to a
              focusable wrapper that explains WHY the action is blocked. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Tooltip content="Resolve the failing check first" side="top" delayDuration={0}>
              <span className="focus-ring" tabIndex={0} style={{ display: 'inline-flex', borderRadius: 'var(--radius-md)' }}>
                <button className="btn ember" disabled aria-describedby={undefined}>Merge</button>
              </span>
            </Tooltip>
            <span className="t-mono-label">disabled trigger</span>
          </div>
        </div>
      </Frame>
      <Lede up>
        In <Mono>open</Mono>-controlled mode the bubble is driven entirely by props — pin it for a
        coach-mark or live preview, and read <Mono>onOpenChange</Mono> to sync your own state. A{' '}
        <strong style={{ color: 'var(--fg)' }}>disabled</strong> button emits no hover or focus
        events, so the tooltip never fires; wrap it in a focusable element and explain the blocker
        there instead of silently swallowing the hint.
      </Lede>

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>
        The tooltip bubble has <Mono>role="tooltip"</Mono> and the trigger receives{' '}
        <Mono>aria-describedby</Mono> pointing to it while open — screen readers announce the hint
        as supplementary text after the element's own label. Critical information the user must
        read to act belongs in a visible label, never a tooltip.
      </Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 'var(--space-3)' }}>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-3)' }}>Keyboard</div>
          <div role="list">
            <div className="kbd-row" role="listitem">
              <span className="label">Focus the trigger — opens the tooltip immediately</span>
              <span className="kbd-chord trailing"><span className="kbd">Tab</span></span>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label">Dismiss while keeping focus on the trigger</span>
              <span className="kbd-chord trailing"><span className="kbd">Esc</span></span>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label">Activate the underlying control (never the bubble)</span>
              <span className="kbd-chord trailing"><span className="kbd">Enter</span><span className="kbd">Space</span></span>
            </div>
          </div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, marginBlockStart: 'var(--space-2)' }}>
            The tooltip never traps focus — the trigger must be a real focusable control.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-3)' }}>ARIA</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The bubble is <Mono>role="tooltip"</Mono>; while open the trigger gets{' '}
            <Mono tone="subtle">aria-describedby</Mono> pointing to the bubble&apos;s stable{' '}
            <Mono tone="subtle">id</Mono> (held in a ref, so it survives re-renders). Screen readers
            read the hint as supplementary text <em>after</em> the trigger&apos;s own label, never as
            a replacement for it.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-3)' }}>Contrast &amp; dismissal</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Tip text clears AA (<span style={{ fontVariantNumeric: 'tabular-nums' }}>4.5:1</span>)
            against the elevated bubble in both themes. Per WCAG{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>1.4.13</span> the bubble is{' '}
            <strong style={{ color: 'var(--fg)' }}>hoverable</strong> — moving the cursor onto it
            cancels the close timer — and persists until <span className="kbd">Esc</span>, blur, or
            hover-out.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-3)' }}>Reduced motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            By default the bubble fades in with a{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>4px</span> offset slide over{' '}
            <Mono tone="subtle">--dur-fast</Mono>. Under <Mono>prefers-reduced-motion</Mono> the
            component sets <Mono tone="subtle">.tip-instant</Mono> — no transform, no transition —{' '}
            and the open-delay timer is bypassed so the hint appears at once.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — align="start" anchors to the inline-start (right) edge'
        row
        code={RTL_CODE}
      >
        <div dir="rtl" style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', paddingBlock: 'var(--space-3)' }}>
          {/* align="start" in RTL → bubble aligns to the inline-start (right) edge of the trigger */}
          <Tooltip content="بحث (⌘K)" side="top" align="start" delayDuration={0}>
            <button className="btn icon" aria-label="بحث">
              <Icons.search size={14} />
            </button>
          </Tooltip>
          <Tooltip content="فلتر" side="right" delayDuration={0}>
            <button className="btn icon ghost" aria-label="فلتر">
              <Icons.filter size={14} />
            </button>
          </Tooltip>
          <Tooltip content="الإعدادات" side="bottom" align="start" delayDuration={0}>
            <button className="btn icon outline" aria-label="الإعدادات">
              <Icons.settings size={14} />
            </button>
          </Tooltip>
          <Tooltip content="الإشعارات" side="left" delayDuration={0}>
            <button className="btn icon ghost" aria-label="الإشعارات">
              <Icons.bell size={14} />
            </button>
          </Tooltip>
        </div>
      </Frame>
      <Lede up>
        Top and bottom placements with <Mono>align="start"</Mono> anchor to the inline-start (right) edge under <Mono>dir="rtl"</Mono>. Left and right
        placements use <Mono>position:fixed</Mono> + <Mono>getBoundingClientRect()</Mono> so the
        bubble always lands on the visual side requested, regardless of text direction.
        Non-directional glyphs (dots, carets) do not mirror.
      </Lede>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 36px 56px', justifyContent: 'center' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <button className="btn icon" tabIndex={-1} aria-label="Search">
                <Icons.search size={14} />
              </button>
              {/* static bubble representation — mirrors the shipped .tip-bubble */}
              <div style={{
                position: 'absolute', insetBlockEnd: 'calc(100% + 6px)', insetInlineStart: '50%',
                transform: 'translateX(-50%)',
                padding: '6px 10px', fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.4,
                color: 'var(--fg)', background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)',
                whiteSpace: 'nowrap', boxShadow: 'var(--elev-3)',
              }}>Search (⌘K)</div>
              <span className="lead h" style={{ insetBlockStart: -32, insetInlineEnd: -28, inlineSize: 24 }} />
              <span className="lead h" style={{ insetBlockStart: -8, insetInlineEnd: -28, inlineSize: 24 }} />
              <span className="lead h" style={{ insetBlockEnd: 14, insetInlineEnd: -28, inlineSize: 24 }} />
              <div className="pin" style={{ insetBlockStart: -40, insetInlineEnd: -52 }}>1</div>
              <div className="pin" style={{ insetBlockStart: -16, insetInlineEnd: -52 }}>2</div>
              <div className="pin" style={{ insetBlockEnd: 6, insetInlineEnd: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Body.</b>{' '}
              Geist <Mono>--text-sm</Mono> at weight 500. One short line. Sentence case, no
              trailing punctuation. Keyboard shortcut in <Mono>(parens)</Mono> at the end if relevant.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Anchor offset.</b>{' '}
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>6px</span> gap between bubble and
              trigger. Animates <span style={{ fontVariantNumeric: 'tabular-nums' }}>4px</span> on
              enter for a soft pop. Instant under <Mono>prefers-reduced-motion</Mono>.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Trigger.</b>{' '}
              Hover OR keyboard focus. Touch users never see tooltips — on tap, use a
              bottom sheet or label instead.
            </span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — clarify icon-only triggers</div>
          <div className="body">
            <Tooltip content="Open command palette (⌘K)" side="top" delayDuration={0}>
              <button className="btn icon" aria-label="Open command palette">
                <Icons.command size={14} />
              </button>
            </Tooltip>
          </div>
          <div className="note">
            An icon-only button without a visible label is a riddle. Tooltip + <Mono>aria-label</Mono> is the canonical pair — both sighted and AT users are served.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — restate visible text</div>
          <div className="body">
            <Tooltip content="Click to deploy" side="top" delayDuration={0}>
              <button className="btn ember">Deploy</button>
            </Tooltip>
          </div>
          <div className="note">
            If the label already says "Deploy", a tooltip saying "Click to deploy" is noise. Reserve tooltips for context the user cannot infer from the visible UI.
          </div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────────── */}
      <SubHead meta="TooltipProps">API reference</SubHead>
      <PropsTable
        label="<Tooltip />"
        rows={[
          { prop: 'content', type: 'ReactNode', required: true, description: 'Tooltip text. One short line, sentence case, no trailing punctuation.' },
          { prop: 'children', type: 'ReactElement', required: true, description: 'The trigger — must be a focusable element (button, a, input…).' },
          { prop: 'side', type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: 'Placement relative to the trigger. Auto-flips when the bubble clips the viewport.' },
          { prop: 'align', type: '"start" | "center" | "end"', default: '"center"', description: 'Alignment along the chosen side.' },
          { prop: 'delayDuration', type: 'number', default: '500', description: 'Milliseconds before the tooltip opens on hover.' },
          { prop: 'closeDelayDuration', type: 'number', default: '100', description: 'Milliseconds before the tooltip closes after hover-out.' },
          { prop: 'open', type: 'boolean', description: 'Force the open state (controlled mode).' },
          { prop: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the controlled open state should change.' },
          { prop: 'className', type: 'string', description: 'Extra CSS classes merged via cn() on the tooltip bubble.' },
        ]}
      />
    </Section>
  );
}
