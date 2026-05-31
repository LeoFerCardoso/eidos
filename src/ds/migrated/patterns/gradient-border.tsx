'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Mono, Spinner, Skeleton, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';


export default function GradientBorderPage() {
  return (
    <Section
      id="pat-gradient-border"
      num="08"
      title="Gradient border"
      desc="A border painted with a gradient — ember through ice — using mask-composite. Optional rotating animation flags 'this surface is premium / AI / active'. Don't reach for it on regular cards; it's a flourish."
    >
      <SubHead meta="static · diagonal">Default gradient border</SubHead>
      <Frame label=".pat-grad-border">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, width:'100%'}}>
          <div className="pat-grad-border" style={{padding: 20, textAlign:'center'}}>
            <div className="ds-h-eyebrow" style={{marginBlockEnd: 6}}>Premium</div>
            <div className="t-body" style={{fontWeight: 600}}>Enterprise plan</div>
          </div>
          <div className="pat-grad-border" style={{padding: 20, textAlign:'center'}}>
            <Icons.sparkle size={16} style={{color:'var(--ember)'}}/>
            <div className="t-body" style={{fontWeight: 600, marginBlockStart: 8}}>AI suggestion</div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">Renders via <Mono>::before</Mono> with <Mono>mask-composite: exclude</Mono> — the gradient is the border, the surface still uses <Mono>--surface</Mono>.</p>

      <SubHead meta="animated · thicker">Variants</SubHead>
      <Frame label="default · is-thick · is-spin (conic rotate)">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14, width:'100%'}}>
          <div className="pat-grad-border" style={{padding: 18, textAlign:'center'}}>
            <div className="t-mono-label">default · 1.5px</div>
          </div>
          <div className="pat-grad-border is-thick" style={{padding: 18, textAlign:'center'}}>
            <div className="t-mono-label">is-thick · 3px</div>
          </div>
          <div className="pat-grad-border is-spin" style={{padding: 18, textAlign:'center'}}>
            <div className="t-mono-label">is-spin · conic 6s</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="real applications">In context</SubHead>
      <Frame label="Premium tier · AI-flagged card · scaffold from agent">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14, width:'100%'}}>
          <div className="pat-grad-border" style={{padding: 18}}>
            <span className="pill ember">PRO</span>
            <div className="t-body" style={{fontWeight: 600, marginBlockStart: 10}}>Unlimited services</div>
            <div className="t-small t-mono" style={{color:'var(--fg-muted)', marginBlockStart: 4, fontVariantNumeric:'tabular-nums'}}>$49 / dev / mo</div>
            <button className="btn ember sm" style={{marginBlockStart: 12, inlineSize:'100%'}}>Upgrade</button>
          </div>
          <div className="pat-grad-border is-spin" style={{padding: 18}}>
            <Icons.sparkle size={16} style={{color:'var(--ember)'}}/>
            <div className="t-body" style={{fontWeight: 600, marginBlockStart: 8}}>Agent action ready</div>
            <div className="t-small" style={{color:'var(--fg-muted)', marginBlockStart: 4}}>&ldquo;Open a PR that rolls back identity-svc to v4.18.1.&rdquo;</div>
            <button className="btn ghost sm" style={{marginBlockStart: 10}}>Approve <Icons.arrowRight size={12}/></button>
          </div>
          <div className="pat-grad-border is-thick" style={{padding: 18}}>
            <span className="pill ice">NEW</span>
            <div className="t-body" style={{fontWeight: 600, marginBlockStart: 8}}>Template v2 available</div>
            <div className="t-small" style={{color:'var(--fg-muted)', marginBlockStart: 4}}>typescript-service · gold standard</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="active · loading · error · disabled · empty">States</SubHead>
      <p className="ds-caption">The agent-action card is the surface this pattern was built for. Its rim only signals the surface is special — the card still has to express its full lifecycle in words and controls. Every state below ships in the demo.</p>
      <Frame label="Agent-action card · full lifecycle">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, width:'100%'}}>

          {/* ACTIVE — ready for input */}
          <div className="pat-grad-border is-spin" style={{padding: 18}}>
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBlockEnd: 8}}>
              <Icons.sparkle size={16} style={{color:'var(--ember)'}} aria-hidden="true"/>
              <span className="t-mono-label">active</span>
            </div>
            <div className="t-body" style={{fontWeight: 600}}>Agent action ready</div>
            <div className="t-small" style={{color:'var(--fg-muted)', marginBlockStart: 4, lineHeight: 1.55}}>&ldquo;Open a PR that rolls back identity-svc to <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>v4.18.1</span>.&rdquo;</div>
            <button className="btn ember sm" style={{marginBlockStart: 12}}>Approve <Icons.arrowRight size={12} aria-hidden="true"/></button>
          </div>

          {/* LOADING — agent working; live region announces progress */}
          <div className="pat-grad-border is-spin" style={{padding: 18}} aria-busy="true">
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBlockEnd: 8}}>
              <Spinner size="sm" aria-label="Agent working"/>
              <span className="t-mono-label">loading</span>
            </div>
            <div className="t-body" style={{fontWeight: 600}}>Opening pull request…</div>
            <div style={{display:'grid', gap: 6, marginBlockStart: 10}}>
              <Skeleton variant="line" width="100%"/>
              <Skeleton variant="line" width="62%"/>
            </div>
          </div>

          {/* ERROR — danger Alert carries role="alert" automatically */}
          <div className="pat-grad-border" style={{padding: 18}}>
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBlockEnd: 10}}>
              <span className="t-mono-label">error</span>
            </div>
            <Alert tone="danger">
              <AlertTitle>Roll-back failed</AlertTitle>
              <AlertDescription>identity-svc v4.18.1 is no longer on the registry. Pick a newer tag and retry.</AlertDescription>
              <AlertActions>
                <button className="btn ghost sm">Retry</button>
              </AlertActions>
            </Alert>
          </div>

          {/* DISABLED — control removed from the focus order */}
          <div className="pat-grad-border" style={{padding: 18, opacity: 0.62}}>
            <div style={{display:'flex', alignItems:'center', gap: 8, marginBlockEnd: 8}}>
              <Icons.lock size={14} style={{color:'var(--fg-faint)'}} aria-hidden="true"/>
              <span className="t-mono-label">disabled</span>
            </div>
            <div className="t-body" style={{fontWeight: 600}}>Approval locked</div>
            <div className="t-small" style={{color:'var(--fg-muted)', marginBlockStart: 4, lineHeight: 1.55}}>Needs a reviewer on the <Mono>platform</Mono> team. The rim dims with the card so it never reads as live.</div>
            <button className="btn ember sm" style={{marginBlockStart: 12}} disabled aria-disabled="true">Approve</button>
          </div>
        </div>
      </Frame>
      <Frame label="Empty — nothing to flag">
        <div className="empty" style={{inlineSize:'100%'}}>
          <div className="empty-icon" aria-hidden="true"><Icons.sparkle size={20}/></div>
          <div className="empty-text">
            <div className="empty-title">No premium surfaces</div>
            <div className="empty-desc">When there is no agent action, premium tier or new template to flag, render a plain card — never an empty gradient rim. The border is a signal, so it should never appear with nothing to say.</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 10}}>Keyboard — the card&rsquo;s own controls</div>
          <dl style={{margin: 0, display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 14, rowGap: 8, alignItems:'baseline'}}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Moves to the next control inside the card (Upgrade, Approve, Retry). The rim is a <Mono>::before</Mono> layer with no tab stop, so it never sits in the focus order.</dd>
            <dt><kbd className="kbd">Shift</kbd> <kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Moves to the previous control; focus tracks the visible reading order, top to bottom.</dd>
            <dt><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Activates the focused button — approves the agent action or retries a failed one.</dd>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Skips a <Mono>disabled</Mono> control entirely — the locked Approve button carries <Mono>aria-disabled</Mono> and is removed from the focus order.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>ARIA &amp; screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Each state is announced by content, not the rim. The decorative icon and ring carry <Mono>aria-hidden</Mono>; the loading card sets <Mono>aria-busy</Mono> and its <Mono>Spinner</Mono> exposes <Mono>role=&quot;status&quot;</Mono> with a visually-hidden &ldquo;Agent working&rdquo; label; the error card renders an <Mono>Alert tone=&quot;danger&quot;</Mono> which is <Mono>role=&quot;alert&quot;</Mono> + <Mono>aria-live=&quot;assertive&quot;</Mono>. Tier and novelty are always in words — a <Mono>PRO</Mono>/<Mono>NEW</Mono> pill — so the border is never the only carrier of meaning.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Contrast over texture</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The gradient paints only the rim via <Mono>mask-composite</Mono>; the fill stays <Mono>--surface</Mono>, so card text keeps full AA contrast and never lands on the gradient itself. Because the border is decorative, the 3:1 non-text-contrast rule is not load-bearing — the real boundary cue is the surface edge.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Reduced motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The <Mono>is-spin</Mono> conic rotation is gated behind <Mono>prefers-reduced-motion</Mono>: when motion is reduced the border holds as a static gradient. The spin reads as decoration, not progress — the loading card above shows progress with a real <Mono>Spinner</Mono>, never the rim.</div>
        </div>
      </div>

      <SubHead meta="layers">Anatomy</SubHead>
      <div className="ana">
        <div className="stage" style={{display:'grid', placeItems:'center', padding: '40px 0', position:'relative'}}>
          <div className="pat-grad-border is-thick" style={{padding: 22, inlineSize: 220}}>
            <span className="pill ember">PRO</span>
            <div className="t-body" style={{fontWeight: 600, marginBlockStart: 10}}>Enterprise plan</div>
          </div>
          {/* 1 — gradient ring (the painted ::before) */}
          <span className="pin" style={{insetBlockStart: 30, insetInlineStart: 'calc(50% - 130px)'}}>1</span>
          <span className="lead h" style={{insetBlockStart: 39, insetInlineStart: 'calc(50% - 112px)', inlineSize: 44}}/>
          {/* 2 — masked fill (--surface) */}
          <span className="pin" style={{insetBlockEnd: 30, insetInlineStart: 'calc(50% - 130px)'}}>2</span>
          <span className="lead h" style={{insetBlockEnd: 39, insetInlineStart: 'calc(50% - 112px)', inlineSize: 44}}/>
          {/* 3 — content layer (z-index 2) */}
          <span className="pin" style={{insetBlockStart: 36, insetInlineEnd: 'calc(50% - 130px)'}}>3</span>
          <span className="lead h" style={{insetBlockStart: 45, insetInlineEnd: 'calc(50% - 112px)', inlineSize: 44}}/>
        </div>
        <div className="ana-list" style={{marginBlockStart: 16}}>
          <span className="num">1</span><div>Gradient ring — a <Mono>::before</Mono> filled with the ember→ice <Mono>linear-gradient</Mono> (or a rotating <Mono>conic-gradient</Mono> under <Mono>is-spin</Mono>), clipped to a <Mono>1.5px</Mono> rim by <Mono>mask-composite: exclude</Mono>.</div>
          <span className="num">2</span><div>Masked fill — the card body stays a solid <Mono>--surface</Mono>; the mask punches the interior out of the gradient so paint survives only on the edge.</div>
          <span className="num">3</span><div>Content layer — pill, heading and controls sit at <Mono>z-index: 2</Mono>, above the decorative rim, so they keep full contrast and are never overlaid by the gradient.</div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — flag a single premium / AI surface</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-grad-border t-small" style={{padding: 12, fontWeight: 600}}>upgrade prompt</div>
          </div>
          <div className="note">One per surface. The gradient earns its loudness only if it's rare.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — every card in a grid</div>
          <div className="body" style={{padding: 0, gap: 6, display:'flex'}}>
            <div className="pat-grad-border" style={{padding: 6, fontSize: 'var(--text-xs)'}}>a</div>
            <div className="pat-grad-border" style={{padding: 6, fontSize: 'var(--text-xs)'}}>b</div>
            <div className="pat-grad-border" style={{padding: 6, fontSize: 'var(--text-xs)'}}>c</div>
          </div>
          <div className="note">Repeat it across a grid and it loses meaning — looks like a band, not a signal.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <PropsTable
        label=".pat-grad-border — modifiers"
        rows={[
          { prop: 'is-thick', type: 'class', description: 'Bump padding mask from 1.5px to 3px.' },
          { prop: 'is-spin',  type: 'class', description: 'Conic-gradient with @property angle rotation. 6s loop.' },
          { prop: 'inherits',  type: '<color>', description: 'Surface stays --surface; gradient is from --ember / --ice tokens.' },
        ]}
      />
    </Section>
  );
}
