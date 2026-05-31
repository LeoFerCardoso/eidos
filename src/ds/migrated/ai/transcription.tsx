'use client';
// Forge AI — Transcription. Speaker-labeled lines from an audio conversation.
// Optional timestamps, confidence scores, and a streaming live mode.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, PropsTable, installTabs, Lede, Transcription, Persona, Mono, Kbd } from '@/ds/core';
import type { TranscriptTurn } from '@/ds/core';


// ── Demo data ─────────────────────────────────────────────────────────────
const USAGE_TURNS: TranscriptTurn[] = [
  { id: 't1', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '09:01', text: 'Good morning. All platform services are green. Two incidents from overnight were auto-resolved at 02:14 UTC.' },
  { id: 't2', speaker: 'On-call SRE',  initials: 'SR', side: 'user',  time: '09:01', text: 'Any lingering alerts I should know about before the standup?' },
  { id: 't3', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '09:02', text: 'Three low-priority alerts remain open — all in the monitoring backlog, none customer-facing. I will include a summary in the standup digest.' },
  { id: 't4', speaker: 'On-call SRE',  initials: 'SR', side: 'user',  time: '09:02', text: 'Can you check the p99 on identity-svc? It was elevated yesterday afternoon.' },
  { id: 't5', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '09:02', text: 'p99 for identity-svc is 284 ms over the last 15 minutes — within the 400 ms SLO. Yesterday\'s spike peaked at 612 ms at 15:47 UTC and resolved after the deploy at 16:03.' },
];

const CONFIDENCE_TURNS: TranscriptTurn[] = USAGE_TURNS.map((t, i) => ({
  ...t,
  confidence: [0.97, 0.83, 0.91, 0.68, 0.95][i],
}));

const LONG_TURNS: TranscriptTurn[] = [
  { id: 'l1',  speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '10:00', text: 'Daily briefing: 14 services healthy, 1 degraded (billing-svc — p95 elevated).' },
  { id: 'l2',  speaker: 'Lead SRE',    initials: 'LS', side: 'user',  time: '10:00', text: 'What\'s causing the billing-svc degradation?' },
  { id: 'l3',  speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '10:01', text: 'A spike in checkout volume at 09:52 UTC triggered the autoscaler. New instances are warm — p95 should recover within 3 minutes.' },
  { id: 'l4',  speaker: 'Lead SRE',    initials: 'LS', side: 'user',  time: '10:01', text: 'Should I page the billing team?' },
  { id: 'l5',  speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '10:01', text: 'Not yet. The autoscaler is handling it. Suggest a 5-minute window before escalation.' },
  { id: 'l6',  speaker: 'Lead SRE',    initials: 'LS', side: 'user',  time: '10:02', text: 'Agreed. What\'s the on-call rotation look like this week?' },
  { id: 'l7',  speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '10:02', text: 'Primary: Reza (platform). Secondary: Ana (infra). Escalation: Leo (team lead). No swaps flagged.' },
  { id: 'l8',  speaker: 'Lead SRE',    initials: 'LS', side: 'user',  time: '10:03', text: 'All good. Anything else for the standup?' },
  { id: 'l9',  speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '10:03', text: 'One deploy window at 14:00 UTC — feature-flags service, patch release. Low risk, 10-minute rollout.' },
  { id: 'l10', speaker: 'Lead SRE',    initials: 'LS', side: 'user',  time: '10:03', text: 'Noted. I\'ll mention it. Thanks.' },
  { id: 'l11', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '10:04', text: 'Standup digest has been posted to #platform-oncall.' },
];

const LIVE_SCRIPT: TranscriptTurn[] = [
  { id: 'v1', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '11:00', text: 'Voice session started. How can I help you today?' },
  { id: 'v2', speaker: 'You',         initials: 'YO', side: 'user',  time: '11:00', text: 'Check the status of the payment pipeline.' },
  { id: 'v3', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '11:00', text: 'Payment pipeline is healthy. All 6 stages are processing normally with a p99 of 210 ms.' },
  { id: 'v4', speaker: 'You',         initials: 'YO', side: 'user',  time: '11:01', text: 'Any failed transactions in the last hour?' },
  { id: 'v5', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '11:01', text: '3 failed transactions — all flagged as fraud, not system errors. No action needed.' },
  { id: 'v6', speaker: 'You',         initials: 'YO', side: 'user',  time: '11:01', text: 'Great. End session.' },
];

// ── prefers-reduced-motion — SSR-safe, reacts to live changes ──────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

