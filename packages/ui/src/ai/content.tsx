import * as React from 'react';
// Eidos AI — content blocks that show up inside a model reply.
//
// All dep-free: the heavy renderers (mermaid, katex, shiki) live in the doc
// pages / the consumer's app, NOT here. These are the styled surfaces the
// rendered output lands in, plus the loading affordances. Styles: ai.css.
import { Icons } from '../icons';

// ── Shimmer — animated text/label while the model is thinking ─────────────
// A gradient sweep over its content. Use for the "before first token" beat
// ("Thinking…", "Searching the codebase…"). Stops under reduced-motion.
const Shimmer = ({
  children = 'Thinking…',
  className,
  style,
}: {
  /** The text label behind the gradient sweep. Keep under 4 words, end with "…". */
  children?: React.ReactNode;
  /** Additional className appended to .ai-shimmer. Use to adjust font-size or color — not the animation. */
  className?: string;
  /** Inline style override. Avoid overriding animation-related properties — use the class instead. */
  style?: React.CSSProperties;
}) => (
  <span className={'ai-shimmer' + (className ? ' ' + className : '')} style={style} aria-live="polite">
    {children}
  </span>
);

// ── ImageView — an image in a reply ───────────────────────────────────────
// Bordered, rounded, aspect-locked, with a shimmer placeholder until load and
// a graceful error fallback. Pair with a caption for provenance.
//   src / alt   the image
//   caption     ReactNode — figcaption under the image
//   aspect      CSS aspect-ratio (e.g. "16 / 9"); omit for natural
//   width       max width
//   rounded     boolean (default true)
const ImageView = ({
  src,
  alt = '',
  caption,
  aspect,
  width,
  rounded = true,
  className,
  style,
}: {
  /** Image URL. Omit to render the empty fallback. A broken URL triggers the error fallback on onError. */
  src?: string;
  /** Alternative text describing the image content. Pass an empty string only for purely decorative images. */
  alt?: string;
  /** Provenance note rendered as figcaption below the frame. Use for source, service, or model attribution. */
  caption?: React.ReactNode;
  /** CSS aspect-ratio value (e.g. "16 / 9", "1 / 1"). Reserves space before load. Omit for natural dimensions. */
  aspect?: string;
  /** CSS max-width of the figure. Constrains the image to a column without stretching. */
  width?: number | string;
  /** Applies var(--radius-lg) border-radius. Set false for diagrams or charts with content at the edges. */
  rounded?: boolean;
  /** Additional className appended to .ai-image. */
  className?: string;
  /** Inline style override for the figure wrapper. */
  style?: React.CSSProperties;
}) => {
  const [state, setState] = React.useState(src ? 'loading' : 'empty');
  return (
    <figure className={'ai-image' + (rounded ? '' : ' square') + (className ? ' ' + className : '')} style={{ maxWidth: width, ...style }}>
      <div className="ai-image-frame" style={aspect ? { aspectRatio: aspect } : undefined}>
        {state === 'loading' && <span className="ai-image-shimmer" aria-hidden="true"/>}
        {state === 'error' && (
          <div className="ai-image-fallback"><Icons.image size={20}/><span>Image unavailable</span></div>
        )}
        {src && state !== 'error' && (
          <img
            src={src} alt={alt}
            onLoad={() => setState('loaded')}
            onError={() => setState('error')}
            style={{ opacity: state === 'loaded' ? 1 : 0 }}
          />
        )}
        {!src && <div className="ai-image-fallback"><Icons.image size={20}/><span>{alt || 'Image'}</span></div>}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

// ── Diagram — figure slot for a rendered diagram (e.g. Mermaid) ───────────
// The DS does not bundle Mermaid; render it in the page/app and drop the SVG
// here. Reuses the .ai-diagram surface with a mono figcaption.
//   caption  ReactNode — fig caption
//   children the rendered <svg> / markup
const Diagram = ({
  caption,
  children,
  className,
  style,
}: {
  caption?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <figure className={'ai-diagram' + (className ? ' ' + className : '')} style={style}>
    {children}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

// ── Math — styled slot for rendered TeX (KaTeX) ───────────────────────────
// The DS does not bundle KaTeX; render it in the page/app (renderToString)
// and pass the HTML, or pass children. `display` switches inline vs block.
//   display  boolean — block (centered, own line) vs inline
//   html     string  — pre-rendered KaTeX HTML (dangerouslySet)
const MathView = ({
  display = false,
  html,
  children,
  className,
  style,
  ...rest
}: {
  /** Block display mode — renders as div, centered, with displayMode spacing. Match with KaTeX renderToString({ displayMode: true }). */
  display?: boolean;
  /** Pre-rendered KaTeX HTML string from renderToString(). When provided, set via dangerouslySetInnerHTML. */
  html?: string;
  /** Fallback slot when html is not provided — render plain text math or a Skeleton here. */
  children?: React.ReactNode;
  /** Appended to .ai-math (and .block when display=true). */
  className?: string;
  /** Inline styles on the wrapper element. */
  style?: React.CSSProperties;
  [x: string]: any;
}) => {
  const cls = 'ai-math' + (display ? ' block' : '') + (className ? ' ' + className : '');
  const Tag = display ? 'div' : 'span';
  if (html != null) {
    return <Tag className={cls} style={style} role="math" {...rest} dangerouslySetInnerHTML={{ __html: html }}/>;
  }
  return <Tag className={cls} style={style} role="math" {...rest}>{children}</Tag>;
};

export { Shimmer, ImageView, Diagram, MathView };
