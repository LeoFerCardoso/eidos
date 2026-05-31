import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Carousel,
  CarouselSlide,
  CarouselPrev,
  CarouselNext,
  CarouselDots,
  CarouselControls,
} from '@eidos/ui';

// ── Helpers ──────────────────────────────────────────────────────────────────

const SLIDE_STYLE: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const THUMB_STYLE: React.CSSProperties = {
  aspectRatio: '4 / 3',
  background:
    'linear-gradient(135deg, color-mix(in oklab, #FF6B35 20%, transparent), color-mix(in oklab, #A78BFA 18%, transparent)), var(--surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--fg-muted)',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  borderBottom: '1px solid var(--border)',
};

const BODY_STYLE: React.CSSProperties = {
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const TITLE_STYLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--fg)',
};

const DESC_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--fg-muted)',
  lineHeight: 1.5,
};

interface SlideData {
  tag: string;
  title: string;
  desc: string;
}

const FEATURES: SlideData[] = [
  { tag: 'NEW',    title: 'Fluid type scale',  desc: 'clamp() across every heading, once in tokens.' },
  { tag: 'UPDATE', title: 'Dark mode tokens',  desc: 'Six surface levels + automatic contrast.' },
  { tag: 'NEW',    title: 'Tailwind v4 preset', desc: 'Drop-in @theme block. Zero config.' },
  { tag: 'NEW',    title: 'Framer Motion 11',  desc: 'Pre-tuned motion variants per surface.' },
  { tag: 'UPDATE', title: 'Accessible focus',  desc: 'Ember rings everywhere — bye, browser blue.' },
  { tag: 'NEW',    title: 'RTL contract',      desc: 'Logical properties throughout. One attribute.' },
];

const HEROES: SlideData[] = [
  { tag: 'RELEASE', title: 'Eidos 1.1', desc: '7 new components, full alphabetical sort.' },
  { tag: 'GUIDE',   title: 'Tailwind v4 setup', desc: 'A 90-second walkthrough of the preset.' },
  { tag: 'ROADMAP', title: 'Coming next', desc: 'Combobox, command palette, and a chart kit.' },
];

const FEATURES_AR: SlideData[] = [
  { tag: 'جديد',  title: 'مقياس الخط المرن', desc: 'clamp() لكل عنوان في الرموز.' },
  { tag: 'تحديث', title: 'رموز الوضع الداكن', desc: 'ست طبقات سطح + تباين تلقائي.' },
  { tag: 'جديد',  title: 'إعداد Tailwind v4', desc: 'كتلة @theme بدون أي تكوين.' },
  { tag: 'جديد',  title: 'Framer Motion 11',  desc: 'متغيرات حركة مضبوطة لكل سطح.' },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Elements/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A gesture/drag/snap carousel built on embla-carousel-react. ' +
          'Provides prev/next arrows, dot indicators, autoplay (pauses on hover/focus/reduced-motion), ' +
          'full keyboard support, and RTL via Embla\'s direction option.',
      },
    },
  },
  args: {
    variant: 'default',
    orientation: 'horizontal',
    label: 'Feature highlights',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'hero'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    autoplayInterval: { control: { type: 'number', min: 0, step: 500 } },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ────────────────────────────────────────────────────────────────

/** Standard card carousel with 6 slides, prev/next arrows, and dot indicators. */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <Carousel {...args}>
        {FEATURES.map((s) => (
          <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>
        ))}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

// ── Hero ───────────────────────────────────────────────────────────────────

/** Full-width hero carousel — each slide occupies 100% of the viewport. */
export const Hero: Story = {
  args: { variant: 'hero', label: 'Featured content' },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <Carousel {...args}>
        {HEROES.map((h) => (
          <CarouselSlide key={h.title} style={{ flex: '0 0 100%', aspectRatio: '16 / 7', position: 'relative', background: 'var(--surface)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, padding: 28,
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6,
              background: 'linear-gradient(0deg, rgba(8,9,10,0.6), transparent 60%)',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: '#FF6B35', textTransform: 'uppercase' }}>{h.tag}</span>
              <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg)' }}>{h.title}</span>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{h.desc}</span>
            </div>
          </CarouselSlide>
        ))}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

// ── AutoPlay ───────────────────────────────────────────────────────────────

/** Autoplay at 3000ms — pauses on hover/focus; disabled under prefers-reduced-motion. */
export const Autoplay: Story = {
  args: { autoplayInterval: 3000, opts: { loop: true }, label: 'Auto-advancing carousel' },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <Carousel {...args}>
        {FEATURES.map((s) => (
          <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>
        ))}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

// ── Loop ───────────────────────────────────────────────────────────────────

/** Loop mode — arrows never disable; wraps from last to first. */
export const Loop: Story = {
  args: { opts: { loop: true }, label: 'Looping carousel' },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <Carousel {...args}>
        {FEATURES.map((s) => (
          <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>
        ))}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

// ── RTL ────────────────────────────────────────────────────────────────────

/**
 * RTL direction — track scrolls right-to-left; chevrons mirror via CSS.
 * Use the trailing-start variant to verify logical anchoring.
 */
export const RTL: Story = {
  args: { label: 'مزايا مميّزة' },
  render: (args) => (
    <div dir="rtl" style={{ width: '100%', maxWidth: 720 }}>
      <Carousel {...args}>
        {FEATURES_AR.map((s) => (
          <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>
        ))}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

// ── InContext ──────────────────────────────────────────────────────────────

/** Carousel embedded in a realistic product-update feed card. */
export const InContext: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 24,
        maxWidth: 680,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>What&apos;s new</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginTop: 4 }}>Eidos 1.1 — release highlights</div>
          </div>
          <button
            type="button"
            style={{ fontSize: 12, color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => setOpen(!open)}
          >
            {open ? 'Collapse' : 'Show all'}
          </button>
        </div>
        <Carousel label="Release highlights" opts={{ align: 'start' }}>
          {FEATURES.slice(0, open ? 6 : 4).map((s) => (
            <CarouselSlide key={s.title} width="200px">
              <div style={SLIDE_STYLE}>
                <div style={THUMB_STYLE}>{s.tag}</div>
                <div style={BODY_STYLE}>
                  <span style={TITLE_STYLE}>{s.title}</span>
                  <span style={DESC_STYLE}>{s.desc}</span>
                </div>
              </div>
            </CarouselSlide>
          ))}
          <CarouselControls />
          <CarouselDots />
        </Carousel>
        <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>Eidos Design System · v1.1.0 · 2026-05-30</div>
      </div>
    );
  },
};
