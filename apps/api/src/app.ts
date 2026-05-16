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

app.route('/auth', authRoutes);
app.route('/invitations', invitationRoutes);
app.route('/templates', templateRoutes);
app.route('/payments', paymentRoutes);
app.route('/upload', uploadRoutes);
app.route('/uploads', uploadsServeRoutes);
app.route('/', publicRoutes);

export default app;
