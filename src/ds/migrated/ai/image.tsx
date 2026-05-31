'use client';
// Eidos AI — Image (§2.2 component-page standard).
// Documents ImageView: the bordered, rounded, aspect-locked image surface for
// AI replies. Handles loading shimmer, error fallback, and captions. Demos
// use inline SVG data-URIs so everything renders offline without bundled assets.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, ImageView, Shimmer, Skeleton, Prose, Mono } from '@/ds/core';


// ── Inline SVG data-URIs (offline-safe demo images) ───────────────────────
// All demos use data-URIs so the page renders correctly without a CDN or
// bundled assets. Each SVG encodes a visually distinct gradient tile.

// 16:9 gradient — blue to violet
const SVG_WIDE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%231e3a5f'/%3E%3Cstop offset='50%25' stop-color='%23312e81'/%3E%3Cstop offset='100%25' stop-color='%230f172a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='360' fill='url(%23g)'/%3E%3Crect x='40' y='140' width='180' height='80' rx='8' fill='rgba(255,255,255,0.08)'/%3E%3Crect x='260' y='100' width='320' height='20' rx='4' fill='rgba(255,255,255,0.12)'/%3E%3Crect x='260' y='132' width='240' height='16' rx='4' fill='rgba(255,255,255,0.07)'/%3E%3Crect x='260' y='160' width='200' height='16' rx='4' fill='rgba(255,255,255,0.07)'/%3E%3Ccircle cx='130' cy='180' r='40' fill='rgba(255,107,53,0.18)'/%3E%3C/svg%3E`;

// 1:1 gradient — ember to dark
const SVG_SQUARE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='40%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='%23FF6B35' stop-opacity='0.35'/%3E%3Cstop offset='100%25' stop-color='%230a0b0c'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='%230a0b0c'/%3E%3Crect width='400' height='400' fill='url(%23g)'/%3E%3Ccircle cx='200' cy='160' r='64' fill='rgba(255,107,53,0.12)' stroke='rgba(255,107,53,0.3)' stroke-width='2'/%3E%3Crect x='120' y='260' width='160' height='16' rx='4' fill='rgba(255,255,255,0.1)'/%3E%3Crect x='140' y='288' width='120' height='12' rx='4' fill='rgba(255,255,255,0.06)'/%3E%3C/svg%3E`;

// Natural height gradient — teal grid
const SVG_NATURAL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='300' viewBox='0 0 480 300'%3E%3Crect width='480' height='300' fill='%230d1f1a'/%3E%3Cg stroke='%2314b8a6' stroke-width='0.5' opacity='0.3'%3E%3Cline x1='0' y1='50' x2='480' y2='50'/%3E%3Cline x1='0' y1='100' x2='480' y2='100'/%3E%3Cline x1='0' y1='150' x2='480' y2='150'/%3E%3Cline x1='0' y1='200' x2='480' y2='200'/%3E%3Cline x1='0' y1='250' x2='480' y2='250'/%3E%3Cline x1='80' y1='0' x2='80' y2='300'/%3E%3Cline x1='160' y1='0' x2='160' y2='300'/%3E%3Cline x1='240' y1='0' x2='240' y2='300'/%3E%3Cline x1='320' y1='0' x2='320' y2='300'/%3E%3Cline x1='400' y1='0' x2='400' y2='300'/%3E%3C/g%3E%3Cellipse cx='240' cy='150' rx='80' ry='60' fill='rgba(20,184,166,0.15)' stroke='rgba(20,184,166,0.4)' stroke-width='1.5'/%3E%3C/svg%3E`;

// Gallery thumbnails
const SVG_THUMB_A = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140' viewBox='0 0 200 140'%3E%3Crect width='200' height='140' fill='%231e3a5f'/%3E%3Ccircle cx='100' cy='70' r='36' fill='rgba(255,107,53,0.25)' stroke='rgba(255,107,53,0.5)' stroke-width='1'/%3E%3C/svg%3E`;
const SVG_THUMB_B = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140' viewBox='0 0 200 140'%3E%3Crect width='200' height='140' fill='%230d1f1a'/%3E%3Crect x='30' y='30' width='140' height='80' rx='6' fill='rgba(20,184,166,0.15)' stroke='rgba(20,184,166,0.35)' stroke-width='1'/%3E%3C/svg%3E`;
const SVG_THUMB_C = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140' viewBox='0 0 200 140'%3E%3Cdefs%3E%3ClinearGradient id='cg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23312e81'/%3E%3Cstop offset='100%25' stop-color='%230a0b0c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='140' fill='url(%23cg)'/%3E%3Ccircle cx='100' cy='70' r='50' fill='rgba(99,102,241,0.2)' stroke='rgba(99,102,241,0.4)' stroke-width='1'/%3E%3C/svg%3E`;

// ── Code snippets ─────────────────────────────────────────────────────────
const USAGE_CODE = `import { ImageView } from "@/ds/core"

