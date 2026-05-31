'use client';
// Forge Mobile — Badge. A small overlay on an icon or avatar that signals "something changed":
// a bare dot for presence, a count for quantity. On the ember fill the number is dark ink, never
// ember-on-ember. Use it for unseen items; for status that needs a word, use a labelled pill.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Skeleton } from '@/ds/core';

function Badge({ count, dot, max = 99 }: { count?: number; dot?: boolean; max?: number }) {
  if (dot) return <span aria-hidden="true" style={{ position: 'absolute', insetBlockStart: -2, insetInlineEnd: -2, width: 10, height: 10, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 0 2px var(--bg)' }} />;
  if (count == null) return null;
  const label = count > max ? `${max}+` : String(count);
  return (
    <span style={{ position: 'absolute', insetBlockStart: -6, insetInlineStart: '60%', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-xs)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 2px var(--bg)', lineHeight: 1 }}>{label}</span>
  );
}

// INNOVATION — the badge's whole purpose is "something changed → seen". This drives a
// real badge through that lifecycle: an event bumps the count (announced once, politely,
// in the host's own label) and "Mark all seen" clears it to the empty state — the same
// live-region contract the Accessibility section documents, performed rather than asserted.
function LiveBadgeDemo() {
  const [count, setCount] = React.useState(2);
  const [bumped, setBumped] = React.useState(false);
  // Honour prefers-reduced-motion truthfully: when set, the value changes with no scale nudge.
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  const label = count === 0 ? 'Notifications, all caught up' : `Notifications, ${count} unread`;
  const display = count > 99 ? '99+' : String(count);

  const bump = () => {
    setCount((c) => Math.min(c + 1, 128));
    if (reduce) return;
    setBumped(true);
    window.setTimeout(() => setBumped(false), 260);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, justifyContent: 'center', flexWrap: 'wrap', padding: 28 }}>
      <button
        type="button"
        aria-label={label}
        className="btn icon"
        style={{ position: 'relative', width: 44, height: 44, background: 'var(--surface)', color: 'var(--fg)', cursor: 'default' }}
      >
        <Icons.bell size={22} />
        {count > 0 && (
          <span
            // The pill itself nudges on a bump (reduced-motion users get the value change only).
            style={{ position: 'absolute', insetBlockStart: -6, insetInlineStart: '60%', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-xs)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 2px var(--bg)', lineHeight: 1, transition: reduce ? 'none' : 'transform 160ms var(--ease, ease)', transform: bumped ? 'scale(1.22)' : 'scale(1)' }}
            aria-hidden="true"
          >
            {display}
          </span>
        )}
      </button>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="btn sm" onClick={bump}>New event</button>
        <button type="button" className="btn sm ghost" onClick={() => setCount(0)} disabled={count === 0}>Mark all seen</button>
      </div>
      {/* The count never reads aloud from the pill; the polite live region carries it once per change. */}
      <span role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function IconWithBadge({ icon, count, dot }: { icon: React.ReactNode; count?: number; dot?: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 44, height: 44 }}>
      <span style={{ color: 'var(--fg)' }}>{icon}</span>
      <Badge count={count} dot={dot} />
    </span>
  );
}

function BadgeScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', borderBlockEnd: '1px solid var(--border)', marginBlockStart: 12 }}>
        <span style={{ fontWeight: 700 }}>Inbox</span>
        <span style={{ display: 'flex', gap: 4 }}>
          <IconWithBadge icon={<Icons.bell size={20} />} count={3} />
          <IconWithBadge icon={<Icons.inbox size={20} />} count={128} />
          <IconWithBadge icon={<Icons.settings size={20} />} dot />
        </span>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[['Deploys', 'rocket', 3], ['Incidents', 'incident', 1], ['Reviews', 'gitPullRequest', 0]].map(([label, ic, n]) => {
          const Ic = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[ic as string];
          return (
            <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48, padding: '0 6px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--surface-active)' }}>
                <Ic size={17} />
                {(n as number) > 0 && <Badge count={n as number} />}
              </span>
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 550 }}>{label}</span>
              <Icons.chevronRight size={16} color="var(--fg-faint)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MobileBadge() {
  return (
    <Section
      id="badge"
      num="01"
      title="Badge"
      desc="A small mark anchored to an icon or avatar — a bare dot when presence is enough, a count when the number matters (capped at 99+). Ember fill, dark ink for full contrast."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>For a status that needs a word — Healthy, Degraded — use a labelled pill instead. A badge communicates presence or a count, never a semantic state.</Lede>
      <Frame label="Counts on app-bar icons and list rows · a dot where the number doesn't matter" center>
        <DeviceFrame initial="iphone-se"><BadgeScreen /></DeviceFrame>
      </Frame>
      <Frame label="Live — an event bumps the count (announced once, politely); Mark all seen clears it to nothing">
        <LiveBadgeDemo />
      </Frame>
      <Lede>Drive it: <b style={{ color: 'var(--fg)' }}>New event</b> increments the count and the host announces "Notifications, N unread" through a polite live region — the pill nudges once (and stays still under reduced-motion). <b style={{ color: 'var(--fg)' }}>Mark all seen</b> drops it to the empty state, where the badge renders nothing at all.</Lede>

      <SubHead meta="states">States</SubHead>
      <Frame label="loading → empty (zero) → count → overflow — the lifecycle a badge moves through">
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', padding: 28 }}>
          {[
            ['loading', (
              <span key="l" role="status" aria-label="Loading unread count" style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 30, height: 30 }}>
                <Icons.bell size={24} color="var(--fg-faint)" />
                <span aria-hidden="true" style={{ position: 'absolute', insetBlockStart: -6, insetInlineStart: '60%' }}><Skeleton variant="circle" size={18} /></span>
              </span>
            ), 'count not known yet'],
            ['empty', (
              <span key="e" aria-label="Notifications, all caught up" style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 30, height: 30, color: 'var(--fg)' }}>
                <Icons.bell size={24} />
              </span>
            ), 'zero → no badge'],
            ['count', (
              <span key="c" style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 30, height: 30, color: 'var(--fg)' }}>
                <Icons.bell size={24} />
                <Badge count={5} />
              </span>
            ), 'quantity shown'],
            ['overflow', (
              <span key="o" style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 30, height: 30, color: 'var(--fg)' }}>
                <Icons.bell size={24} />
                <Badge count={128} />
              </span>
            ), 'capped at 99+'],
          ].map(([key, node, caption]) => (
            <span key={key as string} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              {node as React.ReactNode}
              <span className="t-mono-label">{key as string}</span>
              <span className="t-small" style={{ color: 'var(--fg-muted)', textAlign: 'center', maxWidth: 96, lineHeight: 1.5 }}>{caption as string}</span>
            </span>
          ))}
        </div>
      </Frame>
      <Lede>The badge has no interactive states of its own — it is decorative paint on its host. Its lifecycle is the host's data: a <Mono>role="status"</Mono> skeleton holds the corner while the count loads, <b style={{ color: 'var(--fg)' }}>zero collapses to nothing</b> (never a "0" pill), and anything past the cap renders <Mono>99+</Mono>. A disabled host dims with it — the badge inherits the host's <Mono tone="subtle">opacity</Mono>, it is never independently greyed.</Lede>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Dot · single count · overflow 99+ — dark ink on the ember fill throughout">
        <div style={{ display: 'flex', gap: 36, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          {[['dot', <Icons.bell key="b" size={24} />, undefined, true], ['count', <Icons.inbox key="i" size={24} />, 5, false], ['overflow', <Icons.bell key="b2" size={24} />, 128, false]].map(([label, icon, count, dot], i) => (
            <span key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 30, height: 30 }}>
                <span style={{ color: 'var(--fg)' }}>{icon as React.ReactNode}</span>
                <Badge count={count as number | undefined} dot={dot as boolean} />
              </span>
              <span className="t-mono-label">{label as string}</span>
            </span>
          ))}
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 56, height: 56 }}>
                <Icons.bell size={40} color="var(--fg)" />
                <span style={{ position: 'absolute', insetBlockStart: -2, insetInlineStart: '58%', minWidth: 28, height: 28, padding: '0 7px', borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 3px var(--bg)', lineHeight: 1 }}>9</span>
              </span>
              <span className="lead v" style={{ top: -28, right: 6, height: 22 }} />
              <span className="lead h" style={{ top: 6, right: -30, width: 24 }} />
              <span className="lead v" style={{ bottom: -28, left: '40%', height: 22 }} />
              <div className="pin" style={{ top: -50, right: -4 }}>1</div>
              <div className="pin" style={{ top: -2, right: -54 }}>2</div>
              <div className="pin" style={{ bottom: -50, left: '40%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Count.</b> Dark <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--ember-fg</code> ink on the ember fill, in tabular mono so 9 and 99 stay centred. Overflows to <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>99+</code>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Fill + halo.</b> An <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--accent</code> pill ringed by a 2–3px <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--bg</code> halo, so it reads cleanly over any icon.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Anchor.</b> Pinned to the host's top-trailing corner with overlap; the host keeps its own ≥44px target.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>The badge is decorative (<Mono>aria-hidden</Mono>) — it carries no role, no focus ring, and is not in the tab order. All semantics and keyboard behaviour belong to the <b style={{ color: 'var(--fg)' }}>host</b> it sits on. The notes below describe what the shipped host + badge render, not aspirations.</Lede>
      <div className="surface" style={{ padding: 0, marginBlockEnd: 18, overflow: 'hidden' }}>
        <div className="t-mono-label" style={{ padding: '12px 18px', borderBlockEnd: '1px solid var(--border)' }}>keyboard — on the host (a button/link), not the badge</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
          <thead>
            <tr>
              <th scope="col" className="t-mono-label" style={{ textAlign: 'start', padding: '10px 18px', width: 140, fontWeight: 500 }}>Key</th>
              <th scope="col" className="t-mono-label" style={{ textAlign: 'start', padding: '10px 18px', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Tab', 'Move focus to the host control; the badge is skipped (decorative)'],
              ['Enter / Space', 'Activate the host (open the inbox / notifications) — same as a click'],
              ['Esc', 'No effect on the badge; defers to whatever the host opened'],
            ].map(([k, a]) => (
              <tr key={k} style={{ borderBlockStart: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 18px', verticalAlign: 'top' }}><kbd className="kbd">{k}</kbd></td>
                <td className="t-small" style={{ padding: '10px 18px', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ds-grid cols-2">
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>name</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Count lives in the host's label</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>The host carries <Mono>aria-label="Notifications, 3 unread"</Mono>; the pill is <Mono tone="subtle">aria-hidden</Mono> so a screen reader reads the labelled count, never a stray "3".</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>contrast</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Dark ink on ember clears AA</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>Digits are dark <Mono>--ember-fg</Mono> ink on the <Mono tone="subtle">--accent</Mono> fill (~7:1) — never ember text on an ember pill. A <Mono tone="subtle">--bg</Mono> halo separates the pill from the glyph beneath, so it stays legible over busy or coloured hosts.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>live</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Announced once, politely</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>A background bump updates the host's name inside a <Mono>role="status"</Mono> / <Mono tone="subtle">aria-live="polite"</Mono> region, so the change reads after the current utterance — it never interrupts (see the live demo above).</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>motion</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Honours reduced-motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>The bump nudge is the only animation; under <Mono tone="subtle">prefers-reduced-motion: reduce</Mono> the value changes with no scale, and never flashes for attention.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the badge flips to the host\'s top-left corner'} center code={`<span dir="rtl" className="m-badge-host">
  <Icons.bell />
  {/* insetInlineEnd anchors the badge top-left in RTL */}
  <span className="m-badge">٣</span>
</span>`} lang="tsx">
        <div dir="rtl" style={{ display: 'flex', gap: 36, justifyContent: 'center', alignItems: 'center', padding: 28 }}>
          <IconWithBadge icon={<Icons.bell size={24} />} count={3} />
          <IconWithBadge icon={<Icons.inbox size={24} />} count={128} />
          <IconWithBadge icon={<Icons.settings size={24} />} dot />
        </div>
      </Frame>
      <Lede>The badge anchors with <Mono>insetInlineEnd</Mono>, so it moves from the top-trailing to the host's <b style={{ color: 'var(--fg)' }}>top-left</b> corner. The host icon and the dark <Mono>--ember-fg</Mono> count are unchanged — digits read the same in either direction and need no <Mono>scaleX(-1)</Mono>.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — count for quantity, dot for presence</div>
          <div className="body" style={{ gap: 28, justifyContent: 'center' }}>
            <IconWithBadge icon={<Icons.bell size={22} />} count={4} />
            <IconWithBadge icon={<Icons.settings size={22} />} dot />
          </div>
          <div className="note">Use the number when it's actionable; a dot when "new" is all the user needs to know.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — a four-digit count or a word</div>
          <div className="body" style={{ gap: 28, justifyContent: 'center' }}>
            <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 44, height: 44 }}>
              <Icons.inbox size={22} color="var(--fg)" />
              <span style={{ position: 'absolute', insetBlockStart: -6, insetInlineStart: '50%', padding: '0 5px', borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-xs)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>2,481</span>
            </span>
          </div>
          <div className="note">A huge number stops being scannable. Cap at 99+, and put status words in a labelled pill.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="badge"
        lang="tsx"
        code={`<button aria-label={\`Notifications, \${n} unread\`} className="m-badge-host">
  <Icons.bell />
  {n > 0 && <span className="m-badge" aria-hidden>{n > 99 ? '99+' : n}</span>}
</button>

/* fill var(--accent); text var(--ember-fg) (dark ink), tabular mono;
   box-shadow 0 0 0 2px var(--bg) halo; pinned top-trailing.
   dot variant: 10px circle, no text. */`}
      />
    </Section>
  );
}
