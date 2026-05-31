import * as React from 'react';
// Eidos AI — AskUser. A faithful, tuned re-implementation of the
// fluidfunctionalism.com/docs/ask-user-questions pattern, with the
// mechanics the original docs leave open:
//
//   • Stepped flow with smooth cross-fade transitions between questions
//   • Single-select clicks → confirm-then-advance (~180ms beat) so the
//     user actually sees what they picked before the next q lands
//   • Back button on every question past the first
//   • ⌃↵ to advance · 1–9 to pick option by number · ↑/↓ to focus options
//     · Enter on a focused option to select it
//   • allowOther coexists as a row, typing auto-selects it
//   • Completed state lists answers + offers Restart
//   • Subtle ember progress bar at the top
//
// Stepped is the ONLY mode — showing all questions at once is a different
// UX problem (a form) and we leave it to the host. Visual: borderless,
// sans, ember accent. Selected = ember-soft background fill (no tick
// icons). CSS lives in ai.css under the `.ask*` block.
import { Icons } from '../icons';

const OTHER = '__other';

export interface AskOption { id: string; title: string; description?: string }
export interface AskQuestion {
  id: string;
  title: string;
  /** Short topic prefix rendered before "Question N of M". */
  header?: string;
  options: AskOption[];
  multiSelect?: boolean;
  allowOther?: boolean;
  otherPlaceholder?: string;
  skippable?: boolean;
  /** stacked (default) = description below title; inline = same line. */
  layout?: 'stacked' | 'inline';
}
export interface AskAnswer {
  questionId: string;
  selectedIds: string[];
  otherText?: string;
  skipped?: boolean;
}

