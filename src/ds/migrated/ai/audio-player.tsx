'use client';
// Eidos AI — Audio Player. Minimal play/pause/scrub/mute over a real <audio>.
// Use it whenever an agent responds with a spoken narration or summary.
// Pair it with Transcription for the canonical audio-reply pattern.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, AudioPlayer, Transcription, Message, Mono } from '@/ds/core';
import type { TranscriptTurn } from '@/ds/core';


// Offline-safe placeholder src — a tiny silent WAV encoded as a data URI.
// The player renders with controls but the scrubber stays at 0 for a placeholder.
// In production, replace with a real URL or a blob from the AI SDK's audio stream.
const PLACEHOLDER_SRC = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

// Demo transcript for the paired audio+transcription surface
const SUMMARY_TURNS: TranscriptTurn[] = [
  { id: 's1', speaker: 'Eidos Agent', initials: 'FA', side: 'agent', time: '14:00', text: 'Good afternoon. Here is your daily standup recap.' },
  { id: 's2', speaker: 'Eidos Agent', initials: 'FA', side: 'agent', time: '14:00', text: 'All platform services are green. The deploy of the feature-flags service at 14:03 completed successfully with zero rollback risk.' },
  { id: 's3', speaker: 'Eidos Agent', initials: 'FA', side: 'agent', time: '14:01', text: 'One low-priority alert remains open in the monitoring backlog — not customer-facing. No action required before end of day.' },
  { id: 's4', speaker: 'Eidos Agent', initials: 'FA', side: 'agent', time: '14:01', text: 'The next scheduled deploy is tomorrow at 10:00 UTC — identity-svc minor release.' },
];

