import * as React from 'react';
import { Icons } from '@/components/forge/icons';

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

export { ImageView };
