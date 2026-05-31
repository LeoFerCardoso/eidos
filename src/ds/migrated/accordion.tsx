'use client';
// Eidos DS — Components / Accordion
// Vertically stacked expandable rows. Compound API: <Accordion> wraps
// <AccordionItem>, <AccordionTrigger>, and <AccordionContent>.
import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  installTabs,
  Lede,
  Mono,
  AutoPropsTable,
} from '@/ds/core';

// ── Sample data ───────────────────────────────────────────────────────────────

const FAQ = [
  {
    value: 'q1',
    q: 'Is Eidos a component library or a design system?',
    a: 'A design system. The components are the most visible surface, but the tokens, type scale, motion curves, and copy voice are what hold it together.',
  },
  {
    value: 'q2',
    q: 'Can I use Eidos with my own framework?',
    a: 'Yes. Tokens ship as plain CSS variables; the Tailwind preset is opt-in. The React examples on this site are for demonstration — copy them into your stack of choice.',
  },
  {
    value: 'q3',
    q: 'What about RTL languages?',
    a: 'Supported via CSS logical properties. Set dir="rtl" on a parent and the layout flips. See the RTL page in Get Started for the full contract and known gaps.',
  },
  {
    value: 'q4',
    q: 'Where do I report a missing component?',
    a: 'Open an issue in the Eidos platform repo. The catalog grows as the product grows.',
  },
];

const SHIPPING = [
  {
    value: 's1',
    q: 'Standard delivery — 3 to 5 business days',
    a: 'Free on orders over $50. Ships from the closest fulfillment center to the delivery address. Tracking emailed once the carrier scans.',
  },
  {
    value: 's2',
    q: 'Express delivery — next business day',
    a: 'Available on most orders placed before 2pm local time. $14.95 flat. Saturday delivery in metro areas.',
  },
  {
    value: 's3',
    q: 'International — 7 to 14 business days',
    a: 'Duties and taxes are calculated at checkout. Some countries have restricted SKUs flagged at the cart level.',
  },
];

// Deep-linkable help topics — each `value` doubles as a URL fragment (#faq-<id>).
const HELP = [
  {
    value: 'install',
    q: 'How do I install a Eidos component?',
    a: 'Run the add command for the component slug — it copies the source straight into your repo. There is no runtime package to track; you own the files from that point on.',
  },
  {
    value: 'theming',
    q: 'How do I theme the tokens?',
    a: 'Override the CSS custom properties on :root (or a scoped container). Every component reads from --bg, --fg, --surface, --border, and the single --ember accent, so a theme is a handful of variable assignments.',
  },
  {
    value: 'updates',
    q: 'How do I pull component updates?',
    a: 'Re-run the add command — it diffs against your copy and shows what changed before overwriting, so local edits are never silently lost.',
  },
];

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/forge/accordion"

