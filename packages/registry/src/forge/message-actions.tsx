import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const MessageActions = ({
  surface = 'message',
  onCopy,
  onRegen,
  onShare,
  vote,
  onVote,
  extra,
}: {
  /** Switch between .msg-action (message) and .ai-resp-action (response) chrome. */
  surface?: 'message' | 'response';
  /** Copy handler fired when the copy button is clicked. */
  onCopy?: () => void;
  /** Regenerate handler fired when the regenerate button is clicked. */
  onRegen?: () => void;
  /** Share handler shown only when surface="response". */
  onShare?: () => void;
  /** Controlled vote state — "up", "down", or null (none). */
  vote?: 'up' | 'down' | null;
  /** Called with the toggled vote value when a vote button is clicked. */
  onVote?: (next: 'up' | 'down' | null) => void;
  /** Extra ReactNode appended after the canonical buttons. */
  extra?: React.ReactNode;
}) => {
  const base = surface === 'response' ? 'ai-resp-action' : 'msg-action';
  const sz = surface === 'response' ? 14 : 13;
  return (
    <>
      <button className={base} title="Copy" onClick={onCopy}><Icons.copy size={sz}/></button>
      <button className={base} title="Regenerate" onClick={onRegen}><Icons.refresh size={sz}/></button>
      <button
        className={base + ' thumb-up' + (vote === 'up' ? ' is-on' : '')}
        title="Helpful" aria-pressed={vote === 'up'}
        onClick={() => onVote && onVote(vote === 'up' ? null : 'up')}
      ><Icons.check size={sz}/></button>
      <button
        className={base + ' thumb-down' + (vote === 'down' ? ' is-on' : '')}
        title="Not helpful" aria-pressed={vote === 'down'}
        onClick={() => onVote && onVote(vote === 'down' ? null : 'down')}
      ><Icons.x size={sz}/></button>
      {surface === 'response' && (
        <button className={base} title="Share" style={{ marginInlineStart: 6 }} onClick={onShare}>
          <Icons.share size={sz}/>
        </button>
      )}
      {extra}
    </>
  );
};

export { MessageActions };
