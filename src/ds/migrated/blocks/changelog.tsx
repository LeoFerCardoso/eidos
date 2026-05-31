'use client';
import { ChangelogView, type ChangelogEntry } from '@/components/docs';

const CHANGELOG: ChangelogEntry[] = [
  // ─── v1.11.0 — Blocks on the contract harness (2026-05-30) ──────
  { version: 'v1.11.0', date: '2026-05-30', type: 'docs', scope: 'blocks', title: 'Blocks verified against the contract harness',
    summary: 'The page-level Blocks (hero, feature-grid, cta-banner, stat-band, split-feature, page-headers) were swept for the section standard — Accessibility, RTL, Do/Don\'t, and visual anatomy — and are tracked per-clause in the generated FORGE-HEALTH wall.' },

  // ─── v1.10.0 — Page standard (2026-05-22) ──────
  { version: 'v1.10.0', date: '2026-05-22', type: 'docs', scope: 'blocks', title: 'Thin blocks fleshed out + Accessibility + visual anatomy',
    summary: 'CTA banner, Feature grid, Split feature and Stat band went from a single demo to the full template — Anatomy (visual: the block rendered with numbered pins + legend), Do/Don\'t, and an Accessibility section (heading order, real controls, contrast over texture, focus on the primary CTA, reduced motion). Hero and Page headers gained the Accessibility section too.' },

  // ─── v1.9.0 — Blocks launches as a sub-DS (2026-05-21) ──────
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'blocks', title: 'Eidos Blocks launched at /blocks',
    summary: 'A new sub-DS for section-level recipes — the walls you assemble a page from, between components (the bricks) and full example screens. Everything composes core primitives and tokens; copy a block and own it.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'breaking', scope: 'hero', title: 'Hero & Page headers moved here from IDP',
    summary: 'The section-level Hero and Page-headers recipes left IDP Elements (where they read as platform-only) and now anchor Eidos Blocks alongside the new section recipes.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'feature-grid', title: 'Feature grid, CTA banner, Stat band, Split feature added',
    summary: 'Four new section recipes: a three-up Feature grid (icon · title · copy), a full-width CTA banner on an ember band, a Stat band (headline metrics + sparklines), and a Split feature (alternating two-column text + visual).' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'overview', title: 'Overview — a composed section preview in the hero',
    summary: 'Introduction-style Overview whose hero previews a miniature composed section — a hero card over a row of feature cards — so the landing demonstrates page composition at a glance.' },
];

export default function BlocksChangelog() {
  return (
    <ChangelogView
      entries={CHANGELOG}
      title="Changelog"
      desc="Every change to Eidos Blocks — searchable, filterable, scoped per block."
      dsName="Eidos Blocks"
    />
  );
}