<ImageView
  src="/images/deploy-diagram.png"
  alt="Eidos ring rollout — canary, 25%, 100% stages with health gates"
  caption="Ring rollout model — gates at each stage check the error budget before auto-promoting."
  aspect="16 / 9"
/>`;

const ERROR_CODE = `// Broken src — ImageView shows the error fallback:
<ImageView
  src="https://broken-url/image.png"
  alt="Unavailable chart"
  caption="Data unavailable — check the source."
  aspect="16 / 9"
/>`;

const GALLERY_CODE = `// Small gallery — three ImageViews in a ds-grid:
<div className="ds-grid cols-3">
  <ImageView src={imgA} alt="Deploy diagram" aspect="16 / 9" rounded/>
  <ImageView src={imgB} alt="Health gate model" aspect="16 / 9" rounded/>
  <ImageView src={imgC} alt="Error budget chart" aspect="16 / 9" rounded/>
</div>`;

export default function AiImage() {
  return (
    <Section
      id="image"
      num="08"
      title="Image"
      desc="The surface for images inside AI replies — bordered, rounded, aspect-locked, with a loading shimmer before decode and a graceful error fallback when the source is unavailable."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-image')} ariaLabel="package manager"/>
      <Lede>Always pair with an alt attribute and a caption for provenance: the model generated this image, and the user should know where it came from.</Lede>
      <Lede>
        Ships <Mono>ImageView</Mono> — a <Mono>{'<figure>'}</Mono>-based surface with a loading shimmer, an error fallback (<Mono>Icons.image</Mono> + "Image unavailable"), a <Mono>{'<figcaption>'}</Mono> for provenance, aspect-ratio locking, and a <Mono>rounded</Mono> toggle. Uses only the core <Mono>Icons</Mono> and React state — no external image library.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="ImageView — 16:9 with alt + caption" code={USAGE_CODE} height={320}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <ImageView
            src={SVG_WIDE}
            alt="Eidos ring rollout — canary, 25%, 100% stages with health gates"
            caption="Ring rollout model — gates at each stage check the error budget before auto-promoting."
            aspect="16 / 9"
          />
        </div>
      </Frame>
      <Lede>
        The canonical usage: a constrained-width figure with a fixed aspect ratio, descriptive alt text, and a prose caption below. The shimmer appears while the image decodes and disappears on <Mono>onLoad</Mono>. Always provide both <Mono>alt</Mono> and <Mono>caption</Mono> in AI-generated images — the caption is the provenance note.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="t-mono-label" style={{ letterSpacing: '0.18em' }}>Examples</span>
        <span style={{ flex: 1, blockSize: 1, background: 'var(--border)' }}/>
      </div>

      {/* VARIANTS — ASPECT */}
      <SubHead meta="aspect ratios">Variants — aspect ratio</SubHead>
      <Frame label="16/9 · 1/1 · natural — lock the aspect to prevent layout shift" height={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%', maxWidth: 520 }}>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>16 / 9</span>
            <ImageView src={SVG_WIDE} alt="Ring rollout diagram, 16:9" aspect="16 / 9"/>
          </div>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>1 / 1</span>
            <ImageView src={SVG_SQUARE} alt="Ember gradient tile, 1:1" aspect="1 / 1" width={220}/>
          </div>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>natural (no aspect prop)</span>
            <ImageView src={SVG_NATURAL} alt="Teal grid overlay, natural dimensions"/>
          </div>
        </div>
      </Frame>
      <Lede>
        Always set an <Mono>aspect</Mono> when the image dimensions are known in advance — it reserves the correct space during loading and prevents cumulative layout shift (CLS). Use <Mono>"16 / 9"</Mono> for screenshots and diagrams, <Mono>"1 / 1"</Mono> for icons and avatars. Omit the prop only when the image's natural dimensions are acceptable.
      </Lede>

      {/* VARIANTS — ROUNDED vs SQUARE */}
      <SubHead meta="rounded · square">Rounded vs square</SubHead>
      <Frame label="rounded (default) · square — use square for diagrams with content at the edge" row height={200}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>rounded</span>
            <ImageView src={SVG_SQUARE} alt="Rounded example" aspect="1 / 1" width={160} rounded/>
          </div>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>square</span>
            <ImageView src={SVG_SQUARE} alt="Square example" aspect="1 / 1" width={160} rounded={false}/>
          </div>
        </div>
      </Frame>
      <Lede>
        <Mono>rounded</Mono> is on by default. Pass <Mono>rounded={'{false}'}</Mono> when the image has meaningful content at its corners (charts with axis labels, maps with boundary markers). The border and the <Mono>aspect</Mono> lock are unaffected by this prop.
      </Lede>

      {/* STATES */}
      <SubHead meta="loading · loaded · error">States</SubHead>
      <Frame label="loading shimmer · loaded image · error fallback" height={260}>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start', width: '100%' }}>
          {/* Loading state — replicate the .ai-image-frame shimmer chrome */}
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>loading</span>
            <div className="ai-image" style={{ display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
              <div className="ai-image-frame" style={{ width: 180, aspectRatio: '16 / 9' }}>
                <span className="ai-image-shimmer" aria-hidden="true"/>
              </div>
            </div>
          </div>
          {/* Loaded */}
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>loaded</span>
            <ImageView src={SVG_WIDE} alt="Loaded image example" aspect="16 / 9" width={180}/>
          </div>
          {/* Error */}
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>error fallback</span>
            <ImageView src="https://broken.example/image.png" alt="Unavailable image" aspect="16 / 9" width={180}/>
          </div>
          {/* Empty / no src */}
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>no src</span>
            <ImageView alt="No source provided" aspect="16 / 9" width={180}/>
          </div>
        </div>
      </Frame>
      <Lede>
        <b>Loading</b> — the shimmer plays while the browser fetches and decodes the image. <b>Loaded</b> — the image fades in from opacity 0 to 1 on <Mono>onLoad</Mono>. <b>Error</b> — when <Mono>onError</Mono> fires, a fallback renders (<Mono>Icons.image</Mono> + "Image unavailable") in the same frame. <b>No src</b> — the fallback renders immediately with the <Mono>alt</Mono> text as the label.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="image inside a message turn — ImageView inside Prose with a provenance caption" height={440}>
        <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* User prompt */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px 14px', background: 'var(--ember-soft)', border: '1px solid color-mix(in srgb, var(--ember) 22%, transparent)', borderRadius: 12, borderEndEndRadius: 4, color: 'var(--fg)', fontSize: 'var(--text-base)', lineHeight: 1.55, maxWidth: '70%' }}>
              Show me the ring rollout architecture for identity-svc.
            </div>
          </div>
          {/* Agent reply */}
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', border: '1px solid color-mix(in srgb, var(--ember) 22%, transparent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Icons.sparkle size={16} style={{ color: 'var(--ember)' }}/>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>Eidos platform agent</span>
              <Prose>
                <p>Here is the ring rollout architecture for <code>identity-svc</code> as of the last deployment:</p>
              </Prose>
              <div style={{ marginTop: 12 }}>
                <ImageView
                  src={SVG_WIDE}
                  alt="Ring rollout diagram showing canary, 25%, and 100% stages with health gates at each transition"
                  caption="Generated from eidos.yaml ring definitions · identity-svc · 2026-05-27"
                  aspect="16 / 9"
                />
              </div>
              <Prose style={{ marginTop: 12 }}>
                <p>The canary ring receives 5% of traffic. Gates at each stage check <strong>p95 latency</strong> and <strong>error budget burn rate</strong> before auto-promoting.</p>
              </Prose>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        The caption is the provenance note — it names the source, the service, and the timestamp. In a real AI reply, populate it with the model's generation metadata. The image is placed between two <Mono>{'<Prose>'}</Mono> blocks so it escapes the 68ch prose cap while remaining in the content flow.
      </Lede>

      {/* GALLERY */}
      <SubHead meta="gallery">Gallery / grid</SubHead>
      <Frame label="three images in a ds-grid — same aspect, consistent spacing" code={GALLERY_CODE} height={220}>
        <div className="ds-grid cols-3" style={{ width: '100%' }}>
          <ImageView src={SVG_THUMB_A} alt="Deploy diagram thumbnail" aspect="16 / 9" rounded/>
          <ImageView src={SVG_THUMB_B} alt="Health gate model thumbnail" aspect="16 / 9" rounded/>
          <ImageView src={SVG_THUMB_C} alt="Error budget chart thumbnail" aspect="16 / 9" rounded/>
        </div>
      </Frame>
      <Lede>
        For a multi-image reply, use the <Mono>.ds-grid.cols-3</Mono> (or <Mono>cols-2</Mono>) layout class. Lock all images to the same aspect ratio so the grid rows are consistent. Each still needs its own <Mono>alt</Mono>; add a single caption below the grid rather than repeating three separate captions.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Required alt text</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Every <code style={{ fontFamily: 'var(--font-mono)' }}>ImageView</code> requires an <code style={{ fontFamily: 'var(--font-mono)' }}>alt</code> prop. For informative images (diagrams, charts, screenshots), the alt should describe what the image shows — not its visual style ("blue gradient"). For purely decorative images, pass <code style={{ fontFamily: 'var(--font-mono)' }}>alt=""</code> and the <code style={{ fontFamily: 'var(--font-mono)' }}>{'<img>'}</code> is treated as decorative by screen readers.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Caption as figcaption</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The <code style={{ fontFamily: 'var(--font-mono)' }}>caption</code> prop renders as a semantic <code style={{ fontFamily: 'var(--font-mono)' }}>{'<figcaption>'}</code> inside the <code style={{ fontFamily: 'var(--font-mono)' }}>{'<figure>'}</code> element. Screen readers associate it with the image automatically. Use it for provenance ("Generated from eidos.yaml · identity-svc · timestamp") — not a repeat of the alt text.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Error fallback</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            When the image fails to load, the fallback renders <code style={{ fontFamily: 'var(--font-mono)' }}>Icons.image</code> (aria-hidden) + the text "Image unavailable". When no <code style={{ fontFamily: 'var(--font-mono)' }}>src</code> is provided, the fallback uses the <code style={{ fontFamily: 'var(--font-mono)' }}>alt</code> value as its label. Both states maintain the frame size — there is no layout collapse.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Loading shimmer</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The loading shimmer is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden="true"</code> — it's a visual affordance only. The <code style={{ fontFamily: 'var(--font-mono)' }}>{'<img>'}</code> is in the DOM during loading with <code style={{ fontFamily: 'var(--font-mono)' }}>opacity: 0</code>, so the alt text is available to assistive technology even before the image paints. Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code>, the shimmer sweep stops; the frame still reserves space.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — figcaption aligns to the start edge; image frame and border are direction-neutral"
        code={`<div dir="rtl">
  <ImageView
    src={img}
    alt="مخطط النشر التدريجي"
    caption="تم إنشاؤه من تعريفات eidos.yaml · identity-svc"
    aspect="16 / 9"
  />
