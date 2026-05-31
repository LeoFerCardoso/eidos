'use client';
// Eidos DS — Components / Badges
// Tier · language · numeric · 'new' — small inline markers attached to text or a UI affordance.
// For keyboard chords see Kbd. For an avatar attached to a name see Owner pill (under Avatar).
import * as React from 'react';
import { Badge, TierBadge, LangBadge, Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, PropsTable, installTabs, Lede, Mono } from '@/ds/core';

// Inline marker host: a label and its trailing badge sit on the baseline with a
// single scale gap. tabular-nums keeps the count from shifting the baseline as
// digits change (1 → 9 → 142).
const marker: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  fontVariantNumeric: 'tabular-nums',
};

// Live count demonstrator — proves the two things the page claims about a numeric
// badge: the digits are tabular (the label never shifts as the count climbs) and
// the value caps at 99+ so a runaway counter can't widen the chip. Keyboard-first:
// the +/− controls are real .btn buttons with the built-in focus-visible ring.
function CountPlayground() {
  const [n, setN] = React.useState(3);
  const display = n > 99 ? '99+' : String(n);
  const tone = n === 0 ? undefined : n > 99 ? 'danger' : 'new';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span style={{ ...marker, gap: 'var(--space-2)' }}>
        Pull requests
        {n === 0
          ? <Badge>0</Badge>
          : <Badge tone={tone as 'new' | 'danger'}>{display}</Badge>}
      </span>
      <span role="group" aria-label="Adjust pull-request count" style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
        <button type="button" className="btn sm outline" aria-label="Decrease count" onClick={() => setN((v) => Math.max(0, v - 1))}><Icons.minus size={13}/></button>
        <button type="button" className="btn sm outline" aria-label="Increase count" onClick={() => setN((v) => Math.min(150, v + 1))}><Icons.plus size={13}/></button>
      </span>
      <span aria-live="polite" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>
        n = {n}{n > 99 ? ' → capped at 99+' : ''}
      </span>
    </div>
  );
}

  const USAGE_CODE = `import { Badge, TierBadge, LangBadge } from "@eidos/ui"

export function Demo() {
  return (
    <div className="flex gap-2 items-center">
      <TierBadge tier="T1" />
      <LangBadge lang="TypeScript" />
      <Badge>42</Badge>
      <Badge tone="new">new</Badge>
    </div>
  )
}`;

