import * as React from 'react';

const escapeHtml = (s) => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const tokJs = (src) => {
  const out = [];
  const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:className|onClick|onChange|onSubmit|onKeyDown|onKeyUp|onFocus|onBlur|style|key|ref|href|src|alt|type|value|placeholder|disabled|checked|readOnly|required|role|id|name|lang|dir|title|width|height|aria-[a-z]+|data-[a-z-]+)\b)(?=\s*=)|(\b(?:const|let|var|function|return|import|from|export|default|if|else|for|of|in|new|class|extends|await|async|try|catch|finally|throw|while|do|switch|case|break|continue|typeof|instanceof|null|true|false|undefined|this|super)\b)|(\b[A-Z][A-Za-z0-9_$]*\b)|(=>)/g;
  let pos = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > pos) out.push({ t: '', v: src.slice(pos, m.index) });
    if (m[1])      out.push({ t: 'c', v: m[0] });
    else if (m[2]) out.push({ t: 's', v: m[0] });
    else if (m[3]) out.push({ t: 'a', v: m[0] });
    else if (m[4]) out.push({ t: 'k', v: m[0] });
    else if (m[5]) out.push({ t: 'f', v: m[0] });
    else if (m[6]) out.push({ t: 'k', v: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < src.length) out.push({ t: '', v: src.slice(pos) });
  return out;
};

const tokCss = (src) => {
  const out = [];
  const re = /(\/\*[\s\S]*?\*\/)|(--[A-Za-z0-9-]+)|(@[a-z-]+)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?(?:px|em|rem|%|s|ms|deg|vh|vw|fr|ch|ex)?\b)/g;
  let pos = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > pos) out.push({ t: '', v: src.slice(pos, m.index) });
    if (m[1])      out.push({ t: 'c', v: m[0] });
    else if (m[2]) out.push({ t: 'n', v: m[0] });
    else if (m[3]) out.push({ t: 'k', v: m[0] });
    else if (m[4]) out.push({ t: 's', v: m[0] });
    else if (m[5]) out.push({ t: 'f', v: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < src.length) out.push({ t: '', v: src.slice(pos) });
  return out;
};

const tokHtml = (src) => {
  const out = [];
  let i = 0;
  while (i < src.length) {
    // <!-- comment -->
    if (src.substr(i, 4) === '<!--') {
      const end = src.indexOf('-->', i + 4);
      const stop = end === -1 ? src.length : end + 3;
      out.push({ t: 'c', v: src.slice(i, stop) });
      i = stop; continue;
    }
    // <!DOCTYPE …>
    if (src.substr(i, 2) === '<!') {
      const end = src.indexOf('>', i);
      const stop = end === -1 ? src.length : end + 1;
      out.push({ t: 'c', v: src.slice(i, stop) });
      i = stop; continue;
    }
    // tag
    if (src[i] === '<') {
      const slash = src[i + 1] === '/';
      let n = i + 1 + (slash ? 1 : 0);
      const nameStart = n;
      while (n < src.length && /[A-Za-z0-9_-]/.test(src[n])) n++;
      out.push({ t: '', v: '<' + (slash ? '/' : '') });
      if (n > nameStart) out.push({ t: 'f', v: src.slice(nameStart, n) });
      // attributes / self-close
      while (n < src.length && src[n] !== '>') {
        if (src[n] === '/') { out.push({ t: '', v: '/' }); n++; continue; }
        if (/\s/.test(src[n])) { out.push({ t: '', v: src[n] }); n++; continue; }
        const aStart = n;
        while (n < src.length && /[A-Za-z0-9_:-]/.test(src[n])) n++;
        if (n > aStart) out.push({ t: 'a', v: src.slice(aStart, n) });
        if (src[n] === '=') {
          out.push({ t: '', v: '=' }); n++;
          if (src[n] === '"' || src[n] === "'") {
            const q = src[n];
            const end = src.indexOf(q, n + 1);
            const stop = end === -1 ? src.length : end + 1;
            out.push({ t: 's', v: src.slice(n, stop) });
            n = stop;
          } else {
            const vs = n;
            while (n < src.length && !/[\s>]/.test(src[n])) n++;
            if (n > vs) out.push({ t: 's', v: src.slice(vs, n) });
          }
        } else if (n === aStart) {
          // Stuck — emit one char as plain to avoid infinite loop
          out.push({ t: '', v: src[n] });
          n++;
        }
      }
      if (src[n] === '>') { out.push({ t: '', v: '>' }); n++; }
      i = n; continue;
    }
    // text content up to next tag
    const next = src.indexOf('<', i);
    const stop = next === -1 ? src.length : next;
    out.push({ t: '', v: src.slice(i, stop) });
    i = stop;
  }
  return out;
};

const tokBash = (src) => {
  const out = [];
  const re = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\$[A-Za-z_][A-Za-z0-9_]*|\$\{[^}]+\})/g;
  let pos = 0, m;
  while ((m = re.exec(src))) {
    if (m.index > pos) out.push({ t: '', v: src.slice(pos, m.index) });
    if (m[1])      out.push({ t: 'c', v: m[0] });
    else if (m[2]) out.push({ t: 's', v: m[0] });
    else if (m[3]) out.push({ t: 'n', v: m[0] });
    pos = m.index + m[0].length;
  }
  if (pos < src.length) out.push({ t: '', v: src.slice(pos) });
  return out;
};

const sniffHtml = (src) => {
  const head = src.replace(/^\s+/, '').slice(0, 200);
  if (!head.startsWith('<')) return false;
  if (/\b(const|function|return|import|export|=>)\b/.test(head)) return false;
  return true;
};

const tokenize = (src, lang='jsx') => {
  const code = String(src);
  const norm = (lang || 'jsx').toLowerCase();
  let chosen = norm;
  if (chosen === 'jsx' || chosen === 'js' || chosen === 'ts' || chosen === 'tsx') {
    if (sniffHtml(code)) chosen = 'html';
  }
  let tokens;
  if      (chosen === 'html') tokens = tokHtml(code);
  else if (chosen === 'css')  tokens = tokCss(code);
  else if (chosen === 'bash' || chosen === 'sh' || chosen === 'shell' || chosen === 'terminal') tokens = tokBash(code);
  else                        tokens = tokJs(code);
  return tokens
    .map(t => t.t ? '<span class="' + t.t + '">' + escapeHtml(t.v) + '</span>' : escapeHtml(t.v))
    .join('');
};

const Code = ({ children, lang = 'jsx' }: { children?: React.ReactNode; lang?: string }) => {
  const html = { __html: tokenize(String(children).replace(/^\n+|\s+$/g, ''), lang) };
  return <pre className="ds-code"><code dangerouslySetInnerHTML={html} /></pre>;
};

export { Code };
