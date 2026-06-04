# Anti-AI-slop rules

Concrete, checkable rules that distinguish "designed by a human who has
shipped product" from "default LLM output." Several rules below are
auto-enforced by the daemon's `lint-artifact` linter — failing an
enforced rule is not a style preference, it is a regression. The
rest are guidance for agents and reviewers and are flagged inline as
"(guidance, not auto-checked)" so the contract with the linter stays
honest.

> Adapted from [refero_skill](https://github.com/referodesign/refero_skill)
> (MIT), tightened to match Open Design's lint surface.

## The seven cardinal sins

These are the patterns the linter blocks at P0 (must-fix):

1. **Default Tailwind indigo as accent** — exactly `#6366f1`, `#4f46e5`,
   `#4338ca`, `#3730a3`, `#8b5cf6`, `#7c3aed`, `#a855f7`. The active
   `DESIGN.md` provides `--accent`; use it. Indigo is the textbook AI
   tell. (The daemon's `lint-artifact` flags any of these as a solid
   accent; keep this list in sync with `AI_DEFAULT_INDIGO` in
   `apps/daemon/src/lint-artifact.ts`.)
2. **Two-stop "trust" gradient on the hero** — purple→blue, blue→cyan,
   indigo→pink. A flat surface + intentional type beats this every
   time.
3. **Emoji as feature icons** — `✨`, `🚀`, `🎯`, `⚡`, `🔥`, `💡`
   inside `<h*>`, `<button>`, `<li>`, or `class*="icon"`. Use
   1.6–1.8px-stroke monoline SVG with `currentColor`.
4. **Sans-serif on display text when the seed binds a serif** — h1/h2
   must use `var(--font-display)`, not a hardcoded Inter / Roboto /
   `system-ui`.
5. **Rounded card with a colored left-border accent** — the canonical
   "AI dashboard tile" shape. Drop either the radius or the left
   border.
6. **Invented metrics** — "10× faster", "99.9% uptime", "3× more
   productive". Either pull from a real source or use a labelled
   placeholder.
7. **Filler copy** — `lorem ipsum`, `feature one / two / three`,
   `placeholder text`, `sample content`. An empty section is a design
   problem to solve with composition, not by inventing words.

## Soft tells (P1 — should fix)

- **Standard "Hero → Features → Pricing → FAQ → CTA" sequence with no
  variation** *(guidance, not auto-checked)*. This is the AI-template
  skeleton; introduce at least one unconventional section (testimonial
  wall as full-bleed quote, pricing as comparison-against-status-quo,
  an inline mini-product-demo).
- **External placeholder image CDNs** (`unsplash.com`, `placehold.co`,
  `placekitten.com`, `picsum.photos`). Fragile and obvious. Use the
  shipped `.ph-img` placeholder class.
- **More than ~12 raw hex values outside `:root`.** Tokens were not
  honoured.
- **`var(--accent)` used 6+ times in the rendered body.** Cap at 2
  visible uses per screen.

## Polish tells (P2 — nice to fix)

- **Sections without `data-od-id`** — comment mode can't target them.
- **Decorative blob / wave SVG backgrounds** *(guidance, not
  auto-checked)* — meaningless geometry.
- **Perfect symmetric layout with no visual tension** *(guidance, not
  auto-checked)* — alternating density (one tight section, one
  breathing section) reads as intentional.

## Layout & copy discipline (P0 — these are the ones humans notice)

These caught real reviewer ire. Treat as must-fix.

- **Flat-first is the default.** Prioritise a flat screen; reach for a card /
  border / elevated surface ONLY when two or more distinct concerns genuinely
  need a boundary. When in doubt, no card. Beware components that are carded by
  default when you don't want it — e.g. the DS `TabsContent` (`.eidos-tabpanel`)
  ships with padding + border + elevated bg; flatten it (scoped) when the panel
  holds a single list.
- **Card-in-card / gratuitous carding.** A card's job is to *separate
  concerns* — distinct subjects that need a visual boundary. A region with
  **one subject** (a single list, a single table, one tab's content) gets
  **no card**, just the content. NEVER nest a card inside a card. A list inside
  a bordered box inside a tab panel is three frames around one idea. Default to
  the bare list/table; add a card only when two or more subjects share a row and
  must be told apart.
- **Primary content runs full-bleed inside its content area.** Don't shrink a
  list / table / feed into a centered narrow card with a max-width and a border.
  The list spans edge-to-edge of the column it owns (respecting the page inset),
  so rows use the width: right-aligned timestamps, trailing actions, metadata
  columns. Centered-narrow-card-on-a-wide-page is an AI tell.
- **No em-dash (the long dash glyph) in UI copy.** It is a default-LLM
  signature; humans use it in long-form literary prose, not interface text. In
  rendered copy use a period, comma, colon, or middot (`·`). (Applies to copy,
  not code comments.)
- **Support text must earn its place.** Eyebrow then title then support line is
  fine, but the support line must add what the title does not: a real count, the
  actionable item, a status. Not a decorative restatement ("Everything across
  your estate…"). If deleting it loses no information, it was filler. Lead with
  what the user can act on.
- **Utility controls don't crowd primary navigation.** Search / filter / view
  toggle pin to the trailing (right) edge of their bar, clear of the tabs. Tabs
  are navigation; a search box wedged against them reads as unconsidered.
- **A richer surface shows richer content.** A full page is not a blown-up
  popover. If a compact surface summarises (one line per item), the dedicated
  page shows more per item: a detail/snippet line, real metadata, per-row
  actions. Not the same summary stretched across more whitespace.

## How to add soul without breaking the rules

Aim for **~80% proven patterns + ~20% distinctive choice**. The 20%
should live in:

- One bold visual move — a typography choice, a single color decision,
  an unexpected proportion.
- Voice and microcopy — a button that says "Start tracking" beats one
  that says "Get started".
- One micro-interaction the user will remember — a button press that
  moves 2px, a number that counts up.
- One detail that could only have been put there by someone who used
  the product (a subtle kbd shortcut hint, a status badge with
  product-specific phrasing).

If a reviewer screenshots the artifact and someone outside the project
can identify which product it's from — you have soul. If not, you
shipped a template.
