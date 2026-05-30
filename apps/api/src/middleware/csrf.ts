import { createMiddleware } from 'hono/factory';

/**
 * CSRF protection for cookie-authenticated, state-changing requests.
 *
 * The session cookie is `SameSite=None` in prod (frontend and backend live on
 * different registrable domains: beloved-invitation.com vs beloved-backend.cfd),
 * so the browser attaches it on cross-site requests. A cross-site <form> or
 * cross-origin fetch therefore can't be distinguished from a real one by the
 * cookie alone.
 *
 * Defense: require a custom header. Browsers forbid cross-site HTML forms from
 * setting custom headers, and a cross-origin fetch that sets one triggers a
 * CORS preflight that our origin-pinned CORS rejects. Only our own frontend can
 * attach it, so its presence proves the request was issued by our app.
 *
 * Safe (non-mutating) methods are skipped. `/sync` is exempt because it is hit
 * via navigator.sendBeacon (which cannot set custom headers); it is already
 * CSRF-resistant on its own since it sends Content-Type: application/json,
 * a non-safelisted type that forces a preflight our CORS blocks cross-origin.
 */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_HEADER = 'x-csrf';

function isExemptPath(path: string): boolean {
  // sendBeacon autosave cannot carry custom headers; protected by JSON preflight.
  return path.endsWith('/sync');
}

export const csrfProtection = createMiddleware(async (c, next) => {
  const method = c.req.method.toUpperCase();
  if (SAFE_METHODS.has(method) || isExemptPath(c.req.path)) {
    return next();
  }

  if (!c.req.header(CSRF_HEADER)) {
    return c.json({ error: 'csrf_header_required' }, 403);
  }

  return next();
});
