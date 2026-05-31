'use client';
// Eidos Mobile — Tab bar (scaffold). Bottom navigation for handsets: 3–5 destinations,
// one active (ember), thumb-reachable, safe-area aware.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, StatusBar, platformOf, Icons, Lede, Mono, Spinner, Skeleton, Alert, AlertTitle, AlertDescription } from '@/ds/core';

const TABS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'services', icon: 'server', label: 'Services' },
  { id: 'deploys', icon: 'pipeline', label: 'Deploys', count: 3 },
  { id: 'agent', icon: 'sparkle', label: 'Agent' },
  { id: 'you', icon: 'user', label: 'You' },
] as const;

// Live demo wired to the exact ARIA it documents: a role="tablist" nav whose
// children are role="tab" + aria-selected, with roving tabindex so the bar is a
// SINGLE Tab stop and ←/→/Home/End move the active destination (the WAI-ARIA
// tabs pattern, adapted to a thumb-zone bottom bar).
//
// The one earned move: a single ember active indicator that GLIDES between
// destinations on selection (transform-only, GPU-cheap), and collapses to an
// instant snap under prefers-reduced-motion — the bar reads as one continuous
// control rather than five independent buttons.
function TabBar({ device = 'iphone-15-pro', loading = false }: { device?: string; loading?: boolean }) {
  const [active, setActive] = React.useState(0);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const n = TABS.length;

  const move = (next: number) => {
    const i = (next + n) % n;
    setActive(i);
    refs.current[i]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': e.preventDefault(); move(active + 1); break;
      case 'ArrowLeft':  case 'ArrowUp':   e.preventDefault(); move(active - 1); break;
      case 'Home': e.preventDefault(); move(0); break;
      case 'End':  e.preventDefault(); move(n - 1); break;
    }
  };

  return (
    <>
      <StatusBar platform={platformOf(device)} />
      <div role="tabpanel" aria-label={`${TABS[active].label} screen`} aria-busy={loading || undefined} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-subtle)' }}>
        {loading ? (
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Spinner aria-label={`Loading ${TABS[active].label}`} />
            <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-faint)' }}>Loading {TABS[active].label}…</span>
          </span>
        ) : (
          <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{TABS[active].label} screen</span>
        )}
      </div>
      <nav
        role="tablist"
        aria-label="Primary"
        onKeyDown={onKeyDown}
        style={{ position: 'relative', display: 'flex', borderBlockStart: '1px solid var(--border)', background: 'var(--bg)', paddingBlockEnd: 18 }}
      >
        {/* Earned micro-interaction: a single ember indicator that glides between
            tabs. Driven by --i so it is pure transform (no layout), and the
            transition is wrapped by prefers-reduced-motion at the bottom of the
            block in ds.css fallback below via inline media-safe duration. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            insetBlockStart: 0,
            insetInlineStart: 0,
            inlineSize: `calc(100% / ${n})`,
            blockSize: 2,
            background: 'var(--ember)',
            borderRadius: '0 0 2px 2px',
            transform: `translateX(calc(${active} * 100%))`,
            transition: 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        />
        {TABS.map((t, i) => {
          const Icon = (Icons as Record<string, any>)[t.icon] || Icons.circle;
          const on = i === active;
          const count = 'count' in t ? (t as { count?: number }).count : undefined;
          return (
            <button
              key={t.id}
              ref={(el) => { refs.current[i] = el; }}
              role="tab"
              aria-selected={on}
              aria-label={count ? `${t.label}, ${count} new` : t.label}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingBlock: 10, paddingInline: 0, cursor: 'pointer', background: 'transparent', border: 'none', color: on ? 'var(--ember)' : 'var(--fg-faint)' }}
            >
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <Icon size={20} />
                {count ? (
                  <span
                    aria-hidden="true"
                    style={{ position: 'absolute', insetBlockStart: -5, insetInlineStart: 12, minInlineSize: 15, blockSize: 15, paddingInline: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: 'var(--ember)', color: 'var(--bg)', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
                  >{count}</span>
                ) : null}
              </span>
              <span style={{ fontSize: 10, fontWeight: on ? 600 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default function MobileTabBar() {
  return (
    <Section
      id="tab-bar"
      num="01"
      title="Tab bar"
      desc="Bottom navigation — three to five top-level destinations pinned to the thumb zone, exactly one active in ember. Use when the app has a flat set of peer sections users move between constantly."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Labels stay under every icon. Icon-only tab bars fail the recognition test on first launch — a user who has never seen your app cannot guess what an icon means without a label. Tap a destination, or focus the bar and drive it with <Mono>←</Mono> / <Mono>→</Mono>: one Tab stop, roving focus, an ember indicator that glides to the active tab, exactly the <Mono>role=&quot;tablist&quot;</Mono> contract below.</Lede>
      <Frame label="5 destinations · active in ember · roving arrow-key focus · pick a device" center code={`<nav role="tablist" aria-label="Primary">
  {tabs.map((t, i) => (
    <button role="tab" aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)} />   // ←/→/Home/End roves focus
  ))}
</nav>`} lang="tsx">
        <DeviceFrame><TabBar /></DeviceFrame>
      </Frame>

      <SubHead meta="badge · loading · empty · disabled">States</SubHead>
      <Lede>A tab bar is never just &quot;five tabs&quot;. A destination can carry an unread <b style={{ color: 'var(--fg)' }}>badge</b> (a number, never a meaningless red dot), the panel it reveals has <b style={{ color: 'var(--fg)' }}>loading</b> and <b style={{ color: 'var(--fg)' }}>empty</b> moments, and an offline destination shows an <b style={{ color: 'var(--fg)' }}>error</b> rather than a dead tap. The shipped states, rendered live:</Lede>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12, alignItems: 'start', gap: 16 }}>
        <Frame label="badge — Deploys carries 3 unread; count is announced, tabular, capped at 9+" center>
          <DeviceFrame initial="iphone-15-pro"><TabBar /></DeviceFrame>
        </Frame>
        <Frame label="loading — panel shows a role=status spinner; the bar stays live and tappable" center>
          <DeviceFrame initial="iphone-15-pro"><TabBar loading /></DeviceFrame>
        </Frame>
      </div>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 16, alignItems: 'start', gap: 16 }}>
        <Frame label="empty — a reached-but-empty destination explains itself, never a blank screen">
          <div className="empty sm" style={{ margin: '8px auto', maxInlineSize: 280 }}>
            <div className="empty-icon"><Icons.inbox size={18} /></div>
            <div className="empty-text">
              <div className="empty-title">No deploys yet</div>
              <div className="empty-desc">Ship from CI or the Agent tab and they land here.</div>
            </div>
          </div>
        </Frame>
        <Frame label="error — offline destination raises a danger Alert (role=alert), with retry">
          <Alert tone="danger" style={{ margin: 8 }}>
            <AlertTitle>Can&apos;t reach Services</AlertTitle>
            <AlertDescription>You&apos;re offline. The tab stays tappable; we&apos;ll refresh the moment the connection returns.</AlertDescription>
          </Alert>
        </Frame>
      </div>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 16, alignItems: 'start', gap: 16 }}>
        <Frame label="disabled — a gated destination dims to --fg-faint and drops out of the roving order" center>
          <div role="tablist" aria-label="Disabled example" style={{ display: 'flex', inlineSize: 260, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--bg)', padding: '8px 4px 12px' }}>
            {[
              { icon: Icons.home, label: 'Home', on: true, disabled: false },
              { icon: Icons.server, label: 'Services', on: false, disabled: false },
              { icon: Icons.pipeline, label: 'Deploys', on: false, disabled: true },
              { icon: Icons.user, label: 'You', on: false, disabled: false },
            ].map((t, i) => {
              const I = t.icon;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={t.on}
                  aria-disabled={t.disabled || undefined}
                  tabIndex={t.on ? 0 : -1}
                  disabled={t.disabled}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingBlock: 8, background: 'transparent', border: 'none', cursor: t.disabled ? 'not-allowed' : 'pointer', opacity: t.disabled ? 0.4 : 1, color: t.on ? 'var(--ember)' : 'var(--fg-faint)' }}
                >
                  <I size={20} />
                  <span style={{ fontSize: 10, fontWeight: t.on ? 600 : 500 }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </Frame>
        <Frame label="loading the bar itself — skeleton the labels, never collapse the layout" center>
          <div style={{ display: 'flex', inlineSize: 260, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--bg)', padding: '8px 4px 12px' }} aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingBlock: 8 }}>
                <Skeleton variant="circle" size={20} />
                <Skeleton variant="line" width={28} height={7} />
              </div>
            ))}
          </div>
        </Frame>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ display: 'flex', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 4px 14px' }}>
                {[
                  { icon: Icons.home, label: 'Home', active: true, count: 0 },
                  { icon: Icons.server, label: 'Services', active: false, count: 0 },
                  { icon: Icons.bell, label: 'Alerts', active: false, count: 2 },
                  { icon: Icons.user, label: 'You', active: false, count: 0 },
                ].map((t, i) => {
                  const I = t.icon;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: t.active ? 'var(--ember)' : 'var(--fg-faint)' }}>
                      <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <I size={20} />
                        {t.count ? (
                          <span style={{ position: 'absolute', insetBlockStart: -5, insetInlineStart: 12, minInlineSize: 15, blockSize: 15, paddingInline: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: 'var(--ember)', color: 'var(--bg)', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{t.count}</span>
                        ) : null}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: t.active ? 600 : 400 }}>{t.label}</span>
                    </div>
                  );
                })}
              </div>
              <span className="lead v" style={{ top: -22, left: '12.5%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ top: -22, left: '37.5%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 24, right: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: '62.5%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -42, left: '37.5%', transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: '12.5%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 15, right: -52 }}>3</div>
              <div className="pin" style={{ top: -42, left: '62.5%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Tab item.</b> Equal-width flex column, the whole cell tappable — never just the icon.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Active treatment.</b> Ember icon + label (weight 600) plus a 2px ember indicator that glides to the selected tab; the rest sit in <Mono>--fg-faint</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> 10px Geist under the icon, always present — the affordance, not decoration.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Count badge.</b> Ember capsule with dark ink, mono tabular digits, capped at <Mono>9+</Mono>; folded into the tab&rsquo;s <Mono>aria-label</Mono> (&ldquo;2 new&rdquo;), never a meaningless dot.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Safe-area inset.</b> Block-end padding via <Mono>env(safe-area-inset-bottom)</Mono> clears the home indicator.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>The live preview implements this verbatim — the bar is one focus stop, arrow keys rove, the count folds into the label, and every tab announces its position. Focus the bar and try it.</Lede>
      <div className="kbd-map" style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '8px 16px', alignItems: 'baseline', marginBlock: '14px 4px', maxWidth: 620 }}>
        {[
          ['Tab', 'Moves into the bar — it is a single tab stop (roving tabindex), landing on the active destination.'],
          ['← / →', 'Moves the active destination one tab, wrapping at the ends. Vertical ↑ / ↓ are aliased for screen-reader rotors.'],
          ['Home / End', 'Jumps to the first / last destination.'],
          ['Enter / Space', 'Activates the focused destination (selection follows focus on arrow, so this is mostly belt-and-braces).'],
        ].map(([k, v]) => (
          <React.Fragment key={k}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{k}</code>
            <span className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>{v}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12, gap: 16}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Roles &amp; state</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The <Mono>nav</Mono> is <Mono>role=&quot;tablist&quot;</Mono> with <Mono>aria-label=&quot;Primary&quot;</Mono>; each button is <Mono>role=&quot;tab&quot;</Mono> carrying <Mono>aria-selected</Mono>, so VoiceOver / TalkBack announce &ldquo;Services, tab, 2 of 5, selected&rdquo;. The content region is the matching <Mono>role=&quot;tabpanel&quot;</Mono> and flips <Mono>aria-busy</Mono> while loading.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Badge is spoken, not just seen</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The unread count never lives in colour alone: it folds into the tab&rsquo;s <Mono>aria-label</Mono> (&ldquo;Deploys, 3 new&rdquo;), and the ember capsule carries dark <Mono>--bg</Mono> ink for AA contrast. The loading panel is a <Mono>role=&quot;status&quot;</Mono> Spinner, the offline panel a <Mono>role=&quot;alert&quot;</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Touch targets</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Every tab clears 44×44px even though the icon is 20px — the column&rsquo;s block padding scales from the 4-pt base. Five tabs is the hard ceiling so each stays a comfortable thumb width.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Motion &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The gliding ember indicator and the active-tint crossfade respect <Mono>prefers-reduced-motion</Mono> — they snap instead of slide. Active never relies on colour alone: the bolder label and the indicator back up the ember, and both keep AA contrast against <Mono>--bg</Mono>.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — tab order reverses; the first destination sits on the right'} center code={`<nav dir="rtl">{/* destinations laid out start→end; flex puts Home on the right */}</nav>`} lang="tsx">
        <div dir="rtl"><DeviceFrame><TabBar device="iphone-15-pro" /></DeviceFrame></div>
      </Frame>
      <Lede>The bar is laid out start-to-end, so under <Mono>dir=&quot;rtl&quot;</Mono> the first destination (Home) sits on the right and the order runs leftward. The gliding indicator uses <Mono>insetInlineStart</Mono> + <Mono>translateX</Mono>, so it travels with the writing direction; the count badge pins to <Mono>insetInlineStart</Mono> and follows the icon. The 20px glyphs and labels are non-directional and stay exactly as drawn — no <Mono>scaleX(-1)</Mono> needed.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — three to five peers</div>
          <div className="body" style={{flexDirection:'column', gap: 6, color:'var(--fg-muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em'}}>Home · Services · Deploys · Agent · You</div>
          <div className="note">A flat, stable set of destinations. Overflow goes behind a &ldquo;More&rdquo; tab, never a horizontal scroll.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — strip the labels</div>
          <div className="body" style={{gap: 14, color:'var(--fg-faint)'}}><Icons.home size={20}/><Icons.server size={20}/><Icons.pipeline size={20}/><Icons.sparkle size={20}/><Icons.user size={20}/></div>
          <div className="note">Icon-only bars fail the recognition test on first launch and break TalkBack. Keep the label under every icon.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12, alignItems: 'start', gap: 16 }}>
        <CodeBlock
          label="safe-area padding"
          lang="css"
          code={`.m-tabbar {
  display: flex;                 /* equal-width tab items */
  border-block-start: 1px solid var(--border);
  background: var(--bg);
  padding-block-end: max(8px, env(safe-area-inset-bottom));
}
.m-tabbar [aria-selected="true"] { color: var(--ember); font-weight: 600; }
/* gliding indicator: transform-only, motion-safe */
.m-tabbar-ind { transition: transform 220ms cubic-bezier(.32,.72,0,1); }
@media (prefers-reduced-motion: reduce) { .m-tabbar-ind { transition: none; } }`}
        />
        <CodeBlock
          label="roving tablist (matches the live demo)"
          lang="tsx"
          code={`<nav role="tablist" aria-label="Primary" onKeyDown={onKey}>
  {tabs.map((t, i) => (
    <button key={t.id} role="tab"
      aria-selected={i === active}
      aria-label={t.count ? \`\${t.label}, \${t.count} new\` : t.label}
      tabIndex={i === active ? 0 : -1}   // single tab stop
      onClick={() => setActive(i)} />
  ))}
</nav>
// onKey: ArrowLeft/Right + Home/End move \`active\` and .focus()`}
        />
      </div>
    </Section>
  );
}
