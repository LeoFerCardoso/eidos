import * as React from 'react';

interface TranscriptTurn {
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

const Transcription = ({
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

export { Transcription };
