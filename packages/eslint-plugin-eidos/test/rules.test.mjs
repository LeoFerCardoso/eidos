// Self-contained rule tests: drive each rule's AST visitor with hand-built nodes and a
// fake context, so the logic is proven without an ESLint/parser install. (Wiring the
// plugin into CI with a real parser — @typescript-eslint/parser — is the follow-up step.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const plugin = require('../index.js');

/** Run a rule over a list of [visitorName, node] events; return the reports. */
function run(rule, events, options = []) {
  const reports = [];
  const ctx = { options, report: (r) => reports.push(r) };
  const visitors = rule.create(ctx);
  for (const [name, node] of events) if (visitors[name]) visitors[name](node);
  return reports;
}

const jsxEl = (name) => ['JSXOpeningElement', { name: { type: 'JSXIdentifier', name } }];
const jsxMember = () => ['JSXOpeningElement', { name: { type: 'JSXMemberExpression' } }];
const jsxAttr = (name) => ['JSXAttribute', { name: { type: 'JSXIdentifier', name } }];
const literal = (value) => ['Literal', { value }];
const tmpl = (raw) => ['TemplateElement', { value: { raw } }];

test('no-raw-layout-elements flags raw div/section/nav but not components or `as`', () => {
  const rule = plugin.rules['no-raw-layout-elements'];
  assert.equal(run(rule, [jsxEl('div')]).length, 1);
  assert.equal(run(rule, [jsxEl('section')]).length, 1);
  assert.equal(run(rule, [jsxEl('ul'), jsxEl('li')]).length, 2);
  assert.equal(run(rule, [jsxEl('Box')]).length, 0);
  assert.equal(run(rule, [jsxEl('Stack')]).length, 0);
  assert.equal(run(rule, [jsxMember()]).length, 0);
  // `allow` option lets a project keep an escape element during migration.
  assert.equal(run(rule, [jsxEl('div')], [{ allow: ['div'] }]).length, 0);
});

test('no-inline-style flags the style prop but not className', () => {
  const rule = plugin.rules['no-inline-style'];
  assert.equal(run(rule, [jsxAttr('style')]).length, 1);
  assert.equal(run(rule, [jsxAttr('className')]).length, 0);
  assert.equal(run(rule, [jsxAttr('onClick')]).length, 0);
});

test('no-hardcoded-color flags hex / rgb / oklch but not token strings', () => {
  const rule = plugin.rules['no-hardcoded-color'];
  assert.equal(run(rule, [literal('#FF6B35')]).length, 1);
  assert.equal(run(rule, [literal('rgba(0,0,0,0.5)')]).length, 1);
  assert.equal(run(rule, [tmpl('background: oklch(0.2 0 0)')]).length, 1);
  assert.equal(run(rule, [literal('var(--ember)')]).length, 0);
  assert.equal(run(rule, [literal('flex')]).length, 0);
});

test('flat preset wires all three rules to error', () => {
  const preset = plugin.configs['flat/llm-safe'];
  assert.equal(preset.rules['eidos/no-raw-layout-elements'], 'error');
  assert.equal(preset.rules['eidos/no-inline-style'], 'error');
  assert.equal(preset.rules['eidos/no-hardcoded-color'], 'error');
  assert.ok(preset.plugins.eidos);
});
