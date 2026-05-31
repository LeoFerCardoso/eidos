import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { StatusDot } from '@/components/forge/status-dot';

const PIPE_STATUS = { ok: 'done', pass: 'done', running: 'running', pending: 'pending', fail: 'error', skip: 'skipped' };

const pipeIcon = (tone) => {
  if (tone === 'done')    return Icons.check;
  if (tone === 'error')   return Icons.x;
  if (tone === 'skipped') return Icons.minus;
  return null;
};

type PipeStep = { id?: string; label?: string; status?: string; meta?: string; duration?: string; percent?: number };

const PipelineStepper = ({ steps, currentIndex, compact }: { steps: PipeStep[]; currentIndex?: number; compact?: boolean }) => (
  <ol className={'pipeline pipeline-stepper' + (compact ? ' compact' : '')}>
    {steps.map((s, i) => {
      const tone = PIPE_STATUS[s.status] || s.status || 'pending';
      const isCurrent = currentIndex !== undefined ? i === currentIndex : tone === 'running';
      const Icn = pipeIcon(tone);
      return (
        <li key={s.id || s.label || i} className={'pipe-step ' + tone + (isCurrent ? ' is-current' : '')}>
          <span className="pipe-dot" aria-hidden="true">
            {isCurrent && <span className="pipe-halo"/>}
            {Icn ? <Icn size={11}/> : <span className="pipe-bullet"/>}
          </span>
          {!compact && (
            <div className="pipe-text">
              <span className="pipe-label">{s.label}</span>
              {s.meta && <span className="pipe-meta">{s.meta}</span>}
            </div>
          )}
        </li>
      );
    })}
  </ol>
);

const PipelineChevron = ({ steps, currentIndex }: { steps: PipeStep[]; currentIndex?: number }) => (
  <ol className="pipeline pipeline-chevron">
    {steps.map((s, i) => {
      const tone = PIPE_STATUS[s.status] || s.status || 'pending';
      const isCurrent = currentIndex !== undefined ? i === currentIndex : tone === 'running';
      const Icn = pipeIcon(tone);
      const positionCls = i === 0 ? ' chev-first' : i === steps.length - 1 ? ' chev-last' : '';
      return (
        <li key={s.id || i} className={'chev-step ' + tone + (isCurrent ? ' is-current' : '') + positionCls}>
          <span className="chev-inner">
            <span className="chev-glyph" aria-hidden="true">
              {Icn ? <Icn size={11}/> : <StatusDot tone={tone} pulse={tone === 'running'} size="sm"/>}
            </span>
            <span className="chev-text">
              <span className="chev-label">{s.label}</span>
              {s.meta && <span className="chev-meta">{s.meta}</span>}
            </span>
          </span>
        </li>
      );
    })}
  </ol>
);

const Pipeline = ({
  variant = 'stepper', steps, currentIndex, compact,
}: {
  /** Visual layout. Step model is shared between variants. */
  variant?: 'stepper' | 'chevron';
  /** Ordered steps — each: { id, label, status, meta?, duration?, percent? }. */
  steps?: PipeStep[];
  /** Force which step reads as in-flight. Default: first running step. */
  currentIndex?: number;
  /** Stepper-only — collapse labels for table-cell density. */
  compact?: boolean;
}) => {
  if (variant === 'chevron') return <PipelineChevron steps={steps || []} currentIndex={currentIndex}/>;
  return <PipelineStepper steps={steps || []} currentIndex={currentIndex} compact={compact}/>;
};

export { Pipeline };
