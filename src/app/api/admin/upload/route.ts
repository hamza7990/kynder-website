import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';
import sharp, { type Metadata } from 'sharp';
import { getSession } from '@/lib/auth';

// sharp needs the Node.js runtime (not Edge).
export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB raw upload cap
const MIN_DIMENSION = 200; // reject icons / non-photo junk
// Downscale target — a 6 MB phone photo comes out a few hundred KB of WebP.
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1500;

function fail(code: string, status: number) {
  // A stable machine-readable `code` (the client localises it) plus an English
  // fallback message so the endpoint is also clear when called directly.
  const messages: Record<string, string> = {
    unauthorized: 'You must be signed in as an admin to upload.',
    no_file: 'No file was provided.',
    bad_type: 'Unsupported file type. Upload a JPEG, PNG or WebP image.',
    too_large: 'File is too large. Maximum size is 10 MB.',
    not_image: 'That file is not a valid image.',
    too_small: `Image is too small. Minimum ${MIN_DIMENSION}×${MIN_DIMENSION}px.`,
    upload_failed: 'Upload failed. Please try again.',
  };
  return NextResponse.json({ error: messages[code] ?? code, code }, { status });
}

export async function POST(request: Request) {
  // Only authenticated admins can upload — verified server-side, directly.
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return fail('unauthorized', 401);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('no_file', 400);
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return fail('no_file', 400);
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return fail('bad_type', 415);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return fail('too_large', 413);
  }

  const input = Buffer.from(await file.arrayBuffer());

  // Validate REAL image dimensions from the decoded bytes, not the client's
  // claimed content-type — sharp throws on anything that isn't a real image.
  let metadata: Metadata;
  try {
    metadata = await sharp(input).metadata();
  } catch {
    return fail('not_image', 400);
  }
  if (!metadata.width || !metadata.height) {
    return fail('not_image', 400);
  }
  if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
    return fail('too_small', 400);
  }

  // Resize + compress so we never serve a raw multi-MB phone photo.
  let output: Buffer;
  try {
    output = await sharp(input)
      .rotate() // honour EXIF orientation, then strip metadata
      .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return fail('not_image', 400);
  }

  try {
    const blob = await put(`about/${randomUUID()}.webp`, output, {
      access: 'public',
      contentType: 'image/webp',
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    // Never claim success on a failed upload.
    return fail('upload_failed', 502);
  }
}
