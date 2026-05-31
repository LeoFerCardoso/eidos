'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Suggestion, SuggestionCard, Mono } from '@/ds/core';

  // ─── live demos ─────────────────────────────────────────────────────────
  const PICKABLE = [
    'What changed in the last deploy?',
    'Why is identity-svc paging?',
    'Tier-1 runbooks for billing',
    'Show me the p99 spike',
    'Roll back the 0421 release',
    'List all incidents this week',
    'Compare deploy 0419 vs 0421',
  ];

  // Signature move — tapping a chip fills a live "composer" line, exactly the
  // product behaviour the component exists for (suggestion → seeded prompt).
  const InteractiveRow = () => {
    const [picked, setPicked] = React.useState<string | null>(null);
    return (
      <div style={{ width: '100%' }}>
        <div className="sg-row" role="group" aria-label="Suggested prompts">
          {PICKABLE.map(s => (
            <Suggestion key={s} pressed={picked === s} onClick={() => setPicked(s)}>{s}</Suggestion>
          ))}
        </div>
        <div
          style={{
            marginBlockStart: 12, display: 'flex', alignItems: 'center', gap: 8,
            paddingBlock: 9, paddingInline: 12,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
          }}
        >
          <Icons.cornerDownLeft size={13} aria-hidden="true" style={{ color: 'var(--fg-faint)', flex: '0 0 auto' }}/>
          <span
            aria-live="polite"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', lineHeight: 1.5,
              fontVariantNumeric: 'tabular-nums',
              color: picked ? 'var(--fg)' : 'var(--fg-faint)',
            }}
          >
            {picked ?? 'Tap a suggestion to fill the composer'}
          </span>
        </div>
      </div>
    );
  };

  const WrapVariants = () => (
    <div className="sg-wrap" style={{ width: '100%' }} role="group" aria-label="Suggested prompts">
      <Suggestion icon={<Icons.flame size={11}/>}>Recent incidents</Suggestion>
      <Suggestion icon={<Icons.activity size={11}/>}>Latency report</Suggestion>
      <Suggestion icon={<Icons.gauge size={11}/>}>Today's SLOs</Suggestion>
      <Suggestion icon={<Icons.branch size={11}/>}>Last deploy diff</Suggestion>
      <Suggestion icon={<Icons.shield size={11}/>}>Open security alerts</Suggestion>
      <Suggestion icon={<Icons.book size={11}/>}>Tier-1 runbooks</Suggestion>
      <Suggestion icon={<Icons.user size={11}/>}>Who is on-call?</Suggestion>
    </div>
  );

  const CardGrid = () => (
    <div className="sg-cards" role="group" aria-label="Suggested prompts">
      <SuggestionCard
        icon={<Icons.flame size={14}/>}
        title="Walk me through the 0421 incident"
        line="The full timeline — pages, mitigations, owners, and what landed in 0422."
      />
      <SuggestionCard
        icon={<Icons.branch size={14}/>}
        title="Diff this deploy"
        line="Show me everything that changed between 0420 and 0421 in identity-svc."
      />
      <SuggestionCard
        icon={<Icons.shield size={14}/>}
        title="Audit secrets rotation"
        line="Which services still have credentials older than 30 days?"
      />
      <SuggestionCard
        icon={<Icons.gauge size={14}/>}
        title="Open the on-call dashboard"
        line="p50 / p95 / p99 for every Tier-1 service in the last 24h."
      />
    </div>
  );

  // ─── code snippets ──────────────────────────────────────────────────────
  // There is no <Suggestions> container component — a Suggestion is a single
  // <button>. Group the set yourself with role="group" and wire onClick.
  const USAGE_CODE = `<div className="sg-row" role="group" aria-label="Suggested prompts">
  {prompts.map(p => (
    <Suggestion key={p} pressed={picked === p} onClick={() => ask(p)}>
      {p}
    </Suggestion>
  ))}
</div>`;

  const WRAP_CODE = `<div className="sg-wrap" role="group" aria-label="Suggested prompts">
  <Suggestion icon={<Icons.flame/>} onClick={() => ask('Recent incidents')}>
    Recent incidents
  </Suggestion>
  <Suggestion icon={<Icons.activity/>} onClick={() => ask('Latency report')}>
    Latency report
  </Suggestion>
</div>`;

  const CARDS_CODE = `<div className="sg-cards" role="group" aria-label="Suggested prompts">
  <SuggestionCard
    icon={<Icons.flame/>}
    title="Walk me through the 0421 incident"
    line="The full timeline — pages, mitigations, owners."
    onClick={() => ask('Walk me through the 0421 incident')}
  />
</div>`;

  // ─── page ────────────────────────────────────────────────────────────────
