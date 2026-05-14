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
