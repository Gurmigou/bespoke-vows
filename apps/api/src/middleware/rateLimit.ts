import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Distributed rate limiting backed by Upstash Redis.
 *
 * On Vercel serverless, in-memory counters reset per cold start and are not
 * shared across instances, so they provide no real protection. Upstash gives
 * a shared store with a sliding-window algorithm.
 *
 * If UPSTASH_REDIS_REST_URL / _TOKEN are not configured (e.g. local dev), the
 * middleware becomes a no-op so local development is not blocked.
 */

// Vercel's Upstash integration provisions KV_REST_API_* names; the standalone
// Upstash dashboard uses UPSTASH_REDIS_REST_*. Accept either.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

if (!redis) {
  console.warn('[rateLimit] Upstash not configured — rate limiting DISABLED. Set KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_*) in production.');
}

function clientIp(c: Context): string {
  // Vercel sets x-forwarded-for; take the first (client) hop.
  const fwd = c.req.header('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return c.req.header('x-real-ip') ?? 'unknown';
}

type LimitOpts = {
  /** unique name used in the Redis key namespace */
  name: string;
  /** number of allowed requests per window */
  limit: number;
  /** sliding window duration, e.g. '1 m', '15 m', '1 h' */
  window: Parameters<typeof Ratelimit.slidingWindow>[1];
};

/**
 * Build a rate-limit middleware keyed by client IP.
 * Pass `keyFromBody` to additionally scope by a body field (e.g. email),
 * which blunts targeted credential stuffing against a single account.
 */
export function rateLimit(opts: LimitOpts, keyFromBody?: (body: any) => string | undefined) {
  const limiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(opts.limit, opts.window),
        prefix: `rl:${opts.name}`,
        analytics: false,
      })
    : null;

  return createMiddleware(async (c, next) => {
    if (!limiter) return next();

    let identifier = clientIp(c);

    if (keyFromBody) {
      // Hono caches the parsed body, so the route handler can still call
      // c.req.json() afterwards and get the same object.
      const body = await c.req.json().catch(() => ({}));
      const extra = keyFromBody(body);
      if (extra) identifier = `${identifier}:${extra.toLowerCase()}`;
    }

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    c.header('RateLimit-Limit', String(limit));
    c.header('RateLimit-Remaining', String(Math.max(0, remaining)));
    c.header('RateLimit-Reset', String(Math.ceil((reset - Date.now()) / 1000)));

    if (!success) {
      c.header('Retry-After', String(Math.ceil((reset - Date.now()) / 1000)));
      return c.json({ error: 'rate_limited', message: 'Too many requests. Please try again later.' }, 429);
    }

    return next();
  });
}