</div>`}
      >
        <div dir="rtl" style={{ width: '100%', maxWidth: 480 }}>
          <ImageView
            src={SVG_WIDE}
            alt="مخطط النشر التدريجي لخدمة identity-svc"
            caption="تم إنشاؤه من تعريفات eidos.yaml · identity-svc · 2026-05-27"
            aspect="16 / 9"
          />
        </div>
      </Frame>
      <Lede>
        The <Mono>{'<figcaption>'}</Mono> inherits the document direction, so in RTL it aligns to the start (right) edge and the text reads right-to-left. The image frame, border, and aspect-ratio lock are direction-neutral — the image itself is never mirrored. No additional props or overrides needed.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 400 }} aria-hidden="true">
              <ImageView
                src={SVG_WIDE}
                alt="Anatomy demo image"
                caption="Generated from eidos.yaml · identity-svc · 2026-05-27"
                aspect="16 / 9"
              />
              {/* pin 1 — frame */}
              <span className="lead h" style={{ top: 40, left: -34, width: 30 }}/>
              <div className="pin" style={{ top: 32, left: -56 }}>1</div>
              {/* pin 2 — image */}
              <span className="lead v" style={{ top: -22, left: 200, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 200, transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — shimmer (show inside the frame area) */}
              <span className="lead h" style={{ top: 90, right: -34, width: 30 }}/>
              <div className="pin" style={{ top: 82, right: -56 }}>3</div>
              {/* pin 4 — caption */}
              <span className="lead v" style={{ bottom: -22, left: 100, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: 100, transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Figure frame.</b> A <Mono>{'<figure>'}</Mono> with a 1px border and rounded corners (toggled by the <Mono>rounded</Mono> prop). The frame preserves the aspect ratio via <Mono>aspect-ratio</Mono> CSS — the space is always reserved, even while loading.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Image.</b> The <Mono>{'<img>'}</Mono> element with the provided <Mono>src</Mono> and <Mono>alt</Mono>. Starts at <Mono>opacity: 0</Mono>, transitions to <Mono>opacity: 1</Mono> on <Mono>onLoad</Mono>. Under <Mono>prefers-reduced-motion</Mono>, the transition is instant.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Loading shimmer.</b> An <Mono>aria-hidden</Mono> overlay that plays while the image fetches and decodes. Replaced by the error fallback on <Mono>onError</Mono>. The fallback is <Mono>Icons.image</Mono> + "Image unavailable" text — same frame size.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Caption (figcaption).</b> A semantic <Mono>{'<figcaption>'}</Mono> below the frame. Use it for provenance: source, service, timestamp, or model name. Inherits the document direction for automatic RTL alignment.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — require alt + caption provenance</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 280 }}>
              <ImageView
                src={SVG_WIDE}
                alt="Ring rollout — canary to 25% to 100% with health gates"
                caption="Generated from eidos.yaml · identity-svc"
                aspect="16 / 9"
              />
            </div>
          </div>
          <div className="note">Alt text describes the content ("Ring rollout — canary to 25% to 100%"); the caption names the source ("Generated from eidos.yaml · identity-svc"). Both are mandatory in AI-generated images so users know what they're looking at and where it came from.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — ship an image with no alt</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 280, border: '2px dashed var(--danger)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface)', aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)' }}>
                {'<ImageView src={img}/>'}
              </div>
            </div>
          </div>
          <div className="note">An image with no alt is inaccessible to screen readers and breaks WCAG 1.1.1 (Non-text content). Always provide at minimum <Mono>alt=""</Mono> for decorative images and a descriptive string for informative ones.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — lock the aspect to prevent layout shift</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 280 }}>
              <ImageView src={SVG_SQUARE} alt="Agent profile tile" aspect="1 / 1" width={120}/>
            </div>
          </div>
          <div className="note">Setting <Mono>aspect</Mono> reserves the correct space before the image loads, eliminating cumulative layout shift. The shimmer plays inside the reserved frame, not in a collapsed zero-height container.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — display untrusted image URLs without sandboxing</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--danger)', lineHeight: 1.5 }}>
              src={'{modelOutput.imageUrl}'}
            </div>
          </div>
          <div className="note">Images from model output can point to arbitrary URLs. Validate and proxy all model-provided image URLs through a server-side allowlist before passing them to <Mono>ImageView</Mono>. Untrusted URLs are a tracking and SSRF vector.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="ImageViewProps">API reference</SubHead>
      <AutoPropsTable component="ImageView" label="<ImageView />"/>
      <Lede>
        The component manages its own loading state internally (<Mono>useState</Mono>) — you do not need to pass a <Mono>loading</Mono> or <Mono>error</Mono> prop. The three states (loading, loaded, error) transition automatically via the <Mono>{'<img>'}</Mono> element's <Mono>onLoad</Mono> and <Mono>onError</Mono> handlers.
      </Lede>
    </Section>
  );
}
