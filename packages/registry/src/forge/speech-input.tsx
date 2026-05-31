import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface SpeechInputProps {
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

const SpeechInput = ({
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

export { SpeechInput };