export function Demo() {
  return (
    <Accordion type="single" defaultValue="q1" collapsible>
      <AccordionItem value="q1">
        <AccordionTrigger>Is Eidos a component library or a design system?</AccordionTrigger>
        <AccordionContent>A design system — tokens, type scale, motion curves, copy voice.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Can I use Eidos with my own framework?</AccordionTrigger>
        <AccordionContent>Yes. Tokens ship as CSS variables; the Tailwind preset is opt-in.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`;

// ── Interactive wrappers (stateful) ───────────────────────────────────────────

function SingleDemo({ items, variant }: { items: typeof FAQ; variant?: 'default' | 'ghost' }) {
  const [value, setValue] = React.useState<string>(items[0].value);
  return (
    <Accordion type="single" value={value} onValueChange={(v) => setValue(v as string)} collapsible variant={variant}>
      {items.map(({ value: v, q, a }) => (
        <AccordionItem key={v} value={v}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent><p>{a}</p></AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function MultipleDemo({ items }: { items: typeof SHIPPING }) {
  const [value, setValue] = React.useState<string[]>([items[0].value, items[1].value]);
  return (
    <Accordion type="multiple" value={value} onValueChange={(v) => setValue(v as string[])}>
      {items.map(({ value: v, q, a }) => (
        <AccordionItem key={v} value={v}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent><p>{a}</p></AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function RTLDemo() {
  const [value, setValue] = React.useState<string>('r1');
  return (
    <div dir="rtl" style={{ width: '100%', maxWidth: 640 }}>
      <Accordion type="single" value={value} onValueChange={(v) => setValue(v as string)} collapsible>
        <AccordionItem value="r1">
          <AccordionTrigger>هل فورج مكتبة مكونات أم نظام تصميم؟</AccordionTrigger>
          <AccordionContent>
            <p>نظام تصميم. المكونات هي الواجهة الأكثر وضوحاً، لكن الرموز ومقاييس الخط ومنحنيات الحركة هي ما يجمعها معاً.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="r2">
          <AccordionTrigger>هل يمكنني استخدام فورج مع إطار العمل الخاص بي؟</AccordionTrigger>
          <AccordionContent>
            <p>نعم. تُشحن الرموز كمتغيرات CSS عادية، وإعداد Tailwind اختياري. أمثلة React هنا للعرض فقط.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="r3">
          <AccordionTrigger>ماذا عن لغات RTL؟</AccordionTrigger>
          <AccordionContent>
            <p>مدعومة عبر خصائص CSS المنطقية. عيّن dir="rtl" على عنصر أب وستنقلب التخطيطات.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Deep-linkable FAQ — the open row follows the URL fragment (#faq-<id>) both
// ways: arriving on a hash opens + scrolls to that row; opening a row writes
// the hash so the state is shareable. Honours prefers-reduced-motion.
function DeepLinkFAQ() {
  const PREFIX = 'faq-';
  const fromHash = React.useCallback(() => {
    if (typeof window === 'undefined') return '';
    const h = window.location.hash.replace('#', '');
    return h.startsWith(PREFIX) ? h.slice(PREFIX.length) : '';
  }, []);

  const [value, setValue] = React.useState<string>('');
  const [copied, setCopied] = React.useState<string>('');
  const rowRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  const reveal = React.useCallback((v: string, scroll: boolean) => {
    setValue(v);
    if (!scroll || !v) return;
    const el = rowRefs.current.get(v);
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }, []);

  // Open the row matching the URL fragment on mount and whenever the hash changes.
  React.useEffect(() => {
    const apply = () => {
      const v = fromHash();
      if (v && HELP.some((h) => h.value === v)) reveal(v, true);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [fromHash, reveal]);

  const onToggle = (v: string) => {
    const next = value === v ? '' : v;
    reveal(next, false);
    // Reflect the open row in the URL fragment without adding history entries.
    const url = next ? `#${PREFIX}${next}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
  };

  const copyLink = async (v: string) => {
    const link = `${window.location.origin}${window.location.pathname}#${PREFIX}${v}`;
    try {
      await navigator.clipboard?.writeText(link);
    } catch {
      /* clipboard blocked — the hash is still set, so the address bar is shareable */
    }
    window.history.replaceState(null, '', `#${PREFIX}${v}`);
    setCopied(v);
    window.setTimeout(() => setCopied((c) => (c === v ? '' : c)), 1600);
  };

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Accordion type="single" value={value} onValueChange={(v) => onToggle(v as string)} collapsible>
        {HELP.map(({ value: v, q, a }) => (
          <AccordionItem
            key={v}
            value={v}
            ref={(el) => {
              if (el) rowRefs.current.set(v, el);
              else rowRefs.current.delete(v);
            }}
          >
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent>
              <p>{a}</p>
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => copyLink(v)}
                style={{ marginBlockStart: 4, gap: 6 }}
              >
                <Icons.link size={13} aria-hidden="true" />
                {copied === v ? 'Link copied' : 'Copy link to this answer'}
              </button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <Section
      id="accordion"
      num="16"
      title="Accordion"
      desc="Vertically stacked rows, each expandable. Use it to compress dense content the user can skim selectively — FAQs, settings groups, product specs."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('accordion')} ariaLabel="package manager" />
      <Lede>
        Keyboard-correct WAI-ARIA semantics (<Mono>button</Mono> headers, <Mono>aria-expanded</Mono>, region panels) are built in — plain React over the Eidos CSS layer, no Radix runtime. Pick the <em>Manual</em> tab to paste the source files instead.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <SingleDemo items={FAQ.slice(0, 2)} />
        </div>
      </Frame>

      {/* 3. EXAMPLES — divider eyebrow */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Variants: single */}
      <SubHead meta="single open">Default — single</SubHead>
      <Frame
        label="one row open at a time"
        code={`<Accordion type="single" defaultValue="q1" collapsible>
  <AccordionItem value="q1">
    <AccordionTrigger>Is Eidos a component library or a design system?</AccordionTrigger>
    <AccordionContent>A design system. The components are the most visible surface…</AccordionContent>
  </AccordionItem>
  {/* … */}
</Accordion>`}
      >
        <div style={{ width: '100%', maxWidth: 640 }}>
          <SingleDemo items={FAQ} />
        </div>
      </Frame>

      {/* Variants: multiple */}
      <SubHead meta="allow multiple">Multiple open</SubHead>
      <Frame
        label="any combination of rows open"
        code={`<Accordion type="multiple" defaultValue={["s1", "s2"]}>
  {/* … items … */}
</Accordion>`}
      >
        <div style={{ width: '100%', maxWidth: 640 }}>
          <MultipleDemo items={SHIPPING} />
        </div>
      </Frame>

      {/* Variants: ghost */}
      <SubHead meta="borderless">Ghost</SubHead>
      <Frame
        label="dividers only — sits inside another container"
        code={`<Accordion type="single" variant="ghost">
  {/* … same items … */}
</Accordion>`}
      >
        <div style={{ width: '100%', maxWidth: 640 }}>
          <SingleDemo items={FAQ} variant="ghost" />
        </div>
      </Frame>

      {/* Variants: deep-linkable */}
      <SubHead meta="URL-driven">Deep-linkable</SubHead>
      <Lede up>
        Controlled <Mono>value</Mono> wired to the URL fragment, so a single answer is shareable. Arriving on <Mono>#faq-theming</Mono> opens and scrolls to that row; opening a row writes the hash back (and <Mono>Copy link</Mono> puts it on the clipboard). Scroll respects <Mono>prefers-reduced-motion</Mono>.
      </Lede>
      <Frame
        label='controlled value ⇄ location.hash — try "Copy link", then reload'
        code={`const [value, setValue] = useState(
  () => location.hash.replace("#faq-", "")
);

// arrive on a hash → open + scroll to that row
useEffect(() => {
  const apply = () => setValue(location.hash.replace("#faq-", ""));
  apply();
  addEventListener("hashchange", apply);
  return () => removeEventListener("hashchange", apply);
}, []);

<Accordion type="single" value={value} collapsible
  onValueChange={(v) => {
    setValue(v);
    history.replaceState(null, "", v ? "#faq-" + v : " ");
  }}>
  {/* … items keyed by value … */}
</Accordion>`}
      >
        <DeepLinkFAQ />
      </Frame>

      {/* 4. IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        Ghost variant inside a settings card — no outer border competes with the card edge.
      </Lede>
      <Frame label="shipping FAQ inside a settings card">
        <div style={{ maxWidth: 520, background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 24 }}>
          <p className="t-small" style={{ fontWeight: 600, color: 'var(--fg)', marginTop: 0, marginBottom: 16 }}>Shipping &amp; delivery</p>
          <SingleDemo items={SHIPPING} variant="ghost" />
        </div>
      </Frame>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            <Mono>Tab</Mono> moves to each trigger; <Mono>Enter</Mono> or <Mono>Space</Mono> toggles the panel. <Mono>ArrowDown</Mono> and <Mono>ArrowUp</Mono> move focus between triggers. <Mono>Home</Mono> jumps to the first trigger and <Mono>End</Mono> to the last. In single mode, opening one row collapses the rest unless <Mono>collapsible</Mono> is false.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Each trigger is a <Mono>{'<button>'}</Mono> wrapped in an <Mono>{'<h3>'}</Mono>, carrying <Mono>aria-expanded</Mono> and <Mono>aria-controls</Mono> pointing at its panel. The panel uses <Mono>role="region"</Mono> with <Mono>aria-labelledby</Mono> back to its trigger, and is removed from the accessibility tree (<Mono>aria-hidden</Mono> + <Mono>inert</Mono>) when collapsed.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Focused triggers show the ember focus ring (<Mono>--ring</Mono>) at ≥3:1 against the surface. Focus never enters a collapsed panel — the <Mono>inert</Mono> attribute also keeps controls like the deep-link <em>Copy link</em> button out of the tab order until the row is open. Trigger text is <Mono>--fg</Mono> and content is <Mono>--fg-muted</Mono>, both clearing AA on <Mono>--surface</Mono>. Open state is conveyed by <Mono>aria-expanded</Mono>, chevron rotation, and the revealed content — never colour alone.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The chevron rotation uses <Mono>--dur</Mono> + <Mono>--ease</Mono>. A component-scoped <Mono>@media (prefers-reduced-motion: reduce)</Mono> block collapses the transition to instant, so rows snap open with no sweep for users who prefer reduced motion.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Lede up>
        The trigger layout uses <Mono>justify-content: space-between</Mono> with logical padding, so the chevron mirrors to the leading edge under <Mono>dir="rtl"</Mono>. Text alignment follows <Mono>text-align: start</Mono>. The chevron is a directional glyph and rotates via <Mono>transform: scaleX(-1)</Mono>.
      </Lede>
      <Frame
        label='dir="rtl" — chevron flips to the leading edge'
        code={`<div dir="rtl">
  <Accordion type="single" defaultValue="r1">
    <AccordionItem value="r1">
      <AccordionTrigger>هل فورج مكتبة مكونات أم نظام تصميم؟</AccordionTrigger>
      <AccordionContent>نظام تصميم…</AccordionContent>
    </AccordionItem>
  </Accordion>
</div>`}
      >
        <RTLDemo />
      </Frame>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 480 }} aria-hidden="true">
              <div className="acc">
                <div className="acc-row">
                  <h3 className="acc-heading">
                    <button className="acc-trigger" aria-expanded={true} tabIndex={-1}>
                      <span className="acc-trigger-label">Open question</span>
                      <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="acc-panel is-open" role="region" aria-labelledby="ana-trigger">
                    <div className="acc-content"><p>Answer text appears here when the row is expanded.</p></div>
                  </div>
                </div>
              </div>
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 22, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 28, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 14, left: -52 }}>1</div>
              <div className="pin" style={{ top: 14, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: 20, left: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '40px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Trigger.</b> Geist 500 at <Mono>--text-base</Mono> inside an <Mono>{'<h3>'}</Mono> heading. Phrased as a question or imperative. The whole row is the click target.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Indicator.</b> A 16px chevron rotating 180° on open, shifting from <Mono>--fg-faint</Mono> to ember when expanded. Never a "+/−" — chevrons read better at small sizes.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Content.</b> <Mono>--fg-muted</Mono> at <Mono>--text-base</Mono>, line-height 1.6. Plain prose, ideally one short paragraph. Use a separate page for more than three sentences.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — short, scannable rows</div>
          <div className="body" style={{ padding: 14, alignItems: 'stretch' }}>
            <div className="acc" style={{ width: '100%' }}>
              <div className="acc-row">
                <h3 className="acc-heading">
                  <button className="acc-trigger" tabIndex={-1}>
                    <span className="acc-trigger-label">How do I reset my password?</span>
                    <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                  </button>
                </h3>
              </div>
              <div className="acc-row">
                <h3 className="acc-heading">
                  <button className="acc-trigger" tabIndex={-1}>
                    <span className="acc-trigger-label">Can I export my data?</span>
                    <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                  </button>
                </h3>
              </div>
              <div className="acc-row">
                <h3 className="acc-heading">
                  <button className="acc-trigger" tabIndex={-1}>
                    <span className="acc-trigger-label">What's included in the free tier?</span>
                    <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                  </button>
                </h3>
              </div>
            </div>
          </div>
          <div className="note">Each trigger fits on one line at 640px and reads as a single question.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — accordion as navigation</div>
          <div className="body" style={{ padding: 14, alignItems: 'stretch' }}>
            <div className="acc" style={{ width: '100%' }}>
              <div className="acc-row">
                <h3 className="acc-heading">
                  <button className="acc-trigger" tabIndex={-1}>
                    <span className="acc-trigger-label">Account</span>
                    <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                  </button>
                </h3>
              </div>
              <div className="acc-row">
                <h3 className="acc-heading">
                  <button className="acc-trigger" tabIndex={-1}>
                    <span className="acc-trigger-label">Billing</span>
                    <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                  </button>
                </h3>
              </div>
              <div className="acc-row">
                <h3 className="acc-heading">
                  <button className="acc-trigger" tabIndex={-1}>
                    <span className="acc-trigger-label">Team</span>
                    <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
                  </button>
                </h3>
              </div>
            </div>
          </div>
          <div className="note">If the user will land on each section anyway, use Tabs or a sidenav. Accordions are for content the user might skip.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="AccordionProps">API reference</SubHead>
      <AutoPropsTable component="Accordion" label="<Accordion />" />
    </Section>
  );
}
