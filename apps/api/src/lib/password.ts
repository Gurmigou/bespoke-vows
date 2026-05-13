import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('.');
  if (parts.length !== 2) return false;
  const [hash, salt] = parts;
  if (!hash || !salt) return false;
  try {
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    const stored_buf = Buffer.from(hash, 'hex');
    if (stored_buf.length !== buf.length) return false;
    return timingSafeEqual(stored_buf, buf);
  } catch {
    return false;
  }
}
