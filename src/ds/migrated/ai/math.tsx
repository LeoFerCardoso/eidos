'use client';
// Forge AI — TeX / math in replies via KaTeX → MathView (§2.2 standard).
// Import KaTeX CSS at the page level so Next bundles it into this page's chunk.
// KaTeX renderToString is dynamic-imported inside useEffect — it accesses the
// DOM for measurement and must not run at build time.
import 'katex/dist/katex.min.css';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, AutoPropsTable, installTabs, Lede, MathView, Prose, Skeleton, Mono, Alert, AlertTitle, AlertDescription } from '@/ds/core';

// AI-page inline style convention

// ── KaTeX rendering hook ──────────────────────────────────────────────────────
// Tracks three real states a math surface can be in while rendering streamed
// model output: 'loading' (KaTeX chunk not resolved yet), 'ready' (valid TeX
// rendered to HTML), and 'error' (malformed TeX — throwOnError:false means
// KaTeX returns an error string rather than throwing, so we surface it as a
// real, labelled fallback instead of an endless skeleton).
type KatexState =
  | { status: 'loading'; html: null; error: null }
  | { status: 'ready'; html: string; error: null }
  | { status: 'error'; html: null; error: string };

function useKatex(tex: string, display = false): KatexState {
  const [state, setState] = React.useState<KatexState>({ status: 'loading', html: null, error: null });
  React.useEffect(() => {
    let active = true;
    setState({ status: 'loading', html: null, error: null });
    import('katex').then((k) => {
      if (!active) return;
      try {
        // throwOnError:true makes KaTeX throw a ParseError on malformed TeX,
        // which we catch to drive the explicit 'error' state (instead of the
        // silent error-string that throwOnError:false would inline). Either is
        // valid — the contract is that a parse failure becomes a visible
        // fallback, never a blank gap.
        const rendered = k.default.renderToString(tex, { displayMode: display, throwOnError: true });
        setState({ status: 'ready', html: rendered, error: null });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid TeX';
        setState({ status: 'error', html: null, error: message });
      }
    });
    return () => { active = false; };
  }, [tex, display]);
  return state;
}

// ── Reusable parse-error fallback (role="alert") ─────────────────────────────
// The DS contract: malformed model TeX must degrade to readable text, never a
// blank space or raw symbol soup. Surfaces the offending source verbatim so a
// developer can see exactly what the model produced.
function MathError({ tex }: { tex: string }) {
  return (
    <Alert tone="danger" style={{ maxWidth: 560 }}>
      <AlertTitle>Equation could not be rendered</AlertTitle>
      <AlertDescription>
        The TeX source was malformed. Falling back to the raw source so the reply is never blank:{' '}
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--danger-text)', fontVariantNumeric: 'tabular-nums' }}>{tex}</code>
      </AlertDescription>
    </Alert>
  );
}

// ── inline placeholder while the KaTeX chunk resolves ────────────────────────
function InlineSkel({ width }: { width: number }) {
  return <span className="ai-skel-line" style={{ display: 'inline-block', width, height: '0.9em', verticalAlign: 'middle' }} aria-hidden="true"/>;
}

// ── Demo: inline math in a sentence ──────────────────────────────────────────
function InlineMathDemo() {
  const e = useKatex('E = mc^2');
  const p = useKatex('p = mv');
  const c = useKatex('c \\approx 3 \\times 10^8 \\text{ m/s}');

  return (
    <Prose style={{ maxWidth: 580 }}>
      <p>
        Einstein's mass–energy equivalence {e.status === 'ready'
          ? <MathView html={e.html} aria-label="E equals m c squared"/>
          : <InlineSkel width={60}/>
        } describes the relationship between mass and energy, where{' '}
        {c.status === 'ready'
          ? <MathView html={c.html} aria-label="c is approximately 3 times 10 to the 8 meters per second"/>
          : <InlineSkel width={120}/>
        } is the speed of light. Similarly, momentum is {p.status === 'ready'
          ? <MathView html={p.html} aria-label="p equals m v"/>
          : <InlineSkel width={40}/>
        } where <em>v</em> is velocity.
      </p>
    </Prose>
  );
}

