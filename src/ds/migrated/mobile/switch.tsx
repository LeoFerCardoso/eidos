'use client';
// Forge Mobile — Switch. A binary on/off control for a setting that takes effect
// immediately — no Save button. The mobile sibling of the desktop toggle, sized for
// a thumb and reading its state from the track fill, not colour alone.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Spinner, Skeleton, Alert, AlertTitle, AlertDescription } from '@/ds/core';

function Switch({ on, onChange, disabled, pending, invalid }: { on: boolean; onChange?: (v: boolean) => void; disabled?: boolean; pending?: boolean; invalid?: boolean }) {
  const inert = disabled || pending;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-busy={pending || undefined}
      aria-invalid={invalid || undefined}
      disabled={inert}
      onClick={() => onChange?.(!on)}
      style={{
        position: 'relative', width: 46, height: 28, flex: 'none', borderRadius: 999,
        border: invalid ? '1.5px solid var(--danger)' : 'none',
        padding: 0, cursor: inert ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        background: on ? 'var(--accent)' : 'var(--surface-active)',
        transition: 'background var(--dur) var(--ease)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', insetBlockStart: 3, insetInlineStart: on ? 21 : 3, width: 22, height: 22,
          borderRadius: 999, background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-1)',
          transition: 'inset-inline-start var(--dur) var(--ease-spring)',
          display: 'grid', placeItems: 'center',
        }}
      >
        {pending && <Spinner size={12} color="var(--fg-muted)" aria-label="Saving" />}
      </span>
    </button>
  );
}

function Row({ label, sub, on, onChange, disabled, pending, invalid }: { label: string; sub?: React.ReactNode; on: boolean; onChange?: (v: boolean) => void; disabled?: boolean; pending?: boolean; invalid?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBlockEnd: '1px solid var(--border)', opacity: disabled ? 0.55 : 1 }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.3, color: 'var(--fg)' }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 'var(--text-base)', lineHeight: 1.5, color: invalid ? 'var(--danger)' : 'var(--fg-muted)', marginBlockStart: 2 }}>{pending ? 'Saving…' : sub}</span>}
      </span>
      <Switch on={on} onChange={onChange} disabled={disabled} pending={pending} invalid={invalid} />
    </label>
  );
}

function SwitchScreen() {
  const [s, setS] = React.useState({ deploy: true, slack: true, digest: false });
  const [saving, setSaving] = React.useState<string | null>(null);
  // "Slack mirror" is the optimistic-write demo: every other flip the mock
  // server rejects the write, so the thumb springs over, then springs back —
  // the page's whole thesis ("applies on flip, no Save") shown failing safely.
  const [failed, setFailed] = React.useState(false);
  const attempt = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // Flip optimistically, then confirm — or, on a rejected write, revert.
  function flipSlack(v: boolean) {
    setFailed(false);
    setS((p) => ({ ...p, slack: v }));
    setSaving('slack');
    if (timer.current) clearTimeout(timer.current);
    const willFail = attempt.current++ % 2 === 1; // 1st flip confirms, 2nd rejects, …
    timer.current = setTimeout(() => {
      setSaving(null);
      if (willFail) { setS((p) => ({ ...p, slack: !v })); setFailed(true); }
    }, 700);
  }

  return (
    <div style={{ padding: '58px 18px 0', height: '100%' }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBlockEnd: 6 }}>Notifications</div>
      <Row label="Deploy alerts" sub="Push when a release reaches prod" on={s.deploy} onChange={(v) => setS({ ...s, deploy: v })} />
      <Row label="Slack mirror" sub="Cross-post to #releases" on={s.slack} onChange={flipSlack} pending={saving === 'slack'} invalid={failed} />
      {failed && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlock: '8px 0', padding: '8px 10px', borderRadius: 8, background: 'var(--danger-soft)', border: '1px solid var(--danger)', color: 'var(--fg)', fontSize: 'var(--text-base)', lineHeight: 1.4 }}>
          <Icons.alert size={14} style={{ color: 'var(--danger)', flex: 'none' }} /> <span>Couldn{'’'}t reach Slack — reverted. Tap to retry.</span>
        </div>
      )}
      <Row label="Weekly digest" sub="Monday 9am summary" on={s.digest} onChange={(v) => setS({ ...s, digest: v })} />
      <Row label="On-call override" sub="Requires admin" on={false} disabled />
    </div>
  );
}

