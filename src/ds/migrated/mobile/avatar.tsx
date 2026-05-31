'use client';
// Eidos Mobile — Avatar. A compact stand-in for a person or service: initials by default, an
// icon for non-human actors, an optional presence dot, and an overlapping stack for groups.
// Initials sit in dark or light ink chosen against the tile — never low-contrast on its fill.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Skeleton } from '@/ds/core';

const SIZES = { sm: 28, md: 40, lg: 56 } as const;
type Size = keyof typeof SIZES;
type Status = 'online' | 'busy' | 'offline';
const STATUS_COLOR: Record<Status, string> = { online: 'var(--success)', busy: 'var(--danger)', offline: 'var(--fg-faint)' };

const STATUS_LABEL: Record<Status, string> = { online: 'online', busy: 'busy', offline: 'offline' };

function Avatar({ name, icon, accent, size = 'md', status, label }: { name?: string; icon?: React.ReactNode; accent?: boolean; size?: Size; status?: Status; label?: string }) {
  const px = SIZES[size];
  const initials = name ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : '';
  const dot = Math.round(px * 0.3);
  // The accessible name is the full person/actor name (or an explicit label for icon-only
  // actors) — never the bare initials. Status, when present, is appended as text.
  const aria = (label ?? name ?? 'avatar') + (status ? `, ${STATUS_LABEL[status]}` : '');
  return (
    <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: px, height: px, flex: 'none' }}>
      <span
        role="img"
        aria-label={aria}
        style={{
          width: px, height: px, borderRadius: 999, display: 'grid', placeItems: 'center', overflow: 'hidden',
          background: accent ? 'var(--accent)' : 'var(--surface-active)',
          color: accent ? 'var(--ember-fg)' : 'var(--fg)',
          fontWeight: 700, fontSize: px * 0.36, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
          border: accent ? 'none' : '1px solid var(--border)',
        }}
      >
        <span aria-hidden="true">{icon ?? initials}</span>
      </span>
      {status && <span aria-hidden="true" style={{ position: 'absolute', insetBlockEnd: 0, insetInlineEnd: 0, width: dot, height: dot, borderRadius: 999, background: STATUS_COLOR[status], boxShadow: '0 0 0 2px var(--bg)' }} />}
    </span>
  );
}

function Stack({ names }: { names: string[] }) {
  const extra = names.length - 3;
  // Stack is a real group: role="group" + an aria-label that names every member so
  // assistive tech reads "Group of 5: Jordan Diaz, …" rather than five mute tiles.
  const groupLabel = `Group of ${names.length}: ${names.join(', ')}`;
  return (
    <span role="group" aria-label={groupLabel} style={{ display: 'inline-flex' }}>
      {names.slice(0, 3).map((n, i) => (
        <span key={n} aria-hidden="true" style={{ marginInlineStart: i === 0 ? 0 : -10, borderRadius: 999, boxShadow: '0 0 0 2px var(--bg)' }}><Avatar name={n} size="md" /></span>
      ))}
      {extra > 0 && (
        <span aria-hidden="true" style={{ marginInlineStart: -10, width: 40, height: 40, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 0 0 2px var(--bg)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color: 'var(--fg-muted)' }}>+{extra}</span>
      )}
    </span>
  );
}

function AvatarScreen() {
  return (
    <div style={{ padding: '58px 18px 0', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBlockEnd: 4 }}>Rotation</div>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.01em', marginBlockEnd: 14 }}>On-call</div>
      {[['Jordan Diaz', 'Primary', 'online'], ['Sam Okafor', 'Secondary', 'busy'], ['Lina Park', 'Manager', 'offline']].map(([n, role, st]) => (
        <div key={n as string} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBlockEnd: '1px solid var(--border)' }}>
          <Avatar name={n as string} status={st as Status} />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 'var(--text-body)', lineHeight: 1.3 }}>{n}</div><div style={{ fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--fg-muted)' }}>{role}</div></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>{STATUS_LABEL[st as Status]}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBlockStart: 16 }}>
        <Avatar icon={<Icons.bot size={18} />} accent label="Eidos Agent" />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 'var(--text-body)', lineHeight: 1.3 }}>Eidos Agent</div><div style={{ fontSize: 'var(--text-base)', lineHeight: 1.4, color: 'var(--fg-muted)' }}>Automation</div></div>
        <Stack names={['Jordan Diaz', 'Sam Okafor', 'Lina Park', 'Ravi N', 'Mei L']} />
      </div>
    </div>
  );
}

