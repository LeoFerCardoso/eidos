// Generate PropsTable rows from the typed core components (DS-GAP-ANALYSIS P3.13).
// Now that core props are typed, the API tables can be derived from the source of
// truth instead of hand-maintained (which drifts). Walks src/ds/core/** with the
// TS compiler, and for every component whose first param is an object pattern with
// a TypeLiteral annotation, emits { prop, type, default, required, description }.
//   node scripts/gen-props.mjs   → src/ds/core/props.generated.ts
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');

const FILES = [];
function walk(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p) && !p.endsWith('.generated.ts') && !p.endsWith('.stories.tsx') && n !== 'index.ts') FILES.push(p);
  }
}
// The docs-free component modules were extracted to the @forge/ui workspace
// package; the docs-shell primitives + AI sub-DS are still local. Walk both so
// GENERATED_PROPS (consumed by <AutoPropsTable/>) covers the whole catalog.
for (const root of ['src/ds/core', 'packages/ui/src']) {
  try { walk(root); } catch { /* root may not exist yet during migration */ }
}

const props = {}; // componentName -> rows[]

function jsdoc(node, sf) {
  const ranges = ts.getJSDocCommentsAndTags ? ts.getJSDocCommentsAndTags(node) : [];
  for (const r of ranges) {
    const c = r.comment;
    if (typeof c === 'string' && c.trim()) return c.trim().replace(/\s+/g, ' ');
  }
  return undefined;
}

// Collect interface / type-alias declarations in a source file so a param typed
// by a NAMED ref (`{…}: ModalProps`) resolves the same as an inline TypeLiteral.
function collectTypeDecls(sf) {
  const map = new Map();
  ts.forEachChild(sf, function v(node) {
    if (ts.isInterfaceDeclaration(node) && node.name) map.set(node.name.getText(sf), node);
    else if (ts.isTypeAliasDeclaration(node) && node.name) map.set(node.name.getText(sf), node);
    ts.forEachChild(node, v);
  });
  return map;
}

// Members of a named interface/alias, merging local `extends` heritage (own wins).
function declMembers(name, decls, sf, seen) {
  if (seen.has(name)) return [];
  seen.add(name);
  const node = decls.get(name);
  if (!node) return [];
  if (ts.isInterfaceDeclaration(node)) {
    let members = [...node.members];
    if (node.heritageClauses) {
      for (const h of node.heritageClauses) {
        for (const t of h.types) {
          const hn = t.expression.getText(sf); // local interface name, or React.HTMLAttributes (skipped)
          if (decls.has(hn)) members = members.concat(declMembers(hn, decls, sf, seen));
        }
      }
    }
    return members;
  }
  if (ts.isTypeAliasDeclaration(node)) return membersFromTypeNode(node.type, decls, sf, seen);
  return [];
}

// Resolve a type node to its property-signature members (TypeLiteral, named ref,
// or intersection of those). Utility refs (Omit/Pick/React.*) that aren't local
// resolve to nothing — we surface the explicit, authored props.
function membersFromTypeNode(typeNode, decls, sf, seen = new Set()) {
  if (!typeNode) return [];
  if (ts.isTypeLiteralNode(typeNode)) return [...typeNode.members];
  if (ts.isTypeReferenceNode(typeNode)) return declMembers(typeNode.typeName.getText(sf), decls, sf, seen);
  if (ts.isIntersectionTypeNode(typeNode)) {
    let acc = [];
    for (const t of typeNode.types) acc = acc.concat(membersFromTypeNode(t, decls, sf, seen));
    return acc;
  }
  return [];
}

// Pull rows from a resolved props type node; defaults come from the (optional)
// destructured render param.
function rowsFromType(typeNode, param, sf, decls) {
  if (!typeNode) return null;
  const members = membersFromTypeNode(typeNode, decls, sf);
  if (!members.length) return null;
  // defaults from the binding pattern (name -> default text), when destructured
  const defaults = {};
  if (param && param.name && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) {
      if (el.initializer) defaults[el.propertyName?.getText(sf) || el.name.getText(sf)] = el.initializer.getText(sf);
    }
  }
  const rows = [];
  const seen = new Set();
  for (const m of members) {
    if (!ts.isPropertySignature(m) || !m.name) continue;
    const prop = m.name.getText(sf).replace(/^["']|["']$/g, '');
    if (prop.startsWith('[')) continue; // index signature ([x: string]: any)
    if (seen.has(prop)) continue;       // own member already won (declared first)
    seen.add(prop);
    const type = m.type ? m.type.getText(sf).replace(/\s+/g, ' ') : 'any';
    const def = defaults[prop];
    const optional = !!m.questionToken || def != null;
    const row = { prop, type };
    if (def != null) row.default = def;
    if (!optional) row.required = true;
    const d = jsdoc(m, sf);
    if (d) row.description = d;
    rows.push(row);
  }
  return rows.length ? rows : null;
}

function unwrapFn(fn) {
  if (!fn) return null;
  if (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn) || ts.isFunctionDeclaration(fn)) return fn;
  return null;
}

