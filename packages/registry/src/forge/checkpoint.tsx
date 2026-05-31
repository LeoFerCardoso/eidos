import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const Checkpoint = ({
  label = 'Checkpoint', time, onRestore,
}: {
  /** Text label inside the chip. Name it after the captured state: "Before rollback", "Plan agreed". */
  label?: string;
  /** Optional timestamp. Accepts a string ("14:32", "2 min ago") or a ReactNode. Rendered in Geist Mono. */
  time?: React.ReactNode;
  /** When provided, renders a Restore button inside the chip. Called on click; consumer updates UI state. */
  onRestore?: () => void;
}) => (
  <div className="ai-checkpoint" role="separator" aria-label={`${label}${time ? ' · ' + time : ''}`}>
    <span className="ai-checkpoint-rule"/>
    <span className="ai-checkpoint-label">
      <Icons.flag size={11} className="flag-mark" aria-hidden="true"/>
      <span className="lbl">{label}</span>
      {time && <><span className="sep">·</span><span className="t">{time}</span></>}
      {onRestore && <button className="ai-checkpoint-restore" onClick={onRestore} aria-label={`Restore conversation to ${label}`}>Restore</button>}
    </span>
    <span className="ai-checkpoint-rule"/>
  </div>
);

export { Checkpoint };
