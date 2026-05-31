'use client';
// Forge Mobile — Footer. A bottom toolbar / footer bar anchored to the safe area — a row of
// contextual actions (Share, Edit, Delete) or a primary action + meta text. Distinct from the
// Tab Bar, which is navigation: the Footer provides screen-level commands that appear only
// when relevant content is selected or a form is ready to submit.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Local helpers ─────────────────────────────────────────────────────────────

/** Slot in a toolbar — icon + optional label, tappable at 44 px */
function ToolbarBtn({
  icon,
  label,
  danger = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label?: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={label}
      disabled={disabled}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 3,
        minWidth: 44, minHeight: 44,
        paddingInline: 8,
        background: 'transparent', border: 'none',
        color: danger ? 'var(--danger)' : disabled ? 'var(--fg-faint)' : 'var(--fg)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        borderRadius: 10,
        flexShrink: 0,
      }}
    >
      {icon}
      {label && (
        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
          {label}
        </span>
      )}
    </button>
  );
}

/** A full-width sticky footer with safe-area bottom padding */
function FooterBar({
  children,
  border = true,
}: {
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div style={{
      paddingInline: 12,
      paddingBlockStart: 10,
      paddingBlockEnd: 20, // simulates env(safe-area-inset-bottom)
      borderBlockStart: border ? '1px solid var(--border)' : 'none',
      background: 'var(--bg-elevated)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }}>
      {children}
    </div>
  );
}

// ── Device screen demos ───────────────────────────────────────────────────────

/** Contextual toolbar — actions row with share / edit / delete */
function ContextualFooterScreen() {
  const [selected, setSelected] = React.useState<string[]>(['deploy-1204']);

  const items = [
    { id: 'deploy-1204',  label: 'Deploy #1,204',  env: 'production', time: '2 min ago' },
    { id: 'deploy-1203',  label: 'Deploy #1,203',  env: 'staging',    time: '14 min ago' },
    { id: 'deploy-1202',  label: 'Deploy #1,202',  env: 'production', time: '1 hr ago' },
  ];

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav bar */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', paddingInline: 16, borderBlockEnd: '1px solid var(--border)' }}>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 'var(--text-md)' }}>Deploys</span>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', padding: '6px 4px' }}>Select</button>
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
        {items.map(({ id, label, env, time }) => {
          const sel = selected.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderRadius: 10, border: sel ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                background: sel ? 'var(--surface-selected)' : 'var(--surface)',
                cursor: 'pointer', textAlign: 'start',
              }}
            >
              <span style={{ width: 20, height: 20, borderRadius: 20, border: `2px solid ${sel ? 'var(--accent)' : 'var(--border-strong)'}`, background: sel ? 'var(--accent)' : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {sel && <Icons.check size={11} color="var(--ember-fg)" />}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 550, color: 'var(--fg)' }}>{label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginBlockStart: 2 }}>{env} · {time}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer toolbar — visible when items are selected */}
      {selected.length > 0 && (
        <FooterBar>
          <ToolbarBtn icon={<Icons.share size={20} />}  label="Share"  />
          <ToolbarBtn icon={<Icons.edit size={20} />}   label="Edit"   disabled={selected.length > 1} />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
            {selected.length} selected
          </span>
          <div style={{ flex: 1 }} />
          <ToolbarBtn icon={<Icons.trash size={20} />}  label="Delete" danger />
        </FooterBar>
      )}
    </div>
  );
}