export default function MobileAvatar() {
  return (
    <Section
      id="avatar"
      num="01"
      title="Avatar"
      desc="Round stand-in for a person or service — initials by default, monoline icon for bots, optional presence dot, overlapping stack for groups. Initials pick dark or light ink for contrast."
    >
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Reserve an ember tile for the one actor you want to stand out — the AI agent or the current user. All other actors use the default surface tile.</Lede>
      <Frame label="Initials, a presence dot, an ember bot tile, and a +N group stack" center>
        <DeviceFrame initial="iphone-se"><AvatarScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Sizes &amp; types</SubHead>
      <Frame label="sm · md · lg — initials, icon, ember actor, and presence states">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center', padding: 24 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Avatar name="Jordan Diaz" size="sm" />
            <Avatar name="Jordan Diaz" size="md" />
            <Avatar name="Jordan Diaz" size="lg" />
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Avatar icon={<Icons.bot size={18} />} accent label="Eidos Agent" />
            <Avatar name="Sam Okafor" status="online" />
            <Avatar name="Lina Park" status="busy" />
            <Avatar name="Ravi N" status="offline" />
          </div>
        </div>
      </Frame>

      <SubHead meta="states">Fallback ladder &amp; loading</SubHead>
      <Lede up>An avatar rarely has a photo. It resolves down a fixed ladder — and while the record loads, it holds a circular skeleton so the row never reflows when the real tile arrives.</Lede>
      <Frame label="loading → photo → initials → generic glyph — the order an avatar degrades through">
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', padding: 24 }}>
          {([
            ['loading', <span key="l" role="status" aria-label="Loading avatar" style={{ display: 'inline-grid', placeItems: 'center', width: 40, height: 40 }}><Skeleton variant="circle" size={40} /></span>, 'no record yet'],
            ['photo', <span key="p" role="img" aria-label="Jordan Diaz" style={{ width: 40, height: 40, borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface)', color: 'var(--fg-muted)', border: '1px solid var(--border)', overflow: 'hidden' }}><span aria-hidden="true"><Icons.user size={22} /></span></span>, 'image present'],
            ['initials', <Avatar key="i" name="Jordan Diaz" />, 'name, no image'],
            ['glyph', <span key="g" role="img" aria-label="Unknown member" style={{ width: 40, height: 40, borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface-active)', color: 'var(--fg-faint)', border: '1px dashed var(--border-strong)' }}><span aria-hidden="true"><Icons.user size={18} /></span></span>, 'no name'],
          ] as const).map(([key, node, hint]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, minWidth: 84 }}>
              {node}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span className="t-mono-label">{key}</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-faint)' }}>{hint}</span>
              </div>
            </div>
          ))}
        </div>
      </Frame>
      <Lede>Each rung is reachable on its own: pass <Mono>src</Mono> for a photo, <Mono>name</Mono> for initials, neither for the dashed unknown glyph. The unknown tile still carries <Mono tone="subtle">role="img"</Mono> + <Mono tone="subtle">aria-label="Unknown member"</Mono>, and the loading placeholder is wrapped in <Mono tone="subtle">role="status"</Mono> so the wait is announced — never a silent blank circle.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: 72, height: 72 }}>
                <span style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--surface-active)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 26, fontFamily: 'var(--font-mono)' }}>JD</span>
                <span style={{ position: 'absolute', insetBlockEnd: 2, insetInlineEnd: 2, width: 18, height: 18, borderRadius: 999, background: 'var(--success)', boxShadow: '0 0 0 3px var(--bg)' }} />
              </span>
              <span className="lead v" style={{ top: -26, left: '50%', height: 20, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ bottom: 8, right: -30, width: 24 }} />
              <span className="lead h" style={{ top: '50%', left: -30, width: 24 }} />
              <div className="pin" style={{ top: -48, left: '50%', transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ bottom: 0, right: -54 }}>2</div>
              <div className="pin" style={{ top: '46%', left: -54 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Content.</b> Up to two initials in mono, or a monoline icon for non-human actors. Ink contrasts the tile — light on the neutral surface, dark <Mono>--ember-fg</Mono> on an ember tile.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Presence dot.</b> A status colour (online/busy/offline) ringed with a <Mono>--bg</Mono> halo, pinned to the trailing-bottom corner.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Tile.</b> A circle on <Mono>--surface-active</Mono> with a hairline border; one ember tile per view at most.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>The avatar is a non-interactive <Mono>role="img"</Mono> — it carries no focus ring and is not in the tab order on its own; wrap it in the row's link or button when the whole row is the target. The behaviours below are what the shipped component renders, not aspirations. The loading skeleton's shimmer rests to a flat tint under <Mono tone="subtle">prefers-reduced-motion: reduce</Mono>.</Lede>
      <div className="ds-grid cols-2">
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>role + name</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Name, never the initials</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>The tile renders <Mono>role="img"</Mono> with <Mono tone="subtle">aria-label</Mono> set to the full name (or an explicit label for icon-only actors); the initials/glyph inside are <Mono tone="subtle">aria-hidden</Mono> so screen readers say "Jordan Diaz", not "J D".</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>contrast</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Ink clears AA on any tile</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>Ink is chosen against the fill — dark <Mono>--ember-fg</Mono> on ember, light <Mono tone="subtle">--fg</Mono> on the neutral surface — so the initials always clear AA. The presence dot also wears a <Mono tone="subtle">--bg</Mono> halo so it stays distinct over any tile.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>status</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Not by colour alone</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>Presence is folded into the label (<Mono>aria-label="Sam Okafor, busy"</Mono>) and paired with a visible mono status word in the row, so the dot's hue is never the only signal.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>group</div>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>The stack names its members</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>The stack is a <Mono>role="group"</Mono> whose <Mono tone="subtle">aria-label</Mono> lists every member ("Group of 5: Jordan Diaz, …"); the overlapping tiles and the <Mono tone="subtle">+N</Mono> overflow are <Mono tone="subtle">aria-hidden</Mono> decoration.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the presence dot flips to the leading-bottom (left) corner'} center code={`<span dir="rtl">
  {/* insetInlineEnd pins the dot to the bottom-left in RTL */}
  <Avatar name="جوردان" status="online" />
</span>`} lang="tsx">
        <div dir="rtl" style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 24 }}>
          <Avatar name="Sam Okafor" status="online" />
          <Avatar name="Lina Park" status="busy" />
          <Avatar icon={<Icons.bot size={18} />} accent label="Eidos Agent" />
          <Stack names={['Jordan Diaz', 'Sam Okafor', 'Lina Park', 'Ravi N', 'Mei L']} />
        </div>
      </Frame>
      <Lede>The presence dot is pinned with <Mono>insetInlineEnd</Mono>, so it moves from the trailing-bottom to the <b style={{ color: 'var(--fg)' }}>leading-bottom (left)</b> corner; the group stack overlaps from the right via <Mono>marginInlineStart</Mono>. Initials and the bot glyph are script-agnostic and need no <Mono>scaleX(-1)</Mono>.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — initials, one ember actor</div>
          <div className="body" style={{ gap: 14, justifyContent: 'center' }}>
            <Avatar name="Jordan Diaz" />
            <Avatar name="Sam Okafor" status="online" />
            <Avatar icon={<Icons.bot size={18} />} accent label="Eidos Agent" />
          </div>
          <div className="note">People in neutral tiles; the agent gets the single ember tile so the automated actor stands out.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — ember on every tile</div>
          <div className="body" style={{ gap: 14, justifyContent: 'center' }}>
            <Avatar name="Jordan Diaz" accent />
            <Avatar name="Sam Okafor" accent />
            <Avatar name="Lina Park" accent />
          </div>
          <div className="note">Ember everywhere burns the accent and flattens hierarchy. Cap it at one actor per view.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="avatar"
        lang="tsx"
        code={`<span className="m-avatar" data-size="md" role="img" aria-label="Jordan Diaz, busy">
  {/* fallback ladder: src → initials → generic glyph */}
  <span aria-hidden>JD</span>          {/* or <Icon> for a bot */}
  <span className="m-avatar-status" data-status="busy" aria-hidden />
</span>

{/* loading: hold a circular skeleton inside role="status" so the row never reflows */}
<span role="status" aria-label="Loading avatar"><Skeleton variant="circle" size={40} /></span>

<span className="m-avatar-stack" role="group" aria-label="Group of 5: Jordan Diaz, …">
  {/* each tile + the +N overflow is aria-hidden decoration */}
</span>

/* sizes 28 / 40 / 56; initials in mono, tabular-nums.
   neutral tile = var(--surface-active) + var(--fg);
   accent tile = var(--accent) + var(--ember-fg) (dark ink) — one per view. */`}
      />
    </Section>
  );
}