// ── Demo: display (block) equations ──────────────────────────────────────────
function DisplayMathDemo() {
  const fraction = useKatex('\\frac{d}{dx}\\left(\\frac{f(x)}{g(x)}\\right) = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}', true);
  const sum      = useKatex('\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}', true);
  const matrix   = useKatex('\\mathbf{A} = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad \\det(\\mathbf{A}) = ad - bc', true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%', maxWidth: 600 }}>
      {fraction.status === 'ready'
        ? <MathView display html={fraction.html} aria-label="Quotient rule: derivative of f over g equals f prime g minus f g prime, all over g squared"/>
        : <Skeleton lines={2}/>
      }
      {sum.status === 'ready'
        ? <MathView display html={sum.html} aria-label="Sum from k equals 1 to n of k equals n times n plus 1 over 2"/>
        : <Skeleton lines={2}/>
      }
      {matrix.status === 'ready'
        ? <MathView display html={matrix.html} aria-label="Matrix A with entries a b c d, determinant equals a d minus b c"/>
        : <Skeleton lines={2}/>
      }
    </div>
  );
}

// ── Demo: math inside Prose reply ─────────────────────────────────────────────
function ProseWithMathDemo() {
  const bayes    = useKatex('P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}', true);
  const inline   = useKatex('P(A \\mid B)');
  const prior    = useKatex('P(A)');

  return (
    <Prose style={{ maxWidth: 600 }}>
      <h3>Bayes' theorem</h3>
      <p>
        Bayes' theorem states that the conditional probability {inline.status === 'ready'
          ? <MathView html={inline.html} aria-label="P of A given B"/>
          : <InlineSkel width={60}/>
        } is computed from the likelihood, the prior {prior.status === 'ready'
          ? <MathView html={prior.html} aria-label="P of A"/>
          : <InlineSkel width={30}/>
        }, and the evidence:
      </p>
      {bayes.status === 'ready'
        ? <MathView display html={bayes.html} aria-label="P of A given B equals P of B given A times P of A, divided by P of B"/>
        : <Skeleton lines={3}/>
      }
      <p>
        This is the foundation of probabilistic reasoning — update your belief about <em>A</em> after observing evidence <em>B</em>.
      </p>
    </Prose>
  );
}

// ── Demo: the three render states, side by side (FUNCTION) ────────────────────
// Loading (chunk pending) · Rendered (valid TeX) · Parse error (malformed TeX
// from the model). All three are real outputs of the same useKatex hook.
function stateLabel(text: string, dot: string) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-3)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flex: '0 0 auto' }} aria-hidden="true"/>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>{text}</span>
    </div>
  );
}

