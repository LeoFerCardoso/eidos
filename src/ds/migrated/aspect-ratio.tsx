'use client';
// Forge DS — Components / Aspect Ratio
// Section order (DS-PAGE-STANDARD §2.2):
//   1. Installation
//   2. Usage
//   3. Variants (common ratios · object-fit modes)
//   4. In context
//   5. Accessibility
//   6. RTL
//   7. Anatomy
//   8. Do / Don't
//   9. API reference
import { useState, useCallback } from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  Skeleton,
  AutoPropsTable,
  ComponentInstall,
  AspectRatio,
} from '@/ds/core';

// ==========================================================================
// Inline assets — real <img>/<iframe> sources so the demos exercise the
// component's actual loading-vs-loaded path (no external network dep).
// Pattern mirrors src/ds/migrated/ai/image.tsx.
// ==========================================================================
const IMG_HERO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%232a1a12'/%3E%3Cstop offset='100%25' stop-color='%230a0b0c'/%3E%3C/linearGradient%3E%3CradialGradient id='r' cx='28%25' cy='32%25' r='55%25'%3E%3Cstop offset='0%25' stop-color='%23FF6B35' stop-opacity='0.45'/%3E%3Cstop offset='100%25' stop-color='%23FF6B35' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Crect width='640' height='360' fill='url(%23r)'/%3E%3Cg fill='none' stroke='rgba(255,107,53,0.35)' stroke-width='1.5'%3E%3Ccircle cx='180' cy='150' r='52'/%3E%3Cpath d='M260 150 H440'/%3E%3Ccircle cx='460' cy='150' r='14' fill='rgba(255,107,53,0.5)' stroke='none'/%3E%3C/g%3E%3C/svg%3E";

// A real titled <iframe> document — its accessible name comes from the
// title attribute, which we assert in the Accessibility section.
const VIDEO_DOC =
  "data:text/html,%3C!doctype html%3E%3Cmeta name='viewport' content='width=device-width,initial-scale=1'%3E%3Cstyle%3Ehtml,body%7Bmargin:0;height:100%25;background:radial-gradient(circle at 50%25 42%25,%23223 0,%230a0b0c 75%25);display:flex;align-items:center;justify-content:center%7D.p%7Bwidth:60px;height:60px;border-radius:50%25;background:rgba(255,107,53,.92);display:flex;align-items:center;justify-content:center%7D.t%7Bborder-style:solid;border-width:11px 0 11px 18px;border-color:transparent transparent transparent %2308090A;margin-inline-start:4px%7D%3C/style%3E%3Cdiv class='p'%3E%3Cdiv class='t'%3E%3C/div%3E%3C/div%3E";

// ==========================================================================
// Code snippets
// ==========================================================================
const USAGE_CODE = `import { useState } from "react"
import { AspectRatio } from "@/components/forge/aspect-ratio"
import { Skeleton } from "@/components/forge/skeleton"

export function Demo() {
  const [loaded, setLoaded] = useState(false)
  return (
    <AspectRatio ratio={16 / 9}>
      {/* Skeleton fills the reserved box until the image decodes */}
      {!loaded && <Skeleton variant="box" label="Loading hero" />}
      <img
        src="/hero.jpg"
        alt="Forge ring rollout — canary to 100% with health gates"
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity .25s" }}
      />
    </AspectRatio>
  )
}`;

const RATIOS_CODE = `<AspectRatio ratio={16 / 9}>
  <img src="/hero.jpg" alt="" />
</AspectRatio>

<AspectRatio ratio={1}>
  <img src="/avatar.jpg" alt="" />
</AspectRatio>

<AspectRatio ratio="9/16">
  <img src="/story.jpg" alt="" />
</AspectRatio>`;

const OBJECT_FIT_CODE = `{/* cover — fills, may crop */}
<AspectRatio ratio="1/1">
  <img src="/img.jpg" style={{ objectFit: 'cover' }} alt="" />
</AspectRatio>

{/* contain — fits, may letterbox */}
<AspectRatio ratio="1/1">
  <img src="/img.jpg" style={{ objectFit: 'contain' }} alt="" />
</AspectRatio>

{/* scale-down — never upscales */}
<AspectRatio ratio="1/1">
  <img src="/img.jpg" style={{ objectFit: 'scale-down' }} alt="" />
</AspectRatio>`;

const IN_CONTEXT_CODE = `{/* Card with locked-ratio thumbnail */}
<div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
  <AspectRatio ratio="16/9" radius="0">
    <img src="/cover.jpg" alt="Ring rollout diagram — canary to 100% with health gates" />
  </AspectRatio>
  <div style={{ padding: 16 }}>
    <h3>The forge that ships</h3>
    <p>Architecture notes from the platform team.</p>
  </div>
</div>

{/* Video embed — the iframe's accessible name is its title */}
<AspectRatio ratio="16/9">
  <iframe
    src="https://www.youtube.com/embed/…"
    title="Sprint review · 2024-Q4 · S37"
  />
</AspectRatio>`;

