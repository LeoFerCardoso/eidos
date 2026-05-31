import * as React from 'react';
// Eidos AI — Voice surfaces.
//
// Persona       — the orb avatar for audio conversations (idle / listening /
//                 thinking / speaking). SVG-based, animation lives in CSS so
//                 it can be muted by prefers-reduced-motion.
// SpeechInput   — the mic button + (optional) waveform / transcription preview.
// Transcription — speaker-labeled lines, optional timestamps.
// AudioPlayer   — minimal play/pause/scrub/time control over a real <audio>.
//
// Flat: no nested boxes. Each component is its own surface, composes with
// the rest of the DS without an outer container.
import { Icons } from '../icons';

// ── Persona — voice orb ──────────────────────────────────────────────────
// A circular avatar that visualises the conversation state. Compose with
// AgentIdentity for a stationary list; reach for Persona on the dedicated
// audio surface where the orb IS the affordance.
//   state    "idle" | "listening" | "thinking" | "speaking"
//   size     number (px) — diameter (default 96)
//   label    string — accessible name (e.g. agent name)
export const Persona = ({
  state = 'idle', size = 96, label = 'Voice agent', className, style,
}: {
  /** Conversation state. Drives CSS animation class on the ring and orb. */
  state?: 'idle' | 'listening' | 'thinking' | 'speaking';
  /** Diameter in px. The orb and ring scale proportionally. Minimum recommended: 48. */
  size?: number;
  /** Accessible name. Combined with state to form aria-label: "<label> — <state>". */
  label?: string;
  /** Extra class names applied to the root span. */
  className?: string;
  /** Inline styles merged onto the root span (width/height are set from size). */
  style?: React.CSSProperties;
}) => (
  <span
    className={'ai-persona is-' + state + (className ? ' ' + className : '')}
    style={{ width: size, height: size, ...style }}
    role="img" aria-label={`${label} — ${state}`}
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      {/* Outer ring — pulses on listening, rotates on thinking */}
      <circle cx="50" cy="50" r="46" className="ai-persona-ring" />
      {/* Inner orb — ember gradient */}
      <defs>
        <radialGradient id="eidos-persona-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%"  stopColor="#FFB07F"/>
          <stop offset="55%" stopColor="#FF6B35"/>
          <stop offset="100%" stopColor="#7A2F12"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="32" fill="url(#eidos-persona-grad)" className="ai-persona-orb"/>
    </svg>
  </span>
);

// ── SpeechInput — mic button with state + optional transcription ─────────
// Two shapes:
//   • default — full surface with mic + waveform + transcript/hint. For the
//     dedicated voice screen.
//   • compact — JUST the mic icon button, styled like `.pi-tool` (matches
//     the paperclip in the PromptInput footer). Pass `compact` when slotting
//     into `<PromptInput footerTools={…}/>` so it doesn't dominate the row.
export interface SpeechInputProps {
  /** Current mic state. Drives button aria-label, aria-pressed, and waveform visibility. */
  state?: 'idle' | 'listening' | 'processing' | 'error';
  /** Called on mic button click. The parent manages state transitions. */
  onToggle?: () => void;
  /** Live transcription text. Shown below the waveform (replaces hint). Container is aria-live="polite". */
  transcript?: string;
  /** Amplitude values (0–1) for each waveform bar. Array length determines bar count. Only shown in listening state. */
  levels?: number[];
  /** When true, renders the icon-only mic button (styled as .pi-tool) suitable for the PromptInput footerTools slot. */
  compact?: boolean;
  /** Extra class names on the root wrapper. */
  className?: string;
}

export const SpeechInput = ({
  state = 'idle', onToggle, transcript, levels, compact = false, className,
}: SpeechInputProps) => {
  const label =
    state === 'listening'  ? 'Stop listening' :
    state === 'processing' ? 'Transcribing…'   :
    state === 'error'      ? 'Microphone error — tap to retry' :
                              'Start voice input';

  // A click while processing is a no-op — but the button stays focusable (no
  // `disabled`) so Tab-reachability and the documented focus-never-lost
  // behaviour hold even if the parent eidosts to gate the transition.
  const handleToggle = () => { if (state !== 'processing') onToggle?.(); };

  // Compact: just the icon button — reuses .pi-tool chrome so it lines up
  // visually with the paperclip / model selector in the prompt footer.
  if (compact) {
    return (
      <button
        type="button"
        className={'pi-tool ai-speech-tool is-' + state + (className ? ' ' + className : '')}
        onClick={handleToggle}
        aria-label={label}
        aria-pressed={state === 'listening'}
        title={label}
      >
        <Icons.mic size={15}/>
      </button>
    );
  }

  return (
    <div className={'ai-speech is-' + state + (className ? ' ' + className : '')}>
      <button
        type="button"
        className="ai-speech-mic"
        onClick={handleToggle}
        aria-label={label}
        aria-pressed={state === 'listening'}
      >
        <Icons.mic size={18}/>
      </button>
      <div className="ai-speech-body">
        {state === 'listening' && levels && levels.length > 0 ? (
          <div className="ai-speech-wave" aria-hidden="true">
            {levels.map((v, i) => (
              <span key={i} className="ai-speech-bar" style={{ transform: `scaleY(${Math.max(0.08, Math.min(1, v))})` }}/>
            ))}
          </div>
        ) : null}
        {transcript ? (
          <div className="ai-speech-transcript" aria-live="polite">{transcript}</div>
        ) : (
          <div className="ai-speech-hint">{label}</div>
        )}
      </div>
    </div>
  );
};

