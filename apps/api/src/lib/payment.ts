import { createHmac } from 'crypto';

export function verifyPlataSignature(body: string, signature: string): boolean {
  const secret = process.env.MONO_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac('sha512', secret).update(body).digest('hex');
  return expected === signature;
}
