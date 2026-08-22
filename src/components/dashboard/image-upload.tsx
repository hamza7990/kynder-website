'use client';

import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useT } from '@/i18n/client';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

type Status = 'idle' | 'uploading' | 'error';

function isRenderable(url: string): boolean {
  return /^(https?:\/\/|\/|blob:|data:)/.test(url);
}

// Vercel serverless functions cap the request body (~4.5 MB). A 6 MB phone photo
// would be rejected at the platform edge before our validation runs, so we
// downscale oversized images in the browser purely to fit the transport. The
// server still validates dimensions and re-compresses to WebP authoritatively —
// this is not a substitute for server-side processing. On any failure we send
// the original bytes and let the server reject them.
const SHRINK_THRESHOLD = 3 * 1024 * 1024;
const SHRINK_MAX_SIDE = 1600;

async function shrinkForTransport(file: File): Promise<Blob> {
  if (file.size <= SHRINK_THRESHOLD) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, SHRINK_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
    return blob ?? file;
  } catch {
    return file;
  }
}

interface ImageUploadProps {
  /** Form field name — a hidden input carries the stored URL so the parent form saves it. */
  name: string;
  /** Currently stored value (path or URL). */
  defaultValue?: string;
  /** Reserved aspect ratio so the frame never shifts (matches the public page). */
  aspectClass?: string;
}

/**
 * Admin image uploader: file picker + drag-and-drop, a live preview, an upload
 * progress bar, and replace/remove. The chosen file is validated and processed
 * server-side (see /api/admin/upload); on success the returned Blob URL is
 * written to a hidden input so the surrounding form persists it into the same
 * field the public site already reads. Failures never overwrite the saved value
 * and never claim success.
 */
export function ImageUpload({ name, defaultValue = '', aspectClass = 'aspect-[4/5]' }: ImageUploadProps) {
  const t = useT();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [value, setValue] = useState(defaultValue); // what the form will submit
  const [preview, setPreview] = useState(defaultValue); // what we show
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const upload = async (file: File) => {
    // Fast client-side pre-check (the server re-validates authoritatively).
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('imageUpload.err.bad_type'));
      setStatus('error');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(t('imageUpload.err.too_large'));
      setStatus('error');
      return;
    }

    // Local preview while the upload runs.
    clearObjectUrl();
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;
    setPreview(localUrl);
    setError(null);
    setStatus('uploading');
    setProgress(0);

    const payload = await shrinkForTransport(file);
    const body = new FormData();
    body.append('file', payload, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      let data: { url?: string; code?: string } = {};
      try {
        const parsed: unknown = JSON.parse(xhr.responseText);
        if (parsed && typeof parsed === 'object') data = parsed;
      } catch {
        /* fall through to failure handling */
      }

      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        // Success — commit the returned URL as both the shown and submitted value.
        clearObjectUrl();
        setValue(data.url);
        setPreview(data.url);
        setStatus('idle');
        setProgress(100);
        return;
      }

      // Failure — surface a localised message and KEEP the previously saved value.
      const code = data.code && data.code in errorKeys ? data.code : 'upload_failed';
      setError(t(`imageUpload.err.${code}`));
      setStatus('error');
      clearObjectUrl();
      setPreview(value);
    };

    xhr.onerror = () => {
      setError(t('imageUpload.err.network'));
      setStatus('error');
      clearObjectUrl();
      setPreview(value);
    };

    xhr.send(body);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void upload(file);
    e.target.value = ''; // allow re-selecting the same file
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  const remove = () => {
    clearObjectUrl();
    setValue('');
    setPreview('');
    setError(null);
    setStatus('idle');
    setProgress(0);
  };

  const uploading = status === 'uploading';
  const hasImage = isRenderable(preview) && preview !== '';

  return (
    <div className="space-y-3">
      {/* Submitted with the form — the same field the public site reads. */}
      <input type="hidden" name={name} value={value} />

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !uploading) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex w-full max-w-[20rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-cream text-center transition-colors',
          aspectClass,
          dragging ? 'border-terracotta bg-terracotta-soft' : 'border-ink-20 hover:border-navy',
          uploading && 'cursor-wait',
        )}
        aria-label={t('imageUpload.choose')}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={t('imageUpload.preview')} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-ink-60">
            <span className="text-3xl">🖼️</span>
            <span className="text-small font-medium text-navy-deep">{t('imageUpload.dropHint')}</span>
            <span className="text-[11px]">{t('imageUpload.hint')}</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-x-0 bottom-0 bg-navy-deep/85 p-3">
            <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-cream">
              <span>{t('imageUpload.uploading')}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/30">
              {/* Animate via transform (scaleX), never `width` — the motion rule
                  forbids transitioning layout/paint properties. */}
              <div
                className="h-full w-full origin-[left_center] rounded-full bg-terracotta transition-transform duration-fast ltr:origin-left rtl:origin-right"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={onFileChange}
        className="sr-only"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-md border border-ink-20 bg-cream px-3 py-1.5 text-small font-semibold text-navy-deep hover:bg-cream-card btn-press transition-colors disabled:opacity-50"
        >
          {hasImage ? `🔄 ${t('imageUpload.replace')}` : `📁 ${t('imageUpload.choose')}`}
        </button>
        {hasImage && !uploading && (
          <button
            type="button"
            onClick={remove}
            className="rounded-md border border-danger-soft bg-danger-soft px-3 py-1.5 text-small font-semibold text-danger hover:border-danger btn-press transition-colors"
          >
            🗑️ {t('imageUpload.remove')}
          </button>
        )}
      </div>

      {status === 'error' && error && (
        <p className="text-small font-medium text-danger" role="alert">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

// Codes the server may return; used to guard the localisation lookup.
const errorKeys: Record<string, true> = {
  unauthorized: true,
  no_file: true,
  bad_type: true,
  too_large: true,
  not_image: true,
  too_small: true,
  upload_failed: true,
};