// ── Transcription — speaker-labeled lines ────────────────────────────────
//   turns        { id, speaker, text, time?, confidence?, color? }[]
//   showTime     boolean
//   showConfidence boolean
export interface TranscriptTurn {
  id: string;
  speaker: string;
  text: string;
  time?: string;            // pre-formatted display string
  confidence?: number;      // 0..1
  /** Initials override for the speaker chip. */
  initials?: string;
  /** "user" tints the chip ember; "agent" tints neutral by default. */
  side?: 'user' | 'agent';
}

export const Transcription = ({
  turns = [], showTime = true, showConfidence = false, className,
}: {
  /** Ordered array of turns. The component renders each as a list item in an ol role="log". */
  turns?: TranscriptTurn[];
  /** When true, renders the turn's time field in Geist Mono if provided. */
  showTime?: boolean;
  /** When true, renders a confidence percentage chip (colour-coded by accuracy tier) if available. */
  showConfidence?: boolean;
  /** Extra class names on the root ol. */
  className?: string;
}) => (
  <ol className={'ai-transcript' + (className ? ' ' + className : '')} role="log" aria-label="Transcript">
    {turns.map((t) => (
      <li key={t.id} className={'ai-transcript-turn' + (t.side === 'user' ? ' is-user' : '')}>
        <span className="ai-transcript-chip">{t.initials || t.speaker.slice(0, 1)}</span>
        <div className="ai-transcript-text">
          <div className="ai-transcript-meta">
            <span className="ai-transcript-speaker">{t.speaker}</span>
            {showTime && t.time && <span className="ai-transcript-time">{t.time}</span>}
            {showConfidence && typeof t.confidence === 'number' && (
              <span className={'ai-transcript-conf' + (t.confidence < 0.7 ? ' is-low' : t.confidence < 0.9 ? ' is-mid' : ' is-high')}>{Math.round(t.confidence * 100)}%</span>
            )}
          </div>
          <p className="ai-transcript-line">{t.text}</p>
        </div>
      </li>
    ))}
  </ol>
);

// ── AudioPlayer — play/pause, skip ±10s, scrub, speed, mute ────────────────
// Backed by a real <audio>. Pass `src`; control is internal. Optional
// `peaks` paints a waveform (an array of 0..1 amplitude buckets — typically
// 60–120 values) instead of the plain scrubber track. `cover` slots an
// artwork preview to the leading edge. Speed cycles through SPEEDS on
// click of the pill (default 1×).
const fmtTime = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m + ':' + (r < 10 ? '0' + r : r);
};

const SPEEDS = [1, 1.25, 1.5, 2, 0.75] as const;

export interface AudioPlayerProps {
  /** Audio source URL. Passed directly to the underlying audio element. Use a data: URI for offline demos. */
  src: string;
  /** Optional label rendered above the time/scrubber row. Required when multiple players appear in the same surface. */
  title?: string;
  /** Secondary line shown below the title — typically author or episode info. */
  subtitle?: string;
  /** Artwork ReactNode (image, icon, gradient) shown on the leading edge when provided. */
  cover?: React.ReactNode;
  /** Known duration in seconds. Renders the total-time slot immediately, before audio metadata loads. Overwritten by the real duration on loadedmetadata. */
  duration?: number;
  /** 0..1 amplitude buckets — typically 60–120 values for a clean waveform. Replaces the plain scrubber track when provided. */
  peaks?: number[];
  /** Seconds to seek on the skip-back / skip-forward buttons. */
  skipSeconds?: number;
  /** Extra class names on the root wrapper div. */
  className?: string;
}

