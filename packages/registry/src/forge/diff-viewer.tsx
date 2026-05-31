import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type DiffLine = { type?: 'add' | 'del' | 'ctx'; old?: number | null; new?: number | null; code?: string };

type DiffHunk = { header?: string; lines: DiffLine[] };

type DiffFile = { path?: string; additions?: number; deletions?: number; hunks: DiffHunk[] };

const DiffUnified = ({ hunks, wrap }: { hunks: DiffHunk[]; wrap?: boolean }) => (
  <pre className={'diff-body diff-unified' + (wrap ? ' wrap' : '')} aria-label="Diff">
    {hunks.map((h, hi) => (
      <React.Fragment key={hi}>
        {h.header && (
          <div className="diff-hunk">
            <span className="diff-marker"/>
            <span className="diff-no"/>
            <span className="diff-no"/>
            <span className="diff-code">{h.header}</span>
          </div>
        )}
        {h.lines.map((l, li) => (
          <div key={li} className={'diff-line ' + (l.type || 'ctx')}>
            <span className="diff-marker">{l.type === 'add' ? '+' : l.type === 'del' ? '−' : ' '}</span>
            <span className="diff-no">{l.old != null ? l.old : ''}</span>
            <span className="diff-no">{l.new != null ? l.new : ''}</span>
            <span className="diff-code">{l.code}</span>
          </div>
        ))}
      </React.Fragment>
    ))}
  </pre>
);

const DiffSplit = ({ hunks, wrap }: { hunks: DiffHunk[]; wrap?: boolean }) => {
  // Convert unified hunks into pairs of (left, right) lines
  const pairs = [];
  hunks.forEach((h, hi) => {
    if (h.header) pairs.push({ header: h.header });
    let i = 0;
    while (i < h.lines.length) {
      const l = h.lines[i];
      if (l.type === 'del') {
        // Look ahead for matching add
        let j = i + 1;
        const dels = [l];
        while (j < h.lines.length && h.lines[j].type === 'del') { dels.push(h.lines[j]); j++; }
        const adds = [];
        while (j < h.lines.length && h.lines[j].type === 'add') { adds.push(h.lines[j]); j++; }
        const max = Math.max(dels.length, adds.length);
        for (let k = 0; k < max; k++) {
          pairs.push({ left: dels[k] || null, right: adds[k] || null });
        }
        i = j;
      } else if (l.type === 'add') {
        pairs.push({ left: null, right: l });
        i++;
      } else {
        pairs.push({ left: l, right: l });
        i++;
      }
    }
  });
  return (
    <div className={'diff-body diff-split' + (wrap ? ' wrap' : '')} aria-label="Diff (split view)">
      {pairs.map((p, i) => {
        if (p.header) return (
          <div key={i} className="diff-row diff-hunk-row">
            <div className="diff-side"><span className="diff-code">{p.header}</span></div>
            <div className="diff-side"><span className="diff-code">{p.header}</span></div>
          </div>
        );
        const left = p.left, right = p.right;
        return (
          <div key={i} className="diff-row">
            <div className={'diff-side ' + (left ? (left.type === 'del' ? 'del' : 'ctx') : 'empty')}>
              <span className="diff-no">{left && left.old != null ? left.old : ''}</span>
              <span className="diff-marker">{left ? (left.type === 'del' ? '−' : ' ') : ''}</span>
              <span className="diff-code">{left ? left.code : ''}</span>
            </div>
            <div className={'diff-side ' + (right ? (right.type === 'add' ? 'add' : 'ctx') : 'empty')}>
              <span className="diff-no">{right && right.new != null ? right.new : ''}</span>
              <span className="diff-marker">{right ? (right.type === 'add' ? '+' : ' ') : ''}</span>
              <span className="diff-code">{right ? right.code : ''}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DiffViewer = ({ files, hunks, variant = 'unified', wrap = false }: {
  /** Array of diff file objects — each with path, additions, deletions, and hunks. */
  files?: DiffFile[];
  /** Single-file shorthand: pass hunks directly (renders as a single unnamed file). */
  hunks?: DiffHunk[];
  /** Single-column unified view or side-by-side split view. */
  variant?: 'unified' | 'split';
  /** Wrap long lines instead of enabling horizontal scroll. */
  wrap?: boolean;
}) => {
  // Single-file shorthand: pass hunks directly
  const list = files || (hunks ? [{ path: 'change', hunks }] : []);
  return (
    <div className="diff-viewer">
      {list.map((f, fi) => {
        const adds = f.additions != null ? f.additions
          : f.hunks.reduce((m, h) => m + h.lines.filter(l => l.type === 'add').length, 0);
        const dels = f.deletions != null ? f.deletions
          : f.hunks.reduce((m, h) => m + h.lines.filter(l => l.type === 'del').length, 0);
        return (
          <div key={fi} className="diff-file">
            <div className="diff-file-head">
              <Icons.file size={12}/>
              <span className="diff-path">{f.path}</span>
              <span className="diff-counts">
                <span className="add">+{adds}</span>
                <span className="del">−{dels}</span>
              </span>
            </div>
            {variant === 'split'
              ? <DiffSplit hunks={f.hunks} wrap={wrap}/>
              : <DiffUnified hunks={f.hunks} wrap={wrap}/>}
          </div>
        );
      })}
    </div>
  );
};

export { DiffViewer };
