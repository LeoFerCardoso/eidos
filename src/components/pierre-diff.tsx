'use client';
// Eidos DS — DiffViewer, backed by the real diffs.com engine (@pierre/diffs).
//
// We render Pierre's actual MultiFileDiff (Shiki syntax highlighting, word-level
// intra-line diffs, split/unified, collapsible hunks, annotations) and re-skin
// ONLY the colours and typography to Eidos via the `--diffs-*` custom properties
// on `.pierre-diff` (they inherit through the component's Shadow DOM). See
// `.pierre-diff` in ds.css. Controls live OUTSIDE the diff card, in our own bar.
//
// The library pulls in Shiki, so it's loaded with `next/dynamic({ ssr:false })`:
// it never runs during static generation and ships in this page's chunk only
// (same isolation strategy recharts gets on the chart pages).
import * as React from 'react';
import dynamic from 'next/dynamic';
import type { FileContents } from '@pierre/diffs/react';

// Eidos syntax theme — a Shiki CSS-variables theme whose token colours are the
// Eidos data-viz tokens (`--viz-*`, defined on :root, inherited into the diff's
// Shadow DOM). No hard-coded hex: keyword=violet, fn=ice, string=warning-yellow,
// number/const=teal, comment=faint. Green/red are reserved for add/del, so no
// syntax token uses them (they'd clash with the row tint).
const EIDOS_SYNTAX_DEFAULTS: Record<string, string> = {
  foreground: 'var(--fg)',
  background: 'transparent',
  'token-comment': 'var(--fg-faint)',
  'token-keyword': 'var(--viz-cat-3)',
  'token-function': 'var(--viz-cat-2)',
  'token-string': 'var(--viz-cat-5)',
  'token-string-expression': 'var(--viz-cat-5)',
  'token-constant': 'var(--viz-cat-7)',
  'token-parameter': 'var(--fg)',
  'token-punctuation': 'var(--fg-muted)',
  'token-link': 'var(--viz-cat-2)',
};
let eidosThemeRegistered = false;

// Load Pierre's React entry AND register the Eidos CSS-variables theme before
// the component highlights — both inside the dynamic chunk so Shiki never lands
// in the main bundle and never runs during static generation.
const MultiFileDiff = dynamic(
  async () => {
    const [reactMod, coreMod] = await Promise.all([
      import('@pierre/diffs/react'),
      import('@pierre/diffs'),
    ]);
    if (!eidosThemeRegistered) {
      coreMod.registerCustomCSSVariableTheme('forge', EIDOS_SYNTAX_DEFAULTS);
      eidosThemeRegistered = true;
    }
    return reactMod.MultiFileDiff;
  },
  { ssr: false, loading: () => <div className="pierre-diff-loading">Loading diff…</div> },
);

export type DiffStyle = 'unified' | 'split';
export type DiffIndicators = 'classic' | 'bars' | 'none';
export type HunkSeparators = 'simple' | 'metadata' | 'line-info' | 'line-info-basic';

// Monoline glyphs (currentColor, 1.6px) for the control bar — diff-layout shapes
// the shared Icons set doesn't carry. Kept tiny and local to this control.
const G = ({ d, box = 16 }: { d: React.ReactNode; box?: number }) => (
  <svg width="14" height="14" viewBox={`0 0 ${box} ${box}`} fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
);
const GLYPH = {
  stacked: <G d={<><rect x="2.5" y="3" width="11" height="4" rx="1"/><rect x="2.5" y="9" width="11" height="4" rx="1"/></>}/>,
  split:   <G d={<><rect x="2.5" y="3" width="4.5" height="10" rx="1"/><rect x="9" y="3" width="4.5" height="10" rx="1"/></>}/>,
  bars:    <G d={<><line x1="3.5" y1="3" x2="3.5" y2="13"/><line x1="7" y1="3" x2="7" y2="13"/><line x1="10.5" y1="3" x2="10.5" y2="13"/></>}/>,
  classic: <G d={<><line x1="3" y1="5" x2="9" y2="5"/><line x1="3" y1="11" x2="9" y2="11"/><line x1="6" y1="8" x2="13" y2="8"/></>}/>,
  none:    <G d={<line x1="4" y1="12" x2="12" y2="4"/>}/>,
  wrap:    <G d={<><path d="M3 4h10"/><path d="M3 8h8a2.5 2.5 0 0 1 0 5h-2"/><path d="M5 11l-2 2 2 2"/></>}/>,
  hash:    <G d={<><line x1="6" y1="3" x2="4.5" y2="13"/><line x1="11" y1="3" x2="9.5" y2="13"/><line x1="3" y1="6.5" x2="13" y2="6.5"/><line x1="2.7" y1="9.5" x2="12.7" y2="9.5"/></>}/>,
  bg:      <G d={<><rect x="2.5" y="2.5" width="11" height="11" rx="2"/><line x1="2.5" y1="6" x2="13.5" y2="6"/></>}/>,
};