export const AudioPlayer = ({
  src, title, subtitle, cover, duration: durProp, peaks,
  skipSeconds = 10, className,
}: AudioPlayerProps) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [dur, setDur] = React.useState(durProp ?? 0);
  const [speedIdx, setSpeedIdx] = React.useState(0); // index into SPEEDS

  const toggle = () => {
    const el = audioRef.current; if (!el) return;
    if (el.paused) { el.play().catch(() => {}); setPlaying(true); }
    else { el.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const el = audioRef.current; if (!el) return;
    el.muted = !el.muted; setMuted(el.muted);
  };
  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    const el = audioRef.current; if (el) el.playbackRate = SPEEDS[next];
  };
  const skip = (delta: number) => {
    const el = audioRef.current; if (!el) return;
    const next = Math.max(0, Math.min(dur || 0, (el.currentTime || 0) + delta));
    el.currentTime = next; setT(next);
  };
  const onMeta = () => { const el = audioRef.current; if (el && isFinite(el.duration)) setDur(el.duration); };
  const onTime = () => { const el = audioRef.current; if (el) setT(el.currentTime); };
  const seekToFraction = (frac: number) => {
    const el = audioRef.current; if (!el) return;
    const next = Math.max(0, Math.min(dur || 0, frac * (dur || 0)));
    el.currentTime = next; setT(next);
  };
  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current; if (!el || !dur) return;
    const r = el.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    seekToFraction(frac);
  };
  const onTrackKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); skip(-skipSeconds); }
    if (e.key === 'ArrowRight') { e.preventDefault(); skip( skipSeconds); }
    if (e.key === 'Home')       { e.preventDefault(); seekToFraction(0); }
    if (e.key === 'End')        { e.preventDefault(); seekToFraction(1); }
  };

  const pct = dur > 0 ? (t / dur) * 100 : 0;
  const speed = SPEEDS[speedIdx];

  return (
    <div className={'ai-audio' + (peaks ? ' has-peaks' : '') + (cover ? ' has-cover' : '') + (className ? ' ' + className : '')}>
      <audio
        ref={audioRef} src={src}
        onLoadedMetadata={onMeta} onTimeUpdate={onTime}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />

      {cover && <div className="ai-audio-cover" aria-hidden="true">{cover}</div>}

      <div className="ai-audio-controls">
        <button type="button" className="ai-audio-btn skip" onClick={() => skip(-skipSeconds)} aria-label={`Back ${skipSeconds} seconds`}>
          <Icons.skipBack size={14}/>
        </button>
        <button type="button" className="ai-audio-btn play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Icons.pause size={16}/> : <Icons.play size={16}/>}
        </button>
        <button type="button" className="ai-audio-btn skip" onClick={() => skip(skipSeconds)} aria-label={`Forward ${skipSeconds} seconds`}>
          <Icons.skipForward size={14}/>
        </button>
      </div>

      <div className="ai-audio-body">
        {(title || subtitle) && (
          <div className="ai-audio-meta">
            {title && <span className="ai-audio-title">{title}</span>}
            {subtitle && <span className="ai-audio-subtitle">{subtitle}</span>}
          </div>
        )}
        <div className="ai-audio-row">
          <span className="ai-audio-time">{fmtTime(t)}</span>
          <div
            ref={trackRef}
            className="ai-audio-track"
            style={{ ['--pct' as any]: pct + '%' }}
            onClick={onTrackClick}
            onKeyDown={onTrackKey}
            role="slider"
            aria-valuemin={0} aria-valuemax={dur || 100} aria-valuenow={Math.round(t)}
            aria-label="Audio scrubber"
            tabIndex={0}
          >
            {peaks && peaks.length > 0 ? (
              <div className="ai-audio-wave" aria-hidden="true">
                {peaks.map((v, i) => {
                  const onLeft = (i / peaks.length) * 100 < pct;
                  return (
                    <span
                      key={i}
                      className={'ai-audio-wave-bar' + (onLeft ? ' is-played' : '')}
                      style={{ height: `${Math.max(8, v * 100)}%` }}
                    />
                  );
                })}
              </div>
            ) : (
              <span className="ai-audio-track-bar" aria-hidden="true"/>
            )}
          </div>
          <span className="ai-audio-time">{fmtTime(dur)}</span>
        </div>
      </div>

      <button
        type="button"
        className="ai-audio-speed"
        onClick={cycleSpeed}
        aria-label={`Playback speed ${speed}x`}
        title="Playback speed"
      >
        {speed === 1 ? '1×' : `${speed}×`}
      </button>
      <button
        type="button"
        className="ai-audio-btn mute"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <Icons.volumeOff size={14}/> : <Icons.volume size={14}/>}
      </button>
    </div>
  );
};
