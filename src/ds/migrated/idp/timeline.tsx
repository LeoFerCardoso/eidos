'use client';
// Forge DS — Components / Timeline
// Vertical sequence of events. (v1.6.0 removed the horizontal variant —
// use <Pipeline variant="stepper"/> or "chevron" instead.)
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Timeline, Lede, Mono, Kbd } from '@/ds/core';


const M = 60_000;
const ITEMS = [
  { id: 't1', tone: 'deploy',   icon: 'rocket', title: 'Promoted forge-api v2.1.7 → canary', at: new Date(Date.now() - 4 * M), meta: '64% of traffic · err 0.12%', current: true },
  { id: 't2', person: { initials: 'AS', name: 'Ana Souza' }, title: 'Ana approved the change',                 at: new Date(Date.now() - 12 * M), meta: 'Reviewer · SRE',                              done: true },
  { id: 't3', tone: 'commit',   icon: 'branch', title: '#4218 — Trim cold-start in handlers',                  at: new Date(Date.now() - 24 * M), meta: '8 files · +142 / −24',                       done: true },
  { id: 't4', tone: 'incident', icon: 'alert',  title: 'INC-4137 closed',                                      at: new Date(Date.now() - 3 * 60 * M), meta: 'Duration 38m · 1 affected service',         done: true },
  { id: 't5', tone: 'note',     icon: 'doc',    title: 'Runbook attached to fraud-engine',                     at: new Date(Date.now() - 5 * 60 * M), meta: 'rb-fraud-engine-v3',                        done: true },
];

const USAGE = `import { Timeline } from "@/components/forge/timeline"

<Timeline items={items}/>          {/* vertical activity feed */}
<Timeline items={items} compact/>  {/* tight density for sidesheets */}`;

