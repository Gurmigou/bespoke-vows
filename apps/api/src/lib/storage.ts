import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';

export interface Storage {
  put(file: File): Promise<{ url: string }>;
  serve?(pathname: string): Promise<{ body: Buffer; contentType: string } | null>;
}

const UPLOADS_DIR = resolve(process.cwd(), 'uploads');

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};
const EXT_TO_MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

class LocalStorage implements Storage {
  constructor(private publicBase: string) {}

  async put(file: File): Promise<{ url: string }> {
    await mkdir(UPLOADS_DIR, { recursive: true });
    const ext = MIME_TO_EXT[file.type] ?? extname(file.name) ?? '';
    const key = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOADS_DIR, key), buffer);
    return { url: `${this.publicBase}/uploads/${key}` };
  }

  async serve(pathname: string): Promise<{ body: Buffer; contentType: string } | null> {
    if (pathname.includes('..') || pathname.includes('/') || pathname.includes('\\')) return null;
    const full = join(UPLOADS_DIR, pathname);
    try {
      await stat(full);
    } catch {
      return null;
    }
    const body = await readFile(full);
    const contentType = EXT_TO_MIME[extname(pathname).toLowerCase()] ?? 'application/octet-stream';
    return { body, contentType };
  }
}

class VercelBlobStorage implements Storage {
  async put(file: File): Promise<{ url: string }> {
    const ext = MIME_TO_EXT[file.type] ?? extname(file.name) ?? '';
    const key = `${randomUUID()}${ext}`;
    const blob = await put(key, file, { access: 'public' });
    return { url: blob.url };
  }
}

function pickDriver(): Storage {
  const driver = (process.env.STORAGE_DRIVER ?? 'vercel').toLowerCase();
  if (driver === 'local') {
    const base = process.env.PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? 3001}`;
    return new LocalStorage(base);
  }
  return new VercelBlobStorage();
}

export const storage: Storage = pickDriver();
export const isLocalStorage = (process.env.STORAGE_DRIVER ?? '').toLowerCase() === 'local';
