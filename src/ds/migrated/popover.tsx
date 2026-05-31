'use client';
// Forge DS — Components / Popover
// A floating panel anchored to a trigger element. Holds rich content — forms,
// link previews, mini-settings. Click to open; Esc or click-away to close.
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, Lede, Mono,
  AutoPropsTable, ComponentInstall,
  Popover, PopoverHeader, PopoverBody, PopoverFooter,
} from '@/ds/core';

// ── Usage code snippet ────────────────────────────────────────────────────────

const USAGE_CODE = `import { Popover, PopoverHeader, PopoverBody, PopoverFooter } from "@forge/ui"

export function Demo() {
  return (
    <Popover trigger={<button className="btn">Dimensions</button>}>
      {({ close }) => (
        <>
          <PopoverHeader>Dimensions</PopoverHeader>
          <PopoverBody>
            <label>Width<input type="number" defaultValue={360} /></label>
          </PopoverBody>
          <PopoverFooter>
            <button className="btn xs ghost" onClick={close}>Cancel</button>
            <button className="btn xs ember" onClick={close}>Apply</button>
          </PopoverFooter>
        </>
      )}
    </Popover>
  );
}`;

// ── Demo content helpers ──────────────────────────────────────────────────────

const SettingsContent = ({ close }: { close: () => void }) => {
  const [w, setW] = React.useState(360);
  const [h, setH] = React.useState(220);
  const [maintain, setMaintain] = React.useState(true);
  return (
    <>
      <PopoverHeader>Dimensions</PopoverHeader>
      <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label className="pop-label">Width<input className="pop-input" type="number" value={w} onChange={(e) => setW(+e.target.value)} /></label>
          <label className="pop-label">Height<input className="pop-input" type="number" value={h} onChange={(e) => setH(+e.target.value)} /></label>
        </div>
        <label className="pop-label" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={maintain} onChange={(e) => setMaintain(e.target.checked)} style={{ width: 'auto' }} />
          Maintain aspect ratio
        </label>
      </PopoverBody>
      <PopoverFooter>
        <button className="btn xs ghost" onClick={close}>Cancel</button>
        <button className="btn xs ember" onClick={close}>Apply</button>
      </PopoverFooter>
    </>
  );
};

const LinkPreviewContent = () => (
  <>
    <div style={{ height: 100, background: 'linear-gradient(135deg, oklch(40% 0.10 30), oklch(20% 0.04 30))', borderRadius: '10px 10px 0 0' }} />
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 4 }}>FORGE.DEV/BLOG</div>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 6 }}>Building a design system that ships every Friday</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>How the platform team made the DS the cheapest path for product engineers.</div>
    </div>
  </>
);