export default function TimelinePage() {
  return (
    <Section id="timeline" title="Timeline" desc="Vertical, time-ordered event feed for audit logs, activity streams, and incident histories. Each row leads with an avatar (human action) or a tone icon (deploy, commit, alert). Use Pipeline for left-to-right steps.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('timeline')} ariaLabel="package manager"/>
      <Lede>Timeline is the workhorse for audit logs, activity feeds, and incident histories — anywhere a vertical, time-ordered list of events makes sense.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Lead with the avatar when a person did it, and with the tone icon (deploy, commit, incident, alert) when the system did it — one signifier per row, never both in the same pin. Depth and body copy belong inside the item body, not the pin.</Lede>
      <Frame label="vertical · default" code={USAGE}>
        <Timeline items={ITEMS}/>
      </Frame>

      <SubHead meta="compact density">Compact</SubHead>
      <Frame label="for sidesheets and inline timelines">
        <Timeline items={ITEMS.slice(0, 3)} compact/>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A read-only feed is not a tab stop — the reader scrolls it. Only an item that links to its deploy, PR, or incident exposes a focusable target; the rail and decorative pins are skipped.</div>
          <div style={{marginTop: 12}}>
            <Kbd label="Next linked event title" keys={['Tab']}/>
            <Kbd label="Previous linked event title" keys={['Shift', 'Tab']}/>
            <Kbd label="Open the focused event" keys={['Enter']}/>
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The feed is an ordered list (<Mono>{'<ol>'}</Mono>); each item reads its title, then its relative time as a <Mono>{'<time datetime>'}</Mono> carrying the full ISO stamp (not just "4m ago"). The pin glyph or avatar is <Mono>aria-hidden</Mono> decoration — the event type lives in the title text. The in-flight item carries <Mono>aria-current="true"</Mono> on its <Mono>{'<li>'}</Mono>, so the reader announces "current" without relying on the ember tint.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The tone (deploy / commit / incident / alert) tints the pin border and icon, but the event kind is always in the title and the meta line — colour is reinforcement, not the message. Pin icon, tone tint and the title text all meet AA against the page surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The current item's pin carries an ember <Mono>.tl-halo</Mono> that pulses on a 1.8s loop to draw the eye. Under <Mono>prefers-reduced-motion: reduce</Mono> the loop holds still — the halo stays drawn, only the animation stops; relative times re-render without transition. Motion is reinforcement, never the sole signal for the current step.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — the rail and pins anchor to the inline-start (right); titles and timestamps align right'>
        <div dir="rtl">
          <Timeline items={[
            { id: 'r1', tone: 'deploy', icon: 'rocket', title: 'ترقية forge-api v2.1.7 → canary', at: new Date(Date.now() - 4 * 60_000), meta: '64% من حركة المرور · خطأ 0.12%', current: true },
            { id: 'r2', person: { initials: 'ع.س', name: 'علي سعد' }, title: 'علي وافق على التغيير', at: new Date(Date.now() - 12 * 60_000), meta: 'مراجع · SRE', done: true },
            { id: 'r3', tone: 'incident', icon: 'alert', title: 'تم إغلاق INC-4137', at: new Date(Date.now() - 3 * 60 * 60_000), meta: 'المدة 38 دقيقة · خدمة واحدة متأثرة', done: true },
          ]}/>
        </div>
      </Frame>
      <Lede>
        The rail is a 1px <Mono>::after</Mono> line on each non-last item; a <Mono>[dir="rtl"]</Mono> rule swaps it from the left edge to the right so it anchors to the inline-start side. Pins, titles, relative timestamps, and meta lines all align from the right. Tone icons (rocket, alert) are non-directional and stay as-is; only layout mirrors.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Timeline items={[
                { id: 'a1', tone: 'deploy', icon: 'rocket', title: 'Promoted forge-api v2.1.7 → canary', at: new Date(Date.now() - 4 * 60_000), meta: '64% of traffic · err 0.12%', current: true },
                { id: 'a2', person: { initials: 'AS', name: 'Ana Souza' }, title: 'Ana approved the change', at: new Date(Date.now() - 12 * 60_000), meta: 'Reviewer · SRE', done: true },
              ]}/>
              {/* pin 1 — tl-pin (icon for system event), top-left of first item */}
              <span className="lead h" style={{ top: 14, left: -32, width: 28 }} />
              <div className="pin" style={{ top: 6, left: -56 }}>1</div>
              {/* pin 2 — vertical rail connector between items */}
              <span className="lead h" style={{ top: 52, left: -32, width: 28 }} />
              <div className="pin" style={{ top: 44, left: -56 }}>2</div>
              {/* pin 3 — title, pointing at first item title */}
              <span className="lead v" style={{ top: -26, left: 80, height: 20 }} />
              <div className="pin" style={{ top: -48, left: 80, transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — relative timestamp, top-right of first row */}
              <span className="lead v" style={{ top: -26, right: 0, height: 20 }} />
              <div className="pin" style={{ top: -48, right: 0, transform: 'translateX(50%)' }}>4</div>
              {/* pin 5 — meta line, below the title of first item */}
              <span className="lead v" style={{ bottom: -26, left: 130, height: 20 }} />
              <div className="pin" style={{ bottom: -48, left: 130, transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Pin.</b> Avatar (<Mono>initials</Mono>) when a person acted; tone icon (deploy, commit, alert) when the system acted. Never both in the same pin — one signifier per row. The current item gets an ember <Mono>.tl-halo</Mono> that pulses (held still under reduced-motion); the pin itself is <Mono>aria-hidden</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Rail.</b> A thin 1px vertical line that spans between pins, drawn as a <Mono>::after</Mono> on every non-last item; a <Mono>[dir="rtl"]</Mono> rule mirrors it from the left to the right edge so it tracks the inline-start side.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> Geist Sans 500/13. The current item renders in <Mono>var(--ember)</Mono> (600 weight); done items dim to <Mono>var(--fg-muted)</Mono>; pending/default items stay <Mono>var(--fg)</Mono>. Wrap an <Mono>{'<a>'}</Mono> here for a linkable event.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Relative timestamp.</b> Rendered as <Mono>{'<time datetime="…">'}</Mono> so screen readers get the full ISO stamp. The visible text is human-relative ("4m ago", "3h ago") — never a bare epoch.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Meta line.</b> One line of muted Geist Mono copy: duration, file counts, audience, or error rate. Optional. Use <Mono>children</Mono> for richer inline content (mini-pipeline, stat row).</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair an avatar with human action</div>
          <div className="body"><Timeline items={[ITEMS[1]]}/></div>
          <div className="note">When a person did it, lead with their avatar. When the system did it, lead with the icon — deploy / alert / commit.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mix avatars and icons in the same pin</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)' }}>icon + initials overlapping = noise</div>
          <div className="note">Pick one signifier per row. If you want to convey both, put the avatar in the body, not the pin.</div>
        </div>
      </div>

      <SubHead meta="TimelineProps">API reference</SubHead>
      {/* Generated from the typed Timeline props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="Timeline" label="<Timeline />"/>
      <Lede><b style={{color:'var(--fg)'}}>tone:</b> <Mono>"deploy"</Mono>, <Mono>"commit"</Mono>, <Mono>"merge"</Mono>, <Mono>"incident"</Mono>, <Mono>"alert"</Mono>, <Mono>"comment"</Mono>, <Mono>"note"</Mono>. Tints the pin border + icon colour.</Lede>
    </Section>
  );
}