const RTL_CODE = `<div dir="rtl">
  <AspectRatio ratio="16/9">
    <img src="/hero.jpg" alt="غلاف" />
    <div className="ar-label">١٦ : ٩ — هيرو</div>
  </AspectRatio>
</div>`;

// ==========================================================================
// Live loading demo — the signature move of this page.
// AspectRatio's whole thesis is "the box reserves space, so nothing shifts
// while the asset loads". We prove it live: a real <img> fades in over a
// Skeleton that fills the SAME reserved box, and a Reload button re-runs the
// loading→loaded transition on demand (cache-busted query so it actually
// re-fetches). The caption below the box never moves — that is the point.
// ==========================================================================
function UsageDemo() {
  const [nonce, setNonce] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const reload = useCallback(() => {
    setLoaded(false);
    setNonce((n) => n + 1);
  }, []);
  return (
    <div style={{ maxWidth: 360, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <AspectRatio ratio="16/9">
        {!loaded && (
          <Skeleton
            variant="box"
            width="100%"
            height="100%"
            radius={0}
            label="Loading hero image"
            style={{ position: 'absolute', inset: 0 }}
          />
        )}
        <img
          /* nonce cache-busts so Reload re-triggers a real decode */
          key={nonce}
          src={`${IMG_HERO}#${nonce}`}
          alt="Forge ring rollout — canary to 100% with health gates"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
        />
      </AspectRatio>
      {/* This row sits directly under the box and must never jump on reload. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span className="t-mono-label" style={{ color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>
          {loaded ? 'loaded · 0 CLS' : 'loading…'}
        </span>
        <button type="button" className="btn sm" onClick={reload}>
          <Icons.refresh size={13} /> Reload
        </button>
      </div>
    </div>
  );
}

// ==========================================================================
// PAGE
// ==========================================================================
export default function AspectRatioPage() {
  return (
    <Section
      id="aspect-ratio"
      num="04"
      title="Aspect Ratio"
      desc="Lock a child to a fixed width/height ratio so the layout never shifts when the asset loads. CSS-only — no script, no padding-bottom hack."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <ComponentInstall slug="aspect-ratio" />
      <Lede>
        Ships <Mono>AspectRatio</Mono> — a zero-dependency wrapper that holds any ratio via the modern{' '}
        <Mono>aspect-ratio</Mono> CSS property. Pass a numeric ratio (<Mono>16/9</Mono>) or a named string
        preset (<Mono>'16/9'</Mono>, <Mono>'1/1'</Mono>, <Mono>'21/9'</Mono>…). Children are absolutely
        positioned to fill the box edge-to-edge.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="real <img> · live loading → loaded" code={USAGE_CODE}>
        <UsageDemo />
      </Frame>
      <Lede>
        Hit <b>Reload</b>: the <Mono>Skeleton</Mono> fills the reserved box while the image
        re-decodes, then the photo fades in — and the caption below never shifts a pixel. That
        steadiness is the whole point of locking the ratio before the asset arrives.
      </Lede>

      {/* ====================================================================
          3. VARIANTS / COMMON RATIOS
          ==================================================================== */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <SubHead meta="7 common ratios">Common ratios</SubHead>
      <Frame
        label="16:9 · 4:3 · 3:2 · 1:1 · 3:4 · 9:16 · 21:9"
        code={RATIOS_CODE}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, width: '100%' }}>
          <AspectRatio ratio="16/9">
            <div className="ar-fill" />
            <div className="ar-label">16 : 9 — video</div>
          </AspectRatio>
          <AspectRatio ratio="4/3">
            <div className="ar-fill warm" />
            <div className="ar-label">4 : 3 — classic</div>
          </AspectRatio>
          <AspectRatio ratio="3/2">
            <div className="ar-fill cool" />
            <div className="ar-label">3 : 2 — DSLR</div>
          </AspectRatio>
          <AspectRatio ratio="1/1">
            <div className="ar-fill warm" />
            <div className="ar-label">1 : 1 — square</div>
          </AspectRatio>
          <AspectRatio ratio="3/4">
            <div className="ar-fill cool" />
            <div className="ar-label">3 : 4 — portrait</div>
          </AspectRatio>
          <AspectRatio ratio="9/16">
            <div className="ar-fill" />
            <div className="ar-label">9 : 16 — story</div>
          </AspectRatio>
        </div>
      </Frame>

      {/* Pick a ratio decision table */}
      <SubHead meta="when to use">Pick a ratio</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">ratio guide</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Ratio</th>
              <th>Where</th>
              <th>Avoid for</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">16 : 9</td><td>Hero images, video, dashboard tiles, card covers.</td><td>Portrait photography — the head gets cropped.</td></tr>
            <tr><td className="tok-name">4 : 3 / 3 : 2</td><td>Editorial photography, classic image cards.</td><td>Video thumbnails — feels dated next to 16:9.</td></tr>
            <tr><td className="tok-name">1 : 1</td><td>Avatars, social-style posts, product gallery thumbs.</td><td>Wide landscape content — letterboxes hard.</td></tr>
            <tr><td className="tok-name">3 : 4 / 9 : 16</td><td>Mobile previews, story-format media, portraits.</td><td>Desktop heroes — towers awkwardly.</td></tr>
            <tr><td className="tok-name">21 : 9</td><td>Cinematic banners, marketing splash sections.</td><td>Anything that needs to read on a phone.</td></tr>
          </tbody>
        </table>
      </div>

      {/* object-fit modes */}
      <SubHead meta="object-fit">cover · contain · scale-down</SubHead>
      <Frame label="how the child fills the box" code={OBJECT_FIT_CODE}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, width: '100%' }}>
          <div>
            <AspectRatio ratio="1/1">
              <div className="ar-fill warm" style={{ width: '140%', height: '140%', inset: '-20%' }} />
              <div className="ar-label">cover</div>
            </AspectRatio>
            <div className="t-mono-label" style={{ color: 'var(--fg-muted)', marginTop: 6 }}>cover — fills, crops outside</div>
          </div>
          <div>
            <AspectRatio ratio="1/1">
              <div className="ar-fill cool" style={{ width: '70%', height: '70%', inset: '15%', borderRadius: 'var(--radius-sm)' }} />
              <div className="ar-label">contain</div>
            </AspectRatio>
            <div className="t-mono-label" style={{ color: 'var(--fg-muted)', marginTop: 6 }}>contain — fits, may letterbox</div>
          </div>
          <div>
            <AspectRatio ratio="1/1">
              <div className="ar-fill" style={{ width: '40%', height: '40%', inset: '30%', borderRadius: 'var(--radius-sm)' }} />
              <div className="ar-label">scale-down</div>
            </AspectRatio>
            <div className="t-mono-label" style={{ color: 'var(--fg-muted)', marginTop: 6 }}>scale-down — never upscales</div>
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          4. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="card thumbnail · video embed · avatar grid · banner" code={IN_CONTEXT_CODE}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16, width: '100%' }}>
          {/* Card — real <img> cover with a descriptive alt */}
          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            <AspectRatio ratio="16/9" radius="0">
              <img src={IMG_HERO} alt="Ring rollout diagram — canary to 100% with health gates" />
            </AspectRatio>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, letterSpacing: '-0.005em', marginBottom: 4 }}>The forge that ships</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>Architecture notes from the platform team.</div>
            </div>
          </div>
          {/* Video — real titled <iframe>; its accessible name is the title */}
          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            <AspectRatio ratio="16/9" radius="0">
              <iframe title="Sprint review · 2024-Q4 · S37" src={VIDEO_DOC} />
            </AspectRatio>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Sprint review · 14 min</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>2024-Q4 · S37</div>
            </div>
          </div>
          {/* Avatar grid */}
          <div className="surface" style={{ padding: 14 }}>
            <div className="t-mono-label" style={{ color: 'var(--fg-muted)', marginBottom: 10, letterSpacing: '0.04em' }}>SQUARE GRID · 1 : 1</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
              {(['warm','cool','warm','cool','warm','cool'] as const).map((f, i) => (
                <AspectRatio key={i} ratio="1/1" radius="var(--radius-lg)">
                  <div className={`ar-fill ${f}`} />
                </AspectRatio>
              ))}
            </div>
          </div>
          {/* Banner */}
          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            <AspectRatio ratio="21/9" radius="0">
              <div className="ar-fill warm" />
              <div className="ar-label">21 : 9 — banner</div>
            </AspectRatio>
            <div style={{ padding: 14, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
              Use 21:9 sparingly — it's an editorial / hero ratio.
            </div>
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>
        The wrapper is a non-interactive layout primitive. It adds no role, no tab stop, and no
        ARIA attributes. All accessibility obligations belong to the children.
      </Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The box itself has no focus stop. Interactive children behave normally: a wrapped{' '}
            <Mono>{'<video>'}</Mono> keeps its native controls (Tab to reach, Space to play), and an{' '}
            <Mono>{'<iframe>'}</Mono> embed is Tab-reachable as a single stop.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The wrapper adds no role, so the child announces as-is. The In-context cover above ships
            a real <Mono>alt</Mono>; mark a purely decorative fill with <Mono>alt=""</Mono> (or{' '}
            <Mono>aria-hidden</Mono>). The video card is a live <Mono>{'<iframe>'}</Mono> whose{' '}
            <Mono>title="Sprint review · 2024-Q4 · S37"</Mono> is exactly what a screen reader reads
            as the frame's name — inspect it to confirm.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus {'&'} contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            <Mono>overflow: hidden</Mono> never clips a child's focus ring (<Mono>--ring</Mono>) because
            controls render edge-to-edge inside the box. The optional caption sits on a 55% scrim with
            light ink, clearing WCAG AA against the media beneath it.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The box is static — it only reserves space, eliminating layout-shift jank by construction.
            The Usage demo's load-in is a short opacity fade only (no movement); gate any such fade and
            any autoplaying video behind <Mono>prefers-reduced-motion</Mono> at the source.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="aspect-ratio is direction-agnostic — the box is just a box" code={RTL_CODE}>
        <div dir="rtl" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, width: '100%' }}>
          <AspectRatio ratio="16/9">
            <div className="ar-fill warm" />
            <div className="ar-label">١٦ : ٩ — هيرو</div>
          </AspectRatio>
          <AspectRatio ratio="1/1">
            <div className="ar-fill cool" />
            <div className="ar-label">١ : ١ — أفتار</div>
          </AspectRatio>
        </div>
      </Frame>
      <Lede>
        The caption uses <Mono>inset-inline-end</Mono>, so it always lands in the trailing corner
        regardless of text direction. The ratio itself never flips — boxes don't mirror with text
        direction, only inline-axis chrome around them does.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 320 }}>
              <AspectRatio ratio="16/9">
                <div className="ar-fill" />
                <div className="ar-label">16 : 9</div>
              </AspectRatio>
              <div className="pin" style={{ top: -10, left: -10 }}>1</div>
              <div className="pin" style={{ top: -10, right: -10 }}>2</div>
              <div className="pin" style={{ bottom: 14, right: -28 }}>3</div>
              <div className="pin" style={{ bottom: -10, left: -10 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '24px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Container.</b>{' '}
              <Mono>position: relative</Mono> + <Mono>aspect-ratio: 16 / 9</Mono>.
              Width is fluid; height is computed from width by the browser.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Asset.</b>{' '}
              <Mono>position: absolute; inset: 0</Mono> + <Mono>object-fit: cover</Mono>.
              Fills the box edge-to-edge.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Caption (optional).</b>{' '}
              Anchored with <Mono>inset-inline-end</Mono> + <Mono>inset-block-end</Mono> so it
              lands in the trailing corner under both LTR and RTL.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Overflow.</b>{' '}
              <Mono>overflow: hidden</Mono> on the container — clips the asset to the rounded
              corners and hides any object-fit bleed.
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — reserve space before the asset loads</div>
          <div className="body" style={{ padding: 14 }}>
            <AspectRatio ratio="16/9">
              <div style={{ background: 'var(--surface-hover)', width: '100%', height: '100%' }} />
              <div className="ar-label">loading…</div>
            </AspectRatio>
          </div>
          <div className="note">
            An empty <Mono>AspectRatio</Mono> box reserves the space — when the image arrives,
            nothing below it shifts. Zero CLS by construction.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — let images dictate their own height</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <div style={{
              width: '100%', height: 60,
              background: 'var(--ember-soft)', border: '1px solid var(--ember)',
              borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--ember-text)',
              fontSize: 11, fontFamily: 'var(--font-mono)',
            }}>
              tall image — pushes content down
            </div>
            <div style={{ width: '100%', height: 24, background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ width: '80%', height: 14, background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }} />
          </div>
          <div className="note">
            Without a locked ratio, the layout jumps every time an image arrives at a different
            size. Lighthouse and your users both notice.
          </div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — give decorative fills aria-hidden</div>
          <div className="body" style={{ padding: 14 }}>
            <AspectRatio ratio="1/1" radius="var(--radius-lg)">
              <div className="ar-fill cool" aria-hidden="true" />
            </AspectRatio>
          </div>
          <div className="note">
            A purely decorative background fill contributes no information — hide it from the
            accessibility tree with <Mono>aria-hidden="true"</Mono>.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — nest interactive overlays inside overflow:hidden</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8 }}>
            <AspectRatio ratio="16/9">
              <div className="ar-fill warm" />
            </AspectRatio>
            <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              Dropdowns or tooltips anchored inside the box get clipped. Render overlays via a
              portal outside the containing block instead.
            </div>
          </div>
          <div className="note">
            The <Mono>overflow: hidden</Mono> on the container clips any child that tries to
            paint outside the box, including floating menus and popover panels.
          </div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="AspectRatioProps">API reference</SubHead>
      <AutoPropsTable component="AspectRatio" label="<AspectRatio />" />
    </Section>
  );
}