export default function SuggestionPage() {
  return (
    <Section
      id="ai-suggestion"
      num="04"
      title="Suggestion"
      desc="Starter prompts the user taps instead of typing — a clickable pill, never a styled link. Use to seed an empty thread or offer follow-ups. Three layouts share one chip: scroller, cloud, and card grid."
    >
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-suggestion')} ariaLabel="package manager"/>
      <Lede>Copy is always the user&rsquo;s question (imperative, 8 words or fewer), not the bot&rsquo;s button label.</Lede>
      <Lede>
        Ships two primitives — <Mono>Suggestion</Mono> (a single chip-button) and <Mono>SuggestionCard</Mono>. There is no wrapper component: you group a set yourself with <Mono>role=&quot;group&quot;</Mono> and wire <Mono>onClick</Mono>. Built on the canonical <a href="/pills" style={{ color: 'var(--ember)' }}>Pills &amp; Chips</a> shape — adds interactivity, never re-derives the chip.
      </Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="single-row · horizontal scroll · click to fill the prompt" code={USAGE_CODE} height={180}>
        <InteractiveRow/>
      </Frame>

      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="3 sizes">Sizes</SubHead>
      <Frame label="sm · md · lg" code={`<Suggestion size="sm">…</Suggestion>
<Suggestion>…</Suggestion>
<Suggestion size="lg">…</Suggestion>`} row height={120}>
        <Suggestion size="sm">Recent incidents</Suggestion>
        <Suggestion>Recent incidents</Suggestion>
        <Suggestion size="lg">Recent incidents</Suggestion>
      </Frame>

      <SubHead meta="wrap layout">Wrap (with icons)</SubHead>
      <Frame label="layout=&quot;wrap&quot; — chips wrap onto multiple lines, each with a leading icon" code={WRAP_CODE} height={180}>
        <WrapVariants/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Adding a tiny <Mono>11px</Mono> icon raises a chip from "starter prompt" to "category" — useful when the suggestions span more than one domain (incidents, deploys, audits, runbooks).
      </p>

      <SubHead meta="card layout · empty state">Cards</SubHead>
      <Frame label="layout=&quot;cards&quot; — 4 high-emphasis tiles, the empty-state companion" code={CARDS_CODE} height={300}>
        <CardGrid/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Cards are the high-emphasis form — used inside <a href="/ai/conversation" style={{ color: 'var(--ember)' }}>Conversation</a>'s empty state, never mid-thread. Title is a question, the line below is the value prop in &lt;15 words.
      </p>

      <SubHead meta="composition · mid-thread follow-ups">After an assistant answer</SubHead>
      <Frame label="3 follow-up chips below the last assistant turn" height={260}>
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            display: 'inline-block', alignSelf: 'flex-start',
            padding: '10px 12px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, borderEndStartRadius: 4,
            fontSize: 'var(--text-base)', color: 'var(--fg)', maxWidth: '76%',
          }}>
            Three things to check first — start with the retry budget on <Mono>grpc.toml</Mono>.
          </div>
          <div className="sg-row" style={{ paddingBlockStart: 0 }} role="group" aria-label="Follow-up prompts">
            <Suggestion size="sm">Show me grpc.toml</Suggestion>
            <Suggestion size="sm">Why was it bumped?</Suggestion>
            <Suggestion size="sm">Roll back the change</Suggestion>
            <Suggestion size="sm">Check downstream timeouts</Suggestion>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 10}}>Keyboard</div>
          <dl style={{display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 8, margin: 0}}>
            <dt style={{whiteSpace: 'nowrap', paddingBlockStart: 1}}><kbd className="kbd">Tab</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Move to the next chip/card in DOM order. A chip off-screen at the trailing edge of the scroller scrolls into view as focus reaches it — focus is never trapped in the overflow.</dd>
            <dt style={{whiteSpace: 'nowrap', paddingBlockStart: 1}}><kbd className="kbd">Shift</kbd> <kbd className="kbd">Tab</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Move to the previous chip/card.</dd>
            <dt style={{whiteSpace: 'nowrap', paddingBlockStart: 1}}><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Activate the focused chip/card — fires <Mono>onClick</Mono> with the prompt (the host fills or submits its composer).</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>There is no wrapper element — wrap the set in <Mono>role=&quot;group&quot;</Mono> with <Mono>aria-label=&quot;Suggested prompts&quot;</Mono> (every demo here does) so it is announced as one unit. Each <Mono>Suggestion</Mono> is a native <Mono>&lt;button&gt;</Mono>; its leading icon is <Mono>aria-hidden</Mono>, so the text label carries the meaning. A picked chip exposes <Mono>aria-pressed=&quot;true&quot;</Mono>. A <Mono>SuggestionCard</Mono> concatenates its title + line as the button&rsquo;s accessible name, so the value prop is spoken, not just shown.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Both <Mono>.sg</Mono> and <Mono>.sg-card</Mono> show a 2px ember focus ring with <Mono>outline-offset: 2px</Mono>, clear of the edge. The picked state pairs the <Mono>--ember-soft</Mono> fill with <Mono>--ember-text</Mono> held at AA <em>and</em> <Mono>aria-pressed</Mono>, so &ldquo;already picked&rdquo; is never colour-only; resting chips keep <Mono>--fg-muted</Mono> on <Mono>--surface</Mono> at AA.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <Mono>prefers-reduced-motion</Mono> the <Mono>.sg-card</Mono> hover lift, the <Mono>.sg</Mono> background/border <Mono>transition: all</Mono>, and the <Mono>.sg-row</Mono> smooth-scroll are all neutralised (state changes apply instantly) — see the shared rule added to <Mono>ai.css</Mono>.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — chips flow from start, icon moves to the trailing edge" height={120}>
        <div dir="rtl" style={{ width: '100%' }}>
          <div className="sg-row" role="group" aria-label="مطالبات مقترحة">
            <Suggestion icon={<Icons.flame size={11}/>}>الحوادث الأخيرة</Suggestion>
            <Suggestion icon={<Icons.activity size={11}/>}>تقرير الكمون</Suggestion>
            <Suggestion icon={<Icons.gauge size={11}/>}>SLOs اليوم</Suggestion>
            <Suggestion icon={<Icons.branch size={11}/>}>آخر فرق نشر</Suggestion>
          </div>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Suggestion size="lg" icon={<Icons.flame size={13}/>}>What changed in the last deploy?</Suggestion>
              <span className="lead v" style={{ top: -22, left: 14, height: 18 }}/>
              <span className="lead h" style={{ top: 16, right: -28, width: 24 }}/>
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ top: -42, left: 14, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 8, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Leading icon (optional).</b> <Mono>11–13px</Mono> stroke icon. Use only when the row spans multiple categories — otherwise drop it.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Sentence-cased question or noun phrase. ≤ 8 words. Avoid trailing punctuation except <Mono>?</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Chip shape.</b> Inherits <Mono>.pill</Mono> — 999px radius, <Mono>--surface</Mono> fill, <Mono>--border-strong</Mono> outline. Pressed state flips to <Mono>--ember-soft</Mono>.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — write the user's question, not the bot's reply</div>
          <div className="body" style={{ padding: 14 }}>
            <Suggestion>What changed in the last deploy?</Suggestion>
          </div>
          <div className="note">Suggestions are what the user would type. Frame them in first-person/imperative.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — write the bot's button copy</div>
          <div className="body" style={{ padding: 14 }}>
            <Suggestion>Click here to see deploys</Suggestion>
          </div>
          <div className="note">"Click here / View / Show" feels like a CTA, not a prompt. Skip it.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep the row scannable</div>
          <div className="body" style={{ padding: 14, justifyContent: 'flex-start', flexDirection: 'column', gap: 8 }}>
            <div className="sg-row" style={{ padding: 0 }}>
              <Suggestion>Recent incidents</Suggestion>
              <Suggestion>Latency report</Suggestion>
              <Suggestion>Last deploy</Suggestion>
            </div>
          </div>
          <div className="note">3–5 short chips in a row. Longer lists go in <Mono>layout="wrap"</Mono>.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — stuff a sentence into a chip</div>
          <div className="body" style={{ padding: 14 }}>
            <Suggestion size="sm">Could you please walk me through every single thing that happened in the 0421 release across all services?</Suggestion>
          </div>
          <div className="note">If it wraps onto two visual lines, use a SuggestionCard instead.</div>
        </div>
      </div>

      <SubHead meta="SuggestionProps">API reference</SubHead>
      <AutoPropsTable component="Suggestion" label="<Suggestion />"/>
      <AutoPropsTable component="SuggestionCard" label="<SuggestionCard />"/>
    </Section>
  );
}