// A settings list while its initial state is still loading from the server —
// the rows hold their shape with skeletons so the layout never jumps on arrival.
function LoadingScreen() {
  return (
    <div style={{ padding: '58px 18px 0', height: '100%' }} role="status" aria-label="Loading notification settings">
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBlockEnd: 6 }}>Notifications</div>
      {[180, 150, 120].map((w, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBlockEnd: '1px solid var(--border)' }}>
          <span style={{ flex: 1, minWidth: 0, display: 'grid', gap: 8 }}>
            <Skeleton variant="line" width={w} height={11} />
            <Skeleton variant="line" width={w - 60} height={11} />
          </span>
          <Skeleton variant="box" width={46} height={28} radius={999} />
        </div>
      ))}
    </div>
  );
}

// A settings group with nothing to configure yet — the honest empty state.
function EmptyScreen() {
  return (
    <div style={{ padding: '58px 18px 0', height: '100%' }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBlockEnd: 6 }}>Notifications</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, padding: '48px 20px', color: 'var(--fg-muted)' }}>
        <Icons.inbox size={26} />
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)' }}>No alerts to configure</span>
        <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.5 }}>Connect a service to start receiving deploy alerts here.</span>
      </div>
    </div>
  );
}

export default function MobileSwitch() {
  return (
    <Section
      id="switch"
      num="01"
      title="Switch"
      desc="A binary control — the setting applies the instant it flips, no Save needed. Use for independent on/off preferences in a list; Segmented control handles two-plus-state choices."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Frame label="Tap a row — the setting applies immediately" center>
        <DeviceFrame initial="iphone-se"><SwitchScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Frame label="Off · On · Disabled · Pending · Invalid — state reads from the track fill and thumb position, never colour alone">
        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', padding: 24 }}>
          {([
            ['off', <Switch key="o" on={false} />],
            ['on', <Switch key="n" on={true} />],
            ['disabled', <Switch key="d" on={true} disabled />],
            ['pending', <Switch key="p" on={true} pending />],
            ['invalid', <Switch key="i" on={false} invalid />],
          ] as const).map(([name, el]) => (
            <span key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              {el}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', color: 'var(--fg-muted)' }}>{name}</span>
            </span>
          ))}
        </div>
      </Frame>
      <Lede>The <Mono>invalid</Mono> ring appears only after a write is rejected (it carries <Mono>aria-invalid</Mono>); <Mono>pending</Mono> shows a thumb spinner with <Mono>aria-busy</Mono>; <Mono>disabled</Mono> drops to 40% and blocks the tap. None of them rely on hue alone — track fill plus thumb position read the same in greyscale.</Lede>

      <SubHead meta="in context">Loading, empty &amp; error recovery</SubHead>
      <Frame label="Initial fetch (skeletons) · nothing to configure (empty) · the live screen with optimistic write + revert on failure" center>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', padding: 24 }}>
          <DeviceFrame initial="iphone-se"><LoadingScreen /></DeviceFrame>
          <DeviceFrame initial="iphone-se"><EmptyScreen /></DeviceFrame>
          <DeviceFrame initial="iphone-se"><SwitchScreen /></DeviceFrame>
        </div>
      </Frame>
      <Frame label='A rejected write surfaces an inline assertive Alert next to the reverted row' code={`<Alert tone="danger">           {/* role="alert" */}
  <AlertTitle>Couldn’t reach Slack</AlertTitle>
  <AlertDescription>Switch reverted — tap to retry.</AlertDescription>
</Alert>`} lang="tsx">
        <div style={{ maxWidth: 420, margin: '0 auto', padding: 16 }}>
          <Alert tone="danger">
            <AlertTitle>Couldn{'’'}t reach Slack</AlertTitle>
            <AlertDescription>The mirror switch reverted to its last saved value — tap it to retry.</AlertDescription>
          </Alert>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '70px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 200, display: 'flex', justifyContent: 'center' }} aria-hidden="true">
              <div style={{ position: 'relative', width: 92, height: 56, borderRadius: 999, background: 'var(--accent)' }}>
                <span style={{ position: 'absolute', insetBlockStart: 6, insetInlineStart: 42, width: 44, height: 44, borderRadius: 999, background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-1)' }} />
              </div>
              <span className="lead v" style={{ top: -26, left: '30%', height: 20 }} />
              <span className="lead v" style={{ top: -26, left: '72%', height: 20 }} />
              <span className="lead v" style={{ bottom: -26, left: '50%', height: 20, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -48, left: '30%', transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -48, left: '72%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -48, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Track.</b> Off on <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--surface-active</code>; on fills with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--accent</code> — the only state shift carrying meaning.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Thumb.</b> An elevated 22px disc with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--shadow-1</code>; it slides end to end, so position reinforces the colour.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Hit area.</b> The control is 46×28 but its tappable label row clears 44px so the whole setting is one target.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: 12 }}>Keyboard</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 10, margin: 0 }}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>Move focus to the switch — a 2px ember <Mono>:focus-visible</Mono> ring appears; the whole row label is its accessible name.</dd>
            <dt><kbd className="kbd">Space</kbd> / <kbd className="kbd">Enter</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>Toggle on ⇄ off; the setting applies on the same key, no commit step.</dd>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>A <Mono>disabled</Mono> switch is skipped in the tab order; a <Mono>pending</Mono> one stays focusable but ignores re-taps.</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: 8 }}>VoiceOver / TalkBack</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>It is <Mono>role="switch"</Mono> with <Mono>aria-checked</Mono>, labelled by the row text — announced as {'"Deploy alerts, switch, on"'}. A pending write sets <Mono>aria-busy</Mono> on the switch; the thumb spinner is decorative (<Mono>aria-hidden</Mono>), so the busy state is announced once.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: 8 }}>State, not colour alone</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>On is shown by the thumb sliding to the end <i>and</i> the fill — so it survives greyscale and low vision. No on/off text needed.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: 8 }}>Errors &amp; live regions</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A rejected write sets <Mono>aria-invalid</Mono> on the switch (a danger ring) and surfaces an adjacent <Mono>role="alert"</Mono> banner, so the revert is announced assertively without moving focus.</div>
        </div>
        <div className="surface" style={{ padding: 18, gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: 8 }}>Motion &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The thumb spring and the pending spinner shorten to a calm fade under <Mono>prefers-reduced-motion</Mono>. The thumb keeps AA contrast against the ember track at both ends; loading rows are <Mono>{`<Skeleton>`}</Mono> in a single <Mono>role="status"</Mono> region.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the row swaps and "on" sits at the leading (left) edge'} center code={`<div dir="rtl"><Row label="تنبيهات النشر" on /></div>`} lang="tsx">
        <div dir="rtl">
          <div style={{ maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
            <Row label="Deploy alerts" sub="Push when a release reaches prod" on={true} />
            <Row label="Weekly digest" sub="Monday 9am summary" on={false} />
          </div>
        </div>
      </Frame>
      <Lede>Because the thumb travels to the leading edge via <Mono>inset-inline-start</Mono>, under <Mono>dir="rtl"</Mono> the "on" thumb rests on the left and the row label and switch swap sides; the symmetric track and its ember fill are unchanged.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — instant, independent settings</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
            <Row label="Deploy alerts" on={true} />
            <Row label="Weekly digest" on={false} />
          </div>
          <div className="note">Each row stands alone and applies on flip. No Save button to forget.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use it to pick one of many</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
            <Row label="Region · us-east" on={true} />
            <Row label="Region · eu-west" on={false} />
            <Row label="Region · ap-south" on={false} />
          </div>
          <div className="note">Mutually-exclusive options are radios, not three switches that can all be off.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="switch"
        lang="tsx"
        code={`<button role="switch" aria-checked={on} aria-busy={pending}
  aria-invalid={failed || undefined} className="m-switch"
  data-on={on} disabled={disabled || pending} onClick={() => flip(!on)}>
  <span className="m-switch-thumb" aria-hidden>
    {pending && <Spinner size={12} aria-hidden />}
  </span>
</button>

/* off: background var(--surface-active)
   on:  background var(--accent)        // track only — thumb stays elevated
   thumb 22px, box-shadow var(--shadow-1), slides via inset-inline-start
   pending: optimistic flip + aria-busy while the write confirms
   failed:  revert + aria-invalid ring + adjacent role="alert"
   wrap in a >=44px <label> row so the whole setting is the target */`}
      />
      <p className="ds-caption" style={{ marginBlockStart: 12 }}>
        The handset sibling of the desktop <a href="/toggle" style={{ color: 'var(--ember)' }}>toggle</a>; for a committed choice use <a href="/mobile/checkbox" style={{ color: 'var(--ember)' }}>Checkbox</a> or <a href="/mobile/radio" style={{ color: 'var(--ember)' }}>Radio</a>.
      </p>
    </Section>
  );
}
