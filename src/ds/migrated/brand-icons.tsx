'use client';
// Eidos DS — Foundations / Brand Icons. Real third-party marks (the systems
// Forge connects to) + LLM providers/models, organised by category. Backed by
// Simple Icons + a small hand-maintained EXTRA; all render through <BrandIcon/>.
import {
  BrandIcon, BRANDS, BRAND_CATEGORIES, brandsByCategory,
  CodeBlock, Lede, Mono, Section, SubHead,
} from '@/ds/core';

export default function BrandIconsPage() {
  return (
    <Section
      id="brand-icons"
      num="07"
      title="Brand Icons"
      desc={`Real brand marks for the ${BRANDS.length} systems Forge connects to — source control, observability, incident, cloud and data — plus the LLM providers and models behind the agents. Separate from the hand-drawn icon set: these are logos, organised by category, ready for integration surfaces.`}
    >
      <Lede wide>
        As agents start talking to third-party systems — GitLab, GitHub, Datadog, ServiceNow,
        PagerDuty and many more — we need their <b style={{ color: 'var(--fg)' }}>real marks</b>, not generic glyphs.
        Brand icons ship with the design system at <Mono>brand-icons.tsx</Mono>: most come from{' '}
        <b style={{ color: 'var(--fg)' }}>Simple Icons</b> (CC0 path data), and a small hand-maintained set
        supplies the few brands Simple Icons drops on trademark request (OpenAI, AWS, Slack, Azure, Teams,
        ServiceNow, Grok). Every mark is one 24×24 path, so they all render the same way through{' '}
        <Mono>{'<BrandIcon/>'}</Mono>.
      </Lede>

      {/* Principles */}
      <div className="ds-grid cols-3" style={{ marginBottom: 24 }}>
        {[
          ['Monochrome first', 'Marks inherit currentColor so they sit quietly in lists and chips. Reach for the brand colour only where the logo is the subject.'],
          ['One render path', 'Simple Icons and the hand-authored EXTRA both reduce to a single path — <BrandIcon slug=… /> is the only call site.'],
          ['Extensible registry', 'Grouped by category (integrations, LLM providers, LLM models). Add an integration by dropping its slug into the registry.'],
        ].map(([t, d]) => (
          <div key={t} className="surface" style={{ padding: 16 }}>
            <div className="ds-h-eyebrow" style={{ marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Library — by category */}
      <SubHead meta={BRANDS.length + ' marks'}>Library</SubHead>
      <Lede up wide>
        Use <Mono>{'<BrandIcon slug="github"/>'}</Mono>, <Mono>{'<BrandIcon slug="datadog"/>'}</Mono>, etc.
        Pass <Mono>color="brand"</Mono> for the official colour. Hover a tile for its slug.
      </Lede>

      {BRAND_CATEGORIES.map((cat) => {
        const items = brandsByCategory(cat.id);
        if (!items.length) return null;
        return (
          <div key={cat.id} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span className="ds-h-eyebrow">{cat.label}</span>
              <span className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>{items.length}</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>· {cat.desc}</span>
            </div>
            <div className="surface" style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {items.map((b) => (
                <div
                  key={b.slug}
                  title={b.slug}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', textAlign: 'center' }}
                >
                  <BrandIcon slug={b.slug} size={26} />
                  <span className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Brand colour */}
      <SubHead meta="color='brand'">In brand colour</SubHead>
      <Lede up wide>
        On a marketplace tile or an integration card, the logo is the subject — render it in its own colour.
        Everywhere else (lists, chips, the access sidebar) keep it monochrome.
      </Lede>
      <div className="surface" style={{ padding: 18, display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
        {['github', 'gitlab', 'datadog', 'pagerduty', 'grafana', 'slack', 'aws', 'kubernetes', 'openai', 'claude', 'gemini', 'grok'].map((slug) => (
          <span key={slug} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <BrandIcon slug={slug} size={24} color="brand" />
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>{slug}</span>
          </span>
        ))}
      </div>

      {/* Usage */}
      <SubHead meta="import">Usage</SubHead>
      <CodeBlock
        lang="tsx"
        code={`import { BrandIcon, brandsByCategory } from '@eidos/ui';

// Monochrome — inherits the surrounding text colour
<BrandIcon slug="datadog" size={18} />

// Official brand colour (integration cards, marketplace tiles)
<BrandIcon slug="datadog" size={24} color="brand" />

// Drive a connector list off the registry
brandsByCategory('observability').map((b) => (
  <Row key={b.slug} icon={<BrandIcon slug={b.slug} />} label={b.title} />
));`}
      />

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up wide>
        Each <Mono>{'<BrandIcon/>'}</Mono> renders <Mono>role="img"</Mono> with an <Mono>aria-label</Mono> of the
        brand title, so the logo is announced even with no visible text. When the name is already shown beside it,
        pass an empty <Mono>title</Mono> or mark the icon decorative to avoid the label being read twice. Marks are
        single-colour and meet contrast on any surface because they inherit <Mono>currentColor</Mono>.
      </Lede>
    </Section>
  );
}
