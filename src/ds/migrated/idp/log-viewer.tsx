'use client';
// Eidos DS — Components / LogViewer
// Three variants: compact (inline), expanded (with timestamps), filterable
// (toolbar with severity chips + search).
import { AutoPropsTable, Icons, Frame, Section, SubHead, TabbedCode, installTabs, LogViewer, Lede, Mono } from '@/ds/core';


// Synthetic IDP-shaped lines.
const LINES = [
  { time: '14:32:01.142', level: 'info',  message: 'POST /v1/deploys/eidos-api → 202 (req=a3f9)' },
  { time: '14:32:01.412', level: 'info',  message: 'Provisioning canary cohort · 3/3 pods ready' },
  { time: '14:32:02.092', level: 'debug', message: 'feature-flag canary-blue evaluated true (rule=ring-3)' },
  { time: '14:32:02.870', level: 'warn',  message: 'p95 latency 187ms above 30d baseline 142ms' },
  { time: '14:32:03.012', level: 'info',  message: 'Health check passed on canary-blue-1.us-east-2' },
  { time: '14:32:03.541', level: 'error', message: 'Connection refused: redis-cache-2.us-east-2 — retrying (1/3)' },
  { time: '14:32:04.221', level: 'error', message: 'Connection refused: redis-cache-2.us-east-2 — retrying (2/3)' },
  { time: '14:32:04.690', level: 'info',  message: 'Connection re-established: redis-cache-2 (failover to cache-3)' },
  { time: '14:32:05.124', level: 'info',  message: 'Promoted canary to 25% traffic' },
  { time: '14:32:05.812', level: 'trace', message: 'evt=rollout.cohort.advance ring=3 prev=10 next=25' },
  { time: '14:32:06.001', level: 'warn',  message: 'PII scrubber dropped 3 fields from audit event #2241' },
  { time: '14:32:06.402', level: 'fatal', message: 'OOM: memory budget exceeded on canary-blue-2 (kill-and-replace)' },
  { time: '14:32:07.110', level: 'info',  message: 'Replacement pod scheduled: canary-blue-2-new' },
  { time: '14:32:07.890', level: 'info',  message: 'SLO snapshot · eidos-api · err 0.12% / err budget 0.50%' },
];

const USAGE = `import { LogViewer } from "@/components/forge/log-viewer"

<LogViewer
  variant="filterable"
  lines={lines}
  height={320}
  follow
/>`;

