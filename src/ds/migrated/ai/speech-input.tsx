'use client';
// Forge AI — Speech Input. Mic button + waveform + transcription preview.
// Four states: idle / listening / processing / error.
// Compose inside a PromptInput footerTools slot or standalone on a voice surface.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, SpeechInput, PromptInput, Mono } from '@/ds/core';


// Random-ish level arrays for waveform demos
const LEVELS_14: number[] = [0.35, 0.62, 0.84, 0.51, 0.78, 0.43, 0.91, 0.67, 0.55, 0.80, 0.39, 0.72, 0.48, 0.60];
const LEVELS_6:  number[] = [0.50, 0.82, 0.44, 0.91, 0.63, 0.37];
const LEVELS_22: number[] = [0.4, 0.6, 0.8, 0.55, 0.72, 0.88, 0.42, 0.65, 0.91, 0.50, 0.73, 0.85, 0.38, 0.66, 0.80, 0.48, 0.70, 0.90, 0.44, 0.62, 0.78, 0.52];

const STATES = ['idle', 'listening', 'processing', 'error'] as const;

// ── Interactive usage demo ────────────────────────────────────────────────
// Walks the FULL documented state machine — including the error → retry
// recovery loop that the spec describes but a happy-path demo would never show.
function UsageDemo() {
  const [state, setState] = React.useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [levels, setLevels] = React.useState<number[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = () => {
    if (state === 'idle') {
      setState('listening');
    } else if (state === 'listening') {
      if (timerRef.current) clearInterval(timerRef.current);
      setState('processing');
      setTimeout(() => setState('idle'), 1800);
    } else if (state === 'error') {
      // Documented recovery: tapping the mic in error retries → listening.
      setState('listening');
    }
  };

  // The parent owns the error transition — here it stands in for a denied
  // mic permission or a dropped stream, the two real ways `error` is reached.
  const failStream = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('error');
  };

  React.useEffect(() => {
    if (state === 'listening') {
      const gen = () => Array.from({ length: 14 }, () => 0.1 + Math.random() * 0.9);
      setLevels(gen());
      timerRef.current = setInterval(() => setLevels(gen()), 140);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    } else {
      setLevels([]);
    }
  }, [state]);

  const hint =
    state === 'idle'       ? 'Tap the mic to start voice input' :
    state === 'listening'  ? 'Listening — tap to stop, or simulate a dropped stream' :
    state === 'processing' ? 'Transcribing…' :
                              'Microphone error — tap the mic to retry';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <SpeechInput
        state={state}
        onToggle={toggle}
        levels={state === 'listening' ? levels : undefined}
      />
      <span style={{ fontSize: 'var(--text-base)', color: state === 'error' ? 'var(--danger)' : 'var(--fg-muted)' }}>{hint}</span>
      <button
        type="button"
        className="btn ghost sm"
        onClick={failStream}
        disabled={state === 'error' || state === 'processing'}
      >
        Simulate dropped stream
      </button>
    </div>
  );
}

// ── Transcript demo ───────────────────────────────────────────────────────
function TranscriptDemo() {
  const [levels, setLevels] = React.useState<number[]>(LEVELS_14);

  React.useEffect(() => {
    const id = setInterval(
      () => setLevels(Array.from({ length: 14 }, () => 0.1 + Math.random() * 0.9)),
      140
    );
    return () => clearInterval(id);
  }, []);

  return (
    <SpeechInput
      state="listening"
      levels={levels}
      transcript="How long until the canary finishes?"
    />
  );
}

// ── In-context PromptInput demo ───────────────────────────────────────────
function InContextDemo() {
  const [speechState, setSpeechState] = React.useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [levels, setLevels] = React.useState<number[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = () => {
    if (speechState === 'idle') {
      setSpeechState('listening');
    } else if (speechState === 'listening') {
      if (timerRef.current) clearInterval(timerRef.current);
      setSpeechState('processing');
      setTimeout(() => setSpeechState('idle'), 1600);
    }
  };

  React.useEffect(() => {
    if (speechState === 'listening') {
      const gen = () => Array.from({ length: 14 }, () => 0.1 + Math.random() * 0.9);
      setLevels(gen());
      timerRef.current = setInterval(() => setLevels(gen()), 140);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    } else {
      setLevels([]);
    }
  }, [speechState]);

  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <PromptInput
        placeholder="Ask anything…"
        status="ready"
        footerTools={
          <SpeechInput
            compact
            state={speechState}
            onToggle={toggle}
          />
        }
      />
    </div>
  );
}