const ProfileContent = ({ close }: { close: () => void }) => (
  <>
    <PopoverBody style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14 }}>
      <span className="avatar lg ember">AS</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, letterSpacing: '-0.005em' }}>Ana Silva</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginBottom: 8 }}>Platform engineer · GMT-3</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="pill"><span className="dot" />Online</span>
          <span className="pill">Owner</span>
        </div>
      </div>
    </PopoverBody>
    <PopoverFooter>
      <button className="btn xs ghost" onClick={close}>Cancel</button>
      <button className="btn xs ember">Message</button>
    </PopoverFooter>
  </>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const [side, setSide] = React.useState<'top' | 'bottom' | 'start' | 'end'>('bottom');
  const [align, setAlign] = React.useState<'start' | 'center' | 'end'>('start');
  const sides = ['top', 'bottom', 'start', 'end'] as const;
  const aligns = ['start', 'center', 'end'] as const;

  return (
    <Section
      id="popover"
      num="21"
      title="Popover"
      desc="A floating panel anchored to a trigger for rich content — forms, link previews, mini-settings. Click to open; Esc or click-away to close."
    >

      {/* 1. INSTALLATION */}
      <ComponentInstall slug="popover" />

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div className="pop-stage" style={{ minHeight: 220 }}>
          <Popover trigger={<button className="btn">Dimensions</button>} side="bottom" align="start">
            {({ close }) => <SettingsContent close={close} />}
          </Popover>
        </div>
      </Frame>
      <Lede>
        The <Mono>trigger</Mono> prop accepts any React element — <Mono>{'<button>'}</Mono>, <Mono>{'<a>'}</Mono>, or a custom component. Pass children as a render prop to receive the <Mono>close</Mono> callback inside footer actions.
      </Lede>

      {/* Examples divider */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Live demos */}
      <SubHead meta="live · click the buttons">Quick form</SubHead>
      <Frame
        label="rich content with inputs and a footer of actions"
        code={`<Popover
  trigger={<button className="btn">Dimensions</button>}
  side="bottom" align="start">
  {({ close }) => (
    <>
      <PopoverHeader>Dimensions</PopoverHeader>
      <PopoverBody>…inputs…</PopoverBody>
      <PopoverFooter>
        <button onClick={close}>Cancel</button>
        <button className="btn ember" onClick={close}>Apply</button>
      </PopoverFooter>
    </>
  )}
</Popover>`}
      >
        <div className="pop-stage">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Popover trigger={<button className="btn"><Icons.settings size={13} />Dimensions<Icons.chevronDown size={12} /></button>} side="bottom" align="start">
              {({ close }) => <SettingsContent close={close} />}
            </Popover>
            <Popover trigger={<button className="btn"><span className="avatar sm ember">AS</span>Ana Silva<Icons.chevronDown size={12} /></button>} side="bottom" align="end">
              {({ close }) => <ProfileContent close={close} />}
            </Popover>
            <Popover trigger={<a className="btn link">forge.dev/blog<Icons.link size={12} /></a>} side="top" align="center">
              <LinkPreviewContent />
            </Popover>
          </div>
        </div>
      </Frame>

      {/* Placement */}
      <SubHead meta="4 sides × 3 alignments">Placement</SubHead>
      <Frame
        label="pick a side, pick an alignment"
        code={`<Popover side="top"    align="start"  trigger={…} />
<Popover side="bottom" align="center" trigger={…} />
<Popover side="start"  align="start"  trigger={…} />
<Popover side="end"    align="end"    trigger={…} />`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginInlineEnd: 6 }}>SIDE</span>
            {sides.map((s) => (
              <button key={s} className={'btn xs' + (s === side ? ' ember' : '')} onClick={() => setSide(s)}>{s}</button>
            ))}
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginInlineStart: 12, marginInlineEnd: 6 }}>ALIGN</span>
            {aligns.map((a) => (
              <button key={a} className={'btn xs' + (a === align ? ' ember' : '')} onClick={() => setAlign(a)}>{a}</button>
            ))}
          </div>
          <div className="pop-stage" style={{ minHeight: 280 }}>
            <Popover key={side + '-' + align} trigger={<button className="btn">Open popover</button>} side={side} align={align}>
              {({ close }) => (
                <>
                  <PopoverHeader>{side} · {align}</PopoverHeader>
                  <PopoverBody>
                    <p style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, margin: 0 }}>
                      Uses <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)' }}>position:fixed</code> + <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)' }}>getBoundingClientRect</code> to escape <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)' }}>overflow:hidden</code> parents. <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)' }}>start/end</code> sides follow the inline direction.
                    </p>
                  </PopoverBody>
                </>
              )}
            </Popover>
          </div>
        </div>
      </Frame>

      {/* Use cases */}
      <SubHead meta="rich content">Use cases</SubHead>
      <Frame
        label="link preview · profile card · filter form"
        code={`{/* Link preview */}
<Popover trigger={<a>forge.dev/blog</a>} side="top" align="center">
  <LinkPreview />
</Popover>

{/* Profile peek */}
<Popover trigger={<Avatar />} side="end" align="start">
  {({ close }) => <ProfileCard onClose={close} />}
</Popover>

{/* Filter form */}
<Popover trigger={<button>Filter</button>} side="bottom" align="start">
  {({ close }) => <FilterForm onApply={close} />}
</Popover>`}
      >
        <div className="pop-stage" style={{ minHeight: 220 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Popover trigger={<a className="btn link">forge.dev/blog<Icons.link size={12} /></a>} side="top" align="center">
              <LinkPreviewContent />
            </Popover>
            <Popover trigger={<span className="avatar lg ember" style={{ cursor: 'pointer' }} title="Ana Silva">AS</span>} side="end" align="start">
              {({ close }) => <ProfileContent close={close} />}
            </Popover>
            <Popover trigger={<button className="btn"><Icons.filter size={13} />Filter</button>} side="bottom" align="start">
              {({ close }) => (
                <>
                  <PopoverHeader>Filter rows</PopoverHeader>
                  <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label className="pop-label">Status<select className="pop-input"><option>Any</option><option>Active</option><option>Archived</option></select></label>
                    <label className="pop-label">Owner<input className="pop-input" type="text" placeholder="ana@…" /></label>
                  </PopoverBody>
                  <PopoverFooter>
                    <button className="btn xs ghost" onClick={close}>Reset</button>
                    <button className="btn xs ember" onClick={close}>Apply</button>
                  </PopoverFooter>
                </>
              )}
            </Popover>
          </div>
        </div>
      </Frame>

      {/* Decision matrix */}
      <SubHead meta="when to use">Popover vs Tooltip vs Menu vs Dialog</SubHead>
      <Lede>
        Reach for Popover when a click should reveal rich content. Tooltip is hover-only, plain text. Menu is a list of actions. Dialog is focus-trapped and blocks the page.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Decision matrix</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>Trigger</th>
              <th>Content</th>
              <th>Modal?</th>
              <th>Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">Popover</td><td className="mono">click</td><td>Rich (form, preview)</td><td className="mono">no</td><td>Inline settings, link preview, profile peek.</td></tr>
            <tr><td className="tok-name">Tooltip</td><td className="mono">hover / focus</td><td>Plain text only</td><td className="mono">no</td><td>Restating an icon, a 1-line hint. Never required reading.</td></tr>
            <tr><td className="tok-name">Menu</td><td className="mono">click / right-click</td><td>List of actions</td><td className="mono">no</td><td>Toolbar / context actions — the click chooses one verb.</td></tr>
            <tr><td className="tok-name">Dialog</td><td className="mono">click</td><td>Anything, focus-trapped</td><td className="mono">yes</td><td>Decisive, scrim'd interaction. Confirm delete, complex form.</td></tr>
          </tbody>
        </table>
      </div>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Enter or Space on the trigger opens the panel and moves focus to its first interactive control. Tab cycles through the panel's controls. Esc closes the panel and returns focus to the trigger. Click outside also dismisses.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The trigger carries <code>aria-haspopup="dialog"</code>, <code>aria-expanded</code>, and <code>aria-controls</code> pointing at the panel. The panel is <code>role="dialog"</code> with <code>aria-labelledby</code> pointing at its heading — announced when focus enters.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Initial focus lands on the first focusable element. Every control shows the offset focus ring. The panel floats on <code>--bg-elevated</code> with a border and <code>--elev-3</code> shadow so its edge reads against any background.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The open animation is a short fade-and-scale from the anchor using <code>--dur-fast</code>. Under <code>prefers-reduced-motion: reduce</code> the scale is removed — the panel fades in with opacity only.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — side="start" opens to the trailing edge (visual right)'
        code={`<div dir="rtl">
  <Popover side="bottom" align="start" trigger={<button>الأبعاد</button>}>
    {({ close }) => (
      <>
        <PopoverHeader closeLabel="إغلاق">الأبعاد</PopoverHeader>
        <PopoverBody>…</PopoverBody>
        <PopoverFooter>
          <button onClick={close}>إلغاء</button>
          <button className="btn ember" onClick={close}>تطبيق</button>
        </PopoverFooter>
      </>
    )}
  </Popover>
</div>`}
      >
        <div dir="rtl" className="pop-stage" style={{ minHeight: 280 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Popover trigger={<button className="btn"><Icons.settings size={13} />الأبعاد</button>} side="bottom" align="start">
              {({ close }) => (
                <>
                  <PopoverHeader closeLabel="إغلاق">الأبعاد</PopoverHeader>
                  <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <label className="pop-label">العرض<input className="pop-input" type="number" defaultValue={360} /></label>
                      <label className="pop-label">الارتفاع<input className="pop-input" type="number" defaultValue={220} /></label>
                    </div>
                  </PopoverBody>
                  <PopoverFooter>
                    <button className="btn xs ghost" onClick={close}>إلغاء</button>
                    <button className="btn xs ember" onClick={close}>تطبيق</button>
                  </PopoverFooter>
                </>
              )}
            </Popover>
            <Popover trigger={<button className="btn">المستخدم<Icons.chevronDown size={12} /></button>} side="bottom" align="end">
              {({ close }) => (
                <>
                  <PopoverBody style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14 }}>
                    <span className="avatar lg ember">آن</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>آنا سيلفا</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginBottom: 8 }}>مهندسة منصة</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span className="pill"><span className="dot" />متصل</span>
                        <span className="pill">المالك</span>
                      </div>
                    </div>
                  </PopoverBody>
                  <PopoverFooter>
                    <button className="btn xs ghost" onClick={close}>إلغاء</button>
                    <button className="btn xs ember">رسالة</button>
                  </PopoverFooter>
                </>
              )}
            </Popover>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '64ch' }}>
        The footer's <Mono>justify-content: flex-end</Mono> auto-mirrors so primary actions stay at the trailing edge. <Mono>side="start/end"</Mono> are logical and follow <Mono>dir</Mono>. The panel positions via <Mono>getBoundingClientRect</Mono> (viewport-absolute) so it is not affected by the ancestor direction — only the panel's own text content and flex layout respond to <Mono>dir="rtl"</Mono>.
      </p>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              <div className="pop" style={{ position: 'static', animation: 'none', boxShadow: 'var(--elev-3)' }}>
                <div className="pop-head">
                  <div className="pop-title">Dimensions</div>
                  <button className="pop-close" tabIndex={-1} aria-label="Close"><Icons.x size={14} /></button>
                </div>
                <div className="pop-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label className="pop-label">Width<input className="pop-input" type="number" defaultValue={360} readOnly tabIndex={-1} /></label>
                </div>
                <div className="pop-foot">
                  <button className="btn xs ghost" tabIndex={-1}>Cancel</button>
                  <button className="btn xs ember" tabIndex={-1}>Apply</button>
                </div>
              </div>
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 22, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 100, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 22, right: -28, width: 24 }} />
              <div className="pin" style={{ top: 14, left: -52 }}>1</div>
              <div className="pin" style={{ top: 14, right: -52 }}>2</div>
              <div className="pin" style={{ top: 92, left: -52 }}>3</div>
              <div className="pin" style={{ bottom: 14, right: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '40px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> Geist Sans <Mono>--text-sm</Mono> at weight 600. Optional but recommended — names the surface and gives screen readers a label via <Mono>aria-labelledby</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Close.</b> A <Mono>14px</Mono> X glyph. Non-modal popovers can be dismissed by Esc / click-away, but explicit close helps mouse users.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Body.</b> Free-form. Forms, previews, mini-dashboards — anything except scrolling lists (use a Menu) or scrim'd flows (use a Dialog).</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Footer (optional).</b> Cancel + primary on the trailing edge. Only for popovers with form-style commits.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep content scannable in one screen</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="pop" style={{ position: 'static', animation: 'none', boxShadow: 'none' }}>
              <div className="pop-head"><div className="pop-title">Filter rows</div></div>
              <div className="pop-body" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="pop-label">Status<select className="pop-input"><option>Any</option></select></label>
              </div>
            </div>
          </div>
          <div className="note">A popover is a glance, not a screen. If you need scrolling, tabs, or a back button, promote to Dialog.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — block the user inside it</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="pop" style={{ position: 'static', animation: 'none', boxShadow: 'none' }}>
              <div className="pop-head"><div className="pop-title">Delete account</div></div>
              <div className="pop-body" style={{ padding: 14, color: 'var(--danger)', fontSize: 'var(--text-sm)' }}>This will wipe every workspace. Confirm to continue.</div>
              <div className="pop-foot"><button className="btn xs destructive">Delete</button></div>
            </div>
          </div>
          <div className="note">Popovers can be dismissed by clicking outside — wrong model for destructive actions. Use Alert Dialog, which traps focus and demands an answer.</div>
        </div>
      </div>

      {/* API reference */}
      <SubHead meta="PopoverProps">API reference</SubHead>
      <AutoPropsTable component="Popover" label="<Popover />" />
      <AutoPropsTable component="PopoverHeader" label="<PopoverHeader />" />
      <AutoPropsTable component="PopoverBody" label="<PopoverBody />" />
      <AutoPropsTable component="PopoverFooter" label="<PopoverFooter />" />
    </Section>
  );
}