export default function Badges() {
  return (
    <Section
      id="badges"
      title="Badge"
      desc="Tier · language · numeric · 'new' — small inline markers attached to text or a UI affordance. For keyboard chords see Kbd. For an avatar attached to a name see Owner pill (under Avatar)."
    >
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('badge')} ariaLabel="package manager"/>
      <Lede>Ships <Mono>Badge</Mono>, <Mono>TierBadge</Mono>, <Mono>LangBadge</Mono> — plus the <Mono>.badge</Mono> CSS primitive for raw count and 'new' markers. Badges always sit inline on the baseline — never standalone in a row.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <TierBadge tier="T1"/>
        <LangBadge lang="TypeScript"/>
        <Badge>42</Badge>
        <Badge tone="new">new</Badge>
      </Frame>

      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-2)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      <SubHead meta="3 tiers">Tier</SubHead>
      <Frame label="T1 ember-soft tint · T2 warning tint · T3 ghost border" row>
        <TierBadge tier="T1"/>
        <TierBadge tier="T2"/>
        <TierBadge tier="T3"/>
      </Frame>
      <Lede>
        <Mono>TierBadge</Mono> composes <Mono>{'<Chip tone="tier-t1|t2|t3">'}</Mono>. T1 sits on an <Mono>--ember-soft</Mono> tint (not a solid ember fill) and prints its label in the contrast-tuned <Mono>--ember-text</Mono> — a lightened ember on dark, a burnt ember on light — so the ember-on-tint pairing clears AA without becoming flat ember-on-ember.
      </Lede>

      <SubHead meta="dot + label">Language</SubHead>
      <Frame label="dot uses the lang's brand colour" row>
        <LangBadge lang="TypeScript"/>
        <LangBadge lang="Go"/>
        <LangBadge lang="Python"/>
        <LangBadge lang="Java"/>
        <LangBadge lang="Rust"/>
      </Frame>

      <SubHead meta="counts">Numeric</SubHead>
      <Frame label="counters live next to a label · tone carries severity · digits are tabular" row>
        <span style={marker}>Inbox <Badge>12</Badge></span>
        <span style={marker}>Failed <Badge tone="danger">3</Badge></span>
        <span style={marker}>OK <Badge tone="success">142</Badge></span>
        <span style={marker}>Throughput <Badge tone="ice">9,482</Badge></span>
      </Frame>
      <Frame label="try it — climb the count past 99 and watch the label hold its baseline">
        <CountPlayground/>
      </Frame>

      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame label="three sizes match the line they ride · md is the default" row>
        <span style={{...marker, fontSize: 'var(--text-sm)'}}>Caption <Badge size="sm">3</Badge></span>
        <span style={marker}>Nav label <Badge>12</Badge></span>
        <span style={{...marker, fontSize: 'var(--text-lg)'}}>Heading <Badge size="lg">9,482</Badge></span>
      </Frame>

      <SubHead meta="state markers">"New" / "Updated" / "Beta"</SubHead>
      <Frame label="ride next to a menu item, link, feature title" row>
        <span style={marker}>Quality Gates <Badge tone="new">new</Badge></span>
        <span style={marker}>Risk score <Badge tone="ice">updated</Badge></span>
        <span style={marker}>Agent runner <Badge dot aria-hidden="true"/></span>
      </Frame>

      <SubHead meta="versioning">Version tag</SubHead>
      <Frame label="lives next to a service name · mono, tabular semver" row>
        <span style={{...marker, fontFamily:'var(--font-mono)'}}>forge-api <Badge>v2.1.7</Badge></span>
        <span style={{...marker, fontFamily:'var(--font-mono)'}}>pix-router <Badge tone="warning">v1.0.0-rc.4</Badge></span>
        <span style={{...marker, fontFamily:'var(--font-mono)'}}>fraud-engine <Badge tone="danger">v0.9.2</Badge></span>
      </Frame>

      <SubHead meta="rollups">In a sidebar item</SubHead>
      <Frame label="counter pushed to the end of a nav link · the link is the only Tab stop">
        <div style={{display:'flex', flexDirection:'column', gap: 'var(--space-1)', maxWidth: 280, fontVariantNumeric: 'tabular-nums'}}>
          <a className="ds-link" href="#"><span className="ds-link-label">Service catalog</span><span className="ds-link-badge new">new</span></a>
          <a className="ds-link" href="#"><span className="ds-link-label">Incidents</span><Badge tone="danger" pushEnd>2</Badge></a>
          <a className="ds-link" href="#"><span className="ds-link-label">PR review queue</span><Badge pushEnd>14</Badge></a>
        </div>
      </Frame>

      <SubHead meta="empty · overflow · presence">States</SubHead>
      <Frame label="a count has real edge states — show them, don't fake a number" row>
        <span style={marker}>Inbox <span className="badge" aria-hidden="true">0</span></span>
        <span style={marker}>Drafts <Badge>0</Badge></span>
        <span style={marker}>Notifications <Badge tone="danger">99+</Badge></span>
        <span style={marker}>Build <Badge dot tone="success" aria-hidden="true"/></span>
      </Frame>
      <Lede>
        <b style={{color:'var(--fg)'}}>Zero</b> is a real state — a quiet <Mono>0</Mono> on the default surface, or drop the badge entirely when zero carries no signal (an empty inbox needs no marker). <b style={{color:'var(--fg)'}}>Overflow</b> caps at <Mono>99+</Mono> so the chip never widens past two glyphs; the unbounded value belongs in the tooltip / link name, not the badge. The <b style={{color:'var(--fg)'}}>presence dot</b> (<Mono>dot</Mono>) is the count-less variant — pure "something here" — and is always <Mono>aria-hidden</Mono> because it carries no text. Badges have no loading, error, disabled, or invalid state of their own: they are inert markers, so any such state lives on the host control (a skeleton row, a danger <Mono>Alert role="alert"</Mono>, a disabled link) and the badge simply rides along.
      </Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockEnd: 'var(--space-3)'}}>A badge takes <b style={{color:'var(--fg)'}}>no focus stop</b> of its own — keys belong to the host link or button it rides on.</div>
          <dl style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'var(--space-2) var(--space-3)', margin:0, alignItems:'baseline'}}>
            <dt style={{margin:0}}><kbd className="kbd">Tab</kbd></dt>
            <dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight:1.55}}>Moves to the enclosing link — the single target. The badge is skipped.</dd>
            <dt style={{margin:0}}><kbd className="kbd">Enter</kbd></dt>
            <dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight:1.55}}>Activates that link; its name includes the badge, e.g. "Incidents 2".</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Keep the badge meaningful as text — "Inbox 12", "Risk score updated" — so it announces in context; avoid bare numbers without a preceding label. The language dot is decorative (<Mono>aria-hidden</Mono>), with the language name itself carrying the meaning.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every tone is a <em>tinted</em> surface, never a solid fill: T1 and <Mono>tone="new"</Mono> print ember-family text (<Mono>--ember-text</Mono> / <Mono>--ember</Mono>) on the <Mono>--ember-soft</Mono> tint, and success/warning/danger do the same on their own soft tints — each pairing is tuned to clear AA on that tint. Tone is always doubled with a text label, so colour-blind users read "new"/"updated"/"beta" directly. Badges take no focus stop; only an enclosing link or button does.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Badges are static — they neither pulse nor animate on appearance — so there is no motion to gate behind <Mono>prefers-reduced-motion</Mono>. (A live, pulsing presence dot belongs on <Mono>Pill</Mono>, which does honour the query.)</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — leading dot/icon moves to the right, trailing badge hugs start edge'}
        row
        code={`<div dir="rtl">
  <TierBadge tier="T1" />
  <LangBadge lang="TypeScript" />
  <Badge>42</Badge>
  <Badge tone="new">new</Badge>
</div>`}
        lang="tsx"
      >
        <div dir="rtl" style={{display:'flex', alignItems:'center', gap: 'var(--space-3)', flexWrap:'wrap', fontVariantNumeric:'tabular-nums'}}>
          <TierBadge tier="T1"/>
          <LangBadge lang="TypeScript"/>
          <Badge>42</Badge>
          <Badge tone="new">new</Badge>
        </div>
      </Frame>
      <Lede>
        A badge is largely symmetric. Because it lays out with logical flex, a leading status dot (the <Mono>LangBadge</Mono> colour dot) lands on the start edge — now the right — and the label right-aligns. The numeric and tier glyphs themselves are non-directional and never mirror — only the inline order follows <Mono>dir="rtl"</Mono>, driven by <Mono>margin-inline</Mono> spacing, with no <Mono>scaleX(-1)</Mono> needed. A removable token's trailing <Mono>✕</Mono> lives on its sibling <Mono>Chip</Mono> / <Mono>Pill</Mono> and flips to the end (left) by the same logical rule.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <LangBadge lang="TypeScript" />
              {/* pin 1 — leading colour dot */}
              <span className="lead v" style={{ top: -28, left: 6, height: 22 }} />
              <div className="pin" style={{ top: -50, left: 6, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — label text */}
              <span className="lead v" style={{ top: -28, left: '55%', height: 22 }} />
              <div className="pin" style={{ top: -50, left: '55%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — surface / fill */}
              <span className="lead v" style={{ bottom: -28, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — shape / radius */}
              <span className="lead h" style={{ top: '50%', right: -30, width: 24 }} />
              <div className="pin" style={{ top: '50%', right: -54, transform: 'translateY(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Leading dot / icon.</b> Language dot uses the lang brand colour; decorative, so <Mono>aria-hidden</Mono>. On <Mono>TierBadge T1</Mono> the slot is empty — the ember-soft tint alone signals priority.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Geist Mono at <Mono>--text-xs</Mono>, sentence case. Reads in context as part of the surrounding link or heading — never a bare number without a preceding label.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Surface / tint.</b> A soft tone tint — <Mono>--success-soft</Mono>, <Mono>--warning-soft</Mono>, <Mono>--danger-soft</Mono>, or <Mono>--ember-soft</Mono> for T1 and <Mono>tone="new"</Mono> — never a saturated fill. The label is the matching tone-text colour (e.g. <Mono>--ember-text</Mono> on ember-soft), tuned to clear AA on that tint.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Shape / radius.</b> <Mono>border-radius: 4px</Mono> for chip/badge (rectangle), <Mono>999px</Mono> for pill (capsule). Height tracks the <Mono>sm</Mono> / <Mono>md</Mono> / <Mono>lg</Mono> size prop.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pick the right primitive</div>
          <div className="body" style={{display:'flex', alignItems:'center', gap: 'var(--space-3)', flexWrap:'wrap'}}>
            <span style={marker}>Inbox <Badge>12</Badge></span>
            <TierBadge tier="T1"/>
            <Badge tone="new">new</Badge>
          </div>
          <div className="note">Numeric count → <Mono>Badge</Mono>. Static tag (Tier/Lang) → the typed component. State marker (new/updated/beta) → <Mono>{'<Badge tone="new">'}</Mono>.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use Pill for a static count</div>
          <div className="body"><span className="pill ember">12 new</span></div>
          <div className="note">Pills carry state ("running", "degraded"). Counts and inert tags belong in Badge.</div>
        </div>
      </div>

      <SubHead meta="BadgeProps">API reference</SubHead>
      <AutoPropsTable component="Badge" label="<Badge />"/>
      <PropsTable
        label="<TierBadge />"
        rows={[
          { prop: 'tier', type: '"T1" | "T2" | "T3"', required: true, description: 'Reliability tier. Composes Chip tone="tier-t1|t2|t3". T1 sits on the --ember-soft tint with contrast-tuned --ember-text (not a solid ember fill); T2 warning tint; T3 ghost border.' },
          { prop: 'className', type: 'string', description: 'Extra utility classes merged via cn().' },
        ]}
      />
      <PropsTable
        label="<LangBadge />"
        rows={[
          { prop: 'lang', type: '"TypeScript" | "Go" | "Python" | "Java" | "Rust" | string', required: true, description: 'Language label. Built-ins ship with a color dot; custom strings fall back to neutral.' },
          { prop: 'className', type: 'string', description: 'Extra utility classes merged via cn().' },
        ]}
      />
      <Lede>Need an avatar with a name? See <Mono>Owner pill</Mono> on the Avatar page. Need a keyboard chord with a label? See <Mono>Kbd row</Mono> on the Kbd page.</Lede>
    </Section>
  );
}