export const AskUser = ({
  questions = [], onComplete, onSkip,
  skipLabel = 'Skip', continueLabel = 'Continue', finishLabel = 'Finish',
  backLabel = 'Back',
  advanceDelayMs = 180,
}: {
  /** The question bank. Each entry defines id, title, options, and optional settings. */
  questions?: AskQuestion[];
  /** Fires once all questions are answered or skipped. Receives the answers array. */
  onComplete?: (a: AskAnswer[]) => void;
  /** Fires when a skippable question is skipped — alongside onComplete eventually. */
  onSkip?: (id: string) => void;
  /** Label for the skip text-link in the header. */
  skipLabel?: string;
  /** Label for the multi-select / panel CTA. */
  continueLabel?: string;
  /** Label for the CTA on the last step. */
  finishLabel?: string;
  /** Label for the back link. */
  backLabel?: string;
  /** Delay between single-select click and auto-advancing (ms). 0 = instant. */
  advanceDelayMs?: number;
}) => {
  const initialAnswers = React.useMemo<AskAnswer[]>(
    () => questions.map((q) => ({ questionId: q.id, selectedIds: [], otherText: '', skipped: false })),
    [questions],
  );
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [answers, setAnswers] = React.useState<AskAnswer[]>(initialAnswers);
  // Direction of the current transition: 'next' | 'prev' | null. Drives the
  // cross-fade animation in CSS via a data-attribute.
  const [tDir, setTDir] = React.useState<'next' | 'prev' | null>(null);
  // Which option is keyboard-focused (independent of selection).
  const [focusedIdx, setFocusedIdx] = React.useState<number>(-1);
  // Block input briefly during transition so the user can't double-advance.
  const [locked, setLocked] = React.useState(false);

  const total = questions.length;
  const finish = (next: AskAnswer[]) => { setDone(true); onComplete && onComplete(next); };

  // ── Step transition ────────────────────────────────────────────────────
  // The question element is keyed by `step` so changing step remounts it.
  // CSS @keyframes (defined in ai.css) drive the slide entry from left or
  // right based on the `is-next` / `is-prev` data-state on the root.
  const ANIM_MS = 240;
  const goTo = (next: number, dir: 'next' | 'prev') => {
    if (locked) return;
    if (next >= total) { finish(answers); return; }
    setLocked(true);
    setTDir(dir);
    setStep(next);
    setFocusedIdx(-1);
    window.setTimeout(() => { setLocked(false); setTDir(null); }, ANIM_MS);
  };

  // Compute the next answers array purely, then set + schedule the
  // advance side-effect OUTSIDE the updater. Doing the timer inside a
  // setState updater is a React anti-pattern (concurrent mode may run
  // updaters twice or discard them), which was preventing auto-advance.
  const select = (qi: number, optId: string, multi: boolean, autoAdvance: boolean) => {
    const next = answers.map((a, i) => {
      if (i !== qi) return a;
      const has = a.selectedIds.includes(optId);
      const selectedIds = multi
        ? (has ? a.selectedIds.filter((x) => x !== optId) : [...a.selectedIds, optId])
        : [optId];
      return { ...a, selectedIds, skipped: false };
    });
    setAnswers(next);

    if (autoAdvance && !multi) {
      // Brief beat so the user sees the ember-soft fill confirm, THEN
      // slide into the next question.
      window.setTimeout(() => {
        if (qi < total - 1) {
          setLocked(true);
          setTDir('next');
          setStep(qi + 1);
          setFocusedIdx(-1);
          window.setTimeout(() => { setLocked(false); setTDir(null); }, 240);
        } else {
          finish(next);
        }
      }, advanceDelayMs);
    }
  };

  const setOther = (qi: number, text: string) => {
    setAnswers(answers.map((a, i) => {
      if (i !== qi) return a;
      const selectedIds = text
        ? Array.from(new Set([...a.selectedIds, OTHER]))
        : a.selectedIds.filter((x) => x !== OTHER);
      return { ...a, otherText: text, selectedIds, skipped: false };
    }));
  };

  const advance = (qi: number) => {
    if (qi < total - 1) goTo(qi + 1, 'next'); else finish(answers);
  };
  const back = (qi: number) => {
    if (qi > 0) goTo(qi - 1, 'prev');
  };
  const skip = (qi: number) => {
    const next = answers.map((a, i) => (i === qi ? { ...a, skipped: true, selectedIds: [] } : a));
    setAnswers(next);
    onSkip && onSkip(questions[qi].id);
    if (qi < total - 1) {
      setLocked(true);
      setTDir('next');
      setStep(qi + 1);
      setFocusedIdx(-1);
      window.setTimeout(() => { setLocked(false); setTDir(null); }, 240);
    } else {
      finish(next);
    }
  };

  const restart = () => {
    setAnswers(initialAnswers); setStep(0); setDone(false); setFocusedIdx(-1); setTDir(null);
  };

  if (total === 0) return null;

  // ── Completed summary ─────────────────────────────────────────────────
  if (done) {
    return (
      <div className="ask is-done" role="group" aria-label="Your answers">
        <div className="ask-done-head">
          <Icons.check size={13}/>
          <span>Answers recorded</span>
        </div>
        <dl className="ask-summary">
          {questions.map((q, i) => {
            const a = answers[i];
            const labels = a.skipped
              ? ['Skipped']
              : [
                  ...a.selectedIds.filter((id) => id !== OTHER).map((id) => q.options.find((o) => o.id === id)?.title || id),
                  ...(a.selectedIds.includes(OTHER) && a.otherText ? [a.otherText] : []),
                ];
            return (
              <React.Fragment key={q.id}>
                <dt>{q.header || q.title}</dt>
                <dd className={a.skipped ? 'skipped' : ''}>{labels.length ? labels.join(', ') : '—'}</dd>
              </React.Fragment>
            );
          })}
        </dl>
        <div className="ask-done-foot">
          <button type="button" className="ask-q-cta ghost" onClick={restart}>Restart</button>
        </div>
      </div>
    );
  }

  const renderQuestion = (qi: number) => {
    const q = questions[qi];
    const a = answers[qi];
    const multi = !!q.multiSelect;
    const inline = q.layout === 'inline';
    const hasSelection = a.selectedIds.length > 0 || (a.otherText && a.otherText.length > 0);
    // Continue is shown when:
    //  • multi-select (always — auto-advance is off)
    //  • single-select + allowOther AND the user has typed in the other
    //    input (so they have a way to commit the typed text — option clicks
    //    still auto-advance independently).
    const otherActive = q.allowOther && a.selectedIds.includes(OTHER);
    const showContinue = multi || otherActive;
    const isLast = qi === total - 1;
    const hasBack = qi > 0;
    const pct = total > 1 ? ((qi + 1) / total) * 100 : 100;

    return (
      <div className="ask-q" key={'q-' + step}>
        <div className="ask-q-head">
          {q.header && <span className="ask-q-topic">{q.header}</span>}
          <span className="ask-q-step">Question {qi + 1} of {total}</span>
          {total > 1 && (
            <span className="ask-q-progress" aria-hidden="true">
              <span className="ask-q-progress-fill" style={{ inlineSize: `${pct}%` }}/>
            </span>
          )}
        </div>
        <h3 className="ask-q-title">{q.title}</h3>
        <div
          className={'ask-q-opts' + (inline ? ' is-inline' : '')}
          role={multi ? 'group' : 'radiogroup'} aria-label={q.title}
        >
          {q.options.map((o, idx) => {
            const on = a.selectedIds.includes(o.id);
            const isFocused = idx === focusedIdx;
            return (
              <button
                key={o.id}
                type="button"
                className={'ask-opt' + (on ? ' is-on' : '') + (isFocused ? ' is-focused' : '')}
                role={multi ? 'checkbox' : 'radio'}
                aria-checked={on}
                onClick={() => select(qi, o.id, multi, true)}
                onMouseEnter={() => setFocusedIdx(idx)}
                disabled={locked}
                data-key={idx + 1 <= 9 ? idx + 1 : undefined}
              >
                <span className="ask-opt-body">
                  <span className="ask-opt-title">{o.title}</span>
                  {o.description && (
                    inline
                      ? <><span className="ask-opt-sep">—</span><span className="ask-opt-desc">{o.description}</span></>
                      : <span className="ask-opt-desc">{o.description}</span>
                  )}
                </span>
                {idx < 9 && <span className="ask-opt-key" aria-hidden="true">{idx + 1}</span>}
              </button>
            );
          })}
          {q.allowOther && (
            <label className={'ask-opt ask-opt-other' + (a.selectedIds.includes(OTHER) ? ' is-on' : '')}>
              <input
                type="text"
                value={a.otherText || ''}
                placeholder={q.otherPlaceholder || 'Other — describe in your own words…'}
                onChange={(e) => setOther(qi, e.target.value)}
                disabled={locked}
              />
            </label>
          )}
        </div>
        <div className="ask-q-hint">
          {q.options.length > 0 && (
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate · <kbd>1</kbd>–<kbd>{Math.min(q.options.length, 9)}</kbd> to pick</span>
          )}
          {showContinue && <span><kbd>⌃</kbd><kbd>↵</kbd> to continue</span>}
        </div>
        <div className="ask-q-foot">
          <div className="ask-q-foot-leading">
            {hasBack && (
              <button type="button" className="ask-q-back" onClick={() => back(qi)} disabled={locked}>
                <Icons.arrowLeft size={12}/> {backLabel}
              </button>
            )}
          </div>
          <div className="ask-q-foot-trailing">
            {q.skippable && (
              <button type="button" className="ask-q-skip" onClick={() => skip(qi)} disabled={locked}>{skipLabel}</button>
            )}
            {showContinue && (
              <button
                type="button"
                className="ask-q-cta"
                disabled={!hasSelection || locked}
                onClick={() => advance(qi)}
              >
                {isLast ? finishLabel : continueLabel}
                <Icons.arrowRight size={12}/>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const onKey = (e: React.KeyboardEvent) => {
    const q = questions[step];
    if (!q || locked) return;
    // ⌃↵ — advance
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const a = answers[step];
      if (a.selectedIds.length > 0 || (a.otherText && a.otherText.length > 0)) advance(step);
      return;
    }
    // Don't intercept keys while the "other" input is focused
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT') return;

    // 1–9 — quick pick by index
    if (/^[1-9]$/.test(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      const opt = q.options[idx];
      if (opt) {
        e.preventDefault();
        select(step, opt.id, !!q.multiSelect, true);
      }
      return;
    }
    // ↑ / ↓ — move focus
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((f) => (f + 1) % q.options.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((f) => (f - 1 + q.options.length) % q.options.length);
      return;
    }
    // Enter on a focused option
    if (e.key === 'Enter' && focusedIdx >= 0 && q.options[focusedIdx]) {
      e.preventDefault();
      select(step, q.options[focusedIdx].id, !!q.multiSelect, true);
    }
  };

  return (
    <div
      className={'ask' + (tDir ? ' is-' + tDir : '')}
      role="form" aria-label="The assistant has a question"
      onKeyDown={onKey}
      tabIndex={-1}
    >
      {renderQuestion(step)}
    </div>
  );
};