function StatesDemo() {
  // A real valid equation, rendered through the live hook.
  const ok = useKatex('\\int_0^1 x^2 \\, dx = \\tfrac{1}{3}', true);
  // A real malformed source — \frac with a missing brace — drives the error path.
  const bad = useKatex('\\frac{a}{', true);

  return (
    <div className="ds-grid cols-3" style={{ width: '100%', gap: 'var(--space-4)' }}>
      <div className="surface" style={{ padding: 'var(--space-4)' }}>
        {stateLabel('Loading', 'var(--fg-faint)')}
        <Skeleton lines={2}/>
        <div style={{ marginBlockStart: 'var(--space-3)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
          The KaTeX chunk is still resolving. A <Mono>Skeleton</Mono> holds the line height so the reply does not reflow when the equation lands.
        </div>
      </div>
      <div className="surface" style={{ padding: 'var(--space-4)' }}>
        {stateLabel('Rendered', 'var(--success)')}
        {ok.status === 'ready'
          ? <MathView display html={ok.html} aria-label="Integral from 0 to 1 of x squared dx equals one third"/>
          : <Skeleton lines={2}/>
        }
        <div style={{ marginBlockStart: 'var(--space-3)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
          Valid TeX renders to the <Mono>.ai-math</Mono> surface with <Mono>role="math"</Mono> and the supplied <Mono>aria-label</Mono>.
        </div>
      </div>
      <div className="surface" style={{ padding: 'var(--space-4)' }}>
        {stateLabel('Parse error', 'var(--danger)')}
        {bad.status === 'error'
          ? <MathError tex={'\\frac{a}{'}/>
          : <Skeleton lines={2}/>
        }
        <div style={{ marginBlockStart: 'var(--space-3)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
          Malformed model TeX falls back to a <Mono>role="alert"</Mono> box with the raw source — never a blank gap.
        </div>
      </div>
    </div>
  );
}

// ── Innovation: streamed-TeX render lifecycle ────────────────────────────────
// On-thesis micro-interaction: the model "streams" a malformed fraction, the
// surface shows the parse-error fallback, then the corrected token arrives and
// the equation snaps in — exactly the loading→error→ready path math output
// takes in production. Honors prefers-reduced-motion by skipping the timed
// hand-off and rendering the final equation immediately.
const LIFECYCLE_STEPS = [
  { tex: '', status: 'loading' as const, caption: 'Model is generating…' },
  { tex: '\\frac{n!}{k!(n-k)', status: 'error' as const, caption: 'Token stream is mid-fraction — TeX is temporarily invalid' },
  { tex: '\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}', status: 'final' as const, caption: 'Final token landed — equation renders' },
];

function LifecycleDemo() {
  const [step, setStep] = React.useState(0);
  const reduced = React.useRef(false);

  React.useEffect(() => {
    reduced.current = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) { setStep(LIFECYCLE_STEPS.length - 1); return; }
    if (step >= LIFECYCLE_STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1400);
    return () => clearTimeout(t);
  }, [step]);

  const current = LIFECYCLE_STEPS[step];
  const live = useKatex(current.tex || '\\,', true);
  const isFinal = current.status === 'final';

  const replay = () => setStep(0);

  return (
    <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div
        aria-live="polite"
        aria-busy={!isFinal}
        style={{ minHeight: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface)' }}
      >
        {current.status === 'loading' && <Skeleton lines={2}/>}
        {current.status === 'error' && <MathError tex={current.tex}/>}
        {isFinal && (live.status === 'ready'
          ? <MathView display html={live.html} aria-label="n choose k equals n factorial over k factorial times n minus k factorial"/>
          : <Skeleton lines={2}/>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', color: 'var(--fg-subtle)', fontVariantNumeric: 'tabular-nums' }}>
          step {step + 1}/{LIFECYCLE_STEPS.length} — {current.caption}
        </span>
        <button type="button" className="btn ghost xs" onClick={replay}>
          <Icons.refresh size={12} aria-hidden="true"/> Replay
        </button>
      </div>
    </div>
  );
}

// ── Demo: math inside a real assistant reply (In context) ────────────────────
function InContextDemo() {
  const variance = useKatex('\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2', true);
  const inline   = useKatex('\\bar{x}');

  return (
    <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* User question */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--ember-soft)', border: '1px solid var(--ember-border)', borderRadius: 12, borderEndEndRadius: 4, color: 'var(--fg)', fontSize: 'var(--text-md)', lineHeight: 1.55, maxWidth: '70%' }}>
          How is sample variance computed?
        </div>
      </div>
      {/* Assistant reply */}
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', border: '1px solid var(--ember-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Icons.sparkle size={16} style={{ color: 'var(--ember)' }}/>
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>FORGE STATS AGENT</span>
          <Prose style={{ maxWidth: 560 }}>
            <p>
              Sample variance measures how far each value sits from the mean {inline.status === 'ready'
                ? <MathView html={inline.html} aria-label="x bar"/>
                : <InlineSkel width={20}/>
              }. Square every deviation, average them, and you get:
            </p>
            {variance.status === 'ready'
              ? <MathView display html={variance.html} aria-label="sigma squared equals one over n times the sum from i equals 1 to n of x sub i minus x bar, squared"/>
              : <Skeleton lines={2}/>
            }
            <p>For an unbiased estimator on a sample, divide by <code>n − 1</code> instead of <code>n</code> (Bessel's correction).</p>
          </Prose>
        </div>
      </div>
    </div>
  );
}

// ── code snippets ─────────────────────────────────────────────────────────────
const WIRE_INLINE = `import 'katex/dist/katex.min.css'; // at the top of your page file
import { MathView } from '@/ds/core';

type S =
  | { status: 'loading' }
  | { status: 'ready'; html: string }
  | { status: 'error'; tex: string };

function InlineMath({ tex, label }: { tex: string; label: string }) {
  const [s, setS] = React.useState<S>({ status: 'loading' });
  React.useEffect(() => {
    let active = true;
    setS({ status: 'loading' });
    import('katex').then((k) => {
      if (!active) return;
      try {
        const html = k.default.renderToString(tex, { throwOnError: true });
        setS({ status: 'ready', html });
      } catch {
        setS({ status: 'error', tex }); // malformed model TeX
      }
    });
    return () => { active = false; };
  }, [tex]);

  if (s.status === 'ready') return <MathView html={s.html} aria-label={label}/>;
  if (s.status === 'error') return <code>{tex}</code>; // never a blank gap
  return null; // or an inline skeleton while loading
}`;

const WIRE_DISPLAY = `import 'katex/dist/katex.min.css';
import { MathView, Skeleton, Alert, AlertTitle, AlertDescription } from '@/ds/core';

function DisplayMath({ tex, label }: { tex: string; label: string }) {
  const [s, setS] = React.useState<
    { status: 'loading' } | { status: 'ready'; html: string } | { status: 'error' }
  >({ status: 'loading' });

  React.useEffect(() => {
    let active = true;
    setS({ status: 'loading' });
    import('katex').then((k) => {
      if (!active) return;
      try {
        const html = k.default.renderToString(tex, {
          displayMode: true,
          throwOnError: true,
        });
        setS({ status: 'ready', html });
      } catch {
        setS({ status: 'error' });
      }
    });
    return () => { active = false; };
  }, [tex]);

  if (s.status === 'loading') return <Skeleton lines={2}/>;
  if (s.status === 'error') {
    return (
      <Alert tone="danger">
        <AlertTitle>Equation could not be rendered</AlertTitle>
        <AlertDescription><code>{tex}</code></AlertDescription>
      </Alert>
    );
  }
  return <MathView display html={s.html} aria-label={label}/>;
}`;

export default function AiMath() {
  return (
    <Section
      id="math"
      num="09"
      title="Math"
      desc="Render TeX equations in AI replies using KaTeX and the MathView surface. Inline equations sit within sentences; display equations stand on their own line, centered and larger."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-math')} ariaLabel="package manager"/>
      <Lede>The DS ships the styled slot; KaTeX is dynamic-imported inside useEffect so it never runs at build time.</Lede>
      <Lede>
        Ships <Mono>MathView</Mono> (the <Mono>.ai-math</Mono> surface — inline or block, with <Mono>role="math"</Mono>). The DS does not bundle KaTeX — install <Mono>katex</Mono> in your app and dynamic-import its renderer inside <Mono>useEffect</Mono>. Import <Mono>katex/dist/katex.min.css</Mono> at the top of the page file so Next bundles the stylesheet into this page's chunk.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="MathView — inline equation in flowing prose" height={180}>
        <InlineMathDemo/>
      </Frame>
      <Lede>
        Each equation is rendered to an HTML string by <Mono>katex.renderToString()</Mono> inside <Mono>useEffect</Mono>, then passed to <Mono>{'<MathView html={…}/>'}</Mono>. A <Mono>Skeleton</Mono> or null holds the space before mount.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginBlockStart: 'var(--space-10)', marginBlockEnd: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* DISPLAY EQUATIONS */}
      <SubHead meta="block equations">Display mode</SubHead>
      <Frame label="displayMode=true — fraction · summation · matrix, each on its own line" height={360}>
        <DisplayMathDemo/>
      </Frame>
      <Lede>
        Pass <Mono>display</Mono> to <Mono>MathView</Mono> and <Mono>{'displayMode: true'}</Mono> to KaTeX for block equations. The DS renders them centered with increased spacing above and below, matching the KaTeX block convention.
      </Lede>

      {/* MATH IN PROSE */}
      <SubHead meta="inside a reply">Math in prose</SubHead>
      <Frame label="Prose reply with inline + display math — Bayes theorem explanation" height={460}>
        <ProseWithMathDemo/>
      </Frame>
      <Lede>
        Mix inline and display math freely inside <Mono>{'<Prose>'}</Mono>. Inline equations sit on the text baseline; display equations break out on their own line. The 68ch prose cap still applies to body text — display math is not constrained by it and may be wider.
      </Lede>

      {/* STATES */}
      <SubHead meta="loading · rendered · error">States</SubHead>
      <Frame label="The three real outputs of useKatex — every one is a live render" height={300}>
        <StatesDemo/>
      </Frame>
      <Lede>
        Math from a model is never guaranteed to be valid. The hook resolves to one of three states: a <Mono>Skeleton</Mono> while the KaTeX chunk loads, the rendered surface for valid TeX, or — because partial or hallucinated output is common — a <Mono>role="alert"</Mono> fallback that prints the raw source. The contract is that a malformed equation degrades to readable text, never a blank gap.
      </Lede>

      {/* INNOVATION — STREAMED RENDER LIFECYCLE */}
      <SubHead meta="streamed render — watch it land">Render lifecycle</SubHead>
      <Frame label="A streamed equation passes through loading → temporarily-invalid → rendered" height={260}>
        <LifecycleDemo/>
      </Frame>
      <Lede>
        As tokens stream in, an equation's TeX is transiently malformed — a half-typed <Mono tone="subtle">{'\\frac{n!}{k!(n-k)'}</Mono> has no closing brace. The surface shows the parse-error fallback for those frames, then snaps to the finished <Mono tone="subtle">{'\\binom{n}{k}'}</Mono> the moment the last token lands. The region is <Mono>aria-live="polite"</Mono> with <Mono>aria-busy</Mono> until settled, and under <Mono>prefers-reduced-motion</Mono> the hand-off is skipped — the final equation renders immediately.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="assistant turn — inline + display math inside a streamed reply" height={420}>
        <InContextDemo/>
      </Frame>
      <Lede>
        In a real reply, inline math rides the sentence baseline while the headline equation breaks out on its own centered line. The agent eyebrow and avatar are mono/ember chrome from the AI shell; the math is plain <Mono>MathView</Mono> — no special wrapper needed inside <Mono>{'<Prose>'}</Mono>.
      </Lede>

      {/* WIRING IT UP */}
      <SubHead meta="consumer pattern — inline">Wiring it up — inline</SubHead>
      <CodeBlock
        label="useEffect + KaTeX renderToString → MathView (inline)"
        lang="tsx"
        code={WIRE_INLINE}
      />

      <SubHead meta="consumer pattern — display">Wiring it up — display</SubHead>
      <CodeBlock
        label="displayMode: true → <MathView display html={html}/>"
        lang="tsx"
        code={WIRE_DISPLAY}
      />
      <Lede>
        Two invariants: (1) always dynamic-import KaTeX inside <Mono>useEffect</Mono> — it may access the DOM for measurement and must not run at build time; (2) always handle the error path — model output often contains malformed TeX, so wrap <Mono>renderToString</Mono> in <Mono>try/catch</Mono> (or pass <Mono>throwOnError: false</Mono>) and render a readable fallback. Never let a parse failure leave a blank gap or crash the reply.
      </Lede>

      <SubHead meta="dependency note">Dependency</SubHead>
      <CodeBlock
        label="KaTeX is not bundled by Forge — add it to your app"
        lang="bash"
        code={`pnpm add katex
# or
npm install katex`}
      />
      <Lede>
        KaTeX is kept out of the Forge core so it does not inflate every page's bundle. It only loads on pages that use <Mono>MathView</Mono>. The CSS import at the page top ensures KaTeX's glyph and symbol styles are available without a separate link tag.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 'var(--space-3)' }}>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBlockEnd: 'var(--space-3)' }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockEnd: 'var(--space-3)' }}>
            <code style={{ fontFamily: 'var(--font-mono)' }}>MathView</code> is reading content, not a control — the rendered KaTeX output adds no Tab stops. The only focusable elements in a math surface are the controls you place around it (a copy button, the <em>Replay</em> control in the lifecycle demo above):
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-2) var(--space-4)', margin: 0, fontSize: 'var(--text-base)' }}>
            <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', alignSelf: 'center' }}>Tab</dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>Move to the next surrounding control (skips the equation glyphs).</dd>
            <dt style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', alignSelf: 'center' }}>Enter / Space</dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>Activate the focused control (copy, replay) — each shows a visible focus ring.</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBlockEnd: 'var(--space-3)' }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <code style={{ fontFamily: 'var(--font-mono)' }}>MathView</code> sets <code style={{ fontFamily: 'var(--font-mono)' }}>role="math"</code> on the wrapper. Always provide an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> with a plain-English reading ("E equals m c squared") — screen readers do not parse MathML or TeX. Without one the rendered KaTeX is announced as raw character soup. The streamed lifecycle region is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> + <code style={{ fontFamily: 'var(--font-mono)' }}>aria-busy</code> so the settled equation is announced once, not on every frame.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBlockEnd: 'var(--space-3)' }}>Text alternative &amp; errors</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            For complex display equations a short prose fallback in the surrounding paragraph helps every user, not just AT users. When TeX is malformed, the parse-error fallback is a <code style={{ fontFamily: 'var(--font-mono)' }}>role="alert"</code> region that reads the failure and prints the raw source — never a silent blank. Never render math as an image (<code style={{ fontFamily: 'var(--font-mono)' }}>&lt;img src="formula.png"/&gt;</code>): it degrades at zoom and has no accessible text.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBlockEnd: 'var(--space-3)' }}>Contrast &amp; motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            KaTeX glyphs inherit <code style={{ fontFamily: 'var(--font-mono)' }}>currentColor</code>, so on the DS dark surface they resolve to AA-contrast light ink automatically; verify the result if you place math on a coloured fill. Rendering is static — the only motion is the optional streamed hand-off, which <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> skips entirely so the final equation appears instantly with no flicker.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — prose text direction flips; math equations remain LTR" height={240}>
        <div dir="rtl" style={{ width: '100%' }}>
          <InlineMathDemo/>
        </div>
      </Frame>
      <Lede>
        The surrounding prose flips to right-to-left under <Mono>dir="rtl"</Mono>. Math equations themselves remain left-to-right — this is the international convention for mathematical notation regardless of the surrounding text direction. KaTeX renders LTR glyphs; <Mono>MathView</Mono> uses <Mono>unicode-bidi: isolate</Mono> to prevent the RTL context from reordering math characters.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              <Prose style={{ maxWidth: 520 }}>
                <p style={{ marginBottom: 12 }}>
                  The equation{' '}
                  <span className="ai-math" role="math" style={{ fontStyle: 'italic' }}>E = mc²</span>
                  {' '}relates mass to energy.
                </p>
                <div className="ai-math block" role="math" style={{ textAlign: 'center', padding: '16px 0', fontSize: 'var(--text-lg)', letterSpacing: '0.04em' }}>
                  ∑ k = n(n+1)/2
                </div>
              </Prose>
              {/* pins */}
              <span className="lead h" style={{ top: 14, right: -32, width: 28 }}/>
              <span className="lead v" style={{ top: -22, left: 80, height: 18 }}/>
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ top: 6, right: -56 }}>1</div>
              <div className="pin" style={{ top: -42, left: 80, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Inline math.</b> <Mono>{'<MathView html={…}/>'}</Mono> — sits on the text baseline, inherits the prose font size. Wraps with <Mono>unicode-bidi: isolate</Mono> so RTL context does not reorder glyphs.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>role="math".</b> Present on every <Mono>MathView</Mono>. Always pair with <Mono>aria-label</Mono> — the rendered KaTeX HTML is not intelligible to screen readers without it.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Display math.</b> <Mono>{'<MathView display html={…}/>'}</Mono> — block element, centered, rendered with KaTeX's <Mono>displayMode: true</Mono>. Has more vertical breathing room than inline, and may be wider than the prose 68ch cap.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — provide an accessible aria-label</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              {'<MathView html={html}'}<br/>
              {'  aria-label="E equals m c squared"/>'}
            </div>
          </div>
          <div className="note">A plain-English description of the equation is the only accessible text for AT users. Without it, screen readers announce raw symbol names from the KaTeX HTML.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — render math as an image</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--danger)', lineHeight: 1.6 }}>
              {'<img src="formula.png"'}<br/>
              {'  alt="E=mc2"/>'}
            </div>
          </div>
          <div className="note">An image formula degrades at high zoom, cannot be copied or reflowed, and the alt text is rarely as complete as an aria-label on a MathView. Use KaTeX.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — dynamic-import KaTeX in useEffect</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              React.useEffect(() ={'>'} {'{'}<br/>
              {'  '}import('katex').then(…)<br/>
              {'}'}, [tex]);
            </div>
          </div>
          <div className="note">KaTeX may access the DOM. A dynamic import inside useEffect ensures it only runs on the client, after mount — safe for Next.js App Router.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use displayMode for inline equations</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--danger)', lineHeight: 1.6 }}>
              {'// inline sentence then:'}<br/>
              {'<MathView display html={…}/>  ← breaks layout'}<br/>
              {'// rest of sentence continues'}
            </div>
          </div>
          <div className="note">Display mode renders a block element. Using it mid-sentence breaks the line and the paragraph layout. Use inline mode (no display prop) for equations in flowing text.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="MathViewProps">API reference</SubHead>
      <AutoPropsTable component="MathView" label="<MathView />"/>
      <Lede>
        The DS provides the surface — <Mono>MathView</Mono>. Consumers own the KaTeX integration: <Mono>pnpm add katex</Mono>, import <Mono>katex/dist/katex.min.css</Mono> at the page top, then copy the <Mono>useKatex</Mono> hook pattern from "Wiring it up" above. The DS never bundles KaTeX.
      </Lede>
    </Section>
  );
}