// React.FC<P> / FC<P> / React.FunctionComponent<P> → P (the props type arg).
function fcTypeArg(typeNode) {
  if (typeNode && ts.isTypeReferenceNode(typeNode) && typeNode.typeArguments && typeNode.typeArguments.length) {
    if (/(^|\.)(FC|FunctionComponent)$/.test(typeNode.typeName.getText())) return typeNode.typeArguments[0];
  }
  return null;
}

// Resolve a declaration to { param, typeNode } covering the real authoring shapes:
//   function X(p: P) / const X = (p: P) => / const X = forwardRef<Ref,P>((p,ref)=>)
//   const X = memo<P>(fn) / const X: React.FC<P> = (...) =>
// Props type priority: explicit param annotation → forwardRef/memo generic → FC<> annotation.
function resolveComponent(node) {
  if (ts.isFunctionDeclaration(node)) {
    const p = node.parameters[0];
    return p ? { param: p, typeNode: p.type || null } : null;
  }
  if (!ts.isVariableDeclaration(node)) return null;
  let init = node.initializer;
  let callTypeArg = null;
  while (init && ts.isCallExpression(init) && init.arguments.length) {
    if (init.typeArguments && init.typeArguments.length) {
      callTypeArg = /forwardRef$/.test(init.expression.getText())
        ? (init.typeArguments[1] || init.typeArguments[0]) // forwardRef<Ref, Props>
        : init.typeArguments[0];                            // memo<Props>
    }
    init = init.arguments[0];
  }
  const fn = unwrapFn(init);
  const param = fn && fn.parameters && fn.parameters.length ? fn.parameters[0] : null;
  const typeNode = (param && param.type) || callTypeArg || fcTypeArg(node.type);
  return (param || typeNode) ? { param, typeNode } : null;
}

const aliases = {}; // PascalCase name -> source identifier (e.g. Toaster -> ToastProvider)

for (const file of FILES) {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const decls = collectTypeDecls(sf);
  ts.forEachChild(sf, function visit(node) {
    const declsToScan = ts.isVariableStatement(node) ? node.declarationList.declarations
      : ts.isFunctionDeclaration(node) ? [node] : [];
    for (const decl of declsToScan) {
      const name = (decl.name && decl.name.getText(sf)) || '';
      if (!/^[A-Z]/.test(name)) continue; // components are PascalCase
      // simple re-export alias: `const Toaster = ToastProvider`
      if (ts.isVariableDeclaration(decl) && decl.initializer && ts.isIdentifier(decl.initializer)) {
        if (!aliases[name]) aliases[name] = decl.initializer.getText(sf);
      }
      const resolved = resolveComponent(decl);
      if (!resolved) continue;
      const rows = rowsFromType(resolved.typeNode, resolved.param, sf, decls);
      if (rows && !props[name]) props[name] = rows; // first definition wins
    }
    ts.forEachChild(node, visit);
  });
}

// Resolve identifier aliases (Toaster ← ToastProvider) once all rows are collected.
for (const [name, src] of Object.entries(aliases)) {
  if (!props[name] && props[src]) props[name] = props[src];
}

const names = Object.keys(props).sort();
const out =
  `// AUTO-GENERATED by scripts/gen-props.mjs — do not edit by hand.\n` +
  `// PropsTable rows derived from the typed core components. Re-run after changing\n` +
  `// a component's prop type. Rendered via <AutoPropsTable component="Name"/>.\n` +
  `/* eslint-disable */\n` +
  `export type GeneratedPropRow = { prop: string; type: string; default?: string; required?: boolean; description?: string };\n` +
  `export const GENERATED_PROPS: Record<string, GeneratedPropRow[]> = ${JSON.stringify(props, null, 2)};\n`;
writeFileSync('src/ds/core/props.generated.ts', out);
const rowCount = names.reduce((a, n) => a + props[n].length, 0);
console.log(`Wrote src/ds/core/props.generated.ts — ${names.length} components, ${rowCount} prop rows.`);