export default function AiAudioPlayerPage() {
  return (
    <Section
      id="audio-player"
      num="26"
      title="Audio Player"
      desc="A minimal play/pause/scrub/mute surface over a real audio element. Use it when an agent responds with a spoken summary or narration."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-voice')} ariaLabel="package manager"/>
      <Lede>Always pair AudioPlayer with a Transcription so the content is accessible to all users regardless of whether they can hear audio.</Lede>
      <Lede>
        Ships as part of the voice module alongside <Mono>Persona</Mono>, <Mono>SpeechInput</Mono>, and <Mono>Transcription</Mono>. The player wraps a real <Mono>{'<audio>'}</Mono> element — pass a <Mono>src</Mono> URL and all controls are internal.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="AudioPlayer with a placeholder src — scrubber stays at 0 with a placeholder"
        row
        code={`import { AudioPlayer } from "@/ds/core"

// In production, pass a real audio URL or a blob from the AI SDK's audio stream.
// The player renders with all controls even when the src is a placeholder.
<AudioPlayer src={audioUrl}/>`}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AudioPlayer src={PLACEHOLDER_SRC}/>
        </div>
      </Frame>
      <Lede>
        The demo above uses a silent placeholder WAV — the scrubber stays at 0 and the duration shows 0:00. In a real integration, pass the URL from the agent's audio response. The component handles all state (play/pause, current time, duration, mute) internally.
      </Lede>

      {/* WITH TITLE */}
      <SubHead meta="title prop">With title</SubHead>
      <Frame
        label="title prop — shown above the time/scrubber row"
        row
        code={`<AudioPlayer
  src={audioUrl}
  title="Daily standup recap · 2 min"
/>`}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AudioPlayer src={PLACEHOLDER_SRC} title="Daily standup recap · 2 min"/>
        </div>
      </Frame>
      <Lede>
        Pass <Mono>title</Mono> to identify the recording — useful when there are multiple audio replies in a thread. The title renders above the scrubber row in Geist Sans at the default body size.
      </Lede>

      {/* WITH DURATION HINT */}
      <SubHead meta="duration prop">With duration hint</SubHead>
      <Frame
        label="duration prop — shows a known total time before the audio is loaded"
        row
        code={`<AudioPlayer
  src={audioUrl}
  title="Platform health digest"
  duration={127}
/>`}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AudioPlayer src={PLACEHOLDER_SRC} title="Platform health digest" duration={127}/>
        </div>
      </Frame>
      <Lede>
        Pass <Mono>duration</Mono> (in seconds) when you know the length from the API response before the audio loads — the total time renders immediately instead of showing 0:00 while metadata fetches. The component overwrites it once the real duration is available from the audio element.
      </Lede>

      <SubHead meta="cover · subtitle · peaks">Rich variant</SubHead>
      <Frame
        label="cover artwork · subtitle · waveform from a peaks array"
        row
        code={`const peaks = await fetchPeaks(audioUrl); // 0..1 amplitude buckets

<AudioPlayer
  src={audioUrl}
  cover={<img src="/cover.png" alt=""/>}
  title="Daily standup recap"
  subtitle="Eidos platform team · 2 min"
  peaks={peaks}
/>`}
      >
        <div style={{ width: '100%', maxWidth: 520 }}>
          <AudioPlayer
            src={PLACEHOLDER_SRC}
            title="Daily standup recap"
            subtitle="Eidos platform team · 2 min"
            duration={127}
            cover={<Icons.flame size={22}/>}
            peaks={Array.from({ length: 60 }, (_, i) => {
              // pseudo-waveform: a couple of crescendos for visual interest
              const a = Math.sin(i / 4) * 0.35 + 0.5;
              const b = Math.sin(i / 11 + 1) * 0.25;
              return Math.max(0.15, Math.min(1, a + b));
            })}
          />
        </div>
      </Frame>
      <Lede>
        Pass a <Mono>cover</Mono> ReactNode for artwork (image, icon, gradient), a <Mono>subtitle</Mono> for an author/duration line, and a <Mono>peaks</Mono> array of 0..1 amplitudes to replace the plain scrubber with a real waveform. The played portion of the waveform tints ember; the remaining tail stays neutral. Click anywhere on the track to seek; <Mono>←</Mono>/<Mono>→</Mono> skip ±10s, <Mono>Home</Mono>/<Mono>End</Mono> jump to the edges.
      </Lede>

      <SubHead meta="speed selector">Playback speed</SubHead>
      <Frame
        label="Click the 1× pill — cycles through 1×, 1.25×, 1.5×, 2×, 0.75×"
        row
        code={`<AudioPlayer src={audioUrl} title="Standup recap"/>
// Default starts at 1× — clicking the pill cycles speed.`}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          <AudioPlayer src={PLACEHOLDER_SRC} title="Standup recap" duration={127}/>
        </div>
      </Frame>
      <Lede>
        The speed pill cycles through five common playback rates without opening a menu. The rate persists for the lifetime of the player; pass <Mono>skipSeconds</Mono> to override the ±10s skip default (e.g. 5s for short clips, 30s for podcasts).
      </Lede>

      {/* IN CONTEXT — AGENT NARRATION */}
      <SubHead meta="real surface">In context — agent narration</SubHead>
      <Frame
        label="AudioPlayer inside a Message bubble — agent says 'here is the spoken summary'"
        height={260}
        code={`<Message from="assistant">
  <p style={{ margin: '0 0 12px' }}>Here is the spoken summary of today's standup:</p>
  <AudioPlayer
    src={audioUrl}
    title="Daily standup recap · 2 min"
  />
</Message>`}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          <Message from="assistant">
            <p style={{ margin: '0 0 12px' }}>Here is the spoken summary of today's standup:</p>
            <AudioPlayer
              src={PLACEHOLDER_SRC}
              title="Daily standup recap · 2 min"
            />
          </Message>
        </div>
      </Frame>
      <Lede>
        Drop the player directly inside a <Mono>{'<Message from="assistant">'}</Mono> bubble. The player inherits the bubble background and spacing — no wrapper needed.
      </Lede>

      {/* SIDE-BY-SIDE WITH TRANSCRIPTION */}
      <SubHead meta="audio + transcript">Side-by-side with Transcription</SubHead>
      <Frame
        label="AudioPlayer above Transcription — the canonical audio-reply pattern"
        height={460}
        code={`<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
  <AudioPlayer
    src={audioUrl}
    title="Daily standup recap · 2 min"
  />
  <Transcription turns={turns} showTime/>
</div>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <AudioPlayer
            src={PLACEHOLDER_SRC}
            title="Daily standup recap · 2 min"
          />
          <Transcription turns={SUMMARY_TURNS} showTime/>
        </div>
      </Frame>
      <Lede>
        Always pair audio with a <Mono>Transcription</Mono>. The audio is the preferred modality for some users; the transcript is the accessible fallback for others — and the auditable record for everyone. This two-component pattern is the canonical AI audio-reply surface.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard controls</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Play/pause, skip back/forward, the speed pill, and mute are real <Mono>{'<button>'}</Mono> elements — <Mono>Tab</Mono> reaches each, <Mono>Enter</Mono>/<Mono>Space</Mono> activates. The scrubber is a <Mono>{'<div role="slider">'}</Mono> with <Mono>tabIndex={'{0}'}</Mono> — <Mono>←</Mono>/<Mono>→</Mono> seek by <Mono>skipSeconds</Mono> (default ±10s), <Mono>Home</Mono>/<Mono>End</Mono> jump to start/end.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Aria labels (flip on state)</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Play/pause button: <Mono>aria-label="Play"</Mono> / <Mono>"Pause"</Mono>. Skip buttons: <Mono>"Back 10 seconds"</Mono> / <Mono>"Forward 10 seconds"</Mono> (reflecting <Mono>skipSeconds</Mono>). Speed pill: <Mono>"Playback speed 1x"</Mono>. Mute button: <Mono>"Mute"</Mono> / <Mono>"Unmute"</Mono>. Scrubber: <Mono>role="slider"</Mono> with <Mono>aria-label="Audio scrubber"</Mono> and live <Mono>aria-valuenow</Mono>. Icons are <Mono>aria-hidden</Mono> — the button labels carry the meaning.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Transcription pairing (required)</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Audio alone is not accessible — users who are deaf, hard-of-hearing, or in a silent environment cannot consume the content. Always pair <Mono>AudioPlayer</Mono> with a <Mono>Transcription</Mono> or a prose caption. WCAG 1.2.2 (Captions — Level A) and WCAG 1.2.3 (Audio Description — Level A) both require this.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion &amp; no autoplay</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The component never sets <Mono>autoplay</Mono> on the <Mono>{'<audio>'}</Mono> element — WCAG 1.4.2 (Audio Control) requires the user to be able to pause any audio that auto-plays past 3 seconds, so playback always begins on an explicit action. The scrubber fill tracks position with no animation (seeks are instant); only the control hover/state tints transition, and those collapse under <Mono>prefers-reduced-motion</Mono>.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — controls and scrubber flip; timestamps stay LTR">
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AudioPlayer src={PLACEHOLDER_SRC} title="ملخص الاجتماع اليومي · دقيقتان"/>
          <AudioPlayer src={PLACEHOLDER_SRC}/>
        </div>
      </Frame>
      <Lede>
        Logical CSS flips the play button to the inline-start (right) edge and the mute button to the inline-end (left) edge in RTL. The scrubber direction mirrors automatically via the <Mono>direction</Mono> inheritance. Timestamps — Geist Mono numerals — remain left-to-right by convention, consistent with <Mono>{'<time>'}</Mono> rendering across browsers in RTL documents.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 420, width: '100%' }} aria-hidden="true">
              <AudioPlayer src={PLACEHOLDER_SRC} title="Daily standup recap · 2 min" duration={127}/>
              {/* Transport group — back-skip / play / forward-skip on the inline-start edge */}
              <span className="lead v" style={{ top: -22, left: 16, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 16, transform: 'translateX(-50%)' }}>1</div>
              <span className="lead v" style={{ top: -22, left: 48, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 48, transform: 'translateX(-50%)' }}>2</div>
              <span className="lead v" style={{ top: -22, left: 80, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 80, transform: 'translateX(-50%)' }}>3</div>
              {/* Time-current pin */}
              <span className="lead v" style={{ bottom: -22, left: 120, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: 120, transform: 'translateX(-50%)' }}>4</div>
              {/* Scrubber pin */}
              <span className="lead v" style={{ bottom: -22, left: '52%', height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: '52%', transform: 'translateX(-50%)' }}>5</div>
              {/* Time-total pin */}
              <span className="lead v" style={{ bottom: -22, right: 96, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, right: 96, transform: 'translateX(50%)' }}>6</div>
              {/* Speed pill pin */}
              <span className="lead v" style={{ top: -22, right: 48, height: 18 }}/>
              <div className="pin" style={{ top: -42, right: 48, transform: 'translateX(50%)' }}>7</div>
              {/* Mute pin */}
              <span className="lead v" style={{ top: -22, right: 16, height: 18 }}/>
              <div className="pin" style={{ top: -42, right: 16, transform: 'translateX(50%)' }}>8</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Skip back.</b> Class <Mono>ai-audio-btn skip</Mono>. Rewinds the audio by <Mono>skipSeconds</Mono> (default 10s). <Mono>aria-label="Back 10 seconds"</Mono> tracks the prop. Leads the transport group on the inline-start edge.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Play / Pause button.</b> Class <Mono>ai-audio-btn play</Mono>. Renders the play (▶) or pause (⏸) icon depending on the playing state. <Mono>aria-label</Mono> flips from "Play" to "Pause".</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Skip forward.</b> Class <Mono>ai-audio-btn skip</Mono>. Advances the audio by <Mono>skipSeconds</Mono> (default 10s). <Mono>aria-label="Forward 10 seconds"</Mono>. Closes the transport group.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Current time.</b> Class <Mono>ai-audio-time</Mono>. Geist Mono muted — formatted as M:SS. Updates via the <Mono>timeupdate</Mono> event on the underlying audio element.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Scrubber.</b> A <Mono>{'<div role="slider">'}</Mono> styled as a track with a CSS custom property (<Mono>--pct</Mono>) for the filled portion. <Mono>aria-label="Audio scrubber"</Mono>, <Mono>tabIndex={'{0}'}</Mono>. Click to seek; Arrow keys step by <Mono>skipSeconds</Mono>, Home/End jump to the edges.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Total duration.</b> Second <Mono>ai-audio-time</Mono> span. Populated from <Mono>onLoadedMetadata</Mono> or the <Mono>duration</Mono> prop when provided ahead of loading.</span>
            <span className="num">7</span><span><b style={{ color: 'var(--fg)' }}>Speed pill.</b> Class <Mono>ai-audio-speed</Mono>. Cycles playback rate through 1×, 1.25×, 1.5×, 2×, 0.75× on click. <Mono>aria-label="Playback speed 1x"</Mono> reflects the active rate.</span>
            <span className="num">8</span><span><b style={{ color: 'var(--fg)' }}>Mute / Unmute button.</b> Class <Mono>ai-audio-btn mute</Mono>. Renders the speaker icon; toggles to <Mono>volumeOff</Mono> when muted. <Mono>aria-label</Mono> flips from "Mute" to "Unmute". Located on the inline-end edge.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair audio with a transcription</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 10 }}>
            <AudioPlayer src={PLACEHOLDER_SRC} title="Standup recap · 2 min"/>
            <Transcription
              turns={[{ id: 'p1', speaker: 'Eidos Agent', initials: 'FA', side: 'agent', text: 'All services green. Deploy successful.' }]}
              showTime={false}
            />
          </div>
          <div className="note">The audio is the preferred modality; the transcript is the accessible fallback. Together they satisfy WCAG 1.2.2 and serve users in silent environments.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — autoplay without user intent</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8 }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', wordBreak: 'break-all' }}>
              {'<audio autoplay src="…"/> // ← violates WCAG 1.4.2'}
            </code>
          </div>
          <div className="note">Autoplaying audio disorients screen-reader users, violates WCAG 1.4.2, and will be blocked by most browsers on page load. Always require an explicit play action.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pass title and duration from the API</div>
          <div className="body" style={{ padding: 14 }}>
            <AudioPlayer src={PLACEHOLDER_SRC} title="Morning briefing" duration={183}/>
          </div>
          <div className="note">When the AI SDK returns the audio URL, it typically also returns title and duration. Populate both props so the player renders completely without waiting for audio metadata to load.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use multiple players without labels</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8 }}>
            <AudioPlayer src={PLACEHOLDER_SRC}/>
            <AudioPlayer src={PLACEHOLDER_SRC}/>
          </div>
          <div className="note">Two unlabelled players in the same surface are indistinguishable. Always pass a title when more than one player is visible — the user cannot tell which recording is which.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="AudioPlayerProps">API reference</SubHead>
      <AutoPropsTable component="AudioPlayer" label="<AudioPlayer />"/>
      <Lede>
        All playback state (playing, muted, current time, duration) is managed internally. The component does not expose a ref or controlled props for playback state — for external control (e.g. syncing a player to a transcript highlight), wrap the component and wire up via a ref passed to a custom hook.
      </Lede>
    </Section>
  );
}
