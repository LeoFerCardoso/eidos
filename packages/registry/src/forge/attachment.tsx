import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface AttachmentFile {
  name: string;
  size: string;
  kind: 'file' | 'image';
  url?: string;
  hue?: number;
}

const FakeImage = ({ hue = 12 }: { hue?: number }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <defs>
      <linearGradient id={'fg' + hue} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"  stopColor={`hsl(${hue}, 80%, 55%)`}/>
        <stop offset="100%" stopColor={`hsl(${hue + 60}, 70%, 45%)`}/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" fill={`url(#fg${hue})`}/>
    <circle cx="28" cy="14" r="4" fill="rgba(255,255,255,0.35)"/>
    <path d="M 4 36 L 14 22 L 22 30 L 32 18 L 40 28 L 40 40 L 4 40 Z" fill="rgba(0,0,0,0.25)"/>
  </svg>
);

const Attachment = ({
  file,
  onRemove,
  progress,
}: {
  file: AttachmentFile;
  onRemove?: () => void;
  progress?: number;
}) => {
  const isImage = file.kind === 'image';
  const cls = ['pi-att'];
  if (isImage) cls.push('image');
  if (progress != null && progress < 100) cls.push('is-uploading');
  return (
    <div className={cls.join(' ')}>
      <span className="thumb">
        {isImage
          ? (file.url ? <img src={file.url} alt=""/> : <FakeImage hue={file.hue || 12}/>)
          : <Icons.file size={13}/>}
      </span>
      <span className="meta">
        <span className="name">{file.name}</span>
        <span className="sz">{file.size}{progress != null && progress < 100 ? ` · ${progress}%` : ''}</span>
      </span>
      {onRemove && (
        <button className="close" onClick={onRemove} aria-label={`Remove ${file.name}`}>
          <Icons.x size={11}/>
        </button>
      )}
      {progress != null && progress < 100 && (
        <span className="progress"><span style={{ width: progress + '%' }}/></span>
      )}
    </div>
  );
};

export { Attachment };
