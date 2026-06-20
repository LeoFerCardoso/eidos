// Eidos System layer — the LLM-safe typed layout vocabulary.
//
// One primitive (`Box`) + presets (`Stack`/`Inline`/`Grid`/`Center`) styled solely
// through design-token props. No `className`/`style` surface, so off-system values do
// not type-check. Pair with `eslint-plugin-eidos` to ban raw `<div>`/inline `style` in
// consumer code. The atomic stylesheet is "@eidos/ui/styles/system.gen.css".
export { Box } from './box';
export type { BoxProps, BoxStyleProps } from './box';
export { Stack, Inline, Grid, Center } from './layout';
export * from './tokens.gen';