export default function AiSpeechInputPage() {
  return (
    <Section
      id="speech-input"
      num="24"
      title="Speech Input"
      desc="The mic-button surface for voice input — four states: idle, listening (with animated waveform), processing (transcribing), and error."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-voice')} ariaLabel="package manager"/>
      <Lede>Compose it inside a PromptInput footerTools slot when the agent should pick up voice when typing pauses, or use it standalone on a dedicated audio surface.</Lede>
      <Lede>
        Ships as part of the voice module alongside <Mono>Persona</Mono>, <Mono>Transcription</Mono>, and <Mono>AudioPlayer</Mono>. No extra dependencies — styles live in <Mono>ai.css</Mono>.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="Walk the full machine — start · stop · or drop the stream, then tap to retry"
        height={172}
        code={`import { SpeechInput } from "@/ds/core"

function Demo() {
  const [state, setState] = React.useState('idle');
  const [levels, setLevels] = React.useState([]);

  // update levels via setInterval at ~140 ms when listening …

  return (
    <SpeechInput
      state={state}
      onToggle={() => setState(s => s === 'idle' ? 'listening' : 'processing')}
      levels={state === 'listening' ? levels : undefined}
    />
  );
}`}
      >
        <UsageDemo/>
      </Frame>
      <Lede>
        <Mono>onToggle</Mono> fires on every mic-button click. Happy path: idle → listening → processing → idle. The error state is entered by the <em>parent</em> (here the "simulate dropped stream" button stands in for a denied permission or a lost stream); from error, tapping the mic retries straight back into listening — the demo above runs that real recovery loop, not just the success path.
      </Lede>

      {/* 3. STATES */}
      <SubHead meta="4 states">States</SubHead>
      <Frame
        label="idle · listening · processing · error — four independent instances"
        row
        code={`<SpeechInput state="idle"/>
<SpeechInput state="listening" levels={[0.35,0.62,0.84,0.51,0.78,0.43,0.91,0.67,0.55,0.80,0.39,0.72,0.48,0.60]}/>
<SpeechInput state="processing"/>
<SpeechInput state="error"/>`}
      >
        {STATES.map(s => (
          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <SpeechInput
              state={s}
              levels={s === 'listening' ? LEVELS_14 : undefined}
            />
            <span className="t-mono-label">{s.toUpperCase()}</span>
          </div>
        ))}
      </Frame>
      <Lede>
        The mic button uses <Mono>aria-pressed={'{true}'}</Mono> when listening; the button's <Mono>aria-label</Mono> flips to "Stop listening" / "Start voice input" / "Transcribing…" / "Microphone error — tap to retry" by state.
      </Lede>

      {/* WAVEFORM VARIANTS */}
      <SubHead meta="bar counts">Waveform variants</SubHead>
      <Frame
        label="6 bars (compact) · 14 bars (standard) · 22 bars (wide)"
        row
        code={`<SpeechInput state="listening" levels={[0.50,0.82,0.44,0.91,0.63,0.37]}/>
<SpeechInput state="listening" levels={[0.35,0.62,0.84,0.51,0.78,0.43,0.91,0.67,0.55,0.80,0.39,0.72,0.48,0.60]}/>
<SpeechInput state="listening" levels={[0.4,0.6,0.8,/* …22 values */]}/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SpeechInput state="listening" levels={LEVELS_6}/>
            <span className="t-mono-label" style={{ color: 'var(--fg-faint)' }}>6 BARS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SpeechInput state="listening" levels={LEVELS_14}/>
            <span className="t-mono-label" style={{ color: 'var(--fg-faint)' }}>14 BARS (STANDARD)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SpeechInput state="listening" levels={LEVELS_22}/>
            <span className="t-mono-label" style={{ color: 'var(--fg-faint)' }}>22 BARS</span>
          </div>
        </div>
      </Frame>
      <Lede>
        The waveform bar count is driven by the length of the <Mono>levels</Mono> array — pass 6 values for a compact composer toolbar, 14 for the standard surface, or 22 for a wide viewport. Each value is clamped to 0.08–1 before rendering.
      </Lede>

      {/* WITH TRANSCRIPT */}
      <SubHead meta="transcript prop">With transcript</SubHead>
      <Frame
        label="transcript prop — live text shown below the waveform while listening"
        height={120}
        code={`<SpeechInput
  state="listening"
  levels={levels}
  transcript="How long until the canary finishes?"
/>`}
      >
        <TranscriptDemo/>
      </Frame>
      <Lede>
        When <Mono>transcript</Mono> is provided, the text replaces the hint below the waveform. The container carries <Mono>aria-live="polite"</Mono> so screen readers hear the running transcription. Show the waveform AND the transcript simultaneously — both together confirm the agent is capturing audio.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame
        label="SpeechInput inside PromptInput footerTools — voice picks up when typing pauses"
        height={160}
        code={`<PromptInput
  placeholder="Ask anything…"
  status="ready"
  footerTools={
    <SpeechInput
      compact
      state={speechState}
      onToggle={toggle}
    />
  }
/>`}
      >
        <InContextDemo/>
      </Frame>
      <Lede>
        Drop <Mono>SpeechInput</Mono> into <Mono>PromptInput</Mono>'s <Mono>footerTools</Mono> slot so voice and text input share the same composer. The mic appears after the attachment icon, before the spacer and the submit button.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px 12px 5px 0', verticalAlign: 'top', whiteSpace: 'nowrap' }}><span className="t-mono-label">TAB</span></td>
                <td style={{ padding: '5px 0', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Moves focus to the mic button — reachable in every state, including <Mono>processing</Mono> (it is never <Mono>disabled</Mono>, so focus is never lost mid-transition).</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 12px 5px 0', verticalAlign: 'top', whiteSpace: 'nowrap' }}><span className="t-mono-label">ENTER</span> <span className="t-mono-label">SPACE</span></td>
                <td style={{ padding: '5px 0', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Activates the mic — fires <Mono>onToggle</Mono> from <Mono>idle</Mono>, <Mono>listening</Mono>, and <Mono>error</Mono>. A press while <Mono>processing</Mono> is a no-op so the transcription is never interrupted.</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 12px 5px 0', verticalAlign: 'top', whiteSpace: 'nowrap' }}><span className="t-mono-label">ESC</span></td>
                <td style={{ padding: '5px 0', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Owned by the surrounding surface (e.g. <Mono>PromptInput</Mono> / dialog) to dismiss — <Mono>SpeechInput</Mono> does not capture it, so the host's cancel path keeps working.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <Mono>aria-pressed="true"</Mono> is set on the button when listening, so the toggle state is announced. The button's <Mono>aria-label</Mono> carries the state name (<Mono>"Start voice input"</Mono> → <Mono>"Stop listening"</Mono> → <Mono>"Transcribing…"</Mono> → <Mono>"Microphone error — tap to retry"</Mono>), so state is conveyed by name, not colour alone. The waveform bars are <Mono>aria-hidden</Mono> — purely decorative — and the transcript area carries <Mono>aria-live="polite"</Mono> so the running text is announced incrementally without interrupting the user.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus and contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The mic button paints a dedicated 2 px ember focus ring (<Mono>2px</Mono> stroke, <Mono>2px</Mono> offset) on <Mono>:focus-visible</Mono> — keyboard-only, so a pointer tap never flashes a ring. In the listening state the dark mic icon sits on the ember fill (dark ink on accent) and the bars clear AA against the <Mono>--ember-soft</Mono> surface. The error state fills <Mono>--danger</Mono> with a white icon, which also clears AA.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <Mono>prefers-reduced-motion: reduce</Mono> the pulsing mic and the waveform bar transitions are switched off in <Mono>ai.css</Mono> — the bars still reflect amplitude via their static height, so audio capture is still confirmed without continuous animation. Escalate to <Mono>processing</Mono> once the user stops talking (VAD silence threshold) — never leave the mic <Mono>listening</Mono> indefinitely; a flashing mic with no escalation path trains users to ignore the state.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — mic stays on the leading (right) edge; hint/transcript flip">
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <SpeechInput state="idle"/>
          <SpeechInput state="listening" levels={LEVELS_14} transcript="كم الوقت المتبقي حتى ينتهي الكناري؟"/>
          <SpeechInput state="error"/>
        </div>
      </Frame>
      <Lede>
        Logical CSS properties handle the flip automatically: the mic button stays on the inline-start (right in RTL) edge, and the hint and transcript text align from the start. The waveform bars have no directionality — they stack left-to-right in all locales.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'inline-block' }} aria-hidden="true">
              <SpeechInput state="listening" levels={LEVELS_14} transcript="How long until the canary finishes?"/>
              {/* Mic button pin */}
              <span className="lead v" style={{ top: -22, left: 16, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 16, transform: 'translateX(-50%)' }}>1</div>
              {/* Waveform pin */}
              <span className="lead v" style={{ top: -22, left: 80, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 80, transform: 'translateX(-50%)' }}>2</div>
              {/* Transcript pin */}
              <span className="lead v" style={{ bottom: -22, left: 80, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: 80, transform: 'translateX(-50%)' }}>3</div>
              {/* Hint/label pin */}
              <span className="lead h" style={{ top: 20, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 12, right: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Mic button.</b> A real <Mono>{'<button>'}</Mono> with class <Mono>ai-speech-mic</Mono>. Renders the mic icon (18 px). Becomes ember-tinted when listening, muted when processing, danger-tinted on error.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Waveform.</b> A row of <Mono>ai-speech-bar</Mono> spans scaled by the <Mono>levels</Mono> values via <Mono>scaleY()</Mono>. Rendered only when <Mono>state === "listening"</Mono> and <Mono>levels.length {'>'} 0</Mono>. The bars are <Mono>aria-hidden</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Transcript area.</b> The <Mono>ai-speech-transcript</Mono> div with <Mono>aria-live="polite"</Mono>. Shows the running transcription text while listening. Replaces the hint when present.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Hint.</b> The <Mono>ai-speech-hint</Mono> label — the button's accessible name mirrored as visible text. Shown when no transcript is available. Flips by state: "Start voice input" → "Stop listening" → "Transcribing…" → "Microphone error — tap to retry".</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show waveform feedback while listening</div>
          <div className="body" style={{ padding: 14 }}>
            <SpeechInput state="listening" levels={LEVELS_14}/>
          </div>
          <div className="note">Live waveform bars confirm the mic is capturing audio. Without them the user has no visual confirmation that the device is hearing them — they will tap again to check.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — leave the mic flashing indefinitely</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8 }}>
            <SpeechInput state="listening" levels={LEVELS_6}/>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>…30 seconds of silence…</span>
          </div>
          <div className="note">Once the user stops talking, escalate to processing after your VAD silence window. Perpetual listening wastes battery and creates anxiety about whether the agent actually heard anything.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show the transcript as it arrives</div>
          <div className="body" style={{ padding: 14 }}>
            <SpeechInput state="listening" levels={LEVELS_14} transcript="How long until the canary finishes?"/>
          </div>
          <div className="note">Streaming the transcript alongside the waveform lets the user correct themselves before the phrase is submitted — reducing backtrack cycles.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use SpeechInput for non-voice actions</div>
          <div className="body" style={{ padding: 14 }}>
            <button
              type="button"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)', fontSize: 'var(--text-base)', cursor: 'pointer' }}
            >
              <Icons.mic size={16}/> Record video
            </button>
          </div>
          <div className="note">SpeechInput is semantically wired to voice-to-text. For audio/video recording, build a custom control — the states and ARIA attributes here would be misleading.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="SpeechInputProps">API reference</SubHead>
      <AutoPropsTable component="SpeechInput" label="<SpeechInput />"/>
    </Section>
  );
}