export default function LogViewerPage() {
  return (
    <Section id="log-viewer" title="Log viewer" desc="Monospace log surface for deploy output, agent runs, and incident streams. Three variants: compact for drawers, expanded for detail panes, filterable (search + severity chips + follow) for the debugging surface.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('log-viewer')} ariaLabel="package manager"/>
      <Lede>Lines are <Mono>{`{ time, level, message }`}</Mono>. Levels map to <Mono>--status-*</Mono> / severity tokens. The filterable variant adds an inline severity chip row and a search input.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Past a few hundred lines, reach for the filterable variant or paginate — the viewer renders every node and does not virtualize internally. Each line carries a severity-coloured level prefix so the stream reads in greyscale and is selectable as text.</Lede>
      <Frame label="filterable · the workhorse" code={USAGE}>
        <LogViewer variant="filterable" lines={LINES} height={300}/>
      </Frame>

      <SubHead meta="3 variants">Variants</SubHead>
      <Lede>One body, three chrome levels — pick by surface: <Mono>compact</Mono> for drawers, <Mono>expanded</Mono> for detail panes, <Mono>filterable</Mono> for the debugging surface.</Lede>

      <SubHead meta="dense · inline / drawer">Compact</SubHead>
      <Frame label="no toolbar, no timestamp column">
        <LogViewer variant="compact" lines={LINES.slice(0, 7)} height={180} toolbar={false}/>
      </Frame>

      <SubHead meta="timestamp column · detail panes">Expanded</SubHead>
      <Frame label="timestamps + severity column visible">
        <LogViewer variant="expanded" lines={LINES.slice(0, 8)} height={220} toolbar={false}/>
      </Frame>

      <SubHead meta="search + chips · debug surface">Filterable</SubHead>
      <Frame label="full toolbar — search, severity chips, line count">
        <LogViewer variant="filterable" lines={LINES} height={300}/>
      </Frame>
      <Lede>Click a severity chip to hide that level. The line counter at the right shows visible / total. Search is substring on message text.</Lede>

      <SubHead meta="streaming">Wrap + follow</SubHead>
      <Frame label="wrap long lines · auto-scroll to bottom on new lines">
        <LogViewer variant="expanded" lines={LINES.map(l => ({ ...l, message: l.message + ' · trace_id=4f8e2b1c-7d3a-…' }))} height={200} toolbar={false} wrap follow/>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The log body is a focusable scroll region, pannable with the arrow keys / <Mono>PageUp</Mono> / <Mono>PageDown</Mono> / <Mono>Home</Mono> / <Mono>End</Mono>. In the filterable variant the search input and each severity chip are in the tab order; a chip toggles its level with <Mono>Enter</Mono>/<Mono>Space</Mono>. Turning on <Mono>follow</Mono> does not steal focus from the toolbar.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A streaming log (<Mono>follow</Mono>) marks its body as a polite <Mono>aria-live</Mono> region so newly appended lines are announced without yanking the user away from what they are reading. Severity chips are toggle buttons with <Mono>aria-pressed</Mono>, and the line counter announces visible / total as filters change.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every line prints its level as a text prefix (<Mono>warn</Mono>, <Mono>error</Mono>, <Mono>fatal</Mono>) beside the severity tint — so severity reads in greyscale and to a reader. Because each prefix is load-bearing severity text, the level colours map to <Mono>--status-*</Mono> / <Mono>--fg-muted</Mono> tokens chosen to meet AA against the dark log surface — <Mono>trace</Mono> and <Mono>debug</Mono> share the same AA-passing muted tone rather than a decorative faint one.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density &amp; focus</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Dense mono rows keep a visible focus ring on the scroll region and on each chip. Use <Mono>wrap</Mono> rather than horizontal scroll for long trace lines on narrow panes. Auto-scroll from <Mono>follow</Mono> is suppressed once the user scrolls up, and honours <Mono>prefers-reduced-motion</Mono> (jump, don't animate).</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — the toolbar and level prefix anchor to the right; log message text stays LTR'>
        <div dir="rtl">
          <LogViewer variant="filterable" lines={LINES.slice(0, 6)} height={200}/>
        </div>
      </Frame>
      <Lede>
        The toolbar (search, severity chips, line counter) and the level-prefix column align to the inline-start (right) edge under <Mono>dir="rtl"</Mono>. Log message text is technical output — it remains left-to-right regardless of the UI locale, the same way source code does in a diff viewer.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 460 }} aria-hidden="true">
              <LogViewer variant="expanded" lines={LINES.slice(0, 5)} height={150} toolbar={false}/>
              {/* Pin 1 — severity level prefix */}
              <span className="lead h" style={{ top: 30, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 18, left: -54 }}>1</div>
              {/* Pin 2 — timestamp */}
              <span className="lead v" style={{ top: -24, left: 56, height: 20 }}/>
              <div className="pin" style={{ top: -46, left: 56, transform: 'translateX(-50%)' }}>2</div>
              {/* Pin 3 — message text */}
              <span className="lead v" style={{ top: -24, right: 80, height: 20 }}/>
              <div className="pin" style={{ top: -46, right: 80, transform: 'translateX(50%)' }}>3</div>
              {/* Pin 4 — warn line severity tint */}
              <span className="lead h" style={{ top: 83, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 71, left: -54 }}>4</div>
              {/* Pin 5 — scroll body */}
              <span className="lead v" style={{ bottom: -24, left: '50%', height: 20, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -46, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Level prefix.</b> <Mono>trace</Mono> / <Mono>debug</Mono> / <Mono>info</Mono> / <Mono>warn</Mono> / <Mono>error</Mono> / <Mono>fatal</Mono> — tinted with the matching <Mono>--status-*</Mono> token. Always rendered as text beside the colour so severity reads in greyscale and to a screen reader.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Timestamp.</b> <Mono>--fg-faint</Mono> Geist Mono, tabular numerics. Visible in the <Mono>expanded</Mono> and <Mono>filterable</Mono> variants; hidden in <Mono>compact</Mono> to save horizontal space in drawers.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Message.</b> Full-width Geist Mono, <Mono>--fg</Mono>. Default single-line with ellipsis; pass <Mono>wrap</Mono> to reflow long trace lines rather than scroll horizontally.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Severity row tint.</b> A subtle background strip behind lines whose level is <Mono>warn</Mono>, <Mono>error</Mono>, or <Mono>fatal</Mono>, pulled from <Mono>--status-*</Mono> at low opacity. Never the only signal — the level prefix text is always present.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Scroll body.</b> Fixed height (<Mono>height</Mono> prop, default 320px), <Mono>overflow-y: auto</Mono>. Marked <Mono>aria-live="polite"</Mono> when <Mono>follow</Mono> is on so newly appended lines are announced without moving focus.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use the filterable variant for {'>'}50 lines</div>
          <div className="body"><LogViewer variant="filterable" lines={LINES.slice(0, 5)} height={140}/></div>
          <div className="note">Without filtering, dense logs become wallpaper. The chips + search turn it back into something parseable.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — render an unbounded list</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)' }}>10,000 lines mounted at once</div>
          <div className="note">Past a few hundred lines, paginate or virtualize. The viewer renders every node; it doesn't virtualize internally.</div>
        </div>
      </div>

      <SubHead meta="LogViewerProps">API reference</SubHead>
      <AutoPropsTable component="LogViewer" label="<LogViewer />"/>
    </Section>
  );
}
