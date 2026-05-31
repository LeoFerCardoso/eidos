import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@eidos/ui';

// ── Shared sample data ────────────────────────────────────────────────────────

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

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Vertically stacked expandable rows. Compound API: ' +
          '<Accordion> wraps <AccordionItem value>, which wraps <AccordionTrigger> and <AccordionContent>. ' +
          'Keyboard: ArrowDown/Up move between triggers, Home/End jump first/last, Enter/Space toggle.',
      },
    },
  },
  args: {
    type: 'single',
    collapsible: true,
    variant: 'default',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean' },
    variant: { control: 'inline-radio', options: ['default', 'ghost'] },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default single-open with the first row expanded. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string>('q1');
    return (
      <Accordion {...args} value={value} onValueChange={(v) => setValue(v as string)}>
        {FAQ.map(({ value: v, q, a }) => (
          <AccordionItem key={v} value={v}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent><p>{a}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};

/** Multiple items can be open simultaneously. */
export const Multiple: Story = {
  args: { type: 'multiple' },
  render: (args) => {
    const [value, setValue] = React.useState<string[]>(['q1', 'q2']);
    return (
      <Accordion {...args} value={value} onValueChange={(v) => setValue(v as string[])}>
        {FAQ.map(({ value: v, q, a }) => (
          <AccordionItem key={v} value={v}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent><p>{a}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};

/** Ghost variant — borderless, dividers only between rows. */
export const Ghost: Story = {
  args: { variant: 'ghost' },
  render: (args) => {
    const [value, setValue] = React.useState<string>('q1');
    return (
      <Accordion {...args} value={value} onValueChange={(v) => setValue(v as string)}>
        {FAQ.map(({ value: v, q, a }) => (
          <AccordionItem key={v} value={v}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent><p>{a}</p></AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};

/** Uncontrolled with defaultValue — no external state needed. */
export const Uncontrolled: Story = {
  render: () => (
    <Accordion type="single" defaultValue="q2" collapsible>
      {FAQ.map(({ value, q, a }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent><p>{a}</p></AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** RTL — chevron flips to the leading edge (logical CSS). */
export const RTL: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('r1');
    return (
      <div dir="rtl">
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
              <p>نعم. تُشحن الرموز كمتغيرات CSS عادية، وإعداد Tailwind اختياري.</p>
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
  },
};

/** In-context — accordion inside a settings surface. */
export const InContext: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>('shipping');
    return (
      <div style={{ maxWidth: 560, background: 'var(--surface)', borderRadius: 10, padding: 24 }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 16 }}>
          Shipping &amp; delivery
        </p>
        <Accordion type="single" variant="ghost" value={value} onValueChange={(v) => setValue(v as string)} collapsible>
          <AccordionItem value="shipping">
            <AccordionTrigger>Standard delivery — 3 to 5 business days</AccordionTrigger>
            <AccordionContent>
              <p>Free on orders over $50. Ships from the closest fulfillment center. Tracking emailed once the carrier scans.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="express">
            <AccordionTrigger>Express delivery — next business day</AccordionTrigger>
            <AccordionContent>
              <p>Available on most orders placed before 2pm local time. $14.95 flat. Saturday delivery in metro areas.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="international">
            <AccordionTrigger>International — 7 to 14 business days</AccordionTrigger>
            <AccordionContent>
              <p>Duties and taxes are calculated at checkout. Some countries have restricted SKUs flagged at the cart level.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};
