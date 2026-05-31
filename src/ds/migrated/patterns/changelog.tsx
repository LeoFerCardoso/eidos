'use client';
import { ChangelogView, type ChangelogEntry } from '@/components/docs';

const CHANGELOG: ChangelogEntry[] = [
  // ─── v1.11.0 — Patterns on the contract harness (2026-05-30) ──────
  { version: 'v1.11.0', date: '2026-05-30', type: 'docs', scope: 'patterns', title: 'Patterns verified against the contract harness',
    summary: 'The CSS pattern pages were swept for the section standard (Accessibility, reduced-motion, Do / Don\'t, CSS-variable reference) and are tracked per-clause in the generated EIDOS-HEALTH wall.' },

  // ─── v1.10.0 — Page standard (2026-05-22) ──────
  { version: 'v1.10.0', date: '2026-05-22', type: 'docs', scope: 'patterns', title: 'Accessibility section on every pattern',
    summary: 'Each texture page got a sharpened lede and an Accessibility section: the pattern is decorative (aria-hidden) and never the only carrier of meaning, content over it keeps AA contrast via a solid/scrim layer, and any animated pattern (conic-orb is-spin, ember-glow is-pulse, gradient-border is-spin) is gated behind prefers-reduced-motion.' },

  // ─── v1.9.0 — Patterns becomes its own sub-DS (2026-05-21) ──────
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'patterns', title: 'Eidos Patterns split into its own sub-DS at /patterns',
    summary: 'The eight visual textures moved into a dedicated Patterns sub-DS, route-prefixed at /patterns. They stay pure decoration — CSS / SVG over the same --ember / --ice / surface tokens, never a new accent, never a page-level shell.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'overview', title: 'Overview rebuilt — texture swatches in the hero',
    summary: 'New Introduction-style Overview whose hero is a 2×2 grid of live texture swatches (dot-grid, mesh, conic-orb, spotlight) rendered via the real .pat-* classes instead of stat cards.' },
  { version: 'v1.7.1', date: '2026-05-17', type: 'fix', scope: 'mesh-gradient', title: 'Mesh / dot / linear grid textures render inside .pat-demo',
    summary: 'The demo helper .pat-demo used the background shorthand, which resets background-image — wiping any pattern texture layered on top. Switched to the background-color longhand so the texture classes compose cleanly.' },
  { version: 'v1.7.1', date: '2026-05-17', type: 'fix', scope: 'noise-grain', title: 'Noise grain visible on dark theme',
    summary: 'mix-blend-mode: overlay over a near-black surface produced almost no visible noise. Dark theme switched to mix-blend-mode: screen with a brighter feColorMatrix alpha and coarser turbulence; the subtle / default / strong opacity scale now reads 0.45 / 0.85 / 1.0 in dark.' },
  { version: 'v1.7.0', date: '2026-05-17', type: 'breaking', scope: 'patterns', title: 'Patterns reframed — visual effects only',
    summary: 'Patterns used to mix page-level shells, section compositions and overlay UI. It is now exclusively decoration — backgrounds, glows, textures. The page-level shells moved to the Examples gallery; Hero / Page-headers moved to Blocks; Sidesheet moved to Components.' },
  { version: 'v1.7.0', date: '2026-05-17', type: 'feat', scope: 'patterns', title: '8 visual pattern utilities + docs pages',
    summary: 'Dot grid, Linear grid, Mesh gradient, Conic orb, Radial spotlight, Noise grain, Ember glow, Gradient border — each ships a CSS utility class and a docs page with variants + Do / Don\'t.' },
];

export default function PatternsChangelog() {
  return (
    <ChangelogView
      entries={CHANGELOG}
      title="Changelog"
      desc="Every change to Eidos Patterns — searchable, filterable, scoped per texture."
      dsName="Eidos Patterns"
    />
  );
}
