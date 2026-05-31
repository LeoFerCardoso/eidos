import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const AgentAvatar = ({
  size = 32,
  status,
  ember = true,
  glyph,
  initials,
  name,
  className,
  style,
}: {
  /** Avatar diameter in px. */
  size?: number;
  /** Presence dot variant. "online" shows green; "away" amber; "offline" grey; "busy" red. */
  status?: 'online' | 'away' | 'offline' | 'busy';
  /** When true, applies the ember tint (default true). Set false for user avatars. */
  ember?: boolean;
  /** Override the default agent icon with any ReactNode. */
  glyph?: React.ReactNode;
  /** Render initials instead of the glyph icon. */
  initials?: string;
  /** Accessible name for the avatar (used in title attribute). */
  name?: string;
  /** Extra class names applied to the root span. */
  className?: string;
  /** Inline styles merged onto the root span. */
  style?: React.CSSProperties;
}) => {
  const cls = ['avatar', 'ai-agent-avatar'];
  if (ember) cls.push('ember');
  if (size >= 40) cls.push('lg');
  if (className) cls.push(className);
  return (
    <span className={cls.join(' ')} style={{ width: size, height: size, ...style }} title={name}>
      {initials
        ? <span style={{ fontSize: Math.round(size * 0.36) }}>{initials}</span>
        : (glyph || <Icons.agent size={Math.round(size * 0.5)}/>)}
      {status && <span className={'status-dot' + (status !== 'online' ? ' ' + status : '')} aria-hidden="true"/>}
    </span>
  );
};

export { AgentAvatar };