// ── Streaming demo ────────────────────────────────────────────────────────
// Honours prefers-reduced-motion: when motion is reduced we skip the
// perpetual 1.4 s append/replay loop and render the full transcript at once.
function LiveDemo({ reduced }: { reduced: boolean }) {
  const [turns, setTurns] = React.useState<TranscriptTurn[]>(reduced ? LIVE_SCRIPT : []);
  const idxRef = React.useRef(0);

  React.useEffect(() => {
    if (reduced) { setTurns(LIVE_SCRIPT); return; }
    setTurns([]); idxRef.current = 0;
    const id = setInterval(() => {
      const next = LIVE_SCRIPT[idxRef.current];
      if (!next) {
        clearInterval(id);
        setTimeout(() => { setTurns([]); idxRef.current = 0; }, 2000);
        return;
      }
      setTurns(t => [...t, next]);
      idxRef.current += 1;
    }, 1400);
    return () => clearInterval(id);
  }, [reduced]);

  return <Transcription turns={turns} showTime/>;
}

export default function AiTranscriptionPage() {
  const reduced = usePrefersReducedMotion();
  return (
    <Section
      id="transcription"
      num="25"
      title="Transcription"
      desc="Speaker-labeled lines from an audio conversation — each turn shows initials, speaker name, the text, an optional timestamp, and an optional confidence chip."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-voice')} ariaLabel="package manager"/>
      <Lede>Use it below a Persona or AudioPlayer as the canonical audio-reply transcript surface — always pair audio output with a transcript for accessibility.</Lede>
      <Lede>
        Ships as part of the voice module. The only required prop is <Mono>turns</Mono> — an array of <Mono>TranscriptTurn</Mono> objects. Timestamps and confidence scores are opt-in.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="5-turn on-call check · showTime=true · side alternates agent/user"
        height={320}
        code={`import { Transcription } from "@/ds/core"
import type { TranscriptTurn } from "@/ds/core"

const turns: TranscriptTurn[] = [
  { id: 't1', speaker: 'Forge Agent', initials: 'FA', side: 'agent', time: '09:01',
    text: 'Good morning. All platform services are green…' },
  { id: 't2', speaker: 'On-call SRE', initials: 'SR', side: 'user',  time: '09:01',
    text: 'Any lingering alerts I should know about?' },
  // …
]

<Transcription turns={turns} showTime/>`}
      >
        <Transcription turns={USAGE_TURNS} showTime/>
      </Frame>
      <Lede>
        The <Mono>side</Mono> field tints the speaker chip: <Mono>"user"</Mono> renders ember, <Mono>"agent"</Mono> renders neutral. Use real speaker names — never "User" and "Bot" — so the record is legible in a post-incident review.
      </Lede>

      {/* WITH CONFIDENCE */}
      <SubHead meta="confidence scores">With confidence</SubHead>
      <Frame
        label="showConfidence=true — chip colour hierarchy maps to transcription accuracy"
        height={320}
        code={`<Transcription
  turns={turns}   // same turns, each with a confidence field
  showTime
  showConfidence
/>`}
      >
        <Transcription turns={CONFIDENCE_TURNS} showTime showConfidence/>
      </Frame>
      <Lede>
        High confidence (≥ 0.9) renders the chip in <Mono>--fg-muted</Mono>; medium (0.7–0.9) in amber; low (below 0.7) in <Mono>--danger</Mono>. This lets the user skim for turns that need human review without reading every line.
      </Lede>

      {/* LONG TRANSCRIPT */}
      <SubHead meta="scroll container">Long transcript</SubHead>
      <Frame
        label="10+ turns inside a scroll container — overflow-y auto + maxHeight"
        height={320}
        code={`<div style={{ maxHeight: 280, overflowY: 'auto' }}>
  <Transcription turns={longTurns} showTime/>
</div>`}
      >
        <div style={{ maxHeight: 260, overflowY: 'auto', width: '100%' }}>
          <Transcription turns={LONG_TURNS} showTime/>
        </div>
      </Frame>
      <Lede>
        Wrap the component in a <Mono>div</Mono> with <Mono>max-height</Mono> and <Mono>overflow-y: auto</Mono> for pageable transcripts. The <Mono>{'<ol>'}</Mono> element inside carries <Mono>role="log"</Mono>, which tells screen readers this is an ordered, live-updating list.
      </Lede>

      {/* LIVE / STREAMING */}
      <SubHead meta="streaming">Live (streaming)</SubHead>
      <Frame
        label={reduced
          ? 'prefers-reduced-motion: reduce — full transcript rendered at once, no replay loop'
          : 'turns append every 1.4 s · resets and replays automatically'}
        height={280}
        code={`// Append a new TranscriptTurn to the array every ~1.4 s,
// but honour prefers-reduced-motion: render the whole transcript at once.
const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
const [turns, setTurns] = React.useState<TranscriptTurn[]>(reduced ? SCRIPT : []);

React.useEffect(() => {
  if (reduced) { setTurns(SCRIPT); return; }       // no interval, no loop
  const id = setInterval(() => {
    setTurns(prev => [...prev, nextTurn()]);
  }, 1400);
  return () => clearInterval(id);
}, [reduced]);

<Transcription turns={turns} showTime/>`}
      >
        <LiveDemo reduced={reduced}/>
      </Frame>
      <Lede>
        Because <Mono>Transcription</Mono> is stateless and takes the full turns array, append new turns in the parent and pass the updated array — the component re-renders only the new item. The <Mono>role="log"</Mono> wrapper causes screen readers to announce each new line as it appears. Under <Mono>prefers-reduced-motion: reduce</Mono> the demo above skips the append/replay loop entirely and renders the full transcript at once.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame
        label="Persona above Transcription — the canonical audio-conversation transcript surface"
        height={400}
        code={`<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
  <Persona state="speaking" size={96} label="Forge Agent"/>
  <Transcription turns={turns} showTime/>
</div>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%' }}>
          <Persona state="speaking" size={96} label="Forge Agent"/>
          <Transcription turns={USAGE_TURNS} showTime/>
        </div>
      </Frame>
      <Lede>
        The canonical voice-reply surface: the <Mono>Persona</Mono> at the top communicating current state, the <Mono>Transcription</Mono> below as the auditable record. No extra container needed — each component brings its own spacing.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 12 }}>
            The transcript is a read-only record — it has no interactive controls and takes no Tab stop. Reading is driven by the screen reader and the scroll container:
          </div>
          <Kbd keys={['VO', '↓']} label="Read the next turn — speaker name, then line"/>
          <Kbd keys={['VO', '⌘', 'L']} label="Jump by list — the <ol> exposes turn count + position" meta="role=log"/>
          <Kbd keys={['↑', '↓']} label="Scroll the container when the transcript overflows"/>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Live region</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <code style={{ fontFamily: 'var(--font-mono)' }}>role="log"</code> on the <Mono>{'<ol>'}</Mono> combined with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label="Transcript"</code> makes screen readers treat it as a polite live region — each appended turn is announced without interrupting current reading. It is implicitly <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code>, not assertive, so the reader never jumps mid-sentence.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Roles &amp; identity</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The list is an ordered <Mono>{'<ol>'}</Mono>; each turn is an <Mono>{'<li>'}</Mono> whose speaker name and text are real visible text, not aria-only — so the reader announces "Forge Agent: All platform services are green." The confidence chip renders its numeric value as text (e.g. "97%"), never hue alone, so low-confidence turns are flagged under colour blindness or forced-colours mode.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast &amp; reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Speaker name and line sit at <Mono>--fg</Mono>/<Mono>--fg-muted</Mono> on <Mono>--surface</Mono> (≥ 4.5:1); the ember <Mono>side="user"</Mono> chip carries dark ink (<Mono>--bg</Mono>), never ember-on-ember. Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion: reduce</code> the streaming demo drops its append/replay interval and renders the full transcript at once — no perpetual loop.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — chip and text flip; timestamps stay LTR (mono numerals)">
        <div dir="rtl" style={{ width: '100%' }}>
          <Transcription
            turns={[
              { id: 'r1', speaker: 'وكيل Forge', initials: 'FA', side: 'agent', time: '09:01', text: 'صباح الخير. جميع خدمات المنصة سليمة.' },
              { id: 'r2', speaker: 'مهندس النوبة', initials: 'SR', side: 'user',  time: '09:01', text: 'هل هناك تنبيهات معلقة قبل الاجتماع؟' },
              { id: 'r3', speaker: 'وكيل Forge', initials: 'FA', side: 'agent', time: '09:02', text: 'ثلاثة تنبيهات منخفضة الأولوية — لا تؤثر على العملاء.' },
            ]}
            showTime
          />
        </div>
      </Frame>
      <Lede>
        Logical CSS flips the chip, speaker name, and text automatically under <Mono>dir="rtl"</Mono>. Timestamps are Geist Mono numerals — numerals are displayed left-to-right by convention in all locales, so they are not reversed. This matches browser rendering of <Mono>{'<time>'}</Mono> in RTL contexts.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 520, width: '100%' }} aria-hidden="true">
              <Transcription
                turns={[CONFIDENCE_TURNS[0]]}
                showTime
                showConfidence
              />
              {/* Chip pin */}
              <span className="lead v" style={{ top: -22, left: 14, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 14, transform: 'translateX(-50%)' }}>1</div>
              {/* Speaker pin */}
              <span className="lead v" style={{ top: -22, left: 60, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 60, transform: 'translateX(-50%)' }}>2</div>
              {/* Time pin */}
              <span className="lead h" style={{ top: 8, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 0, right: -52 }}>3</div>
              {/* Confidence pin */}
              <span className="lead h" style={{ top: 8, right: -86, width: 52 }}/>
              <div className="pin" style={{ top: 0, right: -108 }}>4</div>
              {/* Line pin */}
              <span className="lead v" style={{ bottom: -22, left: 60, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: 60, transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Speaker chip.</b> A small circle with the speaker's initials (from <Mono>initials</Mono> or the first letter of <Mono>speaker</Mono>). Ember-tinted for <Mono>side="user"</Mono>, neutral for <Mono>side="agent"</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Speaker name.</b> Visible text in Geist Sans semibold. Required — never omit it for accessibility or provenance.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Timestamp.</b> Pre-formatted display string in Geist Mono muted. Shown when <Mono>showTime={'{true}'}</Mono> and the turn has a <Mono>time</Mono> value.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Confidence chip.</b> Numeric percentage (e.g. "97%") shown when <Mono>showConfidence={'{true}'}</Mono> and the turn has a <Mono>confidence</Mono> value. Colour-codes ≥90%/70–90%/below 70%.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Transcript line.</b> The spoken text in Geist Sans regular. Always full-width — no truncation. Multiple sentences stay in one <Mono>{'<p>'}</Mono>.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use named speakers</div>
          <div className="body" style={{ padding: 14 }}>
            <Transcription
              turns={[
                { id: 'dd1', speaker: 'Forge Agent', initials: 'FA', side: 'agent', text: 'p99 is within SLO.' },
                { id: 'dd2', speaker: 'On-call SRE', initials: 'SR', side: 'user',  text: 'Thanks — all clear.' },
              ]}
            />
          </div>
          <div className="note">Real names let the viewer identify speakers in a post-incident review. "Forge Agent" and "Ana" are more auditable than "AI" and "User".</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — strip timestamps</div>
          <div className="body" style={{ padding: 14 }}>
            <Transcription
              turns={[
                { id: 'dd3', speaker: 'Forge Agent', initials: 'FA', side: 'agent', text: 'All services healthy.' },
                { id: 'dd4', speaker: 'Lead SRE',    initials: 'LS', side: 'user',  text: 'Copy that.' },
              ]}
              showTime={false}
            />
          </div>
          <div className="note">Timestamps are provenance. In an on-call context, knowing whether a decision was made at 09:01 or 09:47 matters. Always pass showTime on transcripts that may be reviewed later.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show confidence for review workflows</div>
          <div className="body" style={{ padding: 14 }}>
            <Transcription
              turns={[{ id: 'dd5', speaker: 'Forge Agent', initials: 'FA', side: 'agent', confidence: 0.68, text: 'billing-svc is at 6-hundred milliseconds.' }]}
              showConfidence
            />
          </div>
          <div className="note">Low-confidence turns flag speech that may have been misheard. Surface the chip so a human reviewer can correct the transcript before it is used as evidence.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — truncate long turns</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--surface-active)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '600 var(--text-xs)/1 var(--font-mono)', color: 'var(--fg-muted)', flexShrink: 0 }}>FA</span>
              <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>p99 for identity-svc is 284 ms over the last 15 minutes — within the…</span>
            </div>
          </div>
          <div className="note">A truncated transcript is not a transcript — it is a summary. Keep turns at full width and let the container scroll. Truncation hides the exact wording and defeats the purpose of a voice record.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="TranscriptionProps">API reference</SubHead>
      <AutoPropsTable component="Transcription" label="<Transcription />"/>
      <PropsTable
        label="TranscriptTurn"
        rows={[
          { prop: 'id',         type: 'string',             required: true,   description: 'Unique key for React reconciliation.' },
          { prop: 'speaker',    type: 'string',             required: true,   description: 'Visible speaker name. Used as accessible text — never omit.' },
          { prop: 'text',       type: 'string',             required: true,   description: 'The spoken text for this turn.' },
          { prop: 'side',       type: '"user" | "agent"',   default: '"agent"', description: '"user" tints the chip ember; "agent" renders a neutral chip.' },
          { prop: 'initials',   type: 'string',             default: undefined, description: 'Two-letter override for the chip. Defaults to the first character of speaker.' },
          { prop: 'time',       type: 'string',             default: undefined, description: 'Pre-formatted display string (e.g. "09:01"). Shown when showTime=true.' },
          { prop: 'confidence', type: 'number',             default: undefined, description: 'Transcription accuracy 0–1. Shown as a percentage chip when showConfidence=true.' },
        ]}
      />
    </Section>
  );
}
