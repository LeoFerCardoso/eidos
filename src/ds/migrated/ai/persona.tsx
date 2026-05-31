'use client';
// Eidos AI — Persona. The voice orb avatar for audio conversations.
// Visualises four states: idle / listening / thinking / speaking.
// Compose with SpeechInput on a dedicated audio surface.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Persona, SpeechInput, AgentIdentity, Mono } from '@/ds/core';

const mono  = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' };
const stack = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 };
const row   = { display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' as const };

const STATES = ['idle', 'listening', 'thinking', 'speaking'] as const;
const SIZES  = [64, 96, 144, 200] as const;

const CYCLE_CAPTIONS: Record<(typeof STATES)[number], string> = {
  idle:      'Waiting for you to start.',
  listening: 'Listening to you…',
  thinking:  'Thinking it through…',
  speaking:  'Speaking the answer.',
};

// Live state-cycle — the orb advances idle→listening→thinking→speaking on a
// 2.2s timer so the temporal motion grammar is visible in one frame instead of
// four static stills. Pauses (and announces a static state) under
// prefers-reduced-motion; the surrounding caption is aria-live="polite" so a
// screen reader follows the same arc the eye does.
function LiveCycle() {
  const [idx, setIdx] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % STATES.length), 2200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const state = STATES[idx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}>
      <Persona state={state} size={160} label="Eidos Voice Agent"/>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <span className="t-mono-label" style={{ color: 'var(--ember)' }}>{state}</span>
        <span className="t-small" style={{ color: 'var(--fg-muted)' }}>
          {CYCLE_CAPTIONS[state]}
        </span>
      </div>
      <div role="tablist" aria-label="Conversation states" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {STATES.map((s, i) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={i === idx}
            onClick={() => setIdx(i)}
            className="t-mono-label"
            style={{
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              padding: '4px 2px',
              cursor: 'pointer',
              borderRadius: 4,
              color: i === idx ? 'var(--ember)' : 'var(--fg-faint)',
              borderBlockEnd: i === idx ? '1.5px solid var(--ember)' : '1.5px solid transparent',
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AiPersonaPage() {
  return (
    <Section
      id="persona"
      num="23"
      title="Persona"
      desc="The voice orb that represents the AI in an audio conversation — idle, listening, thinking, or speaking. Place it at the centre of a dedicated audio surface where the orb is the affordance."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-voice')} ariaLabel="package manager"/>
      <Lede>For static lists and chat headers, reach for AgentIdentity instead — Persona is for dedicated audio surfaces only.</Lede>
      <Lede>
        Ships <Mono>Persona</Mono>, <Mono>SpeechInput</Mono>, <Mono>Transcription</Mono>, and <Mono>AudioPlayer</Mono> from a single voice module. Styles live in <Mono>ai.css</Mono> — no extra imports.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="Persona at size 96 · listening state"
        row
        code={`import { Persona } from "@/ds/core"

<Persona state="listening" size={96} label="Eidos Voice Agent"/>`}
      >
        <div style={{ ...stack, gap: 12 }}>
          <Persona state="listening" size={96} label="Eidos Voice Agent"/>
          <span className="t-small" style={{ color: 'var(--fg-muted)' }}>Listening to you…</span>
        </div>
      </Frame>
      <Lede>
        The orb pulses on <Mono>listening</Mono>, rotates on <Mono>thinking</Mono>, and breathes on <Mono>speaking</Mono>. Under <Mono>prefers-reduced-motion</Mono> all CSS animations are suppressed and only the colour tint differentiates states.
      </Lede>

      {/* MOTION GRAMMAR — live state cycle */}
      <SubHead meta="motion in motion">The state cycle</SubHead>
      <Frame
        label="Live — the orb advances idle → listening → thinking → speaking on a 2.2s loop (pauses under reduced motion)"
        height={320}
        code={`// The state prop drives the CSS animation class — drive it from a timer
const STATES = ['idle','listening','thinking','speaking'] as const
const [i, setI] = React.useState(0)
React.useEffect(() => {
  const id = setInterval(() => setI(n => (n + 1) % STATES.length), 2200)
  return () => clearInterval(id)
}, [])

<Persona state={STATES[i]} size={160} label="Eidos Voice Agent"/>`}
      >
        <LiveCycle/>
      </Frame>
      <Lede>
        A voice agent's whole personality lives in this four-beat loop — the orb is the only thing on screen, so its motion <em>is</em> the conversation. Each state owns one verb (pulse, rotate, breathe) so the user reads the agent's status without a word of text. Tap a state to scrub the cycle.
      </Lede>

      {/* 3. STATES */}
      <SubHead meta="4 states">States</SubHead>
      <Frame
        label="idle · listening · thinking · speaking"
        row
        code={STATES.map(s => `<Persona state="${s}" size={96}/>`).join('\n')}
      >
        {STATES.map(s => (
          <div key={s} style={stack}>
            <Persona state={s} size={96} label="Eidos Voice Agent"/>
            <span className="t-mono-label">{s.toUpperCase()}</span>
          </div>
        ))}
      </Frame>
      <Lede>
        Always label the state semantically — the <Mono>aria-label</Mono> combines <Mono>label</Mono> + <Mono>state</Mono>, so a screen reader announces "Eidos Voice Agent — listening" rather than relying on the animation.
      </Lede>

      {/* SIZES */}
      <SubHead meta="4 sizes">Sizes</SubHead>
      <Frame
        label="64 · 96 · 144 · 200 px"
        row
        code={SIZES.map(n => `<Persona state="idle" size={${n}}/>`).join('\n')}
      >
        {SIZES.map(n => (
          <div key={n} style={stack}>
            <Persona state="idle" size={n} label="Eidos Voice Agent"/>
            <span className="t-mono-label">{n}</span>
          </div>
        ))}
      </Frame>
      <Lede>
        Use at least <strong>48 px</strong> so the orb retains its identity (ring detail + gradient collapse below that threshold). The largest size (200 px) is canonical for a full-screen audio surface.
      </Lede>

      {/* IN A VOICE SURFACE */}
      <SubHead meta="real surface">In a voice surface</SubHead>
      <Frame
        label="Persona (size 200) above SpeechInput — canonical audio-only screen layout"
        height={320}
        code={`<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
  <Persona state="listening" size={200} label="Eidos Voice Agent"/>
  <SpeechInput state="listening" levels={[0.4,0.7,0.9,0.6,0.8,0.5,0.7,0.9,0.4,0.6,0.8,0.5,0.7,0.6]}/>
</div>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: '100%' }}>
          <Persona state="listening" size={200} label="Eidos Voice Agent"/>
          <SpeechInput
            state="listening"
            levels={[0.4, 0.7, 0.9, 0.6, 0.8, 0.5, 0.7, 0.9, 0.4, 0.6, 0.8, 0.5, 0.7, 0.6]}
          />
        </div>
      </Frame>
      <Lede>
        The canonical audio-only layout: the Persona at the visual centre, the <Mono>SpeechInput</Mono> anchored at the bottom. No text thread — the orb state carries the conversation's emotional arc.
      </Lede>

      {/* WITH AGENT IDENTITY */}
      <SubHead meta="when to use each">With AgentIdentity</SubHead>
      <Frame
        label="Choose Persona on audio surfaces · AgentIdentity in chat headers and lists"
        row
        code={`{/* audio surface */}
<Persona state="speaking" size={96} label="Eidos Voice Agent"/>

{/* chat header / settings list */}
<AgentIdentity agent={{ name: 'Eidos Voice Agent', model: 'anthropic/claude-sonnet-4.5', status: 'online' }}/>`}
      >
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={stack}>
            <Persona state="speaking" size={96} label="Eidos Voice Agent"/>
            <span className="t-small" style={{ color: 'var(--fg-muted)' }}>audio surface</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', paddingBlockStart: 12 }}>
            <AgentIdentity agent={{ name: 'Eidos Voice Agent', model: 'anthropic/claude-sonnet-4.5', status: 'online' }}/>
            <span className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 4 }}>chat header / settings list</span>
          </div>
        </div>
      </Frame>
      <Lede>
        Use <Mono>Persona</Mono> when the orb IS the primary affordance — the whole screen is about the voice call. Use <Mono>AgentIdentity</Mono> for a stationary identity row in a chat header, agent directory, or settings page.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBottom: 8 }}>Role and label</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, margin: 0 }}>
            The orb renders as <Mono>role="img"</Mono> with <Mono>aria-label</Mono> combining the <Mono>label</Mono> prop and the current <Mono>state</Mono> — e.g. "Eidos Voice Agent — listening". The inner SVG is <Mono>aria-hidden</Mono>. The orb is not interactive, so it carries no keyboard role and is not in the tab order.
          </p>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBottom: 8 }}>Reduced motion</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, margin: 0 }}>
            Under <Mono>@media (prefers-reduced-motion: reduce)</Mono> all CSS keyframe animations on the orb and ring are disabled via <Mono>animation: none</Mono>. State is still distinguishable through the gradient tint — idle is darker, listening/speaking are brighter ember.
          </p>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBottom: 8 }}>Contrast</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, margin: 0 }}>
            The orb is a graphic element — it does not carry text — so WCAG 1.4.3 text-contrast rules do not apply. However, the ember gradient and its ring clear WCAG 1.4.11 (non-text contrast, ≥ 3:1) against both the light and dark surface backgrounds.
          </p>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-h3" style={{ marginBottom: 8 }}>State announcements</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, margin: 0 }}>
            When the <Mono>state</Mono> prop changes at runtime (e.g. idle → listening), update the surrounding <Mono>aria-live="polite"</Mono> region (provided by <Mono>SpeechInput</Mono> when composed together) — do not rely on the orb alone to announce transitions.
          </p>
        </div>
      </div>
      <table className="spec" style={{ marginTop: 16 }}>
        <thead>
          <tr><th>State</th><th>Motion grammar</th><th>Announced as</th></tr>
        </thead>
        <tbody>
          <tr><td><Mono>idle</Mono></td><td>still ring, no animation</td><td><Mono>"{'<label>'} — idle"</Mono></td></tr>
          <tr><td><Mono>listening</Mono></td><td>ember ring pulses (1.6s)</td><td><Mono>"{'<label>'} — listening"</Mono></td></tr>
          <tr><td><Mono>thinking</Mono></td><td>dashed ring rotates (2.4s)</td><td><Mono>"{'<label>'} — thinking"</Mono></td></tr>
          <tr><td><Mono>speaking</Mono></td><td>orb breathes ±6% (1.2s)</td><td><Mono>"{'<label>'} — speaking"</Mono></td></tr>
        </tbody>
      </table>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — orb is radially symmetric, no directional flip needed">
        <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%' }}>
          <div style={row}>
            {STATES.map(s => (
              <div key={s} style={stack}>
                <Persona state={s} size={72} label="وكيل الصوت"/>
                <span className="t-mono-label">{s.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </Frame>
      <Lede>
        The orb is radially symmetric — no directional flip is required or applied under <Mono>dir="rtl"</Mono>. Any adjacent text label or caption will mirror automatically via logical CSS. Only directional icons (arrows, chevrons) ever need <Mono>transform: scaleX(-1)</Mono>; the orb does not.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'inline-block' }} aria-hidden="true">
              <Persona state="listening" size={120} label="Eidos Voice Agent"/>
              {/* Outer ring pin */}
              <span className="lead v" style={{ top: -22, left: 10, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 10, transform: 'translateX(-50%)' }}>1</div>
              {/* Orb pin */}
              <span className="lead v" style={{ bottom: -22, left: 60, height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -42, left: 60, transform: 'translateX(-50%)' }}>2</div>
              {/* Gradient pin */}
              <span className="lead h" style={{ top: 44, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 36, right: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Outer ring.</b> An SVG <Mono>circle</Mono> (class <Mono>ai-persona-ring</Mono>) that pulses on <Mono>listening</Mono> and rotates a dash pattern on <Mono>thinking</Mono>. No animation under <Mono>prefers-reduced-motion</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Inner orb.</b> A filled circle (class <Mono>ai-persona-orb</Mono>) with the ember radial gradient — highlight offset to 35%, 35% so it reads as a three-dimensional sphere.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Radial gradient.</b> Three stops: <Mono>#FFB07F</Mono> at 0% (specular), <Mono>#FF6B35</Mono> (ember) at 55%, and <Mono>#7A2F12</Mono> at 100% (shadow). The gradient id is <Mono>eidos-persona-grad</Mono> — stable across instances.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — centre the orb when it is the surface</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Persona state="listening" size={80} label="Eidos Voice Agent"/>
            <span className="t-small" style={{ color: 'var(--fg-muted)' }}>Listening to you…</span>
          </div>
          <div className="note">On a dedicated voice screen the orb is the protagonist — centre it, give it space, and let the animation carry the state.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — shrink the orb below 48 px</div>
          <div className="body" style={{ padding: 14, alignItems: 'center', justifyContent: 'center' }}>
            <Persona state="speaking" size={28} label="Eidos Voice Agent"/>
            <span className="t-small" style={{ color: 'var(--fg-muted)', marginInlineStart: 8 }}>Voice Agent</span>
          </div>
          <div className="note">Below 48 px the ring detail and gradient collapse — the orb loses its identity and looks like a plain coloured dot. Use AgentIdentity for compact identity in lists.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pass a meaningful label prop</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 6 }}>
            <code style={{ ...mono, fontSize: 'var(--text-xs)' }}>{'<Persona state="listening" label="Eidos Voice Agent"/>'}</code>
            <span className="t-mono-label" style={{ color: 'var(--fg-muted)', textTransform: 'none', letterSpacing: 0 }}>→ aria-label: "Eidos Voice Agent — listening"</span>
          </div>
          <div className="note">The label and state together form the accessible name. Always pass the agent's real name so screen readers can announce who is speaking.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use Persona in a chat header</div>
          <div className="body" style={{ padding: 14, alignItems: 'center', gap: 10 }}>
            <Persona state="idle" size={32} label="Agent"/>
            <span className="t-small" style={{ fontWeight: 600 }}>Eidos Agent</span>
          </div>
          <div className="note">In a chat header or settings list, use AgentIdentity — it is designed for that context, with a stable size and an optional AI label.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="PersonaProps">API reference</SubHead>
      <AutoPropsTable component="Persona" label="<Persona />"/>
    </Section>
  );
}