/** Sticky submit footer — primary action + meta text */
function StickySubmitScreen() {
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  function handleSubmit() {
    if (submitting || done) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setDone(true); }, 2200);
    setTimeout(() => setDone(false), 4500);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav bar */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', paddingInline: 16, borderBlockEnd: '1px solid var(--border)' }}>
        <button style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', cursor: 'pointer', padding: '6px 0' }}>Cancel</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-md)' }}>Approve Request</span>
        <span style={{ width: 48 }} />
      </div>

      {/* Form body */}
      <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBlockEnd: 6 }}>Request</div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--surface)', fontSize: 'var(--text-sm)', color: 'var(--fg)', fontWeight: 500 }}>
            Production access for 4 h — infra-deploy role
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBlockEnd: 6 }}>Requester</div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--surface)', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>L. Cardoso · leofercardoso@example.com</div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBlockEnd: 6 }}>Note (optional)</div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--surface)', fontSize: 'var(--text-sm)', color: 'var(--fg-subtle)', minHeight: 64 }}>
            Deployment unblocked for emergency patch…
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <FooterBar>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            aria-label={submitting ? 'Approving request…' : done ? 'Approved' : 'Approve request'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              height: 48, borderRadius: 13, border: 'none', cursor: submitting ? 'default' : 'pointer',
              background: done ? 'var(--success-soft)' : 'var(--accent)',
              color: done ? 'var(--success)' : 'var(--ember-fg)',
              fontSize: 'var(--text-md)', fontWeight: 600, width: '100%',
            }}
          >
            {submitting
              ? <><SubmitSpinner /><span style={{ color: 'var(--ember-fg)' }}>Approving…</span></>
              : done
              ? <><Icons.check size={17} color="var(--success)" /><span>Approved</span></>
              : <><Icons.compliance size={17} /><span>Approve Request</span></>}
          </button>
          <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>
            Approval will be logged to the audit trail
          </div>
        </div>
      </FooterBar>
    </div>
  );
}

function SubmitSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="ds-spin">
      <path d="M12 3 a9 9 0 0 1 9 9" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileFooter() {
  return (
    <Section
      id="footer"
      num="01"
      title="Footer"
      desc="A bottom toolbar anchored to the safe area, providing contextual actions (Share, Edit, Delete) or a sticky primary action with supporting meta text. Distinct from the Tab Bar, which handles navigation."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>The Footer surfaces only when it is relevant — on content selection, during a multi-step form, or before a destructive operation. It disappears when the context clears, keeping the screen uncluttered at rest.</Lede>
      <Frame label="Contextual toolbar — tap rows to select; footer appears with Share / Edit / Delete" center>
        <DeviceFrame initial="iphone-se"><ContextualFooterScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Sticky submit — primary action pinned above safe area with supporting meta text" center>
        <DeviceFrame initial="iphone-se"><StickySubmitScreen /></DeviceFrame>
      </Frame>
      <Frame label="Contextual action toolbar — icon buttons + label slots evenly distributed">
        <div style={{ maxWidth: 375, marginInline: 'auto', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <FooterBar>
            <ToolbarBtn icon={<Icons.share size={20} />}      label="Share"  />
            <ToolbarBtn icon={<Icons.edit size={20} />}       label="Edit"   />
            <div style={{ flex: 1 }} />
            <ToolbarBtn icon={<Icons.rollback size={20} />}   label="Revert" />
            <div style={{ flex: 1 }} />
            <ToolbarBtn icon={<Icons.trash size={20} />}      label="Delete" danger />
          </FooterBar>
        </div>
      </Frame>
      <Frame label="Minimal — primary action + ghost cancel only">
        <div style={{ maxWidth: 375, marginInline: 'auto', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <FooterBar>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', minHeight: 44, paddingInline: 8 }}>Cancel</button>
            <div style={{ flex: 1 }} />
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, height: 44, paddingInline: 22, borderRadius: 12, background: 'var(--accent)', color: 'var(--ember-fg)', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              <Icons.deploy size={16} color="var(--ember-fg)" />
              Deploy Now
            </button>
          </FooterBar>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Keyboard / activation</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Every action in the footer bar is a native <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code>, reachable with <code style={{ fontFamily: 'var(--font-mono)' }}>Tab</code> and activated by <code style={{ fontFamily: 'var(--font-mono)' }}>Space</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>Enter</code>. Order in the DOM matches visual order left-to-right.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Screen reader landmark</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Wrap the bar in <code style={{ fontFamily: 'var(--font-mono)' }}>{'<footer>'}</code> or give it <code style={{ fontFamily: 'var(--font-mono)' }}>role="toolbar"</code> with an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> that describes the context — "Deploy actions" — so VoiceOver / TalkBack users can jump to it directly.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The <code style={{ fontFamily: 'var(--font-mono)' }}>--bg-elevated</code> bar surface must not reduce button contrast below AA. Danger-coloured icons use <code style={{ fontFamily: 'var(--font-mono)' }}>var(--danger)</code> which meets 3 : 1 on the surface. Disabled items drop to 40% opacity — verified readable.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Touch target ≥ 44 px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Each slot enforces <code style={{ fontFamily: 'var(--font-mono)' }}>min-width: 44px; min-height: 44px</code>. Icons with visible labels can shrink the visual icon size but must preserve the minimum tap area. Use <code style={{ fontFamily: 'var(--font-mono)' }}>gap: 4px</code> between slots rather than overlapping them.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — destructive slot moves to the leading (right) edge; directional icons mirror'} center code={`<footer role="toolbar" aria-label="إجراءات النشر" dir="rtl">
  {/* Trash stays trailing in RTL — inlineEnd = right */}
  <ToolbarBtn icon={<Icons.trash />}   label="حذف"   danger />
  <div style={{ flex: 1 }} />
  <ToolbarBtn icon={<Icons.edit />}    label="تعديل" />
  <ToolbarBtn icon={<Icons.share />}   label="مشاركة" />
</footer>`} lang="tsx">
        <div dir="rtl" style={{ maxWidth: 375, marginInline: 'auto', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{ paddingInline: 12, paddingBlockStart: 10, paddingBlockEnd: 20, borderBlockStart: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ToolbarBtn icon={<Icons.trash size={20} />}  label="حذف"    danger />
            <div style={{ flex: 1 }} />
            <ToolbarBtn icon={<Icons.edit size={20} />}   label="تعديل" />
            <ToolbarBtn icon={<Icons.share size={20} />}  label="مشاركة" />
          </div>
        </div>
      </Frame>
      <Lede>With <Mono>dir="rtl"</Mono>, flex row order naturally places the leading (first) item on the right. Position the destructive action last in the DOM so it remains trailing — in LTR that is the right end, in RTL the left end. Non-directional icons (share, edit, trash) need no <Mono>scaleX(-1)</Mono>; directional arrows would need mirroring.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 40px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              {/* Footer bar render */}
              <div style={{ paddingInline: 12, paddingBlockStart: 10, paddingBlockEnd: 20, borderBlockStart: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 44, minHeight: 44, paddingInline: 8, color: 'var(--fg)' }}>
                  <Icons.share size={20} />
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Share</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 44, minHeight: 44, paddingInline: 8, color: 'var(--fg)' }}>
                  <Icons.edit size={20} />
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Edit</span>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, minWidth: 44, minHeight: 44, paddingInline: 8, color: 'var(--danger)' }}>
                  <Icons.trash size={20} />
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Delete</span>
                </div>
              </div>
              {/* Safe-area strip */}
              <div style={{ height: 6, borderRadius: '0 0 10px 10px', background: 'var(--surface-hover)' }} />

              {/* Pin 1 — separator */}
              <span className="lead v" style={{ top: -36, left: 30, height: 30 }} />
              <div className="pin" style={{ top: -62, left: 14 }}>1</div>
              {/* Pin 2 — toolbar slots */}
              <span className="lead v" style={{ top: -36, left: '50%', height: 30 }} />
              <div className="pin" style={{ top: -62, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              {/* Pin 3 — danger slot */}
              <span className="lead v" style={{ top: -36, right: 30, height: 30 }} />
              <div className="pin" style={{ top: -62, right: 14 }}>3</div>
              {/* Pin 4 — safe area spacer */}
              <span className="lead v" style={{ bottom: -28, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -52, left: '50%', transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Separator.</b> 1 px <code style={{ fontFamily: 'var(--font-mono)' }}>var(--border)</code> line at the block-start edge lifts the bar off the screen content. Omit when the bar sits over a visually distinct surface (e.g. a modal sheet).</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Action slots.</b> Each slot is at minimum 44 × 44 px and carries an icon + short mono label. Distribute slots with a flex spacer or evenly — never compress below the touch minimum.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Destructive slot.</b> Placed trailing (right in LTR, left in RTL) and coloured <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>var(--danger)</code> to visually warn. Never place it adjacent to a confirm action without a separator.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Safe-area spacing.</b> <code style={{ fontFamily: 'var(--font-mono)' }}>padding-block-end: env(safe-area-inset-bottom)</code> — at minimum 16 px — so the footer clears the home indicator on iPhone and navigation bar on Android.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — contextual footer with clear action hierarchy</div>
          <div className="body" style={{ flexDirection: 'column', gap: 0, padding: 0, alignItems: 'stretch' }}>
            <div style={{ paddingInline: 12, paddingBlockStart: 10, paddingBlockEnd: 8, borderBlockStart: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 10 }}>
              <ToolbarBtn icon={<Icons.share size={18} />} label="Share" />
              <ToolbarBtn icon={<Icons.edit size={18} />}  label="Edit"  />
              <div style={{ flex: 1 }} />
              <ToolbarBtn icon={<Icons.trash size={18} />} label="Delete" danger />
            </div>
          </div>
          <div className="note">Destructive action sits trailing, visually separated from safe actions, with a danger colour that confirms risk without needing to open it.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — footer as a second nav bar</div>
          <div className="body" style={{ flexDirection: 'column', gap: 0, padding: 0, alignItems: 'stretch' }}>
            <div style={{ paddingInline: 12, paddingBlockStart: 10, paddingBlockEnd: 8, borderBlockStart: '1px solid var(--border)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 4, borderRadius: 10 }}>
              {(['Deploys', 'Incidents', 'Reviews', 'Settings'] as string[]).map(l => (
                <span key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: 'var(--fg-muted)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
                  <Icons.gauge size={18} color="var(--fg-muted)" />
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="note">Navigation items belong in the Tab Bar, not the Footer. The Footer is for contextual commands — using it for persistent nav creates two competing navigation structures.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="footer"
        lang="tsx"
        code={`/* Contextual toolbar footer */
<footer role="toolbar" aria-label="Deploy actions" className="m-footer">
  <button aria-label="Share" className="m-footer-btn">
    <Icons.share aria-hidden="true" />
    <span>Share</span>
  </button>
  <button aria-label="Edit" className="m-footer-btn">
    <Icons.edit aria-hidden="true" />
    <span>Edit</span>
  </button>
  <div className="m-footer-spacer" />
  <button aria-label="Delete" className="m-footer-btn danger">
    <Icons.trash aria-hidden="true" />
    <span>Delete</span>
  </button>
</footer>

/* Sticky submit footer */
<footer className="m-footer">
  <div className="m-footer-stack">
    <button className="m-action-btn primary" aria-label="Approve request">
      <Icons.compliance aria-hidden="true" />
      Approve Request
    </button>
    <p className="m-footer-meta">Approval will be logged to the audit trail</p>
  </div>
</footer>

/* Tokens:
   background: var(--bg-elevated)
   border-block-start: 1px solid var(--border)
   padding-block-start: 10px
   padding-block-end: max(env(safe-area-inset-bottom), 16px)
   padding-inline: 12px
   slot min-height: 44px; min-width: 44px
   danger color: var(--danger)      ← never ember on contextual-action danger
   primary action height: 48–50px; bg var(--accent); color var(--ember-fg) */`}
      />
    </Section>
  );
}
