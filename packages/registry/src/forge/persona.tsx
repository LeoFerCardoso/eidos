import * as React from 'react';

const Persona = ({
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
        <radialGradient id="forge-persona-grad" cx="35%" cy="35%" r="65%">
          <stop offset="0%"  stopColor="#FFB07F"/>
          <stop offset="55%" stopColor="#FF6B35"/>
          <stop offset="100%" stopColor="#7A2F12"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="32" fill="url(#forge-persona-grad)" className="ai-persona-orb"/>
    </svg>
  </span>
);

export { Persona };
