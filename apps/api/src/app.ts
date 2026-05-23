import 'dotenv/config';
import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors.js';
import { authRoutes } from './routes/auth.js';
import { invitationRoutes } from './routes/invitations.js';
import { templateRoutes } from './routes/templates.js';
import { paymentRoutes } from './routes/payments.js';
import { publicRoutes } from './routes/public.js';
import { uploadRoutes, uploadsServeRoutes } from './routes/upload.js';

const app = new Hono();

app.use('*', async (c, next) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  await next();
  if (c.res.status >= 400) {
    console.error(`[ERROR] ${c.req.method} ${c.req.url} → ${c.res.status}`);
  }
});

app.onError((err, c) => {
  console.error(`[UNHANDLED] ${c.req.method} ${c.req.url}`, err);
  return c.json({ error: 'Internal server error', message: err.message }, 500);
});

app.use('*', corsMiddleware);

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/api/debug/email', async (c) => {
  const to = c.req.query('to');
  if (!to) return c.json({ error: 'pass ?to=email@example.com' }, 400);
  const hasKey = !!process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? 'Beloved <noreply@beloved-invite.com>';
  if (!hasKey) return c.json({ ok: false, reason: 'RESEND_API_KEY missing', from }, 500);
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: 'Beloved test',
      html: '<p>test from /api/debug/email</p>',
    });
    return c.json({ ok: !error, from, data, error });
  } catch (err) {
    return c.json({ ok: false, from, thrown: String(err) }, 500);
  }
});

app.route('/auth', authRoutes);
app.route('/invitations', invitationRoutes);
app.route('/templates', templateRoutes);
app.route('/payments', paymentRoutes);
app.route('/upload', uploadRoutes);
app.route('/uploads', uploadsServeRoutes);
app.route('/', publicRoutes);

export default app;