export interface PierreDiffProps {
  oldFile: FileContents;
  newFile: FileContents;
  diffStyle?: DiffStyle;
  wrap?: boolean;
  indicators?: DiffIndicators;
  lineNumbers?: boolean;
  backgrounds?: boolean;
  hunkSeparators?: HunkSeparators;
  expandUnchanged?: boolean;
  /** Line comment / CI-annotation framework. Each: { side, lineNumber, metadata }. */
  lineAnnotations?: any[];
  renderAnnotation?: (annotation: any) => React.ReactNode;
  /** Render the live diffs.com-style control bar (the viewer owns that state). */
  toolbar?: boolean;
  /** Shiki theme for syntax tokens — defaults to the Eidos data-viz theme. */
  theme?: string;
}

export function PierreDiff({
  oldFile, newFile,
  diffStyle = 'unified', wrap = false, indicators = 'bars',
  lineNumbers = true, backgrounds = true,
  hunkSeparators, expandUnchanged,
  lineAnnotations, renderAnnotation,
  toolbar = false, theme = 'forge',
}: PierreDiffProps) {
  const [style, setStyle] = React.useState<DiffStyle>(diffStyle);
  const [ind, setInd] = React.useState<DiffIndicators>(indicators);
  const [wrapOn, setWrapOn] = React.useState(wrap);
  const [nums, setNums] = React.useState(lineNumbers);
  const [bg, setBg] = React.useState(backgrounds);

  const v = toolbar ? style : diffStyle;
  const i = toolbar ? ind : indicators;
  const w = toolbar ? wrapOn : wrap;
  const n = toolbar ? nums : lineNumbers;
  const b = toolbar ? bg : backgrounds;

  return (
    <div className="pierre-diff">
      {toolbar && (
        <div className="pierre-diff-bar" role="group" aria-label="Diff display options">
          <div className="pdb-seg" role="group" aria-label="Layout">
            <button type="button" className={'pdb-btn' + ((v as string) === 'stacked' || v === 'unified' ? ' is-active' : '')}
              aria-pressed={v === 'unified'} onClick={() => setStyle('unified')}>{GLYPH.stacked}Stacked</button>
            <button type="button" className={'pdb-btn' + (v === 'split' ? ' is-active' : '')}
              aria-pressed={v === 'split'} onClick={() => setStyle('split')}>{GLYPH.split}Split</button>
          </div>
          <div className="pdb-seg" role="group" aria-label="Change indicators">
            <button type="button" className={'pdb-btn' + (i === 'bars' ? ' is-active' : '')}
              aria-pressed={i === 'bars'} onClick={() => setInd('bars')}>{GLYPH.bars}Bars</button>
            <button type="button" className={'pdb-btn' + (i === 'classic' ? ' is-active' : '')}
              aria-pressed={i === 'classic'} onClick={() => setInd('classic')}>{GLYPH.classic}Classic</button>
            <button type="button" className={'pdb-btn' + (i === 'none' ? ' is-active' : '')}
              aria-pressed={i === 'none'} onClick={() => setInd('none')}>{GLYPH.none}None</button>
          </div>
          <button type="button" className={'pdb-toggle' + (w ? ' is-on' : '')} aria-pressed={w} onClick={() => setWrapOn((x) => !x)}>
            {GLYPH.wrap}<span>Wrapping</span><span className="pdb-switch" aria-hidden/>
          </button>
          <button type="button" className={'pdb-toggle' + (n ? ' is-on' : '')} aria-pressed={n} onClick={() => setNums((x) => !x)}>
            {GLYPH.hash}<span>Line numbers</span><span className="pdb-switch" aria-hidden/>
          </button>
          <button type="button" className={'pdb-toggle' + (b ? ' is-on' : '')} aria-pressed={b} onClick={() => setBg((x) => !x)}>
            {GLYPH.bg}<span>Backgrounds</span><span className="pdb-switch" aria-hidden/>
          </button>
        </div>
      )}
      <div className="pierre-diff-surface">
        <MultiFileDiff
          oldFile={oldFile}
          newFile={newFile}
          lineAnnotations={lineAnnotations}
          renderAnnotation={renderAnnotation}
          options={{
            diffStyle: (v as string) === 'stacked' ? 'unified' : v,
            overflow: w ? 'wrap' : 'scroll',
            diffIndicators: i,
            disableLineNumbers: !n,
            disableBackground: !b,
            ...(hunkSeparators ? { hunkSeparators } : {}),
            ...(expandUnchanged != null ? { expandUnchanged } : {}),
            theme,
          }}
        />
      </div>
    </div>
  );
}
