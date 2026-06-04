# Layout & spacing rules

Universal craft for how things sit on a page. These are the failures a reviewer
notices in one glance — misalignment, gratuitous boxing, rounding where a list
should be flat. Several are checkable by eye against the **rendered** screen, not
the source: alignment is a pixel property. Verify it by looking, not by reading CSS.

## The seven layout sins (P0 — must-fix)

1. **One column, one left edge.** Every block in a content area shares the same
   inline-start edge: eyebrow, title, support line, tabs, toolbar, and the list/
   table content below. If the list starts even 8px to the right of the title, it
   reads as broken. The header and the body align.

2. **Spacing lives INSIDE items, never as an outer margin on list rows.** A list/
   table row gets its breathing room from **padding**. Do NOT put `margin-inline`
   (or `margin-left/right`) on a row — an outer margin pushes the whole list out
   of column alignment (see sin #1). The row surface (hover, selected, unread
   band) spans the column edge-to-edge; the content is inset by padding.

3. **A list row is square. So is a table row.** No `border-radius` on rows of a
   list/feed/table. Rounding belongs to genuine cards and controls, not to rows.
   Separate rows with a **hairline divider** (`1px solid var(--border)`), like a
   table — not with gaps-and-rounding that turn each row into a floating chip.

4. **Flat-first. A card only separates concerns.** Default to no card. Reach for a
   bordered/elevated surface ONLY when two or more *distinct subjects* share space
   and need a boundary. One subject in a region (a single list, one tab's content)
   = no card. NEVER nest cards. A list inside a box inside a tab panel is three
   frames around one idea.

5. **Watch carded-by-default components.** Some primitives ship a card you didn't
   ask for. In this DS, `TabsContent` (`.eidos-tabpanel`) renders WITH padding +
   border + elevated bg; a Frame/Section may too. When the panel holds a single
   list, flatten it (scoped override) — don't leave the accidental card.

6. **Primary content runs full-bleed in its content area.** Don't shrink a list/
   table/feed into a centered narrow max-width card on a wide page. It spans the
   column it owns (respecting the page inset) so rows use the width: right-aligned
   timestamps, trailing actions, metadata columns.

7. **Utility controls pin to the trailing edge.** Search / filter / view-toggle sit
   at the inline-end of their bar, clear of the tabs. When a tab indicator and the
   bar's divider must align, drop the tablist onto the bar baseline
   (`align-items: flex-end`) so the active underline lands exactly on the divider.

## Spacing discipline (P1)

- **Use the spacing scale, not magic numbers.** Reach for the shared gap/inset
  tokens (`--fp-*`, the 4px rhythm) before hardcoding `margin: 13px`.
- **Alternating density reads as intentional.** One tight section, one breathing
  section. A perfectly even grid of equal padding everywhere reads as template.
- **Optical alignment beats mathematical.** An icon next to text often needs a 1px
  nudge; a number column aligns on its digits, not its box.

## How to verify (this is the actual gate)

Alignment cannot be trusted from source. Before declaring a screen done:

1. **Screenshot the rendered page** (headless is fine) and look at it.
2. **Drop a vertical guide on the title's left edge** (mentally or with a rule) and
   confirm the eyebrow, tabs, toolbar, AND every list row's surface share it.
3. **Confirm no row has an outer margin** (sin #2) and **no list row is rounded**
   (sin #3).
4. **Confirm every boxed region earns its box** (sin #4): name the distinct concern
   it separates. If you can't, delete the box.

If a reviewer screenshots the screen and the body doesn't align to the header, or a
single list sits in a card, it ships as a regression — not a style preference.
